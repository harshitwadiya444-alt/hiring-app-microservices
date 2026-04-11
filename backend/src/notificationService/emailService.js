import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export const sendEmail = async (data) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { candidateEmail, recruiterEmail, status, jobTitle } = data;

  try {

    if (status === "SHORTLISTED") {

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: candidateEmail,
        subject: "Application Shortlisted",
        text: `Congratulations! You are shortlisted for ${jobTitle}`
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recruiterEmail,
        subject: "Candidate Shortlisted",
        text: `A candidate has been shortlisted for ${jobTitle}`
      });

    }

    else if (status === "REJECTED") {

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: candidateEmail,
        subject: "Application Update",
        text: `You were not shortlisted for ${jobTitle}`
      });

    }

    else {

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: candidateEmail,
        subject: "Application Under Review",
        text: `Your application for ${jobTitle} is under review`
      });

    }

    console.log("Email sent successfully");

  } catch (error) {

    console.log("Email sending failed:", error.message);

  }

};