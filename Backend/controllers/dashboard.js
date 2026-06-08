const category = require("../models/category");
const university = require("../models/universities");
const event = require("../models/events");
const user = require("../models/user");
const bookEvent = require("../models/bookevent");
const comment = require("../models/comment");
const  payment = require("../models/payment");
const Wallet = require("../models/wallet");
const getDashboardData = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    try {
        const categories = await category.find();
        const universities = await university.find();
        const events = await event.find();
        const users = await user.find();
        const bookEvents = await bookEvent.find().populate('user').populate('event');
        const comments = await comment.find().populate('user').populate('event');
       const confirmorpaidbookevents= bookEvents.filter(be=>be.status=="confirmed" || be.status=="paid");
       const payments = await payment.find().populate('user').populate('event');
       const amount = parseFloat(payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2));
       const totalUniversityAdmins = await user.countDocuments({ role: 'subAdmin' });
       const payload={totalUsers:users.length,totalCategories:categories.length,totalUniversities:universities.length,totalEvents:events.length,totalBookEvents:confirmorpaidbookevents.length,totalComments:comments.length,
        totalPayments:amount,
        totalUniversityAdmins: totalUniversityAdmins
       };
       if(role==="Admin"){
        res.status(200).json(payload);
       } else {
        const userBookEvents = bookEvents.filter(be => be.event.user._id.toString() === userId);
        const userComments = comments.filter(comment => comment.event.user._id.toString() === userId);
        const userPayments = payments.filter(payment => payment.event.user._id.toString() === userId);
        const userEvents = events.filter(event => event.user._id.toString() === userId);
        const userWallet = await Wallet.findOne({ user: userId });
        const userPayload = {
            totalUsers: 1, // Since it's for the current user
            totalCategories: categories.length,
            totalUniversities: universities.length,
            totalEvents: userEvents.length,
            totalBookEvents: userBookEvents.length,
            totalComments: userComments.length,
            totalPayments: parseFloat(userPayments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)),
            totalUniversityAdmins: totalUniversityAdmins,
            totalWalletAmount: userWallet ? parseFloat((userWallet.balance || 0).toFixed(2)) : 0
        };
        res.status(200).json(userPayload);
       }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getDashboardData };