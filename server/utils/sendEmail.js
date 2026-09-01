const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('SMTP_USER and SMTP_PASS are required to send Gmail OTP email');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Your OTP code',
        text: `Your verification code is ${otp}. It expires in 5 minutes.`,
    });

    console.log('Email sent:', info.messageId);
};

module.exports = sendOTPEmail;