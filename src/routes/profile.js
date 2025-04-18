const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  const { user } = req;
  res.send(user);
});

module.exports = {
  profileRouter,
};
