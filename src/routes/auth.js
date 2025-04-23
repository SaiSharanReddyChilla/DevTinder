const express = require("express");
const { validateSignUpPayload } = require("../utils/validation");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpPayload(req);

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const data = await user.save();

    res.json({
      message: "User added successfully!",
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Invalid Credentials!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email not registered!");
    }

    const isPasswordValid = await user.validatePassword(req);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 360000),
      });
      res.send("Authenticated successfully!");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logged out successfully!");
});

module.exports = {
  authRouter,
};
