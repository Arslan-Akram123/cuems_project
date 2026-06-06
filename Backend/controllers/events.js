
const eventSchema = require('../models/events');
function validateBusinessData(req, res) {
    const {
        name,
        location,
        totalSubscribers,
        price,
        category,
        description,
    } = req.body;

    const errors = [];

    // Name validation
    if (!name || name.trim() === '') {
        errors.push({
            field: 'name',
            message: 'Name is required'
        });
    } else {
        const trimmedName = name.trim();
        
        if (trimmedName.length < 2) {
            errors.push({
                field: 'name',
                message: 'Name must be at least 2 characters long'
            });
        } else if (trimmedName.length > 100) {
            errors.push({
                field: 'name',
                message: 'Name cannot exceed 100 characters'
            });
        } else if (!/^[a-zA-Z0-9\s\-_&.,()!@#$%^*]+$/.test(trimmedName)) {
            errors.push({
                field: 'name',
                message: 'Name contains invalid characters'
            });
        }
    }

    // Location validation
    if (!location || location.trim() === '') {
        errors.push({
            field: 'location',
            message: 'Location is required'
        });
    } else {
        const trimmedLocation = location.trim();
        
        if (trimmedLocation.length < 3) {
            errors.push({
                field: 'location',
                message: 'Location must be at least 3 characters long'
            });
        } else if (trimmedLocation.length > 200) {
            errors.push({
                field: 'location',
                message: 'Location cannot exceed 200 characters'
            });
        } else if (!/^[a-zA-Z0-9\s\-_,.()#&/@]+$/.test(trimmedLocation)) {
            errors.push({
                field: 'location',
                message: 'Location contains invalid characters'
            });
        }
    }

    // Total Subscribers validation
    if (totalSubscribers !== undefined && totalSubscribers !== null) {
        const subscribers = Number(totalSubscribers);
        
        if (isNaN(subscribers)) {
            errors.push({
                field: 'totalSubscribers',
                message: 'Total subscribers must be a valid number'
            });
        } else if (subscribers < 0) {
            errors.push({
                field: 'totalSubscribers',
                message: 'Total subscribers cannot be negative'
            });
        } else if (subscribers > 1000000000) {
            errors.push({
                field: 'totalSubscribers',
                message: 'Total subscribers cannot exceed 1 billion'
            });
        } else if (!Number.isInteger(subscribers)) {
            errors.push({
                field: 'totalSubscribers',
                message: 'Total subscribers must be a whole number'
            });
        }
    }

    // Price validation
    if (price !== undefined && price !== null) {
        const priceValue = Number(price);
        
        if (isNaN(priceValue)) {
            errors.push({
                field: 'price',
                message: 'Price must be a valid number'
            });
        } else if (priceValue < 0) {
            errors.push({
                field: 'price',
                message: 'Price cannot be negative'
            });
        } else if (priceValue > 1000000) {
            errors.push({
                field: 'price',
                message: 'Price cannot exceed 1,000,000'
            });
        } else if (priceValue.toString().split('.')[1]?.length > 2) {
            errors.push({
                field: 'price',
                message: 'Price can have maximum 2 decimal places'
            });
        }
    }

    // Category validation
    if (!category || category.trim() === '') {
        errors.push({
            field: 'category',
            message: 'Category is required'
        });
    } else {
        const trimmedCategory = category.trim();
        
        if (trimmedCategory.length < 2) {
            errors.push({
                field: 'category',
                message: 'Category must be at least 2 characters long'
            });
        } else if (trimmedCategory.length > 50) {
            errors.push({
                field: 'category',
                message: 'Category cannot exceed 50 characters'
            });
        } else if (!/^[a-zA-Z0-9\s\-_&]+$/.test(trimmedCategory)) {
            errors.push({
                field: 'category',
                message: 'Category contains invalid characters'
            });
        }
    }

    // Description validation
    if (description && description.trim() !== '') {
        const trimmedDescription = description.trim();
        
        if (trimmedDescription.length < 10) {
            errors.push({
                field: 'description',
                message: 'Description must be at least 10 characters long'
            });
        } else if (trimmedDescription.length > 2000) {
            errors.push({
                field: 'description',
                message: 'Description cannot exceed 2000 characters'
            });
        }
    }

    // Return errors array (don't send response here)
    return errors;
}
const createEvent = async (req, res) => {
    const userId = req.user.id; 
    try {
        const {
            name,
            location,
            totalSubscribers,
            price,
            startDate,
            endDate,
            startTime,
            endTime,
            category,
            description,
            image
        } = req.body;
   const validationErrors = validateBusinessData(req, res);
        
        // Check if there are any validation errors
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: validationErrors[0].message,
                errorField: validationErrors[0].field
            });
        }
        // const image = req.file ? req.file.filename : null;

        const event = new eventSchema({
            name,
            user: userId,
            location,
            totalSubscribers,
            price,
            startDate,
            endDate,
            startTime,
            endTime,
            category,
            description,
            image,
        });

        await event.save();

        res.status(201).json({
            message: 'Event created successfully',
            event,
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
function calculateEventStatus(event) {
    let status = 'upcoming';
    const now = new Date();
    const startDate = event.startDate ? new Date(event.startDate) : null;
    const endDate = event.endDate ? new Date(event.endDate) : null;
    let start = startDate;
    let end = endDate;
    if (startDate && event.startTime) {
        const [h, m] = event.startTime.split(':');
        start = new Date(startDate);
        start.setHours(Number(h), Number(m || 0), 0, 0);
    }
    if (endDate && event.endTime) {
        const [h, m] = event.endTime.split(':');
        end = new Date(endDate);
        end.setHours(Number(h), Number(m || 0), 59, 999);
    }
    if (start && end) {
        if (now < start) {
            status = 'upcoming';
        } else if (now >= start && now <= end) {
            status = 'ongoing';
        } else {
            status = 'completed';
        }
    } else {
        status = 'upcoming';
    }
    return status;
}

const getAllEvents = async (req, res) => {
    console.log("user role",req.user.role);
    try {
       if(req.user.role === 'User'){
         const events = await eventSchema.find().sort({ createdAt: -1 });
        const eventsWithStatus = events.map(event => {
            const obj = event.toObject();
            obj.status = calculateEventStatus(event);
            return obj;
        });
        res.status(200).json({
            success: true,
            count: eventsWithStatus.length,
            events: eventsWithStatus,
        });}
        else{
            const events = await eventSchema.find({ user: req.user.id }).sort({ createdAt: -1 });
        const eventsWithStatus = events.map(event => {
            const obj = event.toObject();
            obj.status = calculateEventStatus(event);
            return obj;
        });
        res.status(200).json({
            success: true,
            count: eventsWithStatus.length,
            events: eventsWithStatus,
        });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
 async function getSpecificEvent(req, res) {
    try {
        const event = await eventSchema.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const obj = event.toObject();
        obj.status = calculateEventStatus(event);
        res.status(200).json(obj);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
 }

 async function updateEvent(req, res) {
    const { id } = req.params;
    const {
        name,
        location,
        totalSubscribers,
        price,
        startDate,
        endDate,
        startTime,
        endTime,
        category,
        description,
        image
    } = req.body;
     const validationErrors = validateBusinessData(req, res);
        
        // Check if there are any validation errors
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: validationErrors[0].message,
                errorField: validationErrors[0].field
            });
        }
    try {
        const specificEvent = await eventSchema.findById(id);
        if (!specificEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const updatedImage = image || specificEvent.image;
        const updatedEvent = await eventSchema.findByIdAndUpdate(
            id,
            {
                name,
                location,
                totalSubscribers: totalSubscribers - (specificEvent.reservedSeats + specificEvent.bookings),
                price,
                startDate,
                endDate,
                startTime,
                endTime,
                category,
                description,
                image: updatedImage
            },
            { new: true }
        );
        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
 }
 async function deleteEvent(req, res) {
    try {
        const event = await eventSchema.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
 }

 async function getSpecificEventbyCategory(req, res) {
    try {
        const category = req.params.id;
        const events = await eventSchema.find({ category: category });
        // Add status to each event
        const eventsWithStatus = events.map(event => {
            const obj = event.toObject();
            obj.status = calculateEventStatus(event);
            return obj;
        });
        res.status(200).json({
            success: true,
            count: eventsWithStatus.length,
            events: eventsWithStatus,
        });
    } catch (error) {
        console.error('Error fetching events by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
 }
module.exports = {
    createEvent,
    getAllEvents,
    getSpecificEvent,
    deleteEvent,
    updateEvent,
    getSpecificEventbyCategory
};
