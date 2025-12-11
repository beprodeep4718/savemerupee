import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import razorpay from "../config/razorpay";
import Transaction from "../models/transaction.model";
import User from "../models/user.model";
import Wallet from "../models/wallet.model";
import Referral from "../models/referral.model";
import crypto from "crypto";

export const paymentController = {
  // Create Razorpay order
  createOrder: async (req: AuthRequest, res: Response) => {
    try {
      const { amount, serviceName, referralCode } = req.body;
      const userId = req.user?.userId;

      if (!amount || !serviceName) {
        return res.status(400).json({
          success: false,
          message: "Amount and service name are required.",
        });
      }

      // Validate referral code if provided
      let referredBy = null;
      if (referralCode) {
        const referral = await Referral.findOne({ code: referralCode });
        if (referral) {
          // Check if user already used this referral or is their own code
          if (referral.userId.toString() === userId) {
            return res.status(400).json({
              success: false,
              message: "You cannot use your own referral code.",
            });
          }
          
          const alreadyUsed = referral.usedBy.some(
            (id) => id.toString() === userId
          );
          if (alreadyUsed) {
            return res.status(400).json({
              success: false,
              message: "You have already used this referral code.",
            });
          }

          referredBy = referral.userId;
        }
      }

      // Create Razorpay order
      const options = {
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      // Create transaction record
      const transaction = new Transaction({
        userId,
        orderId: order.id,
        amount,
        currency: "INR",
        status: "pending",
        serviceName,
        referralCode,
        referredBy,
      });

      await transaction.save();

      return res.status(200).json({
        success: true,
        order,
        transactionId: transaction._id,
      });
    } catch (error) {
      console.error("Create order error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create order.",
      });
    }
  },

  // Verify payment and process referral
  verifyPayment: async (req: AuthRequest, res: Response) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        transactionId,
      } = req.body;
      const userId = req.user?.userId;

      // Verify signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Payment verification failed.",
        });
      }

      // Update transaction
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found.",
        });
      }

      transaction.paymentId = razorpay_payment_id;
      transaction.status = "completed";
      await transaction.save();

      // Update user as purchased
      await User.findByIdAndUpdate(userId, { hasPurchased: true });

      // Generate referral code for this user if they don't have one
      const user = await User.findById(userId);
      if (!user?.referralCode) {
        const newReferralCode = `REF${userId?.toString().slice(-6).toUpperCase()}`;
        await User.findByIdAndUpdate(userId, { referralCode: newReferralCode });
        
        // Create referral document
        await Referral.create({
          code: newReferralCode,
          userId,
        });
      }

      // Process referral reward if applicable
      if (transaction.referredBy) {
        const referral = await Referral.findOne({ userId: transaction.referredBy });
        if (referral) {
          // Add user to usedBy array
          referral.usedBy.push(userId as any);
          referral.totalReferrals += 1;
          referral.totalEarnings += 200;
          await referral.save();

          // Update or create wallet
          let wallet = await Wallet.findOne({ userId: transaction.referredBy });
          if (!wallet) {
            wallet = new Wallet({ userId: transaction.referredBy });
          }

          wallet.balance += 200;
          wallet.totalEarned += 200;
          wallet.referralEarnings.push({
            referredUserId: userId as any,
            amount: 200,
            transactionId: transaction._id as any,
            earnedAt: new Date(),
          });

          await wallet.save();
        }
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully.",
        transaction,
      });
    } catch (error) {
      console.error("Verify payment error:", error);
      return res.status(500).json({
        success: false,
        message: "Payment verification failed.",
      });
    }
  },

  // Get user transactions
  getTransactions: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;

      const transactions = await Transaction.find({ userId })
        .sort({ createdAt: -1 })
        .populate("referredBy", "name phoneNumber");

      return res.status(200).json({
        success: true,
        transactions,
      });
    } catch (error) {
      console.error("Get transactions error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch transactions.",
      });
    }
  },

  // Get wallet details
  getWallet: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;

      let wallet = await Wallet.findOne({ userId }).populate(
        "referralEarnings.referredUserId",
        "name phoneNumber"
      );

      if (!wallet) {
        wallet = new Wallet({ userId });
        await wallet.save();
      }

      const referral = await Referral.findOne({ userId });
      const user = await User.findById(userId);

      return res.status(200).json({
        success: true,
        wallet,
        referralCode: user?.referralCode || null,
        totalReferrals: referral?.totalReferrals || 0,
      });
    } catch (error) {
      console.error("Get wallet error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch wallet details.",
      });
    }
  },

  // Request disbursement (when balance >= 1000)
  requestDisbursement: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;

      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: "Wallet not found.",
        });
      }

      if (wallet.balance < 1000) {
        return res.status(400).json({
          success: false,
          message: "Minimum balance of ₹1000 required for disbursement.",
        });
      }

      // Create pending disbursement request
      wallet.disbursements.push({
        amount: wallet.balance,
        status: "pending",
        method: "Bank Transfer",
        disbursedAt: new Date(),
      });

      await wallet.save();

      return res.status(200).json({
        success: true,
        message: "Disbursement request submitted successfully. Admin will process it soon.",
      });
    } catch (error) {
      console.error("Request disbursement error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to request disbursement.",
      });
    }
  },
};
