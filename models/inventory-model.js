const pool = require("../database/");

const invModel = {};

// Check if classification already exists
invModel.checkExistingClassification = async function(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0;
  } catch (error) {
    return error.message;
  }
};

// Add new classification to database
invModel.addClassification = async function(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

// Get inventory by classification ID
invModel.getInventoryByClassificationId = async function(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory AS i 
      JOIN classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
    throw error;
  }
};

// Get inventory item by inventory ID - FIXED FUNCTION
invModel.getInventoryByInventoryId = async function(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory AS i 
      JOIN classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    
    // Check if any rows were returned
    if (data.rows.length === 0) {
      return null;
    }
    
    // Return the data as an array with one element to match controller expectations
    return [data.rows[0]];
  } catch (error) {
    console.error("getInventoryByInventoryId error " + error);
    throw error;
  }
};

// Get all classifications
invModel.getClassifications = async function() {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name";
    const result = await pool.query(sql);
    return result;  // Return the entire result object, which has a .rows property
  } catch (error) {
    return error.message;
  }
};

// Add new inventory item - FIXED PARAMETER HANDLING
invModel.addInventoryItem = async function(
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
) {
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
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const params = [
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
    ];
    
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

// Get classification name by ID
invModel.getClassificationNameById = async function(classification_id) {
  try {
    const sql = "SELECT classification_name FROM classification WHERE classification_id = $1";
    const result = await pool.query(sql, [classification_id]);
    return result.rows[0]?.classification_name || "Unknown Classification";
  } catch (error) {
    console.error("getClassificationNameById error: " + error);
    throw error;
  }
};

module.exports = invModel;