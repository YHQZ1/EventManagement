import User from "../models/User.js";
import EventInterest from "../models/EventInterest.js";
import Event from "../models/Event.js";
import { Resend } from "resend";

const getResendClient = () => {
  return new Resend(process.env.RESEND_API_KEY);
};

// Get all users emails (Admin only)
export const getAllUsersEmails = async (req, res) => {
  try {
    const users = await User.find({}, "email name");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get interested users for email (Admin only)
export const getInterestedUsersForEmail = async (req, res) => {
  try {
    const { eventId } = req.params;

    const interestedUsers = await EventInterest.find({ event: eventId })
      .populate("user", "email name")
      .populate("event", "title date time location");

    res.json(interestedUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send bulk email notification to all interested users for an event
export const sendBulkEventNotification = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { subject, message, customMessage } = req.body;

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get all interested users for this event using your existing Event model structure
    const interestedUsers = await User.find(
      {
        _id: { $in: event.interestedUsers },
      },
      "email name"
    );

    if (interestedUsers.length === 0) {
      return res
        .status(400)
        .json({ message: "No interested users found for this event" });
    }

    // Prepare email content
    const emailSubject = subject || `Update: ${event.title}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .event-details { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0; }
            .custom-message { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ISKCON Events</h1>
              <h2>${emailSubject}</h2>
            </div>
            
            <div class="event-details">
              <h3>Event Details:</h3>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Date:</strong> ${new Date(
                event.date
              ).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${event.time}</p>
              <p><strong>Location:</strong> ${event.location}</p>
            </div>

            ${
              customMessage
                ? `
            <div class="custom-message">
              <h4>Message from Event Organizer:</h4>
              <p>${customMessage}</p>
            </div>
            `
                : ""
            }

            ${message ? `<p>${message}</p>` : ""}

            <div class="footer">
              <p>Thank you for your interest in ISKCON events.</p>
              <p>Hare Krishna!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send emails to all interested users
    const emailPromises = interestedUsers.map(async (user) => {
      try {
        const resend = getResendClient();
        await resend.emails.send({
          from: "ISKCON Events <onboarding@resend.dev>",
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        });
        return { email: user.email, status: "sent" };
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
        return {
          email: user.email,
          status: "failed",
          error: emailError.message,
        };
      }
    });

    const results = await Promise.all(emailPromises);

    const sentCount = results.filter(
      (result) => result.status === "sent"
    ).length;
    const failedCount = results.filter(
      (result) => result.status === "failed"
    ).length;

    res.json({
      message: `Emails sent successfully to ${sentCount} users. ${failedCount} failed.`,
      totalUsers: interestedUsers.length,
      sent: sentCount,
      failed: failedCount,
      details: results,
    });
  } catch (error) {
    console.error("Bulk email error:", error);
    res.status(500).json({
      message: "Failed to send bulk emails",
      error: error.message,
    });
  }
};
