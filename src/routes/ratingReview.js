

const express = require('express');
const { createRatingReview, getProductReviews, getProductAverageRating } = require('../controllers/ratingAndReviewController');

const router = express.Router();

router.post('/create', createRatingReview);

router.get('/rating/:productId', getProductReviews);

router.get('/average-rating/:productId', getProductAverageRating);

module.exports = router;
