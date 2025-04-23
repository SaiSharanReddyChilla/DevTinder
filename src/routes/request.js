const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const { connect } = require("mongoose");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { user } = req;
      const fromUserId = user?._id;
      const toUserId = req.params?.toUserId;
      const status = req.params?.status?.toUpperCase();

      const ALLOWED_STATUS = ["IGNORED", "INTERESTED"];

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid status type!");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists!");
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error("User not found!");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message:
          status === "IGNORED"
            ? `${user?.firstName} ignored ${toUser?.firstName}`
            : `${user?.firstName} is interested in ${toUser?.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err?.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req?.user;
      const status = req.params.status.toUpperCase();
      const requestId = req.params.requestId;

      if (!status || !requestId) {
        throw new Error("Invalid request params!");
      }

      const ALLOWED_STATUS = ["ACCEPTED", "REJECTED"];

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid status type!");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser?._id,
        status: "INTERESTED",
      });

      if (!connectionRequest) {
        throw new Error("Connection request not found!");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: `Connection request ${req.params.status}`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err?.message);
    }
  }
);

module.exports = {
  requestRouter,
};
