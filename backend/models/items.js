const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemname: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Seller",
  },
  stock: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Stock must be a postive number");
      }
    },
  },
  price: {
    type: Number,
    default: 1,
    validate(value) {
      if (value < 0) {
        throw new Error("Stock must be a postive number");
      }
    },
  },
  show: {
    type: Boolean,
    default: true,
  },
  image: {
    type: Buffer,
  },
  returnValid : {
    type: Number,
    required: true
  }
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
