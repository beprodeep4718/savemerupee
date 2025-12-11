import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error("Missing required Twilio environment variables. Please check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID.");
}

const twilioClient = twilio(accountSid, authToken);

export const startVerification = async (phoneNumber: string) => {
    return twilioClient.verify.v2.services(verifyServiceSid)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' });
};

export const checkVerification = async (phoneNumber: string, code: string) => {
    return twilioClient.verify.v2.services(verifyServiceSid)
        .verificationChecks
        .create({ to: phoneNumber, code: code });
};
