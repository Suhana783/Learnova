const nodemailer = require('nodemailer');

const getSmtpConfig = () => {
    const rawUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
    const rawPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
    const rawFrom = process.env.SMTP_FROM || process.env.EMAIL_FROM;

    const user = rawUser ? rawUser.trim() : '';
    // Gmail App Passwords are shown as "xxxx xxxx xxxx xxxx" (16 chars + 3 spaces = 19 chars).
    // Strip ALL whitespace so the raw copied value works regardless of formatting.
    const pass = rawPass ? rawPass.replace(/\s/g, '') : '';
    const from = rawFrom ? rawFrom.trim() : '';

    return { user, pass, from };
};

const createTransporter = (smtp) => {
    if (process.env.SMTP_HOST) {
        const port = Number(process.env.SMTP_PORT) || 587;
        const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST.trim(),
            port,
            secure: isSecure,
            auth: {
                user: smtp.user,
                pass: smtp.pass,
            },
        });
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: smtp.user,
            pass: smtp.pass,
        },
    });
};

const sendOTPEmail = async (email, otp) => {
    const smtp = getSmtpConfig();

    if (!smtp.user || !smtp.pass) {
        console.error('[Learnova Email Service] SMTP configuration is missing. Please set SMTP_USER and SMTP_PASS (or GMAIL_USER and GMAIL_APP_PASSWORD) in server/.env');
        const err = new Error('Email service is not configured. Please contact support or configure SMTP credentials.');
        err.statusCode = 503;
        throw err;
    }

    try {
        const transporter = createTransporter(smtp);

        const fromAddress = smtp.from || `"Learnova" <${smtp.user}>`;
        const subject = 'Learnova - Your Verification OTP';
        const text = `Welcome to Learnova!\n\nYour 6-digit verification code is: ${otp}\n\nThis code is valid for 18 minutes. If you did not request this registration, please disregard this email.\n\nBest regards,\nThe Learnova Team`;
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Learnova Verification Code</title>
            </head>
            <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; color: #f3f4f6;">
                <div style="max-width: 520px; margin: 0 auto; background: #131d33; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #ff8c5a; font-size: 26px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px;">Learnova</h1>
                        <p style="color: #94a3b8; font-size: 14px; margin: 0;">Empowering Your Learning Journey</p>
                    </div>
                    <div style="background-color: #0d1527; border: 1px solid #24324f; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                        <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 12px 0;">Use the verification code below to complete your account setup:</p>
                        <div style="font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #ff8c5a; padding: 12px; background: #17233f; border-radius: 8px; display: inline-block; font-family: monospace;">
                            ${otp}
                        </div>
                        <p style="color: #94a3b8; font-size: 12px; margin: 14px 0 0 0;">This code will expire in <strong>18 minutes</strong>.</p>
                    </div>
                    <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0 0 8px 0;">
                        If you did not request this verification code, you can safely ignore this email. No changes will be made to your account.
                    </p>
                    <div style="border-top: 1px solid #1e293b; margin-top: 24px; padding-top: 16px; text-align: center;">
                        <p style="color: #475569; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} Learnova. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const info = await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject,
            text,
            html,
        });

        const isAccepted = Array.isArray(info.accepted) && info.accepted.some(addr => addr.toLowerCase() === email.toLowerCase());
        const isRejected = Array.isArray(info.rejected) && info.rejected.some(addr => addr.toLowerCase() === email.toLowerCase());

        if (!isAccepted || isRejected) {
            const err = new Error('Email delivery could not be confirmed by the email provider.');
            err.statusCode = 502;
            throw err;
        }

        console.log('[Learnova Email Service] OTP email delivery confirmed by provider (Message ID:', info.messageId, ')');
        return info;
    } catch (err) {
        if (err.statusCode) {
            throw err;
        }

        // Safe diagnostics: Do NOT expose passwords, app passwords, or OTP in logs
        console.error('[Learnova Email Service] Email delivery failure:', {
            code: err.code,
            command: err.command,
            responseCode: err.responseCode,
            message: err.message,
        });

        let userMessage = 'Failed to send OTP email. Please check your email address and try again.';
        if (err.code === 'EAUTH' || err.responseCode === 535) {
            userMessage = 'Email service authentication failed. Please verify your Gmail App Password configuration.';
        } else if (err.code === 'ESOCKET' || err.code === 'ETIMEDOUT' || err.code === 'ECONNECTION') {
            userMessage = 'Email server connection timed out. Please try again in a few moments.';
        }

        const error = new Error(userMessage);
        error.statusCode = 502;
        throw error;
    }
};

module.exports = sendOTPEmail;