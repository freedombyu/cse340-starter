const { validationResult } = require("express-validator")
const utilities = require(".")

/**
 * Handle errors
 * @param {function} fn - The function to execute
 * @returns {function} - The function with error handling
 */
const handleErrors = fn => {
  return async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      return res.render("account/register", {
        title: "Registration",
        nav,
        errors,
        ...req.body, // keeps the form values the user entered
      })
    }
    return fn(req, res, next)
  }
}

module.exports = handleErrors