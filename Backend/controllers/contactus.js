
const Contactus = require('../models/contactus'); 
const usersendEmail=require('../services/contactmail');
async function createContactUs(req, res) {
    console.log('Received contact data:', req.user, req.body);
    const userId = req.user.id; 
    if (!req.body.message) {
        return res.status(400).json({ message: 'Message is required' });
    }
    const {  message } = req.body;
    // validation for message only contain alphanumeric characters and spaces and some special charactors and 3 to 100 words limit
    if(!/^[a-zA-Z0-9\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{3,100}$/.test(message)){
        return res.status(400).json({ message: 'Message can only contain alphanumeric characters and spaces and some special charactors and 3 to 100 words limit' });
    }
    
    try {
        // Send email to the user
        await usersendEmail(req.user.email, message);

        // const contactUs = await Contactus.create({userId, message });
        res.status(201).json("your response has been recorded");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createContactUs };