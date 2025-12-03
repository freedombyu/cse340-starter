const errorCont = {}

/* ***************************
 *  Function to trigger intentional error
 * ************************** */
errorCont.triggerError = async function (req, res, next) {
  // Intentionally throw error for testing purposes
  throw new Error("This is an intentional 500 error for testing purposes")
}

module.exports = errorCont