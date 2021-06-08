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
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  deliveryDetails: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
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
  },
  razorpayOrderId: {
    type: String,
    default: "",
  },
  razorpayPaymentId: {
    type: String,
    default: "",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
