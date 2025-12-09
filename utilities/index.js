require('dotenv').config();
const jwt = require('jsonwebtoken');
const {
  getClassifications,
  getInventoryByClassificationId,
  getDetailsByInventoryId,
  getClassificationById,
  getReviewsByInventoryId,
} = require('../models/inventory-model');
const {
  gridInventoryDetailsTemplate,
  gridTemplate,
  navTemplate,
  gridManagementTemplate,
  noVehiclesTemplate,
  clasOptionsTemplate,
  accountGridTemplate,
} = require('../templates');

const getNav = async (req, res, next) => {
  const data = await getClassifications();
  return navTemplate(data);
};

const getClasOptions = async (clas_id) => {
  const data = await getClassifications();
  return clasOptionsTemplate(data, clas_id);
};

const buildClassificationGrid = async (clasId) => {
  const inventory = await getInventoryByClassificationId(clasId);
  if (inventory.length > 0) {
    const title = `${inventory[0].clas_name} Vehicles`;
    return {
      grid: gridTemplate(inventory),
      title,
    };
  } else {
    const clasName = await getClassificationById(clasId);
    return {
      grid: noVehiclesTemplate,
      title: `${clasName} Vehicles`,
    };
  }
};

const buildInventoryGrid = async (invId) => {
  const inventoryDetail = await getDetailsByInventoryId(invId);
  const inventoryReviews = await getReviewsByInventoryId(invId);
  const nav = await getNav();
  return {
    grid: gridInventoryDetailsTemplate(inventoryDetail, inventoryReviews),
    title: `${inventoryDetail.inv_year} ${inventoryDetail.inv_make} ${inventoryDetail.inv_model}`,
    nav,
  };
};

const buildManagementGrid = async () => {
  const nav = await getNav();
  const clasOptions = await getClasOptions();
  return {
    title: `Vehicle Management`,
    nav,
    grid: gridManagementTemplate(),
    clasOptions,
  };
};

const buildAddClassGrid = async () => {
  const nav = await getNav();
  return {
    title: `Add Classification`,
    nav,
  };
};

const buildAddEditInvGrid = async (type = 'Add', clas_id) => {
  const nav = await getNav();
  const clasOptions = await getClasOptions(clas_id);
  formData = {};
  const formAction = type === 'Edit' ? '/inv/edit' : '/inv/inventory';
  return {
    title: `${type} Vehicle`,
    nav,
    clasOptions,
    formData,
    formAction,
  };
};

const buildDeleteInventoryGrid = async (invId) => {
  const inventoryDetail = await getDetailsByInventoryId(invId);
  return {
    grid: gridInventoryDetailsTemplate(inventoryDetail),
    title: `Delete Confirmation - ${inventoryDetail.inv_year} ${inventoryDetail.inv_make} ${inventoryDetail.inv_model}`,
    deleteMessage:
      'Are you sure you want to delete this vehicle? Delete is permanent and cannot be undone!',
  };
};

const buildLoginGrid = async () => {
  const nav = await getNav();
  const title = `Login`;
  const acc_email = '';
  return {
    title,
    nav,
    acc_email,
  };
};

const buildSignupGrid = async () => {
  const nav = await getNav();
  const title = `Signup`;
  const formData = { acc_firstname: '', acc_lastname: '', acc_email: '' };
  return {
    title,
    nav,
    formData,
  };
};

const buildAccountGrid = async () => {
  const nav = await getNav();
  const title = `Account Management`;
  return {
    grid: accountGridTemplate(),
    title,
    nav,
  };
};

const buildEditAccountGrid = async () => {
  const nav = await getNav();
  const title = `Update Account`;
  return {
    title,
    nav,
  };
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
const handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
const checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      (err, accountData) => {
        if (err) {
          req.flash('Please log in');
          res.clearCookie('jwt');
          return res.redirect('/account/login');
        }
        req.user = accountData;
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 * Middleware to check Admin or Employee account type
 **************************************** */
const isEmployeeOrAdmin = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      (err, accountData) => {
        if (err) {
          req.flash('Please log in');
          res.clearCookie('jwt');
          return res.redirect('/account/login');
        }
        const { acc_type } = accountData;
        if (acc_type === 'Employee' || acc_type === 'Admin') {
          next();
        } else {
          req.flash(
            'notice',
            'Access denied. Please login with allowed credentials.'
          );
          return res.redirect('/account/login');
        }
      }
    );
  }
};

module.exports = {
  getNav,
  buildClassificationGrid,
  buildInventoryGrid,
  handleErrors,
  buildLoginGrid,
  buildSignupGrid,
  buildAccountGrid,
  checkJWTToken,
  buildManagementGrid,
  buildAddClassGrid,
  buildAddEditInvGrid,
  buildDeleteInventoryGrid,
  isEmployeeOrAdmin,
  buildEditAccountGrid,
};
