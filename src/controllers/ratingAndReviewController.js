const RatingReview = require('../models/RatingAndReview');
const User = require('../models/User');

const createRatingReview = async (req, res) => {
  const { userId, productId, rating, review } = req.body;

  try {
    const existingReview = await RatingReview.findOne({ userId, productId });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.review = review;
      await existingReview.save();
      return res.status(200).json({ message: 'Review updated successfully.' });
    }

    const newRatingReview = new RatingReview({
      userId,
      productId,
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
  const { productId } = req.params;

  try {
    const reviews = await RatingReview.find({ productId }).populate('userId', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

const getProductAverageRating = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await RatingReview.find({ productId });

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    res.status(200).json({ averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching average rating', error });
  }
};

const getMostRatedArtisans = async (req, res) => {
  try {
    const { limit = 10 } = req.query; // Optional query parameter to limit results

    // Sort artisans by rating in descending order and limit the results
    const artisans = await User.find({ user_type: 'artisan' })
      .sort({ rating: -1 }) // Sort by rating in descending order
      .limit(Number(limit)); // Limit the number of results

    if (!artisans || artisans.length === 0) {
      return res.status(404).json({ message: 'No artisans found.' });
    }

    res.status(200).json({ artisans });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get least rated artisans
const getLeastRatedArtisans = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const artisans = await User.find({ user_type: 'artisan' })
      .sort({ rating: 1 }) // Sort by rating in ascending order (least rated first)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (!artisans || artisans.length === 0) {
      return res.status(404).json({ message: 'No artisans found.' });
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
