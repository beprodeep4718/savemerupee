import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/user.model";

export const userController = {
  getProfile: async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findById(req.user?.userId).select('-__v');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          age: user.age,
          lastLogin: user.lastLogin,
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch profile.",
      });
    }
  },

  updateProfile: async (req: AuthRequest, res: Response) => {
    try {
      const { name, age } = req.body;
      const userId = req.user?.userId;

      const updateData: { name?: string; age?: number } = {};
      if (name !== undefined) updateData.name = name;
      if (age !== undefined) updateData.age = age;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-__v');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          age: user.age,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update profile.",
      });
    }
  },
};
