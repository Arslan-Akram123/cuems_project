const { Schema, model } = require('mongoose');


const bookingEventSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event', required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled','paid'],
        default: 'pending'
    },
    bookingNotes: {
        type: String,
        required: true
    },
    adminRead: {
        type: Boolean,
        default: false
    },
    userRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const BookEvent = model('BookEvent', bookingEventSchema);
module.exports = BookEvent;
