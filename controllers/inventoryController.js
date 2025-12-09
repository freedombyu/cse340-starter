const {
  createClassification,
  createInventory,
  getInventoryByClassificationId,
  getDetailsByInventoryId,
  getClassifications,
  updateInventory,
  deleteInventoryById,
  createReview,
} = require("../models/inventory-model");

const {
  getNav,
  buildClassificationGrid,
  buildInventoryGrid,
} = require("../utilities");

/* ---------------- VIEW BUILDERS ---------------- */
const buildByClassificationId = async (req, res) => {
  const classificationId = req.params.clasId;
  const { grid, title } = await buildClassificationGrid(classificationId);
  const nav = await getNav();

  if (!grid) {
    req.flash("notice", "No vehicles found.");
    return res.redirect("/");
  }

  res.render("./inventory/classification", { title, nav, grid, errors: null });
};

const buildByInventoryId = async (req, res) => {
  const invId = req.params.invId;
  const { grid, title, nav } = await buildInventoryGrid(invId);

  if (!grid) {
    req.flash("notice", "Vehicle not found.");
    return res.redirect("/");
  }

  res.render("./inventory/inventory", { title, nav, grid, errors: null });
};

/* ---------------- ADD CLASSIFICATION ---------------- */
const buildAddClass = async (req, res) => {
  const nav = await getNav();
  res.render("./inventory/add-classification", { title: "Add Classification", nav, errors: null });
};

const addClassification = async (req, res) => {
  const { classification_name } = req.body;
  const result = await createClassification(classification_name);
  const nav = await getNav();

  if (!result) {
    req.flash("notice", "Failed to add classification.");
    return res.render("./inventory/add-classification", { title: "Add Classification", nav, errors: null });
  }

  req.flash("notice", `Classification "${classification_name}" added.`);
  res.redirect("/inv");
};

/* ---------------- ADD INVENTORY ---------------- */
const buildAddInventory = async (req, res) => {
  const nav = await getNav();
  res.render("./inventory/add-update-inventory", {
    title: "Add Inventory",
    nav,
    clasOptions: [],
    formData: {},
    formAction: "/inv/add",
    errors: null,
  });
};

const addInventory = async (req, res) => {
  const formData = req.body;
  const result = await createInventory(formData);

  if (!result) {
    req.flash("notice", "Failed to add new vehicle.");
    return res.redirect("/inv/add");
  }

  req.flash("notice", "Vehicle added successfully.");
  res.redirect("/inv");
};

/* ---------------- EDIT INVENTORY ---------------- */
const buildEditInventory = async (req, res) => {
  const invId = req.params.invId;
  const vehicle = await getDetailsByInventoryId(invId);

  if (!vehicle) {
    req.flash("notice", "Vehicle not found.");
    return res.redirect("/inv");
  }

  const nav = await getNav();

  res.render("./inventory/add-update-inventory", {
    title: "Edit Vehicle",
    nav,
    clasOptions: [],
    formData: vehicle,
    formAction: `/inv/edit/${invId}`,
    errors: null,
  });
};

const editInventory = async (req, res) => {
  const invId = req.params.invId;
  const formData = { ...req.body, inv_id: invId };
  const result = await updateInventory(formData);

  if (!result) {
    req.flash("notice", "Update failed.");
    return res.redirect(`/inv/edit/${invId}`);
  }

  req.flash("notice", "Vehicle updated successfully.");
  res.redirect("/inv");
};

/* ---------------- DELETE INVENTORY ---------------- */
const buildDeleteByInventoryId = async (req, res) => {
  const invId = req.params.invId;
  const vehicle = await getDetailsByInventoryId(invId);

  if (!vehicle) {
    req.flash("notice", "Vehicle not found.");
    return res.redirect("/inv");
  }

  const nav = await getNav();
  const title = `Delete ${vehicle.inv_make} ${vehicle.inv_model}`;

  res.render("./inventory/delete-confirm", { title, nav, vehicle, invId, errors: null });
};

const deleteInventory = async (req, res) => {
  const invId = req.params.invId;
  const result = await deleteInventoryById(invId);

  if (!result) {
    req.flash("notice", "Delete failed.");
    return res.redirect(`/inv/delete/${invId}`);
  }

  req.flash("notice", "Vehicle deleted successfully.");
  res.redirect("/inv");
};

/* ---------------- AJAX: GET INVENTORY BY CLASS ID ---------------- */
const getInventoryByClasId = async (req, res) => {
  const classificationId = Number(req.params.clasId);
  const invData = await getInventoryByClassificationId(classificationId);
  return res.json(invData);
};

/* ---------------- ADD REVIEW ---------------- */
const addInventoryReview = async (req, res) => {
  const invId = req.params.invId;
  const formData = { ...req.body, inv_id: invId };
  const result = await createReview(formData);

  if (result) {
    req.flash("notice", "Review added.");
    return res.redirect(`/inv/detail/${invId}`);
  }

  req.flash("notice", "Review failed.");
  res.redirect(`/inv/detail/${invId}`);
};

/* ---------------- EXPORTS ---------------- */
module.exports = {
  buildByClassificationId,
  buildByInventoryId,
  buildAddClass,
  addClassification,
  buildAddInventory,
  addInventory,
  buildEditInventory,
  editInventory,
  buildDeleteByInventoryId,
  deleteInventory,
  getInventoryByClasId,
  addInventoryReview,
};