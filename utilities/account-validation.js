const { body, validationResult } = require('express-validator');
const { buildSignupGrid, buildLoginGrid, buildEditAccountGrid } = require('.');
const { checkExistingEmail } = require('../models/account-model');

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
const signupRules = () => {
  return [
    // firstname is required and must be string
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a first name.'),

    // lastname is required and must be string
    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a last name.'),

    // valid email is required and cannot already exist in the DB
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.')
      .custom(async (account_email) => {
        const emailExist = await checkExistingEmail(account_email);
        if (emailExist) {
          throw new Error(
            'Email already exists. Please login or register with a different email.'
          );
        }
      }),

    // password is required and must be strong password
    body('account_password')
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
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { title, nav } = await buildSignupGrid();
    res.render('account/signup', {
      errors,
      title,
      nav,
      formData: {
        account_firstname,
        account_lastname,
        account_email,
      },
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
    // valid email is required
    body('account_email')
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid credentials, please review and try again.'),

    // password is required
    body('account_password')
      .trim()
      .notEmpty()
      .withMessage('Invalid credentials, please review and try again.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
const checkUserLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { title, nav } = await buildLoginGrid();
    res.render('account/login', {
      errors,
      title,
      nav,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Account Data Validation Rules
 * ********************************* */
const updateDataRules = () => {
  return [
    // firstname is required and must be string
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a first name.'),

    // lastname is required and must be string
    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a last name.'),

    // valid email is required
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),
  ];
};

/* ******************************
 * Check update data and return errors or continue
 * ***************************** */
const checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const { title, nav } = await buildEditAccountGrid();
    res.render('account/edit', {
      title,
      nav,
      dataErrors: errors,
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
    // password is required and must be strong password
    body('account_password')
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
 * Check password update and return errors or continue
 * ***************************** */
const checkPasswordUpdate = async (req, res, next) => {
  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const { title, nav } = await buildEditAccountGrid();
    res.render('account/edit', {
      title,
      nav,
      dataErrors: null,
      passwordErrors: errors,
    });
    return;
  }
  next();
};

module.exports = {
  signupRules,
  loginRules,
  checkUserSignupData,
  checkUserLoginData,
  updateDataRules,
  checkUpdateData,
  updatePasswordRules,
  checkPasswordUpdate,
};