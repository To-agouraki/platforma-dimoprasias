const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); //pass encryption
const jwt = require("jsonwebtoken"); //token

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Admin = require("../models/admin");
const Place = require("../models/place");
const Category = require("../models/category"); // Assuming you've imported the Category model
const BidJunctionTable = require("../models/bidding");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email, password);
  let existingUser;
  try {
    existingUser = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing in failed.", 500);
    return next(error);
  }

  if (!existingUser) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        500
      )
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }
  //const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  //if (!identifiedUser || identifiedUser.password !== password) {
  // throw new HttpError(
  // "Could not identify user, credentials seem to be wrong.",
  //401
  // );
  // }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "private_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Log in failed, please try again later.", 500);
    console.log(err);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

const createDummyAdmin = async () => {
  const dummyAdmin = new Admin({
    name: "Dummy Admin",
    email: "dummy@example.com",
    password: await bcrypt.hash("dummy123", 10), // Hashed password
  });

  try {
    await dummyAdmin.save();
    console.log("Dummy admin created:", dummyAdmin);
  } catch (error) {
    console.error("Error creating dummy admin:", error);
  }
};
//createDummyAdmin();

const getAdmins = async () => {
  try {
    const admins = await Admin.find();
    console.log("Admins:", admins);
    res.status(200).json({ admins: admins });
  } catch (err) {
    const error = new HttpError("Fetching admins failed.", 500);
  }
};

const getCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find();
  } catch (error) {
    return next(new HttpError("return categories failed", 500));
  }
  res.json({ categories: categories.map((categories) => categories.toObject({ getters: true })) });
};

//getAdmins();

const createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, make sure name is not empty and the description is not too big.",
        422
      )
    );
  }

  const { name, description } = req.body;

  const createdCategory = new Category({
    name,
    description,
  });

  try {
    // Save the category to the database using the save() method
    const category = await createdCategory.save();

    // Respond with the newly created category
    res.status(201).json({ category });
  } catch (error) {
    console.error("Error creating category:", error);
    return next(
      new HttpError("Creating category failed, please try again.", 500)
    );
  }
};

const deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId; // Assuming you pass the categoryId as a route parameter

  try {
    // Find the category by its ID and delete it
    const deletedCategory = await Category.findByIdAndRemove(categoryId);

    if (!deletedCategory) {
      return next(new HttpError("Category not found", 404));
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return next(
      new HttpError("Deleting category failed, please try again.", 500)
    );
  }
};

const updateCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId; // Assuming you pass the categoryId as a route parameter
  const { name, description } = req.body;

  try {
    // Find the category by its ID and update its properties
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true } // This option returns the updated category
    );

    if (!updatedCategory) {
      return next(new HttpError("Category not found", 404));
    }

    res.status(200).json({ category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    return next(
      new HttpError("Updating category failed, please try again.", 500)
    );
  }
};

exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.login = login;
exports.createCategory = createCategory;
exports.getCategories = getCategories;
