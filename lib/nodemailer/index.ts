import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";

export const trasnporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    },
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace("{{intro}}", intro);

    const mailOptions = {
        from: `"MarketPulse" <marketpulse@stocks.pro>`,
        to: email,
        subject: `Welcome to MarketPulse - your stock market toolkit is ready!`,
        text: 'Thanks for joining MarketPulse! We\'re excited to have you on board. You now have tools to track the stock market and make smarter moves.',
        html: htmlTemplate,
    }
    await trasnporter.sendMail(mailOptions);
}