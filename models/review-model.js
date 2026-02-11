const pool = require('../database/');

/* ***************************
 *  Add new review
 * ************************** */
async function addReview(inv_id, account_id, rating, reviewText) {
  try {
    const sql = `
      INSERT INTO reviews (inv_id, account_id, review_rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(sql, [inv_id, account_id, rating, reviewText]);
    return result.rows[0];
  } catch (error) {
    console.error('addReview error: ', error);
    throw error;
  }
}

/* ***************************
 *  Get all reviews for a vehicle
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT 
        r.review_id,
        r.inv_id,
        r.account_id,
        r.review_rating,
        r.review_text,
        r.review_date,
        r.updated_at,
        a.account_firstname,
        a.account_lastname
      FROM reviews r
      INNER JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error('getReviewsByInventoryId error: ', error);
    return [];
  }
}

/* ***************************
 *  Get review by ID
 * ************************** */
async function getReviewById(review_id) {
  try {
    const sql = 'SELECT * FROM reviews WHERE review_id = $1';
    const result = await pool.query(sql, [review_id]);
    return result.rows[0];
  } catch (error) {
    console.error('getReviewById error: ', error);
    return null;
  }
}

/* ***************************
 *  Get all reviews by a user
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT 
        r.*,
        i.inv_make,
        i.inv_model,
        i.inv_year
      FROM reviews r
      INNER JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC
    `;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    console.error('getReviewsByAccountId error: ', error);
    return [];
  }
}

/* ***************************
 *  Update review
 * ************************** */
async function updateReview(review_id, rating, reviewText) {
  try {
    const sql = `
      UPDATE reviews
      SET review_rating = $1,
          review_text = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE review_id = $3
      RETURNING *
    `;
    const result = await pool.query(sql, [rating, reviewText, review_id]);
    return result.rows[0];
  } catch (error) {
    console.error('updateReview error: ', error);
    throw error;
  }
}

/* ***************************
 *  Delete review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM reviews WHERE review_id = $1';
    const result = await pool.query(sql, [review_id]);
    return result.rowCount;
  } catch (error) {
    console.error('deleteReview error: ', error);
    throw error;
  }
}

/* ***************************
 *  Get average rating for vehicle
 * ************************** */
async function getAverageRating(inv_id) {
  try {
    const sql = `
      SELECT 
        COALESCE(ROUND(AVG(review_rating)::numeric, 1), 0) as avg_rating,
        COUNT(*) as review_count
      FROM reviews
      WHERE inv_id = $1
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error('getAverageRating error: ', error);
    return { avg_rating: 0, review_count: 0 };
  }
}

/* ***************************
 *  Check if user already reviewed
 * ************************** */
async function hasUserReviewed(inv_id, account_id) {
  try {
    const sql = `
      SELECT COUNT(*) as count
      FROM reviews
      WHERE inv_id = $1 AND account_id = $2
    `;
    const result = await pool.query(sql, [inv_id, account_id]);
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('hasUserReviewed error: ', error);
    return false;
  }
}

module.exports = {
  addReview,
  getReviewsByInventoryId,
  getReviewById,
  getReviewsByAccountId,
  updateReview,
  deleteReview,
  getAverageRating,
  hasUserReviewed,
};