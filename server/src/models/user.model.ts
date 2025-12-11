import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  hasPurchased: {
    type: Boolean,
    default: false,
  },
  // Optional: You could track the last time they logged in
  lastLogin: {
    type: Date,
  },
}, {
    timestamps: true,
});


const User = mongoose.model('User', UserSchema);

export default User;