const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    status: {
      type: String,
      required: true,
      uppercase: true,
      enum: {
        values: ["IGNORED", "INTERESTED", "ACCEPTED", "REJECTED"],
        message: `{VALUE} is not a valid status type!`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Connection to self is not allowed!");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "connectionrequest",
  connectionRequestSchema
);

module.exports = {
  ConnectionRequest,
};
