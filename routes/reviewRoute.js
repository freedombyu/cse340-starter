const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities');
const { body } = require('express-validator');

// Validation rules for reviews
const reviewValidation = [
  body('rating')
    .trim()
    .notEmpty()
    .withMessage('Please select a rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5 stars'),
  
  body('review_text')
    .trim()
    .notEmpty()
    .withMessage('Review text is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review must be between 10 and 1000 characters')
    .escape(),
];

// My Reviews
router.get(
  '/my-reviews',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildUserReviews)
);

// Add review form
router.get(
  '/add/:inv_id',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildAddReview)
);

// Process add review
router.post(
  '/add',
  utilities.checkLogin,
  reviewValidation,
  utilities.handleErrors(reviewController.processAddReview)
);

// Edit review form
router.get(
  '/edit/:review_id',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview)
);

// Process update review
router.post(
  '/update',
  utilities.checkLogin,
  reviewValidation,
  utilities.handleErrors(reviewController.processUpdateReview)
);

// Delete review
router.get(
  '/delete/:review_id',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.processDeleteReview)
);

module.exports = router;