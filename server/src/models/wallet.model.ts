import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  totalEarned: {
    type: Number,
    default: 0,
  },
  totalDisbursed: {
    type: Number,
    default: 0,
  },
  referralEarnings: [{
    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: {
      type: Number,
      default: 200,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  disbursements: [{
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    method: {
      type: String,
    },
    disbursedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

const Wallet = mongoose.model('Wallet', WalletSchema);

export default Wallet;
