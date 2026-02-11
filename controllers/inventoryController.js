const { createClassification, createInventory } = require('../models/inventory-model');
const invModel = require('../models/inventory-model');
const reviewModel = require('../models/review-model');
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

// ✅ FIXED - This should render to detail.ejs, not management.ejs
const buildByInventoryId = async (req, res, next) => {
  const invId = req.params.invId;
  const { grid, title, vehicle } = await buildInventoryGrid(invId);
  const nav = await getNav();

  // Fetch reviews
  const reviews = await reviewModel.getReviewsByInventoryId(invId);
  const ratingData = await reviewModel.getAverageRating(invId);

  res.render('./inventory/detail', {  // ✅ CHANGED from 'management' to 'detail'
    title,
    grid,
    nav,
    vehicle,
    reviews,
    avgRating: parseFloat(ratingData.avg_rating),
    reviewCount: parseInt(ratingData.review_count),
    errors: null,
  });
};

const buildVehicleDetail = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await getNav();
  
  try {
    const vehicle = await invModel.getDetailsByInventoryId(inv_id);
    
    if (!vehicle) {
      req.flash('notice', 'Vehicle not found');
      return res.redirect('/inv');
    }
    
    // Get reviews for this vehicle
    const reviews = await reviewModel.getReviewsByInventoryId(inv_id);
    
    // Get average rating
    const ratingData = await reviewModel.getAverageRating(inv_id);
    
    res.render('inventory/detail', {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      reviews,
      avgRating: ratingData.avg_rating,
      reviewCount: ratingData.review_count,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ OPTIMIZED - Management page now loads faster
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
    const formData = req.body;
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
  buildVehicleDetail,
  buildManagement,
  buildAddClass,
  addClassification,
  buildAddInventory,
  addInventory,
};