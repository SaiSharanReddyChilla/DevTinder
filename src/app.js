const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

const portNo = 7777;

// Call the express.json() middleware which processes and converts the incoming JSON req body to JS Object
app.use(express.json());

// GET API to fetch users by email
app.get("/users", async (req, res) => {
  try {
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
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req?.params?.userId;
    const data = req.body;

    const ALLOWED_UPDATES = [
      "lastName",
      "password",
      "gender",
      "age",
      "about",
      "skills",
      "photoUrl",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }

    if (data?.skills?.length > 0) {
      throw new Error("Skills cannot exceed 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
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

// POST API to register a new User
app.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    // Encrypt the password using bcrypt library
    const pwdHash = await bcrypt.hash(password, 10);

    // Create a new Instance of the User Model
    const user = new User({
      firstName,
      lastName,
      email,
      password: pwdHash,
    });

    // Call the save method to save the document to user collection
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    console.log("ERROR: ", err?.message);
    res.status(400).send("Error Adding User: " + err?.message);
  }
});

// POST API to authenticate a User Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (isPasswordValid) {
      res.send("Login Successful!");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

// Middleware to catch and and handle errors
app.use("/", (err, req, res, next) => {
  if (err) {
    console.log("ERROR", err);
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
