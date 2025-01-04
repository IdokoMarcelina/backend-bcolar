const mongoose = require('mongoose');

const ratingReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }, 
  rating: { type: Number, required: true, min: 1, max: 5 }, 
  review: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RatingReview', ratingReviewSchema);
