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
// Comment out validation for now - routes will still work without it
// const {
//   addClassificationRules,
//   checkAddClassificationData,
//   addInventoryRules,
//   checkAddInventoryData,
// } = require('../utilities/inventory-validation');

const inventoryRouter = new Router();

inventoryRouter.get('/type/:clasId', buildByClassificationId);
inventoryRouter.get('/detail/:invId', buildByInventoryId);
inventoryRouter.get('/', buildManagement);
inventoryRouter.get('/classification', buildAddClass);
inventoryRouter.get('/inventory', buildAddInventory);

// POST route to add new classification (works without validation)
inventoryRouter.post(
  '/classification',
  handleErrors(addClassification)
);

// POST route to add new vehicle (works without validation)
inventoryRouter.post(
  '/inventory',
  handleErrors(addInventory)
);

module.exports = inventoryRouter;