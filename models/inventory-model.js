const pool = require('../database');

const getClassifications = async () => {
  return await pool.query('SELECT * FROM classification ORDER BY classification_name');
};

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get classification name by classification_id
 * ************************** */
async function getClassificationNameById(classification_id) {
  try {
    const data = await pool.query(
      "SELECT classification_name FROM public.classification WHERE classification_id = $1",
      [classification_id]
    )
    return data.rows[0].classification_name
  } catch (error) {
    console.error("getClassificationNameById error " + error)
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getClassificationNameById,
};