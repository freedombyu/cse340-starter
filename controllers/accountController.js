require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  createUser,
  getAccountByEmail,
  updatePassword,
  updateData,
} = require("../models/account-model");

const {
  buildLoginGrid,
  buildSignupGrid,
  buildAccountGrid,
  buildEditAccountGrid,
} = require("../utilities");

/* -----------------------------
   🟢 Decode JWT Helper
------------------------------ */
function getAccountFromJWT(req) {
  try {
    const token = req.cookies.jwt;
    if (!token) return null;

    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
}

/* -----------------------------
   🟢 Render Account Dashboard
------------------------------ */
const buildAccount = async (req, res) => {
  const accountData = getAccountFromJWT(req);

  if (!accountData) {
    req.flash("notice", "Please log in first.");
    return res.redirect("/account/login");
  }

  const { grid, title, nav } = await buildAccountGrid(accountData.acc_id);

  res.render("./account/", {
    title,
    nav,
    grid,
    accountData,
    errors: null,
  });
};

/* -----------------------------
   🟢 Render Edit Account Page
------------------------------ */
const buildEditAccount = async (req, res) => {
  const accountData = getAccountFromJWT(req);

  if (!accountData) {
    req.flash("notice", "Please log in first.");
    return res.redirect("/account/login");
  }

  const { title, nav } = await buildEditAccountGrid();

  res.render("./account/edit", {
    title,
    nav,
    accountData,
    dataErrors: null,
    passwordErrors: null,
  });
};

/* -----------------------------
   🟢 Login Page
------------------------------ */
const buildLogin = async (req, res) => {
  const { title, nav, acc_email } = await buildLoginGrid();
  res.render("./account/login", {
    title,
    nav,
    errors: null,
    acc_email,
  });
};

/* -----------------------------
   🟢 Signup Page
------------------------------ */
const buildSignup = async (req, res) => {
  const { title, nav, formData } = await buildSignupGrid();
  res.render("./account/signup", {
    title,
    nav,
    errors: null,
    formData,
  });
};

/* -----------------------------
   🟢 Handle User Registration
------------------------------ */
const signupUser = async (req, res) => {
  const { acc_firstname, acc_lastname, acc_email, acc_password } = req.body;

  const formData = { acc_firstname, acc_lastname, acc_email };

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(acc_password, 10);
  } catch (error) {
    req.flash("notice", "There was an error processing the registration.");
    const { title, nav } = await buildSignupGrid();

    return res.status(500).render("./account/signup", {
      title,
      nav,
      errors: null,
      formData,
    });
  }

  const regResult = await createUser(
    acc_firstname,
    acc_lastname,
    acc_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations ${acc_firstname}, you're registered! Please log in.`
    );
    const { title, nav } = await buildLoginGrid();
    return res.status(201).render("account/login", {
      title,
      nav,
      errors: null,
      acc_email,
    });
  }

  req.flash("notice", "Registration failed.");
  const { title, nav } = await buildSignupGrid();
  res.status(501).render("./account/signup", {
    title,
    nav,
    errors: null,
    formData,
  });
};

/* -----------------------------
   🟢 Edit Account Data
------------------------------ */
const editAccountData = async (req, res) => {
  const accountData = getAccountFromJWT(req);

  if (!accountData) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }

  const updateResult = await updateData(accountData.acc_id, req.body);

  if (updateResult) {
    delete updateResult.acc_password;

    const newToken = jwt.sign(
      updateResult,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    );

    res.cookie("jwt", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600 * 1000,
    });

    req.flash("notice", "Account updated.");
    return res.redirect("/account/edit");
  }

  req.flash("notice", "Update failed.");
  const { title, nav } = await buildEditAccountGrid();

  res.status(500).render("./account/edit", {
    title,
    nav,
    dataErrors: null,
    passwordErrors: null,
  });
};

/* -----------------------------
   🟢 Update Password
------------------------------ */
const editPassword = async (req, res) => {
  const accountData = getAccountFromJWT(req);

  if (!accountData) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(req.body.acc_password, 10);
  } catch (error) {
    req.flash("notice", "Password update error.");
    return res.redirect("/account/edit");
  }

  const updateResult = await updatePassword(accountData.acc_id, hashedPassword);

  if (updateResult) {
    req.flash("notice", "Password updated.");
    return res.redirect("/account/edit");
  }

  req.flash("notice", "Password update failed.");
  res.redirect("/account/edit");
};

/* -----------------------------
   🟢 Login Handler
------------------------------ */
const loginUser = async (req, res) => {
  const { acc_email, acc_password } = req.body;
  const { title, nav } = await buildLoginGrid();

  const accountData = await getAccountByEmail(acc_email);

  if (!accountData) {
    req.flash("notice", "Invalid credentials.");
    return res.status(400).render("./account/login", {
      title,
      nav,
      errors: null,
      acc_email,
    });
  }

  const passwordMatch = await bcrypt.compare(
    acc_password,
    accountData.acc_password
  );

  if (!passwordMatch) {
    req.flash("notice", "Invalid credentials.");
    return res.status(400).render("./account/login", {
      title,
      nav,
      errors: null,
      acc_email,
    });
  }

  delete accountData.acc_password;

  const token = jwt.sign(
    accountData,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 3600 * 1000 }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 3600 * 1000,
  });

  return res.redirect("/account/");
};

/* -----------------------------
   🟢 Logout Handler
------------------------------ */
const logoutUser = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};

module.exports = {
  buildLogin,
  buildSignup,
  signupUser,
  loginUser,
  logoutUser,
  buildAccount,
  buildEditAccount,
  editAccountData,
  editPassword,
};
