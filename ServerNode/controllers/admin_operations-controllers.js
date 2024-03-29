const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); //pass encryption
const jwt = require("jsonwebtoken"); //token
const io = require("socket.io")(); // Import the Socket.IO instance

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Admin = require("../models/admin");
const Place = require("../models/place");
const Category = require("../models/category"); // Assuming you've imported the Category model
const BidJunctionTable = require("../models/bidding");
const { param } = require("../routes/users-routes");
const { getUsers } = require("./users-controllers");

const login = async (req, res, next) => {
  const { email, password } = req.body;

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
    categories = await Category.find().sort({ name: 1 });
  } catch (error) {
    return next(new HttpError("return categories failed", 500));
  }
  res.json({
    categories: categories.map((categories) =>
      categories.toObject({ getters: true })
    ),
  });
};

const getCategoryById = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (error) {
    return next(new HttpError("Fetching category failed", 500));
  }

  if (!category) {
    return next(new HttpError("Category not found", 404));
  }

  res.json({ category: category.toObject({ getters: true }) });
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

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const { name, description } = req.body;

  let image = req.file.path;

  const capitalizedCategoryName = capitalizeFirstLetter(name);

  const createdCategory = new Category({
    name: capitalizedCategoryName,
    description,
    image,
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

  // Check if there are items in the category

  try {
    const itemsInCategory = await Place.find({ category: categoryId });

    if (itemsInCategory.length > 0) {
      return next(
        new HttpError("Cannot delete category with associated items", 400)
      );
    }
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed for update, make sure name is not empty and the description is not too big.",
        422
      )
    );
  }

  const categoryId = req.params.categoryId;
  const { name, description } = req.body;
  let imagepath;

  // Check if req.file is defined and has a path property
  if (req.file && req.file.path) {
    imagepath = req.file.path;
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description, imagepath }, // Use imagepath variable
      { new: true }
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

const updateNormalUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, imagepath } = req.body;
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    const err = new HttpError("something went wrong could not update", 500);
    return next(err);
  }

  user.name = name;
  if (typeof req.file !== "undefined" && typeof req.file.path !== "undefined") {
    user.image = req.file.path;
  }
  //user.image = req.file.path;

  try {
    await user.save();
  } catch (error) {
    const err = new HttpError(
      "Something went wrong could not save the updated data",
      500
    );
    return next(err);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

const getAllItems = async (req, res, next) => {
  let places;

  try {
    // Populate the 'category' field with the actual category data
    places = await Place.find({
      dateTime: { $gte: new Date() },
      activationState: { $eq: true },
    })
      .populate("category")
      .sort({ title: 1 })
      .exec();
  } catch (error) {
    console.log(error);
    console.log("fail");
    const err = new HttpError("Fetching places failed.", 404);
    return next(err);
  }
  try {
    io.emit("notification", { message: "New item added!" });
  } catch (error) {
    console.log(error);
  }
  // try {
  //     io.emit("notification", { message: "New items are available!" });

  // } catch (error) {
  //   console.log(error);
  // }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: places.map((place) => ({
      id: place._id,
      title: place.title,
      description: place.description,
      image: place.image,
      category: place.category.name, // Display the category name
      dateTime: place.dateTime,
      highestBid: place.highestBid,
      highestBidder: place.highestBidder, // Include the entire user object if needed
      bids: place.bids, // Include the array of bid IDs
      creator: place.creator, // Include the entire user object if needed
      activationState: place.activationState,
    })),
  });
};

const getAllExpiredItems = async (req, res, next) => {
  let places;

  try {
    // Populate the 'category' field with the actual category data
    places = await Place.find({
      dateTime: { $lt: new Date() },
      //activationState: { $eq: true },//enkro an xriazete afu en expired
    })
      .populate("category")
      .sort({ title: 1 })
      .exec();
  } catch (error) {
    console.log(error);
    console.log("fail");
    const err = new HttpError("Fetching places failed.", 404);
    return next(err);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  //console.log(places);

  res.json({
    places: places.map((place) => ({
      id: place._id,
      title: place.title,
      description: place.description,
      image: place.image,
      category: place.category.name, // Display the category name
      dateTime: place.dateTime,
      highestBid: place.highestBid,
      highestBidder: place.highestBidder, // Include the entire user object if needed
      bids: place.bids, // Include the array of bid IDs
      creator: place.creator, // Include the entire user object if needed
      activationState: place.activationState,
    })),
  });
};

// middleware/getPlacesData.js

const getPlacesData = async () => {
  try {
    // Fetch all places
    const allPlaces = await Place.find();

    // Extract id, title, and creationDate from each place
    const placesData = allPlaces.map((place) => ({
      id: place._id,
      title: place.title,
      creationDate: place.creationDate,
    }));

    // Return the extracted data
    return placesData;
  } catch (error) {
    throw new Error("Error fetching places data");
  }
};

const getUsersActivities = async () => {
  try {
    // Fetch all users
    const allUsers = await User.find();

    // Extract user activity data
    const userActivityData = allUsers.map((user) => ({
      name: user.name,
      bids: user.bids?.length || 0,
      places: user.places?.length || 0,
      soldItems: user.soldItems?.length || 0,
      unSoldItems: user.unSoldItems?.length || 0,
      wonItems: user.wonItems?.length || 0,
    }));

    return userActivityData;
  } catch (error) {
    console.error("Error fetching user activity data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStatistics = async (req, res, next) => {
  try {
    const totalItems = await Place.countDocuments();
    const activatedItems = await Place.countDocuments({
      activationState: true,
    });
    const deactivatedItems = await Place.countDocuments({
      activationState: false,
    });
    const expiredItems = await Place.countDocuments({
      dateTime: { $lt: new Date() },
    });
    const nonExpiredItems = totalItems - expiredItems;

    const totalUsers = await User.countDocuments();

    const usersWithPlaces = await User.countDocuments({
      places: { $exists: true, $not: { $size: 0 } },
    });
    const usersWithBids = await User.countDocuments({
      bids: { $exists: true, $not: { $size: 0 } },
    });

    const totalCategories = await Category.countDocuments();

    const CategoryItemsCount = await getCategoryItemCounts();

    const placesCreationDate = await getPlacesData();

    const usersActivities = await getUsersActivities();

    res.json({
      totalItems,
      activatedItems,
      deactivatedItems,
      expiredItems,
      nonExpiredItems,
      totalUsers,
      usersWithPlaces,
      usersWithBids,
      totalCategories,
      CategoryItemsCount,
      placesCreationDate,
      usersActivities,
    });
  } catch (error) {
    const err = new HttpError("Could not fetch statistics.", 500);
    return next(err);
  }
};

const getCategoryNameById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    return category ? category.name : "Unknown Category";
  } catch (error) {
    console.error(`Error getting category name for ID ${categoryId}:`, error);
    return "Unknown Category";
  }
};

// Now you can use this function in your getCategoryItemCounts function
const getCategoryItemCounts = async () => {
  try {
    // Fetch all items from the Place collection
    const allItems = await Place.find();

    // Initialize category counters
    const allItemsCounters = {};
    const activeItemsCounters = {};
    const unsoldItemsCounters = {};
    const soldItemsCounters = {};

    // Iterate through the items, updating category counters and categorizing items
    allItems.forEach((item) => {
      const categoryId = item.category;
      const itemDateTime = item.dateTime;
      const highestbid = item.highestBid;

      // Update category counters for all items
      if (categoryId) {
        allItemsCounters[categoryId] = (allItemsCounters[categoryId] || 0) + 1;
      }

      // Check if the item is active or expired and update counters accordingly
      if (itemDateTime) {
        const now = new Date();
        if (itemDateTime >= now) {
          // Active item
          activeItemsCounters[categoryId] =
            (activeItemsCounters[categoryId] || 0) + 1;
        } else if (itemDateTime <= now && highestbid == 0) {
          // Expired item
          unsoldItemsCounters[categoryId] =
            (unsoldItemsCounters[categoryId] || 0) + 1;
        } else {
          soldItemsCounters[categoryId] =
            (soldItemsCounters[categoryId] || 0) + 1;
        }
      }
    });

    // Get category names asynchronously
    const allItemsCategoryNames = await Promise.all(
      Object.entries(allItemsCounters).map(async ([categoryId, count]) => ({
        name: await getCategoryNameById(categoryId),
        value: count,
      }))
    );

    const activeItemsCategoryNames = await Promise.all(
      Object.entries(activeItemsCounters).map(async ([categoryId, count]) => ({
        name: await getCategoryNameById(categoryId),
        value: count,
      }))
    );

    const unsoldItemsCategoryNames = await Promise.all(
      Object.entries(unsoldItemsCounters).map(async ([categoryId, count]) => ({
        name: await getCategoryNameById(categoryId),
        value: count,
      }))
    );

    const soldItemsCategoryNames = await Promise.all(
      Object.entries(soldItemsCounters).map(async ([categoryId, count]) => ({
        name: await getCategoryNameById(categoryId),
        value: count,
      }))
    );

    //console.log("All items category counts:", allItemsCategoryNames);
    //console.log("Active items category counts:", activeItemsCategoryNames);
    //console.log("Expired items category counts:", expiredItemsCategoryNames);

    return {
      allItemsCategoryNames,
      activeItemsCategoryNames,
      unsoldItemsCategoryNames,
      soldItemsCategoryNames,
    };
  } catch (error) {
    console.error("Error getting item counts:", error);
    return {};
  }
};

exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.login = login;
exports.createCategory = createCategory;
exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.updateNormalUser = updateNormalUser;
exports.getAllItems = getAllItems;
exports.getAllExpiredItems = getAllExpiredItems;
exports.getStatistics = getStatistics;
