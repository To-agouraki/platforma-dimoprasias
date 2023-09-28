//const uuid = require("uuid").v4; // gia random id (kamni to i mongodb pleon)
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); //pass encryption
const jwt = require("jsonwebtoken"); //token

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Place = require("../models/place");
const BidJunctionTable = require("../models/bidding");

// const DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "Max Schwarz",
//     email: "test@test.com",
//     password: "testers",
//   },
// ];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("return users failed", 500));
  }
  res.json({ users: users.map((users) => users.toObject({ getters: true })) });
};

const getOnetUsers = async (req, res, next) => {
  const userId = req.params.uid;
  let user;
  try {
    //users = await User.find(u=>u.id === userId)
    user = await User.findById(userId, "-id -_id -email");
  } catch (error) {
    return next(new HttpError("getting user data failed", 500));
  }

  if (!user) {
    const error = new HttpError("could not find the user.", 404);
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, imagepath } = req.body;
  const userId = req.params.uid;
  //console.log(imagepath);
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    const err = new HttpError("something went wrong could not update", 500);
    return next(err);
  }

  //const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };//old logic
  //const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  //updatedPlace.title = title;
  // updatedPlace.description = description;
  //DUMMY_PLACES[placeIndex] = updatedPlace;

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

/////////////////////////////////////////////////
const signup = async (req, res, next) => {
  const errors = validationResult(req); //from check
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check your data(pass>6 or empty email).",
        422
      )
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 11);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "../uploads/images/6cf1e270-f28f-11ed-a28b-170f2a4af830.png",
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "private_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};
////////////////////////////////////////////
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
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

const getBiddersItems = async (req, res, next) => {
  let userId = req.params.uid;
  try {
    // Retrieve the bidded items for the user
    const biddedItems = await BidJunctionTable.find({
      bidder: userId,
    })
      .populate({
        path: "place",
        populate: {
          path: "category",
          select: "name", // Select only the 'name' field from the 'category' document
        },
      })
      .exec();

    res.json({
      items: biddedItems.map((item) => ({
        _id: item._id,
        amount: item.amount,
        place: {
          _id: item.place._id,
          title: item.place.title,
          description: item.place.description,
          image: item.place.image,
          category: item.place.category.name, // Extract category name here
          dateTime: item.place.dateTime,
          highestBid: item.place.highestBid,
          bids: item.place.bids,
          creator: item.place.creator,
          highestBidder: item.place.highestBidder,
          id: item.place.id,
        },
        bidder: item.bidder,
        __v: item.__v,
        id: item.id,
      })),
    });

    /* res.json({
      items: biddedItems.map((items) => items.toObject({ getters: true })),
    });*/
  } catch (error) {
    console.log(error);
    const err = new HttpError("getting item failed.", 500);
    return next(err);
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getOnetUsers = getOnetUsers;
exports.updateUser = updateUser;
exports.getBiddersItems = getBiddersItems;
