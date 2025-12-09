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

const updateData = async (acc_id, data) => {
  const { acc_firstname, acc_lastname, acc_email } = data;
  try {
    const sql =
      'UPDATE account SET acc_firstname=$2, acc_lastname=$3, acc_email=$4 WHERE acc_id=$1 RETURNING *';
    const values = [acc_id, acc_firstname, acc_lastname, acc_email];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

const updatePassword = async (acc_id, acc_password) => {
  try {
    const sql =
      'UPDATE account SET acc_password=$2 WHERE acc_id=$1 RETURNING *';
    values = [acc_id, acc_password];
    return await pool.query(sql, values);
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

/* **********************
 *   Check for existing email
 * ********************* */
const checkExistingEmail = async (acc_email) => {
  try {
    const sql = 'SELECT * FROM account WHERE acc_email = $1';
    const email = await pool.query(sql, [acc_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
};

/* **********************
 *   Get Account by email
 * ********************* */
const getAccoutByEmail = async (acc_email) => {
  try {
    const sql = 'SELECT * FROM account WHERE acc_email = $1';
    const email = await pool.query(sql, [acc_email]);
    return email.rows[0];
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  createUser,
  getAccountByEmail,
  checkExistingEmail,
  updatePassword,
  getAccoutByEmail,
  updateData,
};
