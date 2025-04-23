const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

const userRouter = express.Router();

const ALLOWED_USER_FIELDS =
  "firstName lastName age gender about skills photoUrl";

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      status: "INTERESTED",
      toUserId: loggedInUser?._id,
    }).populate("fromUserId", ALLOWED_USER_FIELDS);

    res.json({
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      status: "ACCEPTED",
      $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser?._id }],
    })
      .populate("fromUserId", ALLOWED_USER_FIELDS)
      .populate("toUserId", ALLOWED_USER_FIELDS);

    const data = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser?._id.toString()) {
        return request?.toUserId;
      }
      return request?.fromUserId;
    });

    res.json({
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.size || 10;
    limit = limit <= 25 ? limit : 10;
    let skip = (page - 1) * limit;
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser?._id }],
    }).select("fromUserId toUserId");

    let hiddenUsersFromFeed = new Set();

    connectionRequests.forEach((request) => {
      hiddenUsersFromFeed.add(request.fromUserId.toString());
      hiddenUsersFromFeed.add(request.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser?._id } },
      ],
    })
      .select(ALLOWED_USER_FIELDS)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

module.exports = {
  userRouter,
};
