const { Router } = require('express');
const {
  buildByClassificationId,
  buildByInventoryId,
  buildManagement,
  buildAddClass,
  addClassification,
  buildAddInventory,
  addInventory,
} = require('../controllers/inventoryController');
const { handleErrors } = require('../utilities');
const validate = require('../utilities/inventory-validation');

const inventoryRouter = new Router();

inventoryRouter.get('/type/:clasId', buildByClassificationId);
inventoryRouter.get('/detail/:invId', buildByInventoryId);
inventoryRouter.get('/', buildManagement);
inventoryRouter.get('/classification', buildAddClass);
inventoryRouter.get('/inventory', buildAddInventory);

// POST route to add new classification WITH validation
inventoryRouter.post(
  '/classification',
  validate.classificationRules(),
  validate.checkClassificationData,
  handleErrors(addClassification)
);

// POST route to add new vehicle WITH validation
inventoryRouter.post(
  '/inventory',
  validate.inventoryRules(),
  validate.checkInventoryData,
  handleErrors(addInventory)
);

module.exports = inventoryRouter;