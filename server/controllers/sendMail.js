const nodemailer = require("nodemailer");
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(toUserEmail, subject, text, html, attachmentPath) {
    let attachments = [];
    if (attachmentPath) {
        try {
            const attachment = fs.readFileSync(attachmentPath);
            attachments.push({
                filename: path.basename(attachmentPath),
                content: attachment,
                encoding: 'base64',
            });
        } catch (error) {
            console.error(`Failed to read file at path: ${attachmentPath}`);
            throw error;
        }
    }

    const info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: [process.env.EMAIL, toUserEmail].join(', '), // list of receivers (you and the user)
        subject, // Subject line
        text, // plain text body
        html, // html body
        attachments
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = { sendMail };
