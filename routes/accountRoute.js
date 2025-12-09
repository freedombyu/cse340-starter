const { Router } = require('express');
const { handleErrors } = require('../utilities');
const {
  buildLogin,
  buildSignup,
  signupUser,
  loginUser,
  buildAccount,
  logoutUser,
  buildEditAccount,
  editPassword,
  editAccountData,
} = require('../controllers/accountController');
const {
  signupRules,
  loginRules,
  checkUserSignupData,
  checkUserLoginData,
  updatePasswordRules,
  checkUpdatePasswordData,
  updateAccountRules,
  checkUpdateAccountData,
} = require('../utilities/account-validation');

const accountRouter = new Router();

accountRouter.get('/', handleErrors(buildAccount));
accountRouter.get('/login', handleErrors(buildLogin));
accountRouter.get('/signup', handleErrors(buildSignup));
accountRouter.get('/logout', handleErrors(logoutUser));
accountRouter.get('/edit', handleErrors(buildEditAccount));

accountRouter.post(
  '/login',
  loginRules(),
  checkUserLoginData,
  handleErrors(loginUser)
);
accountRouter.post(
  '/signup',
  signupRules(),
  checkUserSignupData,
  handleErrors(signupUser)
);
accountRouter.post(
  '/edit/data',
  updateAccountRules(),
  checkUpdateAccountData,
  handleErrors(editAccountData)
);
accountRouter.post(
  '/edit/password',
  updatePasswordRules(),
  checkUpdatePasswordData,
  handleErrors(editPassword)
);

module.exports = accountRouter;
