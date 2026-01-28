const { createClassification, createInventory } = require('../models/inventory-model');
const {
  getNav,
  buildClassificationGrid,
  buildInventoryGrid,
  buildManagementGrid,
  buildAddClassGrid,
  buildAddInventoryGrid,
  buildClassificationList,
} = require('../utilities');

const buildByClassificationId = async (req, res, next) => {
  const clasId = req.params.clasId;
  const { grid, title } = await buildClassificationGrid(clasId);
  const nav = await getNav();

  res.render('./inventory/classification', {
    title,
    nav,
    grid,
    errors: null,
  });
};

const buildByInventoryId = async (req, res, next) => {
  const invId = req.params.invId;
  const { grid, title } = await buildInventoryGrid(invId);
  const nav = await getNav();

  res.render('./inventory/inventory', {
    title,
    grid,
    nav,
    errors: null,
  });
};

const buildManagement = async (req, res, next) => {
  const { grid, title, clasOptions } = await buildManagementGrid();
  const nav = await getNav();

  res.render('./inventory/management', {
    title,
    grid,
    nav,
    clasOptions,
    errors: null,
  });
};

const buildAddClass = async (req, res, next) => {
  const { title } = await buildAddClassGrid();
  const nav = await getNav();

  res.render('./inventory/add-classification', {
    title,
    nav,
    clas_name: '',
    errors: null,
  });
};

const addClassification = async (req, res) => {
  const { clas_name } = req.body;
  const result = await createClassification(clas_name);
  if (result) {
    req.flash('notice', `Classification "${clas_name}" added`);
    const { grid, title, clasOptions } = await buildManagementGrid();
    const nav = await getNav();
    res.render('./inventory/management', {
      title,
      grid,
      nav,
      clasOptions,
      errors: null,
    });
  } else {
    req.flash('notice', `Error adding "${clas_name}" classification`);
    const nav = await getNav();
    const { title } = await buildAddClassGrid();
    res.render('./inventory/add-classification', {
      title,
      nav,
      clas_name,
      errors: null,
    });
  }
};

const buildAddInventory = async (req, res, next) => {
  const { title, clasOptions, formData, formAction } = await buildAddInventoryGrid();
  const nav = await getNav();

  res.render('./inventory/add-inventory', {
    title,
    nav,
    clasOptions,
    formData,
    formAction,
    errors: null,
  });
};

// ADD OR REPLACE THIS FUNCTION HERE
const addInventory = async (req, res) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const result = await createInventory(
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
  );

  if (result) {
    req.flash('notice', `Vehicle "${inv_make} ${inv_model}" added successfully`);
    const { grid, title, clasOptions } = await buildManagementGrid();
    const nav = await getNav();
    res.render('./inventory/management', {
      title,
      grid,
      nav,
      clasOptions,
      errors: null,
    });
  } else {
    req.flash('notice', `Error adding vehicle "${inv_make} ${inv_model}"`);
    const nav = await getNav();
    const clasOptions = await buildClassificationList();
    const formData = req.body; // Pass back the form data
    const formAction = '/inv/inventory';
    res.render('./inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav,
      clasOptions,
      formData,
      formAction,
      errors: null,
    });
  }
};

module.exports = {
  buildByClassificationId,
  buildByInventoryId,
  buildManagement,
  buildAddClass,
  addClassification,
  buildAddInventory,
  addInventory,
};