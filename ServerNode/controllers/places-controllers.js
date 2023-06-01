const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const fs = require("fs");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
const BidJunctionTable = require("../models/bidding");

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
  const placeId = req.params.pid; // { pid: 'p1' }
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError("cant find id", 500);
    return next(err);
  }

  // const place = DUMMY_PLACES.find((p) => {  //old logic
  //  return p.id === placeId;
  // });

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) }); // => { place } => { place: place } getters = true remove the undescore on _id cause mongoose adds an id getter on evry doc which return the id as a string
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  //let userWithPlaces; //comenneted alterantive method with populate
  try {
    places = await Place.find({ creator: userId });
    //userWithPlaces = await User.findById(userId).populate('places');
  } catch (error) {
    const err = new HttpError("fetch places failed.", 404);
    return next(err);
  }

  //const places = DUMMY_PLACES.filter((p) => {
  //return p.creator === userId; //old logic
  //});

  if (
    !places /*userWithPlaces*/ ||
    /*userWithPlaces.places.lenght*/ places.length === 0
  ) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: /*userWithPlaces.places.map(...) */ places.map((places) =>
      places.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, dateTime, creator } = req.body;
  let image = req.file.path;
  // const title = req.body.title;
  const createdPlace = new Place({
    title,
    description,
    address,
    dateTime,
    image: image,
    creator,
  });
  //'../uploads/images/c5b29fd0-fb40-11ed-aebe-35ddc5059fee.png'
  let user;

  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(
      new HttpError(
        "creating a new place failed, please check your inputs(user error)",
        500
      )
    );
  }

  if (!user) {
    return next(new HttpError("creating place failed, userid error", 404));
  }

  //DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace); //pushes place id to user mongoosepush, places and user are the collections
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    const err = new HttpError("creating place failed", 500);
    return next(err);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, testing } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError("something went wrong could not update", 500);
    return next(err);
  }

  //const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };//old logic
  //const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  //updatedPlace.title = title;
  // updatedPlace.description = description;
  //DUMMY_PLACES[placeIndex] = updatedPlace;

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      'Not authorized!.',
      401
    );
    return next(error);
  }

  place.title = title;
  place.description = description;
  place.testing = testing;

  try {
    await place.save();
  } catch (error) {
    const err = new HttpError("Something went wrontg could not jpdate", 500);
    return next(err);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

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

  if (!place) {
    return next(new HttpError("could not find this id", 404));
  }
 
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'Not authorized!.',
      401
    );
    return next(error);
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



const bidItem = async (req, res, next) => {
  const { amount, itemId, userId } = req.body;
  let bid;

  if(amount<0){
    return next(new HttpError("Please bid with a positive amount", 500));
  }
///moni mlkia pou emine eni aman valun idiio bid price jiame enkro genika ti ipotethete prepi na gini
  try {
    // Find the existing highest bid for the same item by the current bidder
    const existingBid = await BidJunctionTable.findOne({
      place: itemId,
      bidder: userId,
    }).sort({ amount: -1 });

    if (existingBid) {
      // If existing bid is found, check if the new bid amount is greater
      if (amount > existingBid.amount) {
        // Update the existing bid with the new amount
        existingBid.amount = amount;
        await existingBid.save();
        bid = existingBid; // Assign the existing bid to the 'bid' variable
      } else {
        return res.status(400).json({
          message:
            "The bid amount must be greater than the existing highest bid.",
        });
      }
    } else {
      // Create a new bid
      bid = new BidJunctionTable({
        amount,
        place: itemId,
        bidder: userId,
      });

      // Save the new bid to the database
      await bid.save();

      // Update the user's bids field only when a new bid is created
      await User.findByIdAndUpdate(
        userId,
        { $push: { bids: bid._id } },
        { new: true }
      );

      await Place.findByIdAndUpdate(
        userId,
        { $push: { bids: bid._id } },
        { new: true }
      );
    }

    // Find the existing highest bid for the item
    const existingHighestBid = await BidJunctionTable.findOne({ place: itemId })
      .sort({ amount: -1 })
      .exec();

    let highestBid = existingHighestBid ? existingHighestBid.amount : 0;
    let highestBidder = existingHighestBid ? existingHighestBid.bidder : null;

    if (amount > highestBid) {
      highestBid = amount;
      highestBidder = userId;
    }

    // Update the place's highest bid and bidder fields
    try {
      await Place.findByIdAndUpdate(
        itemId,
        { highestBid, highestBidder },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }

    res.status(201).json({ message: "Bid created successfully", bid });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Creating bid failed, please try again", 500));
  }
};





const getPlacesMarket = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: { $ne: userId } });
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
    places: places.map((place) => place.toObject({ getters: true })),
  });
};


exports.getPlacesMarket = getPlacesMarket;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.bidItem = bidItem;
