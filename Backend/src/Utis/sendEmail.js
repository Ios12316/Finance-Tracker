import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Check if SMTP details are provided in environment
  const hasSMTP = 
    process.env.SMTP_HOST && 
    process.env.SMTP_PORT && 
    process.env.SMTP_USER && 
    process.env.SMTP_PASS;

  if (!hasSMTP) {
    console.log("----------------------------------------");
    console.log("WARNING: SMTP credentials not set in .env!");
    console.log("To send real emails, set: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS");
    console.log("For development, we logged the email contents below:");
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message:\n${options.message}`);
    console.log("----------------------------------------");
    return { success: true, logged: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || `"IOS Ledger Support" <noreply@iosledger.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined,
  };

  await transporter.sendMail(mailOptions);
  return { success: true, logged: false };
};

export default sendEmail;
