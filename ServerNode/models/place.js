const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, require: true },
  image: { type: String, require: true },
  address: { type: String, require: true },
  testing:{type:String, require: false},
  location: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema);
