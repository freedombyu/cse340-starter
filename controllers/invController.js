const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = await invModel.getClassificationNameById(classification_id)
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryItemById(inventory_id)
  
  // Check if data exists
  if (!data) {
    req.flash("notice", "Sorry, we couldn't find that vehicle")
    return res.redirect("/")
  }
  
  const vehicleHtml = await utilities.buildVehicleDetailHtml(data)
  let nav = await utilities.getNav()
  const make = data.inv_make
  const model = data.inv_model
  
  res.render("./inventory/detail", {
    title: `${make} ${model}`,
    nav,
    vehicleHtml,
  })
}

/* ***************************
 *  Intentional error function for task 3
 * ************************** */
invCont.generateError = async function (req, res, next) {
  // Intentionally throw an error to test error handling middleware
  throw new Error("This is an intentional 500 error for testing purposes")
}

module.exports = invCont