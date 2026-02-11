const { Router } = require('express');
const {
  buildByClassificationId,
  buildByInventoryId,
  buildVehicleDetail,
  buildManagement,
  buildAddClass,
  addClassification,
  buildAddInventory,
  addInventory,
} = require('../controllers/inventoryController');
const { handleErrors, checkJWTToken, isEmployeeOrAdmin } = require('../utilities');
const validate = require('../utilities/inventory-validation');

const inventoryRouter = new Router();

// PUBLIC ROUTES - Anyone can view
inventoryRouter.get('/type/:clasId', handleErrors(buildByClassificationId));
inventoryRouter.get('/detail/:inv_id', handleErrors(buildVehicleDetail));

// PROTECTED ROUTES - Only Employee or Admin can access
// Inventory Management Dashboard
inventoryRouter.get(
  '/', 
  checkJWTToken, 
  isEmployeeOrAdmin, 
  handleErrors(buildManagement)
);

// Add Classification Page
inventoryRouter.get(
  '/classification', 
  checkJWTToken, 
  isEmployeeOrAdmin, 
  handleErrors(buildAddClass)
);

// Add Classification - POST
inventoryRouter.post(
  '/classification',
  checkJWTToken,
  isEmployeeOrAdmin,
  validate.classificationRules(),
  validate.checkClassificationData,
  handleErrors(addClassification)
);

// Add Inventory Page
inventoryRouter.get(
  '/inventory', 
  checkJWTToken, 
  isEmployeeOrAdmin, 
  handleErrors(buildAddInventory)
);

// Add Inventory - POST
inventoryRouter.post(
  '/inventory',
  checkJWTToken,
  isEmployeeOrAdmin,
  validate.inventoryRules(),
  validate.checkInventoryData,
  handleErrors(addInventory)
);

module.exports = inventoryRouter;