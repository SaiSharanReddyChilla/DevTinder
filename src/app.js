const express = require("express");
const cookieParser = require("cookie-parser");
const { connectToDB } = require("./config/database");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

connectToDB()
  .then((res) => {
    console.log("DB Connection Established Successfully");
    app.listen(7777, () =>
      console.log("Server up and running on port no: 7777")
    );
  })
  .catch((err) => console.log("Failed To Establish Connection With DB"));
