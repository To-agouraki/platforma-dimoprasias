//junction table for bidding
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const placeSchema = new Schema({
    amount: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],//establish connections in place==> we can use populate()
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});
  
  module.exports = mongoose.model("Bidding", placeSchema);