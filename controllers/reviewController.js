const reviewModel = require('../models/review-model');
const invModel = require('../models/inventory-model');
const utilities = require('../utilities');
const { validationResult } = require('express-validator');

/* ***************************
 *  Build add review form
 * ************************** */
async function buildAddReview(req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  
  try {
    const vehicle = await invModel.getDetailsByInventoryId(inv_id);
    
    if (!vehicle) {
      req.flash('notice', 'Vehicle not found');
      return res.redirect('/inv');
    }

    // Check if user already reviewed this vehicle
    if (res.locals.accountData) {
      const accountId = res.locals.accountData.account_id;
      const alreadyReviewed = await reviewModel.hasUserReviewed(inv_id, accountId);
      
      if (alreadyReviewed) {
        req.flash('notice', 'You have already reviewed this vehicle. You can edit your existing review from the vehicle details page.');
        return res.redirect(`/inv/detail/${inv_id}`);
      }
    }
    
    res.render('reviews/add-review', {
      title: `Review ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      errors: null,
      rating: '',
      review_text: '',
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Process add review
 * ************************** */
async function processAddReview(req, res, next) {
  const { inv_id, rating, review_text } = req.body;
  const nav = await utilities.getNav();
  
  // Check if user is logged in
  if (!res.locals.accountData || !res.locals.accountData.account_id) {
    req.flash('notice', 'You must be logged in to submit a review.');
    return res.redirect('/account/login');
  }
  
  const account_id = res.locals.accountData.account_id;
  
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const vehicle = await invModel.getDetailsByInventoryId(inv_id);
    return res.render('reviews/add-review', {
      title: `Review ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      errors: errors.array(),
      rating,
      review_text,
    });
  }
  
  try {
    // Check again if user already reviewed
    const alreadyReviewed = await reviewModel.hasUserReviewed(inv_id, account_id);
    if (alreadyReviewed) {
      req.flash('notice', 'You have already reviewed this vehicle.');
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    await reviewModel.addReview(inv_id, account_id, rating, review_text);
    req.flash('notice', 'Your review has been submitted successfully!');
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error('Add review error:', error);
    req.flash('notice', 'Sorry, there was an error submitting your review.');
    res.redirect(`/inv/detail/${inv_id}`);
  }
}

/* ***************************
 *  Build edit review form
 * ************************** */
async function buildEditReview(req, res, next) {
  const review_id = parseInt(req.params.review_id);
  const nav = await utilities.getNav();
  
  try {
    const review = await reviewModel.getReviewById(review_id);
    
    if (!review) {
      req.flash('notice', 'Review not found');
      return res.redirect('/account');
    }
    
    // Check authorization
    if (!res.locals.accountData || review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You are not authorized to edit this review');
      return res.redirect('/account');
    }
    
    const vehicle = await invModel.getDetailsByInventoryId(review.inv_id);
    
    res.render('reviews/edit-review', {
      title: `Edit Review - ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      review,
      vehicle,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Process update review
 * ************************** */
async function processUpdateReview(req, res, next) {
  const { review_id, rating, review_text } = req.body;
  const nav = await utilities.getNav();
  
  // Check if user is logged in
  if (!res.locals.accountData || !res.locals.accountData.account_id) {
    req.flash('notice', 'You must be logged in to update a review.');
    return res.redirect('/account/login');
  }
  
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const review = await reviewModel.getReviewById(review_id);
    const vehicle = await invModel.getDetailsByInventoryId(review.inv_id);
    return res.render('reviews/edit-review', {
      title: `Edit Review - ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      review: { ...review, review_rating: rating, review_text },
      vehicle,
      errors: errors.array(),
    });
  }
  
  try {
    const review = await reviewModel.getReviewById(review_id);
    
    // Check authorization
    if (review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You are not authorized to edit this review');
      return res.redirect('/account');
    }
    
    await reviewModel.updateReview(review_id, rating, review_text);
    req.flash('notice', 'Your review has been updated successfully!');
    res.redirect(`/inv/detail/${review.inv_id}`);
  } catch (error) {
    console.error('Update review error:', error);
    req.flash('notice', 'Sorry, there was an error updating your review.');
    next(error);
  }
}

/* ***************************
 *  Process delete review
 * ************************** */
async function processDeleteReview(req, res, next) {
  const review_id = parseInt(req.params.review_id);
  
  // Check if user is logged in
  if (!res.locals.accountData || !res.locals.accountData.account_id) {
    req.flash('notice', 'You must be logged in to delete a review.');
    return res.redirect('/account/login');
  }
  
  try {
    const review = await reviewModel.getReviewById(review_id);
    
    if (!review) {
      req.flash('notice', 'Review not found');
      return res.redirect('/account');
    }
    
    // Check authorization
    if (review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You are not authorized to delete this review');
      return res.redirect('/account');
    }
    
    const inv_id = review.inv_id;
    await reviewModel.deleteReview(review_id);
    req.flash('notice', 'Your review has been deleted successfully!');
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error('Delete review error:', error);
    req.flash('notice', 'Sorry, there was an error deleting your review.');
    next(error);
  }
}

/* ***************************
 *  Build user reviews management page
 * ************************** */
async function buildUserReviews(req, res, next) {
  const nav = await utilities.getNav();
  
  try {
    // Check if user is logged in
    if (!res.locals.accountData || !res.locals.accountData.account_id) {
      req.flash('notice', 'You must be logged in to view your reviews.');
      return res.redirect('/account/login');
    }
    
    const account_id = res.locals.accountData.account_id;
    const reviews = await reviewModel.getReviewsByAccountId(account_id);
    
    res.render('reviews/user-reviews', {
      title: 'My Reviews',
      nav,
      reviews,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildAddReview,
  processAddReview,
  buildEditReview,
  processUpdateReview,
  processDeleteReview,
  buildUserReviews,
};