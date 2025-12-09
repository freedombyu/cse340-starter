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
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const pool = require('./database/');
const static = require('./routes/static');
const inventoryRouter = require('./routes/inventoryRoute');
const serverErrorRouter = require('./routes/serverErrorRouter');
const accountRouter = require('./routes/accountRoute');
const { buildHome } = require('./controllers/baseController');
const { getNav, handleErrors, checkJWTToken } = require('./utilities');
const { gridErrorTemplate } = require('./templates');

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkJWTToken);

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

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
// Account Routes
app.use('/account', accountRouter);
// Server Error Routes
app.use('/server-error', serverErrorRouter);

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
  let message = '';
  let grid;
  const data = {
    title,
    statusCode: err.status,
  };
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status === 404) {
    data.message = `Sorry, it seems that page doesn't exists!`;
    data.imageUrl = '/images/site/404-empty.png';
    data.imageName = 'Image of an empty street';
  } else {
    data.message = `Oh no! There was a crash. Maybe try a different route?`;
    data.imageUrl = '/images/site/500-crash.png';
    data.imageName = 'Image of an crash';
  }
  grid = gridErrorTemplate(data);

  res.render('errors/error', {
    title,
    nav,
    grid,
    errors: null,
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
