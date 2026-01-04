const pool = require('../database');

const getClassifications = async () => {
  return await pool.query('SELECT * FROM classification ORDER BY clas_name');
};

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

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
};