const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid token, please login!");
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
