const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain the word "password"');
        } else if (value.length < 7) {
          throw new Error("Password length cannot be less than 6 characters");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    phonenumbers: {
      type: Number,
      required: true,
    },
    cart: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

customerSchema.methods.generateAuthToken = async function () {
  const customer = this;
  const token = jwt.sign(
    { _id: customer.id.toString() },
    process.env.JWT_SECRET
  );

  customer.tokens = customer.tokens.concat({ token });
  await customer.save();

  return token;
};
customerSchema.methods.toJSON = function () {
  const customer = this;
  const customerObject = customer.toObject();

  delete customerObject.password;
  delete customerObject.tokens;

  return customerObject;
}

customerSchema.statics.findByCredentials = async (email,password) => {
  const customer = await Customer.findOne({email});
  if(!customer){
    throw new Error("Unable to Login")
  }

  const isMatch = await bcrypt.compare(password, customer.password);
  if(!isMatch){
    throw new Error("Unable to Login")
  }

  return customer;
}

//Hashing the plain text passwords before saving
customerSchema.pre("save", async function(next){
  const customer = this;

  if(customer.isModified("password")){
    customer.password = await bcrypt.hash(customer.password, 8);
  }

  next();
})

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
