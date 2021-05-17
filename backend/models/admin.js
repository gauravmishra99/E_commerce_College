const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  totalorder: {
    type: Number,
    default: 0,
  },
  totalSeller: {
    type: Number,
    default: 0,
  },
  totalCustomer: {
    type: Number,
    default: 0,
  },
});

const Admin = mongoose.model("Admin",adminSchema);

module.exports = Admin