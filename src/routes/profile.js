const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateProfileUpdatePayload,
  validateProfilePassword,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const { user } = req;
  res.send(user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const { allowed, message } = validateProfileUpdatePayload(req);

    if (!allowed) {
      throw new Error(message);
    }
    const { user } = req;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    res.json({
      message: `${user?.firstName}, profile has been updated succesfully!`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { valid, message } = await validateProfilePassword(req);
    if (!valid) {
      throw new Error(message);
    }
    const { newPassword } = req.body;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const { user } = req;
    user["password"] = passwordHash;
    await user.save();
    res.json({
      message: `${user?.firstName}, profile password updated successfully!`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

module.exports = {
  profileRouter,
};
