const RatingReview = require('../models/RatingAndReview');

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

module.exports = {
  createRatingReview,
  getProductReviews,
  getProductAverageRating,
};
