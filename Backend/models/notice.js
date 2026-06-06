const {Schema, model} = require('mongoose');
const noticeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
}, {timestamps: true});
const Notice = model('Notice', noticeSchema);
module.exports = Notice;