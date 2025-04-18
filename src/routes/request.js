const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const { user } = req;
  res.send(`Hey ${user?.firstName}, connection request sent successfully!!!`);
});

module.exports = {
  requestRouter,
};
