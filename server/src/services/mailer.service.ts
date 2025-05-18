import nodemailer from "nodemailer";
import { throwError } from "../utils/helpers";

interface SendEmailProps {
  to: string;
}

export const sendMail = async ({ to }: SendEmailProps) => {
  try {
    const transporter = await nodemailer.createTransport({
      pool: true,
      service: "gmail",
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const subject = "";
    const html = ``;

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      html: html,
      subject: subject,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    throwError("Error sending email", 500);
  }
};
