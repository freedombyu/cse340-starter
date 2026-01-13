const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

exports.buildManagement = async function (req, res, next) {
  console.log("buildManagement function called")
  try {
    let nav = await utilities.getNav()
    console.log("Navigation retrieved")
    
    const classificationList = await utilities.buildClassificationList()
    console.log("Classification list built")
    
    console.log("Rendering management view")
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationList,
      message: req.flash("notice")
    })
    console.log("Management view rendered")
  } catch (error) {
    console.error("Error in buildManagement:", error)
    next(error)
  }
}

module.exports = baseController