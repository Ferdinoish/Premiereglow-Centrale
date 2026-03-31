import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for booking notifications
  app.post("/api/notify-booking", async (req, res) => {
    const { name, email, phone, service, date, time, notes } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const ownerMailOptions = {
      from: `"Premiereglow Booking" <${process.env.EMAIL_USER}>`,
      to: "libronferdinand@gmail.com",
      subject: `New Appointment: ${service} - ${date} at ${time}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #D4AF37;">New Appointment Request</h2>
          <p><strong>Client Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email || "Not provided"}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Notes:</strong> ${notes || "None"}</p>
          <hr />
          <p style="font-size: 12px; color: #666;">This is an automated notification from your Premiereglow Centrale booking system.</p>
        </div>
      `,
    };

    const clientMailOptions = email ? {
      from: `"Premiereglow Centrale" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmed: ${service} at Premiereglow Centrale`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #D4AF37;">Appointment Confirmed!</h2>
          <p>Hi ${name},</p>
          <p>Your appointment at Premiereglow Centrale has been confirmed. We look forward to seeing you!</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <br/>
          <p><strong>Location:</strong> 2nd Floor, CityMall Bacalso, Natalio B. Bacalso Ave, Cebu City</p>
          <p>If you need to reschedule or cancel, please contact us at 0998 258 4178.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Premiereglow Centrale - Crafting Beauty with Elegance and Care</p>
        </div>
      `,
    } : null;

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email credentials missing. Notification not sent.");
        return res.status(200).json({ success: true, message: "Booking saved, but email notification skipped due to missing credentials." });
      }

      await transporter.sendMail(ownerMailOptions);
      if (clientMailOptions) {
        await transporter.sendMail(clientMailOptions);
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, error: "Failed to send email notification" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
