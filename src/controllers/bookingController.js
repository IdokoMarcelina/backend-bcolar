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
    const message = `
      <h2>You have a new service booking</h2>
      <p>Service Description: ${description}</p>
      <p>Date: ${new Date(bookingDate).toLocaleString()}</p>
      <p>Thank you for using our platform!</p>
    `;
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

module.exports = {
  bookArtisanService,
};
