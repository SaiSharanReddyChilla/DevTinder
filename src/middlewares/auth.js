const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("Please Login!")
    }
    const decodedToken = await jwt.verify(token, "Berlin@26");

    const { id } = decodedToken;

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
};

module.exports = {
  userAuth,
};
