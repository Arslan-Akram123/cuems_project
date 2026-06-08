const bookingEventSchema = require('../models/bookevent');
const eventSchema = require('../models/events');
const paymentSchema = require('../models/payment');
const sendEmail = require('../services/sendEmail');
const walletSchema = require('../models/wallet');
const bookEvent = async (req, res) => {
    // console.log(req.body);
    const { notes, eventId, cnicNumber, previousDegreeName, currentInstituteName } = req.body;
   
    // notes validation
    if (notes && notes.trim() !== '') {
        const trimmedNotes = notes.trim();
        if (trimmedNotes.length < 3 || trimmedNotes.length > 100) {
            return res.status(400).json({ error: 'Notes must be between 3 and 100 characters' });
        } else if (!/^[a-zA-Z0-9\s.,!?'"-]+$/.test(trimmedNotes)) {
            return res.status(400).json({ error: 'Notes can only contain letters, numbers, spaces, and basic punctuation (.,!?\'-)' });
        }
    }else{
        return res.status(400).json({ error: 'Notes are required' });
    }

    if (!cnicNumber || cnicNumber.trim() === '') {
        return res.status(400).json({ error: 'CNIC Number is required' });
    }
    if (!previousDegreeName || previousDegreeName.trim() === '') {
        return res.status(400).json({ error: 'Previous Degree Name is required' });
    }

    const userId = req.user.id;
    const availableSeats = await eventSchema.findById(eventId).select('totalSubscribers');
    if (availableSeats.totalSubscribers <= 0) {
        return res.status(400).json({ error: 'No more seats available' });
    }
    const findusers = await bookingEventSchema.findOne({ user: userId, event: eventId });
    if (!findusers) {
        const newBooking = new bookingEventSchema({ 
            user: userId, 
            event: eventId, 
            bookingNotes: notes.trim(),
            cnicNumber: cnicNumber.trim(),
            previousDegreeName: previousDegreeName.trim(),
            currentInstituteName: currentInstituteName ? currentInstituteName.trim() : ''
        });
        try {
            const savedBooking = await newBooking.save();
            res.status(201).json(savedBooking);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(400).json({ error: 'You have already booked this event' });
    }
};

async function getNewBookings(req, res) {
    const userId = req.user.id;
    // console.log("get new bookings called");
    try {
         const newBookings = await bookingEventSchema.find().populate('user').populate('event').sort({ createdAt: -1 });
        //  filter specific Admin events bookings
        const adminBookings = newBookings.filter(booking => booking.event.user._id.toString() === userId);
        // console.log("admin bookings", adminBookings);
        const filterbookings = adminBookings.filter(booking => booking.status === 'pending');
        res.status(200).json(filterbookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


async function UpdateAdminRead(req, res) {
    const { notif_id } = req.body;
    // console.log(notif_id);
    try {
        const updatedBooking = await bookingEventSchema.findByIdAndUpdate(notif_id, { adminRead: 'true' }, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getSpecificBooking(req, res) {
    const { id } = req.params;
    // console.log(" get specific booking", id);
    try {
        const specificBooking = await bookingEventSchema.findById(id).populate('user').populate('event');
        if (!specificBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(200).json(specificBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function UpdateConfirmBooking(req, res) {
    const { id } = req.params;
    try {
        const updatedBooking = await bookingEventSchema.findByIdAndUpdate(id, { status: 'confirmed', userRead: 'false' }, { new: true }).populate('user').populate('event');
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        const event = await eventSchema.findById(updatedBooking.event._id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (event.totalSubscribers <= 0) {
            return res.status(400).json({ error: 'All seats are already reserved for this event' });
        }
        // console.log("sending email to ", updatedBooking.user.email);
       
        sendEmail(updatedBooking.user.email,"Booking Update","Your booking has been confirmed","Your booking for  "+event.name+" event has been confirmed. Please proceed to payment to secure your spot.");
        event.reservedSeats += 1;
        event.totalSubscribers -= 1;
        if(event.price==0){
            updatedBooking.status='paid';
            await updatedBooking.save();
            const payload={user:updatedBooking.user._id,event:updatedBooking.event._id,amount:event.price};
            const newPayment = new paymentSchema(payload);
            await newPayment.save();

            // Update Event Organizer's Wallet Balance (even if 0, for consistency)
            const organizerId = event.user;
            const wallet = await walletSchema.findOne({ user: organizerId });
            if (wallet) {
                wallet.balance = parseFloat((wallet.balance + (event.price || 0)).toFixed(2));
                await wallet.save();
            }

            event.reservedSeats -= 1;
            event.bookings += 1;
        }
        await event.save();
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function UpdateCancelBooking(req, res) {
    const { id } = req.params;
    try {
        const previousstatusBooking = await bookingEventSchema.findById(id);
        const updatedBooking = await bookingEventSchema.findByIdAndUpdate(id, { status: 'cancelled', userRead: 'false' }, { new: true }).populate('user').populate('event');
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        const event = await eventSchema.findById(updatedBooking.event._id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
       
        // console.log("sending email to ", updatedBooking.user.email);
        sendEmail(updatedBooking.user.email, "Booking Update", "Your booking has been cancelled", "Your booking for " + event.name + " event has been cancelled. If this is a mistake, please contact us.");
        if (previousstatusBooking.status === 'pending') {
            // console.log("Booking was pending, not updating event seats.");
           return res.status(200).json(updatedBooking); 
        }
        event.reservedSeats -= 1;
        event.totalSubscribers += 1;
        await event.save();
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAllBookings(req, res) {
    const userId = req.user.id;
    try {
        const allBookings = await bookingEventSchema.find().populate('user').populate('event').sort({ createdAt: -1 });
        console.log("all bookings for admin", allBookings);
        const adminBookings = allBookings.filter(booking => booking.event.user._id.toString() === userId);
        res.status(200).json(adminBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAllUserBookings(req, res) {
    // console.log("get all user bookings called");
    const userId = req.user.id;
    try {
        const userBookings = await bookingEventSchema.find({ user: userId }).populate('user').populate('event').sort({ createdAt: -1 });
        res.status(200).json(userBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function UpdateUserRead(req, res) {
    // console.log("update user read called");
    const { notif_id } = req.body;
    // console.log(notif_id);
    try {
        const updatedBooking = await bookingEventSchema.findByIdAndUpdate(notif_id, { userRead: 'true' }, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function completeBooking(req, res) {
    const { bookingId, eventId } = req.body;
    // console.log("bookingId", bookingId);
    // console.log("event id", eventId);
    try {
        const updatedBooking = await bookingEventSchema.findByIdAndUpdate(bookingId, { status: 'paid' }, { new: true }).populate('user').populate('event');
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        const event = await eventSchema.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const payload={user:updatedBooking.user._id,event:updatedBooking.event._id,amount:event.price};
       const newPayment = new paymentSchema(payload);
       await newPayment.save();

        // Update Event Organizer's Wallet Balance
        const organizerId = event.user;
        const wallet = await walletSchema.findOne({ user: organizerId });
        if (wallet) {
            // cut 1% platform fee
            const fee = parseFloat((event.price * 0.01).toFixed(2));
            const payoutAmount = parseFloat((event.price - fee).toFixed(2));
            wallet.balance = parseFloat((wallet.balance + payoutAmount).toFixed(2));
            console.log(`Adding payout of ${payoutAmount} to organizer ${organizerId}'s wallet (Event price: ${event.price}, Fee: ${fee})`);
            await wallet.save();
            console.log(`Updated wallet for organizer ${organizerId}. New balance: ${wallet.balance}`);
        } else {
            console.warn(`Wallet not found for organizer ${organizerId}`);
        }

        event.reservedSeats -= 1;
        event.bookings += 1;
        await event.save();
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = { bookEvent, getNewBookings, UpdateAdminRead, getSpecificBooking, UpdateConfirmBooking, UpdateCancelBooking, getAllBookings, getAllUserBookings, UpdateUserRead, completeBooking };