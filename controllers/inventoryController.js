const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  console.log('Inventory data:', JSON.stringify(data, null, 2))  // Shows vehicles
  let nav = await utilities.getNav()
  
  // Check if data exists and has items
  if (!data || data.length === 0) {
    res.render("./inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: "<p class='notice'>Sorry, no vehicles are currently available for this classification.</p>",
    })
    return
  }
  
  const grid = await utilities.buildClassificationGrid(data)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont