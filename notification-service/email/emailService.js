import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (data) => {
  try {

    const {
      candidateEmail,
      candidateName,
      jobTitle,
      companyName,
      newStatus,
      interviewType,
      message
    } = data;

    let subject = "";
    let html = "";
    let text = "";

    const greeting = `Hello ${candidateName},`;

    if (newStatus === "INTERVIEW") {

      subject = `Interview Scheduled - ${jobTitle} | ${companyName}`;

      text = `
${greeting}

Your ${interviewType} interview has been scheduled for the role of ${jobTitle} at ${companyName}.

Details:
${message}

Best of luck.

Regards,
${companyName} Hiring Team
`;

      html = `
<h2>Interview Scheduled</h2>
<p>${greeting}</p>
<p>Your <strong>${interviewType}</strong> interview has been scheduled for the role of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
<p><strong>Details:</strong> ${message}</p>
<p>Best of luck!</p>
<br/>
<p>Regards,<br/><strong>${companyName} Hiring Team</strong></p>
`;

    }

    else if (newStatus === "SHORTLISTED") {

      subject = `You Cleared the Interview Round - ${jobTitle}`;

      text = `
${greeting}

Congratulations!

You have successfully cleared the previous interview round for the position of ${jobTitle} at ${companyName}.

${message}

You are shortlisted for the next round.

Regards,
${companyName} Hiring Team
`;

      html = `
<h2>Congratulations!</h2>
<p>${greeting}</p>
<p>You have successfully cleared the previous interview round for the role of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
<p>${message}</p>
<p>You are shortlisted for the next stage of the hiring process.</p>
<br/>
<p>Regards,<br/><strong>${companyName} Hiring Team</strong></p>
`;

    }

    else if (newStatus === "PASSED") {

      subject = `Congratulations! Offer Confirmation - ${jobTitle}`;

      text = `
${greeting}

Congratulations!

You have successfully cleared all interview rounds for the role of ${jobTitle} at ${companyName}.

Our HR team will contact you soon regarding the offer and onboarding process.

Welcome aboard.

Regards,
${companyName}
`;

      html = `
<h2>Congratulations!</h2>
<p>${greeting}</p>
<p>You have successfully cleared all interview rounds for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
<p>Our HR team will contact you soon regarding the offer and onboarding process.</p>
<p><strong>Welcome aboard!</strong></p>
<br/>
<p>Regards,<br/><strong>${companyName}</strong></p>
`;

    }

    else if (newStatus === "REJECTED") {

      subject = `Application Update - ${jobTitle}`;

      text = `
${greeting}

Thank you for participating in the hiring process for the position of ${jobTitle} at ${companyName}.

${message}

We appreciate your time and interest in our organization.

We wish you the best in your future opportunities.

Regards,
${companyName} Hiring Team
`;

      html = `
<h2>Application Update</h2>
<p>${greeting}</p>
<p>Thank you for participating in the hiring process for the role of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
<p>${message}</p>
<p>We truly appreciate your time and effort.</p>
<p>We wish you success in your future opportunities.</p>
<br/>
<p>Regards,<br/><strong>${companyName} Hiring Team</strong></p>
`;

    }

    await transporter.sendMail({
      from: `"${companyName} Hiring Team" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject,
      text,
      html
    });

    console.log("Email sent successfully");

  } catch (error) {

    console.error("Email sending failed:", error.message);

  }
};