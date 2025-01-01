const Booking = require('../models/Booking')

const bookService = async (req, res) => {
    try {
      const { artisanId, description, bookingDate } = req.body;
  
      
      if (!artisanId || !description || !bookingDate) {
        return res.status(400).json({
          message: "Artisan ID, description, and booking date are required.",
        });
      }
  
      const booking = new Booking({
        artisanId,
        userId: req.user._id, 
        description,
        bookingDate,
      });
  
      const savedBooking = await booking.save();
  
      res.status(201).json({
        message: "Booking successfully created.",
        booking: savedBooking,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error booking service.",
        error: error.message,
      });
    }
  };
  

  module.exports = {
    bookService
  }