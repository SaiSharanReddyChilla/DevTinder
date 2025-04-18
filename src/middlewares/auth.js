const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token! Please Login.");
    }
    const decodedToken = jwt.verify(token, "Berlin@26");
    const { id } = decodedToken;
    const user = await User.findById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      throw new Error("User Not Found!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
};

module.exports = {
  userAuth,
};
