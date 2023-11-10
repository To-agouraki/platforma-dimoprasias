const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: mongoose.Types.ObjectId, required: true, ref: "Category" },
  dateTime: { type: Date, required: true },
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
  activationState: { type: Boolean, default: true },
  creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Place", placeSchema);
