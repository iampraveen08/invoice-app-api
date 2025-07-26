import nodemailer from 'nodemailer';
import config from '../config/env.js';

let transporter;
export const getTransporter = async () => {
    if (transporter) return transporter;

    if (config.mail.user && config.mail.pass) {
        transporter = nodemailer.createTransport({
            host: config.mail.host,
            port: config.mail.port,
            auth: { user: config.mail.user, pass: config.mail.pass }
        });
    } else {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: testAccount
        });
    }
    return transporter;
};

export const sendMail = async ({ to, subject, html }) => {
    const t = await getTransporter();
    const info = await t.sendMail({
        from: config.mail.from,
        to,
        subject,
        html
    });
    return { messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
};
