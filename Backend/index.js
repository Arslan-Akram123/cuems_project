// Load environment variables
require('dotenv').config();
require("./cronjob");
// Import necessary modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// internal modules
const {auth} = require('./middlewares/auth');
const connectDB = require('./utils/connection');
const userRoutes = require('./routes/user');
const settingRoutes = require('./routes/setting');
const categoryRoutes = require('./routes/category');
const universityRoutes = require('./routes/universities');
const noticeRoutes = require('./routes/notice');
const siteSettingRoutes = require('./routes/sitesetting');
const eventsRoutes = require('./routes/events');
const commentRoutes = require('./routes/comment');
const dashboardRoutes = require('./routes/dashboard');
const bookEventRoutes = require('./routes/bookevent');
const scrapingRoutes = require('./routes/scraping');
const contactusRoutes = require('./routes/contactus');
const stripeRoutes = require('./routes/stripe');
// const paymobRoutes = require('./routes/paymob');
const uploadRoutes = require('./uploads/upload');
// Import specific controller for webhook
const { handleStripeWebhook } = require('./controllers/stripe');

// Connect to the database
connectDB();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT ;

// Stripe Webhook - MUST be defined before express.json()
// Uses express.raw() to get the unmodified request body for signature verification
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}));

app.use('/auth', userRoutes);
app.use('/settings',auth, settingRoutes);
app.use('/category',auth, categoryRoutes);
app.use('/universities',auth, universityRoutes);
app.use('/notices',auth, noticeRoutes);
app.use('/siteSettings', siteSettingRoutes);
app.use('/events',auth, eventsRoutes);
app.use('/comments',auth, commentRoutes);
app.use('/dashboard',auth, dashboardRoutes);
app.use('/eventsbook',auth, bookEventRoutes);
app.use('/scraping',auth, scrapingRoutes);
app.use('/contactus', auth,contactusRoutes);
app.use('/stripe', auth, stripeRoutes);
// app.use('/paymob', paymobRoutes);
app.use('/upload', auth, uploadRoutes);


app.listen(PORT, (err) => {
    console.log(err ? `Error starting server: ${err}` : '');
  console.log(`Server is running on http://localhost:${PORT}`);
});

