import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("SMTP User:", process.env.SMTP_USER);
console.log("SMTP Password:", process.env.SMTP_PASS ? "Loaded" : "Not Loaded");

export const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, 
    }
});
