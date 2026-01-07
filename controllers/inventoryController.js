const invModel = require('../models/inventory-model');
const { buildClassificationGrid, getNav } = require('../utilities');

const buildByClassificationId = async (req, res, next) => {
  const classification_id = req.params.clasId;
  
  // Debug: Log the parameter
  console.log('classification_id from params:', classification_id);
  console.log('Full params object:', req.params);
  console.log('Full URL:', req.url);
  
  // Validate the ID exists
  if (!classification_id) {
    return res.status(400).send('Classification ID is missing');
  }
  
  const data = await invModel.getInventoryByClassificationId(classification_id);
  
  // Check if data was returned
  if (!data || data.length === 0) {
    return res.status(404).send('No vehicles found for this classification');
  }
  
  const grid = await buildClassificationGrid(data);
  const nav = await getNav();
  const className = data[0].classification_name;

  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
  });
};

module.exports = {
  buildByClassificationId,
};