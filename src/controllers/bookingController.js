const Booking = require('../models/Booking');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const bookArtisanService = async (req, res) => {
  try {
    const { artisanId, description, bookingDate } = req.body;

    if (!artisanId || !description || !bookingDate) {
      return res.status(400).json({
        message: "Artisan ID, description, and booking date are required.",
      });
    }

    if (new Date(bookingDate) < new Date().setHours(0, 0, 0, 0)) {
      return res
        .status(400)
        .json({ message: "Booking date cannot be in the past." });
    }

    const newBooking = new Booking({
      userId: req.user._id,
      artisanId,
      bookingDate: new Date(bookingDate),
      description,
    });

    const savedBooking = await newBooking.save();

    const artisan = await User.findById(artisanId);
    if (!artisan || !artisan.email) {
      return res.status(404).json({ message: "Artisan not found or email missing." });
    }

    const subject = `New Service Booking: ${description}`;
    message = `

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Booking Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #007BFF;
                color: #ffffff;
                text-align: center;
                padding: 20px 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .content h2 {
                color: #007BFF;
            }
            .details {
                margin: 15px 0;
                padding: 10px;
                background-color: #f9f9f9;
                border: 1px solid #dddddd;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #777777;
                padding: 15px;
                background-color: #f4f4f4;
                border-top: 1px solid #dddddd;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                You Have a New Service Booking
            </div>
            <div class="content">
                <h2>Service Details</h2>
                <div class="details">
                    <p><strong>Service Description:</strong> ${description}</p>
                    <p><strong>Date:</strong> ${new Date(bookingDate). toLocaleString()}</p>
                </div>
                <p>Thank you for using our platform!</p>
            </div>
            <div class="footer">
                © 2025 BLUE COLLAR. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    
    ` ;
    const send_to = artisan.email; 
    const sent_from = process.env.EMAIL_USER;
    const reply_to = req.user.email;  

    await sendEmail(subject, message, send_to, sent_from, reply_to);

    res.status(201).json({
      message: "Service booked successfully and notification sent.",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error booking artisan service:", error.message);
    res.status(500).json({
      message: "Error booking artisan service.",
      error: error.message,
    });
  }
};


const getUserBookings = async (req, res) => {
    try {
      const bookings = await Booking.find({ userId: req.user._id })
        .populate("artisanId", "name")
        .select("description bookingDate status");
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving booking history.",
        error: error.message,
      });
    }
  };
  
  const cancelBooking = async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await Booking.findOneAndUpdate(
        { _id: bookingId, userId: req.user._id },
        { status: "cancelled" },
        { new: true }
      );
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }
  
      res.status(200).json({ message: "Booking cancelled successfully." });
    } catch (error) {
      res.status(500).json({
        message: "Error cancelling booking.",
        error: error.message,
      });
    }
  };
  
  

module.exports = {
  bookArtisanService,
  getUserBookings,
  cancelBooking
};
