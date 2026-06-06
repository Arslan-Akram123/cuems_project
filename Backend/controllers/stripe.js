const paymentSchema = require('../models/payment');
const Wallet = require('../models/wallet');
const Booking = require('../models/bookevent');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(req, res) {
     console.log("Creating payment intent with body:", req.body);
      try {
       
    const { amount, currency,metadata } = req.body;
    console.log("Amount:", amount, "Currency:", currency, "Metadata:", metadata);
    
    // Fetch booking to identify the event organizer
    const bookingId = metadata.bookingId;
    if (!bookingId) {
       return res.status(400).json({ error: "Booking ID is missing in metadata" });
    }
  console.log("Booking ID from metadata:", bookingId);
    const booking = await Booking.findById(bookingId).populate('event');
    if (!booking || !booking.event) {
       return res.status(404).json({ error: "Booking or Event not found" });
    }

    const organizerId = booking.event.user;
    console.log("Organizer ID:", organizerId);
    const organizerWallet = await Wallet.findOne({ user: organizerId });

    if (!organizerWallet || !organizerWallet.stripeAccountId) {
       return res.status(400).json({ error: "Event organizer has not set up a wallet for payouts" });
    }
     console.log("Organizer Wallet:", organizerWallet.stripeAccountId);
    // Calculate 1% platform fee
    const fee = Math.round(amount * 0.01); 

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, 
      currency: currency || 'usd',
      description:metadata.eventName,
      application_fee_amount: fee,
      transfer_data: {
        destination: organizerWallet.stripeAccountId,
      },
      metadata: metadata,
    });

    
     res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllPayments(req,res){
  const userId=req.user.id;
  console.log("user role", req.user.role);
  try{
    const getallpayments=await paymentSchema.find().populate('user').populate('event').sort({ createdAt: -1 });
     const userPayments = getallpayments.filter(payment => payment.event.user._id.toString() === userId);
     console.log("user payments", userPayments);
        res.status(200).json(userPayments);
  }catch(error){
     res.status(500).json({ error: error.message });
  }
}

async function handleStripeWebhook(req, res) {
  console.log("Received Stripe webhook with body:", req.body);
  const sig = req.headers['stripe-signature'];
  let event;
  
  // Note: req.body must be a raw buffer here. 
  // Ensure the route is configured with express.raw({type: 'application/json'}) in index.js
  
  try {
    // If testing locally with Stripe CLI, the secret comes from the CLI output.
    // In production, it's set in the Dashboard.
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (endpointSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
         // Fallback for development if secret not set
         // Since we used express.raw(), req.body is a Buffer. We need to parse it.
         try {
            event = JSON.parse(req.body.toString());
         } catch (parseError) {
            console.error("Error parsing webhook body in fallback mode:", parseError);
            return res.status(400).send(`Webhook Error: ${parseError.message}`);
         }
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Received Stripe Event:', event.type);

  if (event.type === 'account.updated') {
      const account = event.data.object;
      console.log(`Processing account.updated for ${account.id}`);

      if (account.details_submitted) {
          try {
              const wallet = await Wallet.findOne({ stripeAccountId: account.id });
              if (wallet) {
                  // Determine status based on capabilities
                  // Simply "active" if details are submitted is a loose check, 
                  // but effectively means onboarding flow was completed by user.
                  
                  // You might want to check account.charges_enabled as well.
                  if (account.charges_enabled) {
                      wallet.status = 'active';
                  } else {
                      // Status could be 'restricted' or 'pending' depending on what's missing
                      // If details are submitted but charges disabled, likely 'pending' verification
                      wallet.status = 'pending';
                  }
                  
                   // FORCE UPDATE for the user request "auto check this process is complete and update... to active"
                  if (account.details_submitted) {
                       // If details are submitted, we consider the onboarding "step" complete.
                       // Whether Stripe actually allows charges depends on verification.
                       // Let's set to active if charges are enabled, effectively.
                       if(account.charges_enabled && account.payouts_enabled) {
                           wallet.status = 'active';
                       }
                  }

                  await wallet.save();
                  console.log(`Wallet ${wallet._id} status updated to ${wallet.status}`);
              } else {
                  console.log(`No wallet found for Stripe Account ${account.id}`);
              }
          } catch (error) {
              console.error('Error updating wallet from webhook:', error);
          }
      }
  }

  res.json({received: true});
}

module.exports = {
  createPaymentIntent,getAllPayments, handleStripeWebhook
};