import sendEmail from "../Utis/sendEmail.js";

export const contactSupport = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please provide name, email, and message" });
    }

    // Format the email content
    const adminEmail = process.env.SMTP_USER || "idowus187@gmail.com";
    const mailSubject = `[IOS Ledger Support] ${subject || "New Help Request"}`;

    const textContent = `You have received a new support request from IOS Ledger.

Sender Details:
Name: ${name}
Email: ${email}

Subject: ${subject || "N/A"}

Message:
${message}

---
This email was generated automatically by the IOS Ledger support system.`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0; font-size: 24px;">IOS Ledger</h2>
          <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">New Help & Support Ticket</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">Ticket Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #64748b; padding: 8px 0; width: 120px; font-weight: bold;">Sender Name:</td>
              <td style="color: #0f172a; padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 8px 0; font-weight: bold;">Sender Email:</td>
              <td style="color: #0f172a; padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 8px 0; font-weight: bold;">Subject:</td>
              <td style="color: #0f172a; padding: 8px 0; font-weight: bold;">${subject || "General Inquiry"}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">Message</h3>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This email was sent via the IOS Ledger support portal. Please reply directly to this email to contact the user.</p>
      </div>
    `;

    // Send the email to the support mailbox
    await sendEmail({
      email: adminEmail,
      subject: mailSubject,
      message: textContent,
      html: htmlContent
    });

    res.status(200).json({ message: "Thank you! Your request has been sent successfully. We will get back to you shortly." });

  } catch (error) {
    console.error("Support API Error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};
