//junction table for bidding
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bidSchema = new Schema({
  amount: { type: Number, required: true },
  place: { type: mongoose.Types.ObjectId, required: true, ref: "Place" }, //establish connections in place==> we can use populate()
  bidder: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Bidding", bidSchema);
