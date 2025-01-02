const Otp = require('../models/Otp')
const User = require('../models/User')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail');  


const verifyOtp = async (req, res) => {
    try {
        const { otp, type, email } = req.body;

        console.log('Received request body:', req.body);

        // Check for missing fields
        if (!otp || !type || !email) {
            console.log('Missing required fields.');
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        console.log('Finding user...');
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log('User not found.');
            return res.status(400).json({ message: 'Invalid Email.' });
        }

        console.log('Finding OTP...');
        const otpExist = await Otp.findOne({ user: existingUser._id, otp, type });
        if (!otpExist) {
            console.log('Invalid OTP.');
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Check if OTP has expired
        if (otpExist.expires_at < new Date()) {
            console.log('OTP has expired.');
            return res.status(400).json({ message: 'OTP has expired.' });
        }

        // If the OTP is for registration, verify the user's email
        if (type === 'register') {
            console.log('Marking email as verified.');
            existingUser.email_verified = true;
            await existingUser.save();

            // Send a success email after registration (optional)
            const subject = 'Email Verified Successfully';
            const message = `Hello ${existingUser.name},<br>Your email has been successfully verified. You can now proceed with your account activities.`;
            const send_to = email;
            const sent_from = process.env.EMAIL_USER;
            const reply_to = process.env.EMAIL_USER;

            await sendEmail(subject, message, send_to, sent_from, reply_to);
        }

        console.log('Deleting OTP...');
        await Otp.deleteMany({ user: existingUser._id, type });

        console.log(`OTP verification successful for email: ${email}`);
        return res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};


const resendOtp = async (req, res) => {
    try {
        const { email, type } = req.body;

        if (!email || !type) return res.status(400).json({ message: 'Missing required parameters.' });

        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(400).json({ message: 'Invalid Email.' });

        const existingOtp = await Otp.findOne({ user: existingUser._id, type: type });

        if (existingOtp && existingOtp.expires_at > new Date()) {
            return res.status(400).json({ message: 'An OTP has already been sent. Please wait for it to expire before requesting a new one.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes from now

        if (existingOtp) {
            existingOtp.otp = otp;
            existingOtp.expires_at = expiresAt;
            await existingOtp.save();
        } else {
            await Otp.create({ user: existingUser._id, otp, type, expires_at: expiresAt });
        }

        // Send the OTP to the user's email using the sendEmail utility
        const subject = 'Your OTP Code';
        const message = `Your OTP code is: <strong>${otp}</strong>. It will expire in 20 minutes.`;
        const send_to = email;
        const sent_from = process.env.EMAIL_USER;
        const reply_to = process.env.EMAIL_USER;

        await sendEmail(subject, message, send_to, sent_from, reply_to);

        console.log(`OTP for ${email}: ${otp}`);

        return res.status(200).json({ message: 'OTP resent successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
};



module.exports = {verifyOtp,resendOtp};