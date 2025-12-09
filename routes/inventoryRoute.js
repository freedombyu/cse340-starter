const { Router } = require('express');
const {
  buildByClassificationId,
  buildByInventoryId,
  buildDeleteByInventoryId,
  buildAddClass,
  addClassification,
  buildAddInventory,
  addInventory,
  getInventoryByClasId,
  buildEditInventory,
  editInventory,
  deleteInventory,
  addInventoryReview,
} = require('../controllers/inventoryController');

const { handleErrors, isEmployeeOrAdmin, buildManagementGrid } = require('../utilities');
const {
  addClassificationRules,
  checkAddClassificationData,
  addInventoryRules,
  checkAddInventoryData,
  checkEditInventoryData,
  addReviewRules,
  checkAddReviewData,
} = require('../utilities/inventory-validation');

const inventoryRouter = new Router();

// ---------------- Open Routes ----------------
inventoryRouter.get('/type/:clasId', buildByClassificationId);
inventoryRouter.get('/detail/:invId', buildByInventoryId);
inventoryRouter.get('/getInventory/:clasId', handleErrors(getInventoryByClasId));
inventoryRouter.post(
  '/review/:invId',
  addReviewRules(),
  checkAddReviewData,
  handleErrors(addInventoryReview)
);

// ---------------- Protected Routes ----------------
inventoryRouter.get('/', isEmployeeOrAdmin, async (req, res) => {
  const { title, nav, grid, clasOptions } = await buildManagementGrid();
  res.render('./inventory/management', { title, nav, grid, clasOptions, errors: null });
});

inventoryRouter.get('/classification', isEmployeeOrAdmin, buildAddClass);
inventoryRouter.get('/inventory', isEmployeeOrAdmin, buildAddInventory);
inventoryRouter.get('/edit/:invId', isEmployeeOrAdmin, buildEditInventory);
inventoryRouter.get('/delete/:invId', isEmployeeOrAdmin, buildDeleteByInventoryId);

inventoryRouter.post(
  '/classification',
  isEmployeeOrAdmin,
  addClassificationRules(),
  checkAddClassificationData,
  handleErrors(addClassification)
);
inventoryRouter.post(
  '/inventory',
  isEmployeeOrAdmin,
  addInventoryRules(),
  checkAddInventoryData,
  handleErrors(addInventory)
);
inventoryRouter.post(
  '/edit/:invId',
  isEmployeeOrAdmin,
  addInventoryRules(),
  checkEditInventoryData,
  handleErrors(editInventory)
);
inventoryRouter.post(
  '/delete/:invId',
  isEmployeeOrAdmin,
  handleErrors(deleteInventory)
);

module.exports = inventoryRouter;