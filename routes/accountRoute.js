const { Router } = require('express');
const { handleErrors } = require('../utilities');
const {
  buildLogin,
  buildSignup,
  signupUser,
  loginUser,
  buildAccount,
} = require('../controllers/accountController');
const {
  signupRules,
  loginRules,
  checkUserSignupData,
  checkUserLoginData,
} = require('../utilities/account-validation');

const accountRouter = new Router();

accountRouter.get('/', handleErrors(buildAccount));

accountRouter.get('/login', handleErrors(buildLogin));
accountRouter.get('/signup', handleErrors(buildSignup));

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

module.exports = accountRouter;