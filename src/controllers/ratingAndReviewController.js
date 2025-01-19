const RatingReview = require('../models/RatingAndReview');
const User = require('../models/User');

const createRatingReview = async (req, res) => {
  const { userId, rating, review } = req.body;

  try {
    const existingReview = await RatingReview.findOne({ userId });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.review = review;
      await existingReview.save();
      return res.status(200).json({ message: 'Review updated successfully.' });
    }

    const newRatingReview = new RatingReview({
      userId,
      rating,
      review,
    });

    await newRatingReview.save();
    res.status(200).json({ message: 'Review and rating added successfully.', data: newRatingReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while creating review and rating', error });
  }
};

const getProductReviews = async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await RatingReview.find({ userId }).populate('userId', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

const getProductAverageRating = async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await RatingReview.find({ userId });

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    res.status(200).json({ averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching average rating', error });
  }
};

const getMostRatedArtisans = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const artisans = await User.find({ user_type: 'artisan', rating: { $gt: 0 } })
      .sort({ rating: -1 })
      .limit(Number(limit));

    if (!artisans || artisans.length === 0) {
      return res.status(404).json({ message: 'No rated artisans found.' });
    }

    res.status(200).json({ artisans });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


const getLeastRatedArtisans = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const artisans = await User.find({ user_type: 'artisan', rating: { $gt: 0 } })
      .sort({ rating: 1 }) 
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (!artisans || artisans.length === 0) {
      return res.status(404).json({ message: 'No rated artisans found.' });
    }

    res.status(200).json({ artisans });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};




module.exports = {
  createRatingReview,
  getProductReviews,
  getProductAverageRating,
  getMostRatedArtisans,
  getLeastRatedArtisans
};
