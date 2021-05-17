const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      price: {
        type: Number,
        required: true,
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      itemid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      returnValid: {
        type: Number,
        required: true,
      },
    },
  ],
  datePlacedOn: {
    type: Date,
    required: true,
  },

  placedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  dateDelivered: {
    type: Date,
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
