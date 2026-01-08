//utils/sendMail.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `Neterskill <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
