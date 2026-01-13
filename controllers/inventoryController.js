// controllers/invController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");



const invCont = {
  // Build inventory by classification view
  buildByClassificationId: async function(req, res, next) {
    try {
      const classification_id = req.params.classificationId;
      console.log("Classification ID requested:", classification_id);
      
      const data = await invModel.getInventoryByClassificationId(classification_id);
      console.log(`Found ${data ? data.length : 0} inventory items`);
      
      const grid = await utilities.buildClassificationGrid(data);
      let nav = await utilities.getNav();
      
      const className = await invModel.getClassificationNameById(classification_id);
      console.log("Classification name:", className);
      
      res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
      });
    } catch (error) {
      console.error("Error in buildByClassificationId:", error);
      next(error);
    }
  },

  // Build vehicle detail view
  buildByInventoryId: async function(req, res, next) {
    try {
      const inventory_id = req.params.inventoryId;
      const data = await invModel.getInventoryByInventoryId(inventory_id);
      
      if (!data || data.length === 0) {
        const err = new Error("Vehicle not found");
        err.status = 404;
        return next(err);
      }
      
      const vehicleView = await utilities.buildVehicleDisplay(data);
      let nav = await utilities.getNav();
      const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
      
      res.render("./inventory/detail", {
        title: vehicleName,
        nav,
        vehicleView,
      });
    } catch (error) {
      console.error("Error in buildByInventoryId:", error);
      next(error);
    }
  }, 
};

module.exports = invCont;
