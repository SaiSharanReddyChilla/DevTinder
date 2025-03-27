const express = require("express");

const app = express();

const portNo = 7777;

app.get("/user", (req, res) => {
  // Fetch from DB
  res.send({ name: "SAI", age: 29 });
});

app.post("/user", (req, res) => {
  // Save to DB
  res.send("User added successfully");
});

app.put("/user", (req, res) => {
  // Update to DB
  res.send("User updated successfully");
});

app.patch("/user", (req, res) => {
  // Partial update to DB
  res.send("User updated successfully");
});

app.delete("/user", (req, res) => {
  // Delete from DB
  res.send("User deleted successfully");
});

app.use("/test", (req, res) =>
  res.send(
    "Great going, you've arrived at test route handled by express server"
  )
);

app.listen(portNo, () => {
  console.log("Server successfully Up and Running on Port No: ", portNo);
});
