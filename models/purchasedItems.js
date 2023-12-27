const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  companyName: String,
  count: Number,
  id: String,
  imgLink: String,
  inStock: Number,
  itemName: String,
  price: Number,
  weight: Number,
});

const schema = new mongoose.Schema({
  userUid: String,
  date: String,
  items: [itemSchema],
});

module.exports = mongoose.model("purchasedItems", schema);
