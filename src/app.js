const express = require("express");

const app = express();

const portNo = 7777;

app.use("/test", (req, res) =>
  res.send("Great going, you've arrived at test route")
);

app.use("/hello", (req, res) =>
  res.send("Oh oh, you walked your way to greet Hello!")
);

app.use("/bye", (req, res) =>
  res.send("Awesome, you've finally arrived to say GoodBye!")
);

app.use("/", (req, res) => {
  const responseText = "Hurray! Welcome to GoingNuts Dashboard...";
  res.send(responseText);
});

app.listen(portNo, () => {
  console.log("Server successfully Up and Running on Port No: ", portNo);
});
