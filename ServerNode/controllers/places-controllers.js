const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const fs = require("fs");
const { getIo } = require("../middleware/socketio");
const io = getIo();

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const AdminUser = require("../models/admin");
const User = require("../models/user");
const BidJunctionTable = require("../models/bidding");
const Category = require("../models/category");
const Notification = require("../models/notification");
const { error } = require("console");

// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     location: {
//       lat: 40.7484474,
//       lng: -73.9871516,
//     },
//     address: "20 W 34th St, New York, NY 10001",
//     creator: "u1",
//   },
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    // Find the place by ID without populating the category field
    place = await Place.findById(placeId).populate("category").exec();
  } catch (error) {
    const err = new HttpError("Couldn't find the place.", 500);
    return next(err);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  // Return the place data without populating the category field
  res.json({
    place: {
      id: place._id,
      title: place.title,
      description: place.description,
      image: place.image,
      category: place.category.name, // Assuming category is a string field in your schema
      dateTime: place.dateTime,
      highestBid: place.highestBid,
      highestBidder: place.highestBidder,
      bids: place.bids,
      creator: place.creator,
      activationState: place.activationState,
    },
  });
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    // Populate the 'category' field with the actual category data
    places = await Place.find({
      creator: userId,
      activationState: { $eq: true },
    })
      .populate("category")
      .exec();
  } catch (error) {
    const err = new HttpError("Fetch places failed.", 404);
    return next(err);
  }

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

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("from create place", errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, category, dateTime, creator } = req.body;
  let image = req.file.path;

  // Retrieve the category ObjectId based on the category name
  const foundCategory = await Category.findOne({ name: category });

  if (!foundCategory) {
    return next(new HttpError("Category not found.", 404));
  }

  const createdPlace = new Place({
    title,
    description,
    category: foundCategory._id, // Use the ObjectId of the found category
    dateTime,
    image,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(
      new HttpError(
        "Creating a new place failed, please check your inputs (user error)",
        500
      )
    );
  }

  if (!user) {
    return next(new HttpError("Creating place failed, user ID error", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    const err = new HttpError("Creating place failed", 500);
    return next(err);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, category } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError("Something went wrong, could not update", 500);
    return next(err);
  }

  const adminUser = await AdminUser.findById(req.userData.userId);

  if (!place) {
    const error = new HttpError("Could not find this ID", 404);
    return next(error);
  }

  if (place.creator != req.userData.userId) {
    if (req.userData.userId != adminUser.id) {
      const error = new HttpError("Not authorized!.", 401);
      return next(error);
    }
  }

  // Update fields only if they are provided in the request body
  if (title !== undefined) {
    place.title = title;
  }

  if (description !== undefined) {
    place.description = description;
  }

  try {
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      //epidi en stelno id je title pou to backend miniski san string je prepi na ginete checked
      // Check if the category ID is valid before updating
      const itemCategory = await Category.findOne({ _id: category });
      if (!itemCategory) {
        const error = new HttpError("Invalid category ID", 400);
        return next(error);
      }
      place.category = category;
    }
  } catch (error) {
    console.log(error);
    console.log("error has occured with category");
  }

  try {
    if (
      typeof req.file !== "undefined" &&
      typeof req.file.path !== "undefined"
    ) {
      place.image = req.file.path;
    }
  } catch (error) {
    console.log("image error: ", error);
  }

  try {
    await place.save();
    res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    const err = new HttpError("Something went wrong, could not update", 500);
    return next(err);
  }
};
/////////////////////////
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  // throw new HttpError("Could not find a place for that id.", 404);
  // }
  //DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  let place;
  try {
    place = await Place.findById(placeId).populate("creator"); //populat afu ekamane establish conenction sta models je tha kamume kati sto creator field
  } catch (error) {
    const err = new HttpError(
      "something went wrong could not delete place",
      500
    );
    return next(err);
  }

  const adminUser = await AdminUser.findById(req.userData.userId);

  if (!adminUser) {
    const error = new HttpError("Not authorized! not admin", 401);
    return next(error);
  }

  if (!place) {
    return next(new HttpError("could not find this id", 404));
  }

  if (place.creator.id !== req.userData.userId) {
    if (req.userData.userId != adminUser._id) {
      const error = new HttpError("Not authorized!.", 401);
      return next(error);
    }
  }

  const imagePath = place.image;

  try {
    //await place.deleteOne();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place); //apo to object place piani to creator(place.creator) je meta places pou to creator pou to populate to place eshi je to creator id
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    const err = new HttpError(
      "something went wrong the place could not be deleted",
      500
    );
    return next(err);
  }

  fs.unlink(imagePath, (error) => {
    console.log(error);
  });

  res.status(200).json({ message: "Deleted place." });
};
/////////////////////////

const deactivatePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError("Something went wrong, could not update", 500);
    return next(err);
  }

  let expiredplace;
  try {
    expiredplace = await Place.find({
      _id: placeId,
      dateTime: { $lt: new Date() },
    });
  } catch (error) {
    const err = new HttpError("Something went wrong, could not update", 500);
    return next(err);
  }

  if (expiredplace) {
    const error = new HttpError(
      "It is expired, do not deactivate for now.",
      404
    );
    return next(error);
  }
  const adminUser = await AdminUser.findById(req.userData.userId);

  if (!place) {
    const error = new HttpError("Could not find this ID", 404);
    return next(error);
  }

  if (place.creator != req.userData.userId) {
    if (req.userData.userId != adminUser.id) {
      const error = new HttpError("Not authorized!.", 401);
      return next(error);
    }
  }

  try {
    place.activationState = !place.activationState;
  } catch (error) {
    console.log(error);
  }

  try {
    await place.save();
    res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    const err = new HttpError("Something went wrong, could not update", 500);
    return next(err);
  }
};

const bidItem = async (req, res, next) => {
  const { amount, itemId, userId } = req.body;

  if (amount <= 0) {
    return next(
      new HttpError("Please place a bid with a positive amount", 400)
    );
  }

  try {
    // Find the existing highest bid for the item
    const existingHighestBid = await BidJunctionTable.findOne({ place: itemId })
      .sort({ amount: -1 })
      .exec();

    const currentHighestBid = existingHighestBid
      ? existingHighestBid.amount
      : 0;

    if (amount > currentHighestBid) {
      // If the new bid is higher than the current highest bid, create/update the bid
      let bid = await BidJunctionTable.findOneAndUpdate(
        { place: itemId, bidder: userId },
        { amount: amount },
        { new: true, upsert: true }
      );

      // Update the user's bids field only when a new bid is created
      await User.findByIdAndUpdate(userId, { $addToSet: { bids: bid._id } });

      // Update the place's highest bid and bidder fields
      await Place.findByIdAndUpdate(itemId, {
        highestBid: amount,
        highestBidder: userId,
      });

      // Check if there was a previous highest bidder
      if (existingHighestBid && existingHighestBid.bidder !== userId) {
        const replacedUserId = existingHighestBid.bidder;
        const itemID = existingHighestBid.place;
        const newBidAmount = amount;

        // Create a new notification
        const notification = new Notification({
          userId: replacedUserId, // User ID of the replaced highest bidder
          message: `You have been replaced as the highest bidder for item ${itemID}.`,
          data: { itemId: itemID, newBidAmount: newBidAmount },
        });

        // Save the notification to the database
        await notification.save();
        console.log(replacedUserId);
        

        // Emit a notification event to the replaced user with item information
        io.to(replacedUserId).emit("notification", {
          message: `You have been replaced as the highest bidder for item ${itemID}.`,
          notificationId: notification._id, // Optionally, send the notification ID to the client for further reference
        });
      }

      return res
        .status(201)
        .json({ message: "Bid created/updated successfully", bid });
    } else {
      return res.status(400).json({
        message: "Your bid amount must be higher than the current highest bid.",
      });
    }
  } catch (error) {
    console.error(error);
    return next(
      new HttpError("Creating/updating bid failed, please try again", 500)
    );
  }
};

const getPlacesMarket = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    // Populate the 'category' field with the actual category data
    places = await Place.find({
      dateTime: { $gte: new Date() },
      creator: { $ne: userId },
      activationState: { $eq: true },
    })
      .populate("category")
      .sort({ title: 1 })
      .exec();
  } catch (error) {
    const err = new HttpError("Fetching places failed.", 404);
    return next(err);
  }

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

const getDeactivatedItemsAdmin = async (req, res, next) => {
  let places;
  console.log("1");
  try {
    // Populate the 'category' field with the actual category data
    places = await Place.find({
      dateTime: { $gte: new Date() },
      activationState: { $eq: false },
    })
      .populate("category")
      .sort({ title: 1 })
      .exec();
  } catch (error) {
    const err = new HttpError("Fetching places failed.", 404);
    return next(err);
  }

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

const getAllItemsMarket = async (req, res, next) => {
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

exports.getPlacesMarket = getPlacesMarket;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.bidItem = bidItem;
exports.getAllItemsMarket = getAllItemsMarket;
exports.deactivatePlace = deactivatePlace;
exports.getDeactivatedItemsAdmin = getDeactivatedItemsAdmin;
