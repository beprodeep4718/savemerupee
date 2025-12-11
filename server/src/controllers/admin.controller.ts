import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Wallet from "../models/wallet.model";
import User from "../models/user.model";

export const adminController = {
  // Get all pending disbursement requests
  getPendingDisbursements: async (req: AuthRequest, res: Response) => {
    try {
      const wallets = await Wallet.find({
        "disbursements.status": "pending",
      }).populate("userId", "name phoneNumber referralCode");

      const pendingRequests = wallets
        .map((wallet) => {
          const pendingDisbursements = wallet.disbursements.filter(
            (d) => d.status === "pending"
          );
          return pendingDisbursements.map((d) => ({
            walletId: wallet._id,
            userId: wallet.userId,
            disbursementId: d._id,
            amount: d.amount,
            requestedAt: d.disbursedAt,
          }));
        })
        .flat();

      return res.status(200).json({
        success: true,
        requests: pendingRequests,
      });
    } catch (error) {
      console.error("Get pending disbursements error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch disbursement requests.",
      });
    }
  },

  // Approve disbursement
  approveDisbursement: async (req: AuthRequest, res: Response) => {
    try {
      const { walletId, disbursementId } = req.body;

      const wallet = await Wallet.findById(walletId);
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: "Wallet not found.",
        });
      }

      const disbursement = wallet.disbursements.id(disbursementId);
      if (!disbursement) {
        return res.status(404).json({
          success: false,
          message: "Disbursement not found.",
        });
      }

      if (disbursement.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Disbursement already processed.",
        });
      }

      // Update disbursement status
      disbursement.status = "completed";
      
      // Deduct from balance and add to total disbursed
      wallet.balance -= disbursement.amount;
      wallet.totalDisbursed += disbursement.amount;

      await wallet.save();

      return res.status(200).json({
        success: true,
        message: "Disbursement approved successfully.",
      });
    } catch (error) {
      console.error("Approve disbursement error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to approve disbursement.",
      });
    }
  },

  // Get all users with referral stats
  getAllUsersWithStats: async (req: AuthRequest, res: Response) => {
    try {
      const users = await User.find({}).select("-__v");
      const wallets = await Wallet.find({});

      const usersWithStats = users.map((user) => {
        const wallet = wallets.find(
          (w) => w.userId.toString() === user._id.toString()
        );
        return {
          ...user.toObject(),
          walletBalance: wallet?.balance || 0,
          totalEarned: wallet?.totalEarned || 0,
          totalDisbursed: wallet?.totalDisbursed || 0,
          totalReferrals: wallet?.referralEarnings.length || 0,
        };
      });

      return res.status(200).json({
        success: true,
        users: usersWithStats,
      });
    } catch (error) {
      console.error("Get users with stats error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch users.",
      });
    }
  },
};
