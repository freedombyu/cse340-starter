const { Router } = require('express');
const { handleErrors, checkJWTToken } = require('../utilities');
const {
  buildLogin,
  buildSignup,
  signupUser,
  loginUser,
  buildAccount,
  buildEditAccount,
  editAccountData,   
  editPassword,
  logoutUser,
} = require('../controllers/accountController');
const {
  signupRules,
  loginRules,
  checkUserSignupData,
  checkUserLoginData,
  updateDataRules,
  checkUpdateData,
  updatePasswordRules,
  checkPasswordUpdate,
} = require('../utilities/account-validation');

const accountRouter = new Router();

// Public routes (no login required)
accountRouter.get('/login', handleErrors(buildLogin));
accountRouter.get('/signup', handleErrors(buildSignup));
accountRouter.get('/logout', handleErrors(logoutUser));

accountRouter.post(
  '/signup',
  signupRules(),
  checkUserSignupData,
  handleErrors(signupUser)
);

accountRouter.post(
  '/login',
  loginRules(),
  checkUserLoginData,
  handleErrors(loginUser)
);

// Protected routes - require login (checkJWTToken middleware)
accountRouter.get('/', checkJWTToken, handleErrors(buildAccount));
accountRouter.get('/edit', checkJWTToken, handleErrors(buildEditAccount));

accountRouter.post(
  '/update-data',
  checkJWTToken,
  updateDataRules(),
  checkUpdateData,
  handleErrors(editAccountData)
);

accountRouter.post(
  '/update-password',
  checkJWTToken,
  updatePasswordRules(),
  checkPasswordUpdate,
  handleErrors(editPassword)
);

module.exports = accountRouter;