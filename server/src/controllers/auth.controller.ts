import dotenv from "dotenv";
dotenv.config();
import { startVerification, checkVerification } from "../config/twilioClient";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const authController = {
  sendOTP: async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res
        .status(400)
        .send({ success: false, message: "Phone number is required." });
    }

    try {
      await startVerification(phoneNumber);
      res
        .status(200)
        .send({
          success: true,
          message: "Verification code sent successfully.",
        });
    } catch (error) {
      console.error("Twilio error in sendOTP:", error.message);
      // Twilio often returns helpful error codes (e.g., invalid phone number format)
      res
        .status(500)
        .send({
          success: false,
          message:
            "Failed to send verification code. Check phone number format.",
        });
    }
  },
  verifyOTP: async (req: Request, res: Response) => {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res
        .status(400)
        .send({
          success: false,
          message: "Phone number and code are required.",
        });
    }

    try {
      const verificationCheck = await checkVerification(phoneNumber, code);

      if (verificationCheck.status === "approved") {
        let user = await User.findOne({ phoneNumber });

        if (!user) {
          user = new User({ phoneNumber });
          await user.save();
        }

        const token = jwt.sign(
          { userId: user._id, phoneNumber: user.phoneNumber },
          process.env.JWT_SECRET!,
          { expiresIn: "30d" }
        );

        return res.status(200).send({
          success: true,
          message: "Login successful.",
          token: token,
          user: { 
            id: user._id, 
            phoneNumber: user.phoneNumber,
            name: user.name,
            age: user.age,
          },
        });
      } else {
        return res
          .status(401)
          .send({ success: false, message: "Invalid verification code." });
      }
    } catch (error) {
      console.error("Twilio error in verifyOTP:", error.message);
      return res
        .status(500)
        .send({ success: false, message: "Verification failed." });
    }
  },
  logout: (_: Request, res: Response) => {
    res
      .status(200)
      .send({
        success: true,
        message: "User logged out (Client-side token removal assumed).",
      });
  },
};
