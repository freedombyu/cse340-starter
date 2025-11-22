const { Router } = require('express');
const {
  buildByClassificationId,
} = require('../controllers/inventoryController');

const inventoryRouter = new Router();

inventoryRouter.get('/type/:clasId', buildByClassificationId);

module.exports = inventoryRouter;