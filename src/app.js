const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

const portNo = 7777;

// Call the express.json() middleware which processes and converts the incoming JSON req body to JS Object
app.use(express.json());

// GET API to fetch users by email
app.get("/users", async (req, res) => {
  try {
    console.log("email", req.body.email);
    const users = await User.find({ email: req.body.email });
    if (users?.length > 0) {
      res.send(users);
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (err) {
    console.log("ERROR: ", err?.message);
    res.status(400).send("Something Went Wrong!");
  }
});

// GET API to fetch single user by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log("user", user);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (err) {
    console.log("ERROR: ", err?.message);
    res.status(400).send("Something Went Wrong!");
  }
});

// DELETE API to delete a user by id
app.delete("/user", async (req, res) => {
  try {
    const id = req.body.userId;
    await User.findByIdAndDelete(id);
    res.send("User Deleted Successfully");
  } catch (err) {
    console.log("ERROR: ", err?.message);
    res.status(400).send("Something Went Wrong!");
  }
});

// UPDATE API to update the details of an user
app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true
    });
    console.log("User: ", user);
    res.send("User Details Updated Successfully");
  } catch (err) {
    console.log("ERROR: ", err?.message);
    res.status(400).send(err?.message);
  }
});

// GET API to fetch All Users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log("ERROR: ", err?.message);
    res.status(400).send("Something Went Wrong!");
  }
});

app.post("/signup", async (req, res) => {
  try {
    // Create a new Instance of the User Model
    const user = new User(req.body);
    // Call the save method to save the document to user collection, note that the save method returns a prmoise
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    console.log("ERROR: ", err?.message);
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
