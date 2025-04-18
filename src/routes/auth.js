const express = require("express");
const { validateSignUpPayload } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const validator = require("validator");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate/Sanitize Payload
    validateSignUpPayload(req);
    // Retrieve Payload Values
    const { firstName, lastName, email, password } = req.body;
    // Generate a Password Hash
    const passwordHash = await bcrypt.hash(password, 10);
    // Instantiate a New User
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    // Save User to DB
    await user.save();
    // Respond with Success State
    res.send("Registered Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid Credentials!");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 360000),
      });
      res.send("Authenticated Successfully");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout Successful");
});

module.exports = {
  authRouter,
};
