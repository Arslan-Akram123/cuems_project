const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    event: { 
        type: Schema.Types.ObjectId,
        ref: 'Event', required: true 
    },
    comment: { 
        type: String,
        required: true,
        trim: true,
    },
    rating: { 
        type: Number,
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

const Comment = model('Comment', commentSchema);
module.exports = Comment;