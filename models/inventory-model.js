const pool = require('../database');

/* ***************************
 *  Get all classification data
 * ************************** */
const getClassifications = async () => {
  return await pool.query('SELECT * FROM classification ORDER BY clas_name');
};

const getClassificationById = async (clasId) => {
  try {
    const { rows } = await pool.query(
      'SELECT clas_name FROM classification WHERE clas_id=$1',
      [clasId]
    );
    return rows[0].clas_name;
  } catch (error) {
    console.error('getClassificationById error', error);
  }
};

/* ***************************
 *  Get Inventory By Classification ID
 * ************************** */
const getInventoryByClassificationId = async (clasId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM inventory AS i JOIN classification AS c ON i.clas_id = c.clas_id WHERE i.clas_id = $1`,
      [clasId]
    );
    return rows;
  } catch (error) {
    console.log('getInventoryByClassificationId error', error);
  }
};

/* ***************************
 *  Get Inventory Details By ID
 * ************************** */
const getDetailsByInventoryId = async (invId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM inventory WHERE inv_id = $1`,
      [invId]
    );
    return rows[0];
  } catch (error) {
    console.log('getDetailsByInventoryId error', error);
  }
};

/* ***************************
 *  Get Inventory Details By ID
 * ************************** */
const getReviewsByInventoryId = async (invId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM review WHERE inv_id = $1`,
      [invId]
    );
    return rows;
  } catch (error) {
    console.log('getReviewsByInventoryId error', error);
  }
};

/* ***************************
 *  Create Review Data
 * ************************** */
const createReview = async ({ review_description, review_rate, inv_id }) => {
  try {
    const sql =
      'INSERT INTO review (review_description, review_rate, inv_id) VALUES ($1, $2, $3) RETURNING *';
    return await pool.query(sql, [review_description, review_rate, inv_id]);
  } catch (error) {
    return error.message;
  }
};

/* ***************************
 *  Create Classification Data
 * ************************** */
const createClassification = async (clas_name) => {
  try {
    const sql =
      'INSERT INTO classification (clas_name) VALUES ($1) RETURNING *';
    return await pool.query(sql, [clas_name]);
  } catch (error) {
    return error.message;
  }
};

/* ***************************
 *  Create Inventory Data
 * ************************** */
const createInventory = async (formData) => {
  const arrayValues = [
    formData.clas_id,
    formData.inv_make,
    formData.inv_model,
    formData.inv_year,
    formData.inv_description,
    formData.inv_image,
    formData.inv_thumbnail,
    formData.inv_price,
    formData.inv_miles,
    formData.inv_color,
  ];
  try {
    const sql =
      'INSERT INTO inventory (clas_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    return await pool.query(sql, arrayValues);
  } catch (error) {
    return error.message;
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
const updateInventory = async ({
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  clas_id,
}) => {
  try {
    const sql =
      'UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, clas_id = $10 WHERE inv_id = $11 RETURNING *';
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      clas_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error('model error: ' + error);
  }
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
const deleteInventoryById = async (inv_id) => {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1 RETURNING *';
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error('deleteInventoryById error: ', error);
  }
};

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getDetailsByInventoryId,
  createClassification,
  getClassificationById,
  createInventory,
  updateInventory,
  deleteInventoryById,
  getReviewsByInventoryId,
  createReview,
};
