//const uuid = require("uuid").v4; // gia random id (kamni to i mongodb pleon)
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Place = require('../models/place');

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
    user = await User.findById(userId, "-id -_id");
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

  const { name, password } = req.body;
  const userId = req.params.uid;


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
  user.password = password;
  user.image = req.file.path;


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

  const createdUser = new User({
    name,
    email,
    image:
      "../uploads/images/6cf1e270-f28f-11ed-a28b-170f2a4af830.png",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        500
      )
    );
  }

  //const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  //if (!identifiedUser || identifiedUser.password !== password) {
  // throw new HttpError(
  // "Could not identify user, credentials seem to be wrong.",
  //401
  // );
  // }

  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
};

const getUserBids = async (req, res, next) => {
  const  userId  = req.params.uid;

  try {
    // Retrieve the user document and populate the 'bids' field
    const user = await User.findById(userId).populate('bids');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the bid IDs from the populated 'bids' field
    const bidIds = user.bids.map(bid => bid._id);

    // Query the BidJunctionTable collection using the bid IDs
    const items = await Place.find({ _id: { $in: bidIds } });

    res.status(200).json({items: items });
  } catch (error) {
    console.log(error);
    return next(new HttpError('Fetching user bids failed, please try again', 500));
  }
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getOnetUsers = getOnetUsers;
exports.updateUser = updateUser;
exports.getUserBids = getUserBids;
