import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  totalEarnings: {
    type: Number,
    default: 0,
  },
  totalReferrals: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Referral = mongoose.model('Referral', ReferralSchema);

export default Referral;
