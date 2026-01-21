const { Router } = require('express');
const { serverError } = require('../controllers/serverErrorController');

const serverErrorRouter = new Router();

serverErrorRouter.get('/trigger-error', serverError);

module.exports = serverErrorRouter;