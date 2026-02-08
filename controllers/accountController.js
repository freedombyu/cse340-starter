require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")

const {
  createUser,
  getAccountByEmail,
  updatePassword,
  updateData,
} = require("../models/account-model")

const {
  buildLoginGrid,
  buildSignupGrid,
  buildAccountGrid,
  buildEditAccountGrid,
} = require("../utilities")

/* =========================
   BUILD VIEWS
========================= */
const buildAccount = async (req, res) => {
  const { grid, title, nav } = await buildAccountGrid()
  const accountData = res.locals.accountData
  res.render("./account/", { title, nav, grid, errors: null, accountData })
}

const buildEditAccount = async (req, res) => {
  const { title, nav } = await buildEditAccountGrid()
  const accountData = res.locals.accountData
  
  res.render("./account/edit", {
    title,
    nav,
    dataErrors: null,
    passwordErrors: null,
    accountData,
  })
}

const buildLogin = async (req, res) => {
  const { title, nav } = await buildLoginGrid()
  res.render("./account/login", {
    title,
    nav,
    errors: null,
    account_email: "",
  })
}

const buildSignup = async (req, res) => {
  const { title, nav } = await buildSignupGrid()
  res.render("./account/signup", {
    title,
    nav,
    errors: null,
    formData: {},
  })
}

/* =========================
   SIGNUP
========================= */
const signupUser = async (req, res) => {
  const errors = validationResult(req)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const formData = { account_firstname, account_lastname, account_email }

  if (!errors.isEmpty()) {
    const { title, nav } = await buildSignupGrid()
    return res.status(400).render("./account/signup", {
      title,
      nav,
      errors,
      formData,
    })
  }

  // Safety check (controller-level)
  const existingAccount = await getAccountByEmail(account_email)
  if (existingAccount) {
    req.flash("notice", "Email already exists. Please login.")
    const { title, nav } = await buildSignupGrid()
    return res.status(400).render("./account/signup", {
      title,
      nav,
      errors: null,
      formData,
    })
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Error processing registration.")
    const { title, nav } = await buildSignupGrid()
    return res.status(500).render("./account/signup", {
      title,
      nav,
      errors: null,
      formData,
    })
  }

  const regResult = await createUser(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations ${account_firstname}, you're registered. Please log in.`
    )
    return res.redirect("/account/login")
  }

  req.flash("notice", "Registration failed.")
  const { title, nav } = await buildSignupGrid()
  res.status(500).render("./account/signup", {
    title,
    nav,
    errors: null,
    formData,
  })
}

/* =========================
   LOGIN
========================= */
const loginUser = async (req, res) => {
  const errors = validationResult(req)
  const { account_email, account_password } = req.body
  const { title, nav } = await buildLoginGrid()

  if (!errors.isEmpty()) {
    return res.status(400).render("./account/login", {
      title,
      nav,
      errors,
      account_email,
    })
  }

  try {
    const accountData = await getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Invalid email or password.")
      return res.status(400).render("./account/login", {
        title,
        nav,
        errors: null,
        account_email,
      })
    }

    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (!passwordMatch) {
      req.flash("notice", "Invalid email or password.")
      return res.status(400).render("./account/login", {
        title,
        nav,
        errors: null,
        account_email,
      })
    }

    delete accountData.account_password

    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } 
    )

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 1000,
    })

    res.redirect("/account/")
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "Login failed. Please try again.")
    res.status(500).render("./account/login", {
      title,
      nav,
      errors: null,
      account_email,
    })
  }
}

/* =========================
   LOGOUT
========================= */
const logoutUser = (req, res) => {
  res.clearCookie("jwt")
  res.redirect("/")
}

/* =========================
   EDIT ACCOUNT DATA
========================= */
const editAccountData = async (req, res) => {
  const errors = validationResult(req)
  const { account_firstname, account_lastname, account_email } = req.body
  const account_id = res.locals.accountData?.account_id

  // Handle validation errors
  if (!errors.isEmpty()) {
    const { title, nav } = await buildEditAccountGrid()
    return res.status(400).render("./account/edit", {
      title,
      nav,
      dataErrors: errors,
      passwordErrors: null,
      accountData: {
        account_id,
        account_firstname,
        account_lastname,
        account_email
      }
    })
  }

  try {
    const updatedAccount = await updateData(account_id, {
      account_firstname,
      account_lastname,
      account_email,
    })

    if (!updatedAccount) {
      req.flash("notice", "Account update failed.")
      return res.redirect("/account/edit")
    }

    // Update the JWT token with new data
    delete updatedAccount.account_password
    const accessToken = jwt.sign(
      updatedAccount,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )
    
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 1000,
    })

    req.flash("notice", "Account information updated successfully.")
    res.redirect("/account/")
  } catch (error) {
    console.error("editAccountData error:", error)
    req.flash("notice", "Error updating account information.")
    res.redirect("/account/edit")
  }
}

/* =========================
   EDIT PASSWORD
========================= */
const editPassword = async (req, res) => {
  const errors = validationResult(req)
  const { account_password } = req.body
  const account_id = res.locals.accountData?.account_id

  // Handle validation errors
  if (!errors.isEmpty()) {
    const { title, nav } = await buildEditAccountGrid()
    return res.status(400).render("./account/edit", {
      title,
      nav,
      dataErrors: null,
      passwordErrors: errors,
      accountData: res.locals.accountData
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updatedAccount = await updatePassword(account_id, hashedPassword)

    if (!updatedAccount) {
      req.flash("notice", "Password update failed.")
      return res.redirect("/account/edit")
    }

    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/")
  } catch (error) {
    console.error("editPassword error:", error)
    req.flash("notice", "Error updating password.")
    res.redirect("/account/edit")
  }
}


module.exports = {
  buildLogin,
  buildSignup,
  signupUser,
  loginUser,
  buildAccount,
  buildEditAccount,
  editAccountData,   
  editPassword,
  logoutUser,
}