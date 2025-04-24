const express = require("express");
const { connectToDB } = require("./config/database");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectToDB()
  .then(() => {
    console.log("Connection established to DB successfully!");
    app.listen(7777, () => {
      console.log("Server up and running on port: 7777");
    });
  })
  .catch((err) => {
    console.log("Failed to establish connection to DB!");
  });
