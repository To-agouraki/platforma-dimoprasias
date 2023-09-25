const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, require: true },
  image: { type: String, require: true },
  category: { type: mongoose.Types.ObjectId, require: true, ref: "Category" },
  dateTime: { type: Date, require: true },
  highestBid: {
    type: Number,
    default: 0,
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bids: [{ type: mongoose.Types.ObjectId, required: true, ref: "Bidding" }],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema);
