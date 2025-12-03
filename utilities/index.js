const invModel = require("../models/inventory-model")

/* ************************
 * Constructs the nav HTML
 ************************** */
async function getNav() {
  let data = await invModel.getClassifications()
  let list = '<ul class="navigation">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += '<li>'
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>'
    list += '</li>'
  })
  list += '</ul>'
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
async function buildClassificationGrid(data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
        + ' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id + '" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
async function buildVehicleDetailHtml(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Vehicle not found.</p>'
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(vehicle.inv_price)

  const formattedMiles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)

  let html = `
    <div class="vehicle-detail">
      <section class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </section>
      
      <section class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
        
        <div class="vehicle-specs">
          <p class="price"><span>Price:</span> ${formattedPrice}</p>
          <p><span>Year:</span> ${vehicle.inv_year}</p>
          <p><span>Make:</span> ${vehicle.inv_make}</p>
          <p><span>Model:</span> ${vehicle.inv_model}</p>
          <p><span>Mileage:</span> ${formattedMiles}</p>
          <p><span>Color:</span> ${vehicle.inv_color}</p>
        </div>
        
        <div class="vehicle-description">
          <h3>Description</h3>
          <p>${vehicle.inv_description}</p>
        </div>
      </section>
    </div>
  `
  return html
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = {
  getNav,
  buildClassificationGrid,
  buildVehicleDetailHtml,
  handleErrors,
}