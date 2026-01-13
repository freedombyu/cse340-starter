// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventoryController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory item detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

// Route to build inventory management view
router.get("/", (req, res, next) => {
  console.log("Inventory root route accessed")
  return utilities.handleErrors(invController.buildManagement)(req, res, next)
})

// Route to build add classification view (combine with middleware)
// router.get("/add-classification", checkInventoryAuth, utilities.handleErrors(invController.buildAddClassification))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
// Route to process the add classification form
router.post(
  "/add-classification",
  // checkInventoryAuth,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
// router.get("/add", checkInventoryAuth, utilities.handleErrors(invController.buildAddInventory))
router.get("/add", utilities.handleErrors(invController.buildAddInventory))

// Route to process the add inventory form
router.post(
  "/add",
  // checkInventoryAuth,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventoryItem)
)

module.exports = router