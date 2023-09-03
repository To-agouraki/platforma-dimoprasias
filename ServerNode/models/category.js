const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String, // You can add a description field if needed
//   created_at: {
//     type: Date,
//     default: Date.now,
//   },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;