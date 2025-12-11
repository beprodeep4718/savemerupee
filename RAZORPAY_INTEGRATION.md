# Razorpay Payment & Referral System

## Overview

Complete payment and referral system integration with Razorpay for SaveMoney platform.

## Features Implemented

### 🎁 Referral System
- **Automatic Referral Code Generation**: Users get a unique referral code after first purchase
- **₹200 Per Referral**: Referrer earns ₹200 for each successful referral
- **Minimum Withdrawal**: ₹1000 minimum balance required for disbursement
- **Referral Tracking**: Complete history of referral earnings

### 💳 Payment Integration
- **Razorpay Checkout**: Seamless payment gateway integration
- **Order Creation**: Secure order generation with signature verification
- **Payment Verification**: Server-side payment verification for security
- **Transaction History**: Complete payment history for users

### 💰 Wallet System
- **Real-time Balance**: Track earnings from referrals
- **Disbursement Requests**: Users can request payout when balance ≥ ₹1000
- **Admin Dashboard**: Admin can approve/reject disbursement requests
- **Earnings History**: Detailed breakdown of all referral earnings

## Database Models

### User Model
```typescript
- phoneNumber: String (unique)
- name: String
- age: Number
- referralCode: String (unique, auto-generated after first purchase)
- referredBy: ObjectId (ref: User)
- hasPurchased: Boolean
```

### Referral Model
```typescript
- code: String (unique)
- userId: ObjectId (ref: User)
- usedBy: [ObjectId] (array of users who used this code)
- totalEarnings: Number
- totalReferrals: Number
```

### Transaction Model
```typescript
- userId: ObjectId (ref: User)
- orderId: String (Razorpay order ID)
- paymentId: String (Razorpay payment ID)
- amount: Number
- status: 'pending' | 'completed' | 'failed'
- referralCode: String (optional)
- referredBy: ObjectId (optional)
- serviceName: String
```

### Wallet Model
```typescript
- userId: ObjectId (ref: User)
- balance: Number
- totalEarned: Number
- totalDisbursed: Number
- referralEarnings: [{ referredUserId, amount, transactionId, earnedAt }]
- disbursements: [{ amount, status, method, disbursedAt }]
```

## API Endpoints

### Payment Routes (`/api/payment`)
- `POST /create-order` - Create Razorpay order
- `POST /verify-payment` - Verify payment and process referral rewards
- `GET /transactions` - Get user transaction history
- `GET /wallet` - Get wallet details with referral code
- `POST /request-disbursement` - Request payout (min ₹1000)

### Admin Routes (`/api/admin`)
- `GET /disbursements/pending` - Get all pending disbursement requests
- `POST /disbursements/approve` - Approve disbursement
- `GET /users` - Get all users with referral stats

## Environment Setup

### Server (.env)
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
MONGODB_URI=mongodb://localhost:27017/savemoney
JWT_SECRET=your_jwt_secret
```

### Client (.env)
```env
VITE_RAZORPAY_KEY_ID=your_key_id
VITE_API_URL=http://localhost:4000/api
```

## How It Works

### 1. User Purchase Flow
1. User clicks "Purchase Service" on wallet page
2. Optionally enters a referral code
3. Razorpay checkout modal opens
4. User completes payment
5. Server verifies payment signature
6. User gets their own referral code (auto-generated)
7. If referral code was used, referrer gets ₹200 added to wallet

### 2. Referral Reward Flow
1. User shares their referral code
2. Friend uses code during purchase
3. ₹200 instantly added to referrer's wallet
4. Referrer can track all earnings in wallet
5. When balance reaches ₹1000, user can request disbursement
6. Admin approves request
7. Balance deducted and added to totalDisbursed

### 3. Admin Disbursement Flow
1. User requests disbursement (≥ ₹1000)
2. Request appears in admin dashboard
3. Admin approves disbursement
4. Wallet balance reduced
5. totalDisbursed increased
6. External payment processed by admin

## Frontend Pages

### `/wallet` - Wallet Dashboard
- Display wallet balance
- Show referral code with copy button
- Purchase service form
- Referral earnings history
- Request disbursement button
- Razorpay payment integration

### `/dashboard` - User Profile
- User information
- Edit profile
- Link to wallet page

## Security Features

- **Signature Verification**: All payments verified with HMAC SHA256
- **JWT Authentication**: All routes protected with JWT middleware
- **Referral Validation**: Prevents self-referral and duplicate usage
- **Minimum Balance Check**: Server-side validation for disbursement
- **Transaction Records**: Complete audit trail of all transactions

## Testing Checklist

- [ ] Create Razorpay account and get API keys
- [ ] Set up environment variables
- [ ] Make first purchase (generates referral code)
- [ ] Share referral code with test account
- [ ] Make purchase with referral code
- [ ] Verify ₹200 added to referrer wallet
- [ ] Request disbursement when balance ≥ ₹1000
- [ ] Admin approves disbursement
- [ ] Verify balance deducted

## Next Steps

1. Add email/SMS notifications for referral rewards
2. Implement UPI/bank account for automated disbursement
3. Add referral leaderboard
4. Create admin dashboard UI
5. Add analytics and reporting
6. Implement referral campaigns and bonuses

## Support

For issues or questions, contact the development team.
