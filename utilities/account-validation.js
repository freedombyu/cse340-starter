const { body, validationResult } = require('express-validator');
const { buildSignupGrid, buildEditAccountGrid, buildLoginGrid } = require('.');
const {
  checkExistingEmail,
  getAccountByEmail,
} = require('../models/account-model');

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
const signupRules = () => {
  return [
    // firstname is required and must be string
    body('acc_firstname')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a first name.'), // on error this message is sent.

    // lastname is required and must be string
    body('acc_lastname')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a last name.'), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body('acc_email')
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.')
      .custom(async (acc_email) => {
        const emailExist = await checkExistingEmail(acc_email);
        if (emailExist) {
          throw new Error(
            'Email already exists. Please login or register with a different email.'
          );
        }
      }),

    // password is required and must be strong password
    body('acc_password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
const checkUserSignupData = async (req, res, next) => {
  const { acc_firstname, acc_lastname, acc_email } = req.body;
  const formData = {
    acc_firstname,
    acc_lastname,
    acc_email,
  };
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { grid, title, nav } = await buildSignupGrid();
    res.render('./account/signup', {
      errors,
      title,
      nav,
      grid,
      formData,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
const loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body('acc_email')
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('Invalid credentials, please review and try again.'),

    // password is required and must be strong password
    body('acc_password')
      .trim()
      .notEmpty()
      .withMessage('Invalid credentials, please review and try again.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
const checkUserLoginData = async (req, res, next) => {
  const { acc_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { title, nav } = await buildLoginGrid();
    res.render('account/login', {
      errors,
      title,
      nav,
      acc_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Account Data Validation Rules
 * ********************************* */
const updateAccountRules = () => {
  return [
    body('acc_firstname')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a first name.'),
    body('acc_lastname')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a last name.'),
    body('acc_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.')
      .custom(async (acc_email, { req }) => {
        const account = await getAccountByEmail(acc_email);
        if (account && account.acc_id !== req.user.acc_id) {
          throw new Error(
            'Email already exists. Please choose a different email.'
          );
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
const checkUpdateAccountData = async (req, res, next) => {
  let dataErrors = [];
  dataErrors = validationResult(req);
  if (!dataErrors.isEmpty()) {
    const { title, nav } = await buildEditAccountGrid();
    res.render('./account/edit', {
      title,
      nav,
      dataErrors,
      passwordErrors: null,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Password Validation Rules
 * ********************************* */
const updatePasswordRules = () => {
  return [
    body('acc_password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
const checkUpdatePasswordData = async (req, res, next) => {
  let passwordErrors = [];
  passwordErrors = validationResult(req);
  if (!passwordErrors.isEmpty()) {
    const { title, nav } = await buildEditAccountGrid();
    res.render('./account/edit', {
      title,
      nav,
      dataErrors: null,
      passwordErrors,
    });
    return;
  }
  next();
};

module.exports = {
  signupRules,
  checkUserSignupData,
  loginRules,
  checkUserLoginData,
  updateAccountRules,
  checkUpdateAccountData,
  updatePasswordRules,
  checkUpdatePasswordData,
};
