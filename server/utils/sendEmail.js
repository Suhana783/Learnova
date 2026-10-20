const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log(`\n======================================================`);
        console.log(`[Learnova Email Service] SMTP credentials not set.`);
        console.log(`>> OTP for ${email}: ${otp}`);
        console.log(`======================================================\n`);
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Learnova Verification OTP',
            text: `Your Learnova verification code is: ${otp}. This code is valid for 18 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #0e1626; color: #ffffff; padding: 24px; border-radius: 8px;">
                    <h2 style="color: #ff8c5a;">Learnova Verification</h2>
                    <p>Welcome to Learnova! Use the OTP below to complete your registration:</p>
                    <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #ff8c5a; padding: 12px 0;">
                        ${otp}
                    </div>
                    <p style="color: #9ca3af; font-size: 13px;">This code will expire in 18 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });

        console.log('OTP Email successfully sent to:', email, 'MessageID:', info.messageId);
    } catch (err) {
        console.error('Failed to send email via SMTP, fallback to console:', err.message);
        console.log(`>> [FALLBACK] OTP for ${email}: ${otp}`);
    }
};

module.exports = sendOTPEmail;