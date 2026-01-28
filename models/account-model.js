const pool = require('../database');

/* *****************************
 *   Register new account
 * *************************** */
const createUser = async (
  acc_firstname,
  acc_lastname,
  acc_email,
  acc_password
) => {
  try {
    const sql =
      "INSERT INTO account (acc_firstname, acc_lastname, acc_email, acc_password, acc_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      acc_firstname,
      acc_lastname,
      acc_email,
      acc_password,
    ]);
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 * Return account data using email address
 * ***************************** */
const getAccountByEmail = async (acc_email) => {
  try {
    const result = await pool.query(
      'SELECT acc_id, acc_firstname, acc_lastname, acc_email, acc_type, acc_password FROM account WHERE acc_email = $1',
      [acc_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error('No matching email found');
  }
};

module.exports = {
  createUser,
  getAccountByEmail,
};
