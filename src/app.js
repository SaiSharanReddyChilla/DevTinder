const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const { User } = require("./models/user");
const { userAuth } = require("./middlewares/auth");
const { validateSignUpPayload } = require("./utils/validation");
const { connectToDB } = require("./config/database");

const portNo = 7777;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // Validate/Sanitize Payload
    validateSignUpPayload(req);
    // Retrieve Payload Values
    const { firstName, lastName, email, password } = req.body;
    // Generate a Password Hash
    const passwordHash = await bcrypt.hash(password, 10);
    // Instantiate a New User
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    // Save User to DB
    await user.save();
    // Respond with Success State
    res.send("Registered Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid Credentials!");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 360000),
      });
      res.send("Authenticated Successfully");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  const { user } = req;
  res.send(user);
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

connectToDB()
  .then((res) => {
    console.log("DB Connection Established Successfully");
    app.listen(portNo, () =>
      console.log("Server up and running on port no: 7777")
    );
  })
  .catch((err) => console.log("Failed To Establish Connection With DB"));
