const {Schema, model} = require('mongoose');
const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
},{timestamps: true});
const Payment = model('Payment', paymentSchema);
module.exports = Payment;