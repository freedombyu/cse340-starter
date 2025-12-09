const { body, validationResult } = require('express-validator');
const {
  buildAddClassGrid,
  buildAddEditInvGrid,
  buildInventoryGrid,
} = require('.');

const addClassificationRules = () => {
  return [
    body('clas_name')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage('No special characters or spaces allowed!'),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
const checkAddClassificationData = async (req, res, next) => {
  const { clas_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { title, nav } = await buildAddClassGrid();
    res.render('./inventory/add-classification', {
      errors,
      title,
      nav,
      clas_name,
    });
    return;
  }
  next();
};

const addInventoryRules = () => {
  return [
    body('clas_id').notEmpty().withMessage('Select a classification option'),
    body('inv_make')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a make.'),
    body('inv_model')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a model.'),
    body('inv_year')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Year cannot be empty.')
      .isNumeric()
      .withMessage('Please provide a valid year.'),
    body('inv_description')
      .notEmpty()
      .withMessage('Please provide a description.'),
    body('inv_image')
      .trim()
      .notEmpty()
      .withMessage('Please provide a image path.'),
    body('inv_thumbnail')
      .trim()
      .notEmpty()
      .withMessage('Please provide a thumbnail path.'),
    body('inv_price')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Price most be provided')
      .isNumeric()
      .withMessage('Please provide a valid price.'),
    body('inv_miles')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Milage must be provided')
      .isNumeric()
      .withMessage('Please provide a valid value for mileage.'),
    body('inv_color')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a color.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
const checkAddInventoryData = async (req, res, next) => {
  const formData = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { title, nav, clasOptions, formAction } = await buildAddEditInvGrid(
      'Add',
      parseInt(formData.clas_id)
    );
    res.render('./inventory/add-update-inventory', {
      errors,
      title,
      nav,
      clasOptions,
      formData,
      formAction,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
const checkEditInventoryData = async (req, res, next) => {
  const { invId } = req.params;
  const formData = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { title, nav, clasOptions, formAction } = await buildAddEditInvGrid(
      'Edit',
      parseInt(formData.clas_id)
    );
    res.render('./inventory/add-update-inventory', {
      errors,
      title,
      nav,
      clasOptions,
      formData,
      formAction: `${formAction}/${invId}`,
    });
    return;
  }
  next();
};

const addReviewRules = () => {
  return [
    body('review_description')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide a review.'),
    body('review_rate')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Rate cannot be empty.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
const checkAddReviewData = async (req, res, next) => {
  const invId = req.params.invId;
  const formData = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { title, grid, nav } = await buildInventoryGrid(invId);
    res.render('./inventory/inventory', {
      errors,
      title,
      nav,
      grid,
    });
    return;
  }
  next();
};

module.exports = {
  addClassificationRules,
  checkAddClassificationData,
  addInventoryRules,
  checkAddInventoryData,
  checkEditInventoryData,
  addReviewRules,
  checkAddReviewData,
};