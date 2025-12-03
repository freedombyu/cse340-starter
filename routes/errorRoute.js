// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")
const utilities = require("../utilities")

// Route that generates an intentional 500 error
router.get("/trigger-error", utilities.handleErrors(errorController.triggerError))

// Export Router
module.exports = router