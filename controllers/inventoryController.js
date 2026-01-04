const { getInventoryByClassificationId } = require('../models/inventory-model');
const { buildClassificationGrid, getNav } = require('../utilities');

const buildByClassificationId = async (req, res, next) => {
  const clas_id = req.params.clasId;
  const { grid, title } = await buildClassificationGrid(clas_id);
  const nav = await getNav();

  res.render('./inventory/classification', {
    title,
    nav,
    grid,
  });
};

module.exports = {
  buildByClassificationId,
};