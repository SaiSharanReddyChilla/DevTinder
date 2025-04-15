const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

const portNo = 7777;

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // Create a new Instance of the User Model
    const user = new User(req.body);
    // Call the save method to save the document to user collection, note that the save method returns a prmoise
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error Adding User: " + err?.message);
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    console.log("error", err);
    res.send(err?.message);
  }
});

connectDB()
  .then((res) => {
    console.log("DB connection established successfully");
    app.listen(portNo, () => {
      console.log("Server successfully Up and Running on Port No: ", portNo);
    });
  })
  .catch((err) => {
    console.log("Unable to establish connection to DB at the moment");
  });
