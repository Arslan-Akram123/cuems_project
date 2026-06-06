const {Schema, model} = require('mongoose');

const contactusSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    }},
    {timestamps: true});
const Contactus = model('Contactus', contactusSchema);
module.exports = Contactus;