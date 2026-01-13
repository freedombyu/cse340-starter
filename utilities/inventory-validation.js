const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // Classification name is required, must be string with only alphanumeric characters
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlphanumeric()
      .withMessage("Classification name can only contain alphanumeric characters, no spaces or special characters.")
  ]
}

/*  **********************************
 *  Add Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // Make is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle make.")
      .isAlphanumeric()
      .withMessage("Make can only contain letters and numbers."),

    // Model is required and must be string
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle model.")
      .isAlphanumeric()
      .withMessage("Model can only contain letters and numbers."),

    // Year is required and must be a 4-digit year
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a valid 4-digit year.")
      .isNumeric()
      .withMessage("Year must be a number.")
      .custom(value => {
        const year = parseInt(value)
        return year >= 1900 && year <= 2099
      })
      .withMessage("Year must be between 1900 and 2099."),

    // Description is required
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle description."),

    // Image path is required
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    // Thumbnail path is required
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),

    // Price is required and must be numeric
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle price.")
      .isNumeric()
      .withMessage("Price must be a number."),

    // Miles is required and must be numeric
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle mileage.")
      .isNumeric()
      .withMessage("Miles must be a number."),

    // Color is required
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle color."),

    // Classification is required
    body("classification_id")
      .isLength({ min: 1 })
      .withMessage("Please select a vehicle classification.")
  ]
}

/* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors: errors.array(),
      message: null,
      title: "Add New Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors: errors.array(),
      message: null,
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate 