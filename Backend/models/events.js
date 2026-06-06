const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, trim: true },
    totalSubscribers: { type: Number, min: 0 },
    price: { type: Number, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    startTime: { type: String }, 
    endTime: { type: String },
    category: { type: String, trim: true },
    description: { type: String },
    image: { type: String }, 
    bookings:{
        type:Number,
        default:0
    },
    reservedSeats: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Automatically calculate status before saving
eventSchema.pre('save', function (next) {
    const now = new Date();

    if (this.startDate && this.endDate) {
        if (now < this.startDate) {
            this.status = 'upcoming';
        } else if (now >= this.startDate && now <= this.endDate) {
            this.status = 'ongoing';
        } else {
            this.status = 'completed';
        }
    } else {
        this.status = 'upcoming'; 
    }

    next();
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
