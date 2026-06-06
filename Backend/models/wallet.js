const { Schema, model } = require('mongoose');

const walletSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  stripeAccountId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'restricted'],
    default: 'pending',
  },
  balance: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Wallet = model('Wallet', walletSchema);

module.exports = Wallet;