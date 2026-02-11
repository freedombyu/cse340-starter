const pool = require('../database');

const getClassifications = async () => {
  return await pool.query('SELECT * FROM classification ORDER BY classification_name');
};

const getInventoryByClassificationId = async (clasId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM inventory AS i 
       JOIN classification AS c ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [clasId]
    );
    return rows;
  } catch (error) {
    console.error('getInventoryByClassificationId error', error);
    return [];
  }
};

const getDetailsByInventoryId = async (invId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM inventory WHERE inv_id = $1`,
      [invId]
    );
    return rows[0];
  } catch (error) {
    console.error('getDetailsByInventoryId error', error);
    return null;
  }
};

const getClassificationById = async (clasId) => {
  try {
    const { rows } = await pool.query(
      `SELECT classification_name FROM classification WHERE classification_id = $1`,
      [clasId]
    );
    return rows[0]?.classification_name || 'Unknown';
  } catch (error) {
    console.error('getClassificationById error', error);
    return 'Unknown';
  }
};

const getReviewsByInventoryId = async (invId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM reviews WHERE inv_id = $1`,
      [invId]
    );
    return rows;
  } catch (error) {
    console.error('getReviewsByInventoryId error', error);
    return [];
  }
};

// ✅ NEW - Optimized query for management page (only gets what's needed)
const getInventoryForManagement = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        i.inv_id, 
        i.inv_make, 
        i.inv_model, 
        i.inv_year,
        i.inv_price,
        c.classification_name
       FROM inventory AS i 
       JOIN classification AS c ON i.classification_id = c.classification_id 
       ORDER BY c.classification_name, i.inv_make, i.inv_model
       LIMIT 100`  // Limit to prevent slow loads
    );
    return rows;
  } catch (error) {
    console.error('getInventoryForManagement error', error);
    return [];
  }
};

// ✅ NEW - Get inventory by classification for dropdown filtering
const getInventoryByClassificationForManagement = async (clasId) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        i.inv_id, 
        i.inv_make, 
        i.inv_model, 
        i.inv_year,
        c.classification_name
       FROM inventory AS i 
       JOIN classification AS c ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1
       ORDER BY i.inv_make, i.inv_model`,
      [clasId]
    );
    return rows;
  } catch (error) {
    console.error('getInventoryByClassificationForManagement error', error);
    return [];
  }
};

const createClassification = async (clas_name) => {
  try {
    const sql =
      'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *';
    return await pool.query(sql, [clas_name]);
  } catch (error) {
    console.error('createClassification error', error);
    return error.message;
  }
};

const createInventory = async (
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) => {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`;
    
    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    ]);
  } catch (error) {
    console.error('createInventory error', error);
    return null;
  }
};

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getDetailsByInventoryId,
  getClassificationById,
  getReviewsByInventoryId,
  createClassification,
  createInventory,
  getInventoryForManagement,  
  getInventoryByClassificationForManagement,  
};