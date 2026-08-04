




import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // "https://primeshieldwandsworth-frontend.vercel.app",
      // "https://primeshieldwandsworth.uk",
      // "https://www.primeshieldwandsworth.uk",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Prime Shield Services Backend Server is running");
});

const BRAND_NAME = "Prime Shield Services Richmond";
const BRAND_ORANGE = "#E66E26";
const BRAND_GREY = "#464749";
const BRAND_CREAM = "#FAF9F6";
const BRAND_DARK = "#1E2022";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// MAIN CONTACT FORM
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, postcode, service, message } = req.body;

    if (!name || !email || !phone || !postcode || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone number, postcode and message are required",
      });
    }

    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      // subject: `Prime Shield Contact Lead - ${service || "Website Form"}`
      subject: `Prime Shield Contact Lead - ${service || "Website Form"} | #${Date.now()}`,
      text: `
New Contact Lead

Business: ${BRAND_NAME}

Name: ${name}
Email: ${email}
Phone: ${phone}
Postcode: ${postcode}
Service: ${service || "Not selected"}

Message:
${message}
      `,
      html: `
        <div style="font-family:Arial,sans-serif;background:${BRAND_CREAM};padding:30px;">
          <div style="max-width:600px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #ddd;">
            
            <div style="background:${BRAND_DARK};padding:25px;text-align:center;border-bottom:4px solid ${BRAND_ORANGE};">
              <h1 style="color:#fff;margin:0;font-size:24px;">New Contact Lead</h1>
              <p style="color:${BRAND_ORANGE};font-weight:bold;margin:8px 0 0;">${BRAND_NAME}</p>
            </div>

            <div style="padding:25px;color:#333;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>Postcode:</strong> ${postcode}</p>
              <p><strong>Service:</strong> ${service || "Not selected"}</p>

              <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />

              <p><strong>Message:</strong></p>
              <div style="background:${BRAND_CREAM};padding:15px;border-radius:8px;border:1px solid #eee;">
                ${message}
              </div>
            </div>

            <div style="background:${BRAND_GREY};padding:14px;text-align:center;">
              <p style="color:#fff;font-size:12px;margin:0;">
                Automated notification from ${BRAND_NAME}
              </p>
            </div>

          </div>
        </div>
      `,
    });



    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });
  } catch (error) {
    console.error("Contact Email Error:", error);

    res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message,
    });
  }
});

// QUICK CALLBACK FORM
app.post("/api/callback", async (req, res) => {
  try {
    const { name, postcode, phone } = req.body;

    if (!name || !postcode || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, postcode, and phone number are required for call back",
      });
    }

    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      // subject: `Prime Shield Callback Request - ${name} `
      subject: `${BRAND_NAME} | Callback Request | ${name} | #${Date.now()}`,
      text: `
New Callback Request

Business: ${BRAND_NAME}

Name: ${name}
Postcode: ${postcode}
Phone: ${phone}
      `,
      html: `
        <div style="font-family:Arial,sans-serif;background:${BRAND_CREAM};padding:30px;">
          <div style="max-width:600px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #ddd;">
            
            <div style="background:${BRAND_DARK};padding:25px;text-align:center;border-bottom:4px solid ${BRAND_ORANGE};">
              <h1 style="color:#fff;margin:0;font-size:24px;">Callback Requested</h1>
              <p style="color:${BRAND_ORANGE};font-weight:bold;margin:8px 0 0;">${BRAND_NAME}</p>
            </div>

            <div style="padding:25px;color:#333;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Postcode:</strong> ${postcode}</p>
              <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            </div>

            <div style="background:${BRAND_GREY};padding:14px;text-align:center;">
              <p style="color:#fff;font-size:12px;margin:0;">
                Automated callback notification from ${BRAND_NAME}
              </p>
            </div>

          </div>
        </div>
      `,
    });

  

    res.status(200).json({
      success: true,
      message: "Call back request sent successfully!",
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });
  } catch (error) {
    console.error("Callback Email Error:", error);

    res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`${BRAND_NAME} server running on port ${PORT}`);
// });

export default app;