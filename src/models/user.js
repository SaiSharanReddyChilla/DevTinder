const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Weak Password!");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    gender: {
      type: String,
      uppercase: true,
      enum: {
        values: ["MALE", "FEMALE", "OTHERS"],
        message: `{VALUE} is not a valid gender type!`,
      },
    },
    about: {
      type: String,
      maxLength: 100,
      default: "This is just a sample about, feel free to change it!",
    },
    skills: {
      type: [String],
      validate(value) {
        if (Array.isArray(value) && value?.length > 10) {
          throw new Error("Skills cannot exceed 10!");
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

userSchema.methods.validatePassword = async function (req) {
  const user = this;
  const { password } = req.body;
  const isPasswordValid = await bcrypt.compare(password, user?.password);
  return isPasswordValid;
};

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user?._id }, "Berlin@26", {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("user", userSchema);

module.exports = {
  User,
};
