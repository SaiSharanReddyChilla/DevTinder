const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateProfileUpdatePayload,
  validateProfilePassword,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.json({
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const { isAllowed, message } = validateProfileUpdatePayload(req);

    if (!isAllowed) {
      return res.status(400).send(message);
    }

    const { user } = req;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

    await user.save();

    res.json({
      message: `${user?.firstName}, your profile is updated succesfully!`,
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
      return res.status(400).send(message);
    }

    const { newPassword } = req.body;

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const { user } = req;

    user["password"] = passwordHash;

    const data = await user.save();

    res.json({
      message: `${user?.firstName}, your profile password is updated successfully`,
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

module.exports = {
  profileRouter,
};
