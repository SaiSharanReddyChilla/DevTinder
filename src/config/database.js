const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://goingnuts:0123Sharan$@cluster0.eo6gj.mongodb.net/devTinder`
  );
};

module.exports = {
    connectDB
}
