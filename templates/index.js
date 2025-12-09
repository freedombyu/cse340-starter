// Navigation Templates

const formattedNumber = (number) =>
  new Intl.NumberFormat('en-US').format(number);

const navItemTemplate = (item) => `
  <li>
    <a
      href="/inv/type/${item.clas_id}"
      title="See our inventory of ${item.clas_name} vehicles"
      >${item.clas_name}</a
    >
  </li>
`;

const navTemplate = (data) => `
  <ul>
    <li><a href="/" title="Home page">Home</a></li>
    ${data.rows.map(navItemTemplate).join('')}
  </ul>
`;

const clasOptionTemplate =
  (clasId) =>
  ({ clas_id, clas_name }) =>
    `
  <option value=${clas_id} ${
      clasId === clas_id ? 'selected' : ''
    }>${clas_name}</option>
`;

const clasOptionsTemplate = (data, clas_id) => `
  ${data.rows.map(clasOptionTemplate(clas_id)).join('')}
`;

// Grid Inventory by Cassification Templates

const gridItemTemplate = (vehicle) => `
  <li>
    <a
      href="../../inv/detail/${vehicle.inv_id}"
      title="View ${vehicle.inv_make} ${vehicle.inv_model} details"
      ><img
        src="${vehicle.inv_thumbnail}"
        alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors"
    /></a>
    <hr />
    <div class="name-price">
      <h2>
        <a
          href="../../inv/detail/${vehicle.inv_id}"
          title="View ${vehicle.inv_make} ${vehicle.inv_model} details"
          >${vehicle.inv_make} ${vehicle.inv_model}</a
        >
      </h2>
      <span>$ ${formattedNumber(vehicle.inv_price)}</span>
    </div>
  </li>
`;

const gridTemplate = (rows) => `
  <ul id="inv-display">
    ${rows.map(gridItemTemplate).join('')}
  </ul>
`;

const reviewItemTemplate = ({ review_description, review_rate }) => `
  <li>${review_description} (${review_rate}/5)</li>
`;

// Grid Inventory Details Templates

const gridInventoryDetailsTemplate = (
  {
    inv_id,
    inv_year: year,
    inv_make: make,
    inv_model: model,
    inv_image: image,
    inv_price: price,
    inv_description: description,
    inv_color: color,
    inv_miles: miles,
  },
  reviews = null
) => `
  <div>
    <div class="inventory-details-wrapper">
      <img
        src="${image}"
        alt="Image of ${year} ${make} ${model}"
        width="100"
        height="100"
      />
      <div>
        <h2>${make} ${model} Details</h2>
        <ul>
          <li>
            <strong>
              Price: $ ${formattedNumber(price)}
            </strong>
          </li>
          <li>
            <strong>Description:</strong>
            <p>${description}</p>
          </li>
          <li>
            <strong>Color:</strong>
            <p>${color}</p>
          </li>
          <li>
            <strong>Miles:</strong>
            <p>${formattedNumber(miles)}</p>
          </li>
        </ul>
        ${
          reviews
            ? `<div class="reviews-header">
          <h3>Reviews</h3>
          <button id="add-review-btn">Add Review</button>
        </div>
        <ul>
          ${reviews?.map(reviewItemTemplate).join('')}
        </ul>`
            : ''
        }
        <dialog id="add-review-dialog">
          <button id="close-modal">X</button>
          <h2>${year} ${make} ${model} Review</h2>
          <form id="review-form" method="post" action="/inv/review/${inv_id}" class="form">
            <fieldset>
              <div id="stars-reviews" class="stars-reviews">
                <div>Overall Rating<span class="required">*</span></div>
                <div class="stars-form">
                  <input class="star-radio" type="radio" id="fivestar" name="review_rate" value="5" required><label for="fivestar"></label>
                  <input class="star-radio" type="radio" id="fourstar" name="review_rate" value="4"><label for="fourstar"></label>
                  <input class="star-radio" type="radio" id="threestar" name="review_rate" value="3"><label for="threestar"></label>
                  <input class="star-radio" type="radio" id="twostar" name="review_rate" value="2"><label for="twostar"></label>
                  <input class="star-radio" type="radio" id="onestar" name="review_rate" value="1"><label for="onestar"></label>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <div class="comments">
                <label>Tell Us your experience<span class="required">*</span>
                  <textarea name="review_description" id="review" rows="2" required></textarea>
                </label>
              </div>
            </fieldset>
            <fieldset>
              <input id="submit-btn" type="submit" role="button" class="button" value="Add My Review">
            </fieldset>
          </form>
        </dialog>
      </div>
    </div>
  </div>
`;

const gridManagementTemplate = () => `
<div class="inventory-management">
  <a href="/inv/classification">Add New Classification</a>
  <a href="/inv/inventory">Add New Vehicle</a>
</div>
`;

// Pattern with regular expression doesn't work with template
// const gridAddClassTemplate = () => `
// <form class="form" action="/inv/classification" method="post">
//   <fieldset>
//     <label
//       >Classificaiton Name<span class="required">*</span>
//       <input
//         type="text"
//         name="clas_name"
//         id="clasName"
//         required
//         pattern="^\S+\S{1,}"
//       />
//     </label>
//   </fieldset>
//   <fieldset class="submit-btn-container">
//     <input type="submit" role="button" value="Add Classification" />
//   </fieldset>
// </form>
// `;

// No vehicles template

const noVehiclesTemplate = `
  <p class="notice">
    Sorry, no matching vehicles could be found in this category.
  </p>
`;

// Error Templates

const gridErrorTemplate = ({
  title,
  statusCode,
  message,
  imageUrl,
  imageName,
}) => `
  <div class="error-page">
    <h1>${title}</h1>
    <div>
      <p class="code">${statusCode}</p>
      <p>${message}</p>
      <img src="${imageUrl}" alt="${imageName}" width="100", height="100">
    </div>
  </div>
`;

const accountGridTemplate = () => `
  <h3>You are logged in!</h3>
  <a href="/account/edit">Edit Account Information</a>
`;

// Pattern stiky doesn't work with template
// const loginGridTemplate = () => `
//   <form class="form" action="/account/login" method="post">
//     <fieldset>
//       <label
//         >Email<span class="required">*</span>
//       </label>
//       <label
//         >Password<span class="required">*</span>
//         <input
//           type="password"
//           name="acc_password"
//           id="password"
//           required
//         />
//       </label>
//     </fieldset>
//     <fieldset class="submit-btn-container">
//       <input type="submit" role="button" value="Login" />
//     </fieldset>
//     <div>
//       <p>No account? <a href="/account/signup">Sign Up</a></p>
//     </div>
//   </form>
// `;

// Pattern with regular expression doesn't work with template
// const signupGridTemplate = () => `
//   <form class="form" action="/account/signup" method="post">
//     <fieldset>
//       <label
//         >First Name<span class="required">*</span>
//         <input
//           type="text"
//           name="acc_firstname"
//           id="firstname"
//           required
//           autocomplete
//         />
//       </label>
//       <label
//         >Last Name<span class="required">*</span>
//         <input
//           type="text"
//           name="acc_lastname"
//           id="lastname"
//           required
//           autocomplete
//         />
//       </label>
//       <label
//         >Email<span class="required">*</span>
//         <input type="email" name="acc_email" id="email" required autocomplete />
//       </label>
//       <label
//       for="acc_password">Password<span class="required">*</span>
//       <span>
//         Passwords must be at least 12 characters and contain at least 1 number,
//         1 capital letter and 1 special character</span
//       >
//     </label>
//     <input
//       type="password"
//       name="acc_password"
//       id="acc_password"
//       required
//       pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"
//     />
//     </fieldset>
//     <fieldset class="submit-btn-container">
//       <input type="submit" role="button" value="Signup" />
//     </fieldset>
//     <div>
//       <p>Have account? <a href="/account/login">Login</a></p>
//     </div>
//   </form>
// `;

module.exports = {
  navItemTemplate,
  navTemplate,
  gridTemplate,
  gridInventoryDetailsTemplate,
  noVehiclesTemplate,
  gridErrorTemplate,
  accountGridTemplate,
  gridManagementTemplate,
  clasOptionsTemplate,
};
