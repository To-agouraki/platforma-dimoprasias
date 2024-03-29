const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, minlength: 6 },
  image: { type: String, required: false },
  bids: [{ type: mongoose.Types.ObjectId, ref: "Bidding" }],
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }], //establish connections in place==> we can use populate()
  wonItems: [{ type: mongoose.Types.ObjectId, ref: "Place" }], //establish connections in place==> we can use populate()
  soldItems: [{ type: mongoose.Types.ObjectId, ref: "Place" }], //establish connections in place==> we can use populate()
  unSoldItems: [{ type: mongoose.Types.ObjectId, ref: "Place" }],

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
