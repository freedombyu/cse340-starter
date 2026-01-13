/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const static = require('./routes/static');
const inventoryRouter = require('./routes/inventoryRoute');
const serverErrorRouter = require('./routes/serverErrorRouter');
const { buildHome } = require('./controllers/baseController');
const { getNav, handleErrors } = require('./utilities');
const { gridErrorTemplate } = require('./templates');

/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout'); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get('/', handleErrors(buildHome));
// Inventory Routes
app.use('/inv', inventoryRouter);
app.use('/error', serverErrorRouter);

/* ***********************
 * Route Not Found
 * Must be keep after all other routes
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Not Found' });
});

/* ***********************
 * Express Error Handler
 * Must be keep after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await getNav();
  const title = `${err.message}` || 'Server Error';
  const data = {
    title,
    statusCode: err.status,
  };
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status === 404) {
    data.message = `Sorry, it seems that page doesn't exist!`;
    data.imageUrl = '/images/error.jpg';
    data.imageName = 'Error image';
  } else {
    data.message = `Oh no! There was a crash. Maybe try a different route?`;
    data.imageUrl = '/images/error.jpg';
    data.imageName = 'Error image';
  }
  const grid = gridErrorTemplate(data);

  res.render('errors/error', {
    title,
    nav,
    grid,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});