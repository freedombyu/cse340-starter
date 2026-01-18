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
  next({ status: 404, message: 'Sorry, we appear to have lost that page' });
});

/* *****************************************
 * Express Error Handler
 * Must be keep after all other middleware
 *******************************************/
app.use(async (err, req, res, next) => {
  let nav = await getNav()  
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  
  let message;  
  if(err.status == 404) {
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }
  
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
    errors: null,
  })
})
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