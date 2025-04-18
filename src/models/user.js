const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 25,
      validate(value) {
        if (value?.length < 3 || value?.length > 25) {
          throw new Error("First Name must be 3 to 25 characters.");
        }
      },
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email!!!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password!!!");
        }
      },
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gended is not valid!");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    about: {
      type: String,
      default: "This is a sample about, feel free to change!",
    },
    skills: {
      type: [String],
      validate(value) {
        if (Array.isArray(value) && value?.length > 10) {
          throw new Error("Skills must not exceed 10!");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/07/24/59/76/240_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL!");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user?._id }, "Berlin@26", {
    expiresIn: "7d",
  });
  return token;
};

UserSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const passwordHash = user.password;
  const isPwdValid = await bcrypt.compare(inputPassword, passwordHash);
  return isPwdValid;
};

const User = mongoose.model("user", UserSchema);

module.exports = {
  User,
};
