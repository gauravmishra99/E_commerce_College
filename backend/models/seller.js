const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const sellerSchema = new mongoose.Schema(
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

sellerSchema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "seller",
});

sellerSchema.methods.generateAuthToken = async function () {
  const seller = this;
  const token = jwt.sign({ _id: seller.id.toString() }, process.env.JWT_SECRET);

  seller.tokens = seller.tokens.concat({ token });
  await seller.save();

  return token;
};

sellerSchema.methods.toJSON = function () {
  const seller = this;
  const sellerObject = seller.toObject();

  delete sellerObject.password;
  delete sellerObject.tokens;

  return sellerObject;
};

sellerSchema.statics.findByCredentials = async (email,password) => {
  const seller = await Seller.findOne({email});
  if(!seller){
    throw new Error("Unable to Login")
  }

  const isMatch = await bcrypt.compare(password, seller.password);
  if(!isMatch){
    throw new Error("Unable to Login")
  }

  return seller;
}

//Hashing the plain text passwords before saving
sellerSchema.pre("save", async function(next){
  const seller = this;

  if(seller.isModified("password")){
    seller.password = await bcrypt.hash(seller.password, 8);
  }

  next();
})

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
