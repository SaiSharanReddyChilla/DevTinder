const express = require("express");

const app = express();

const portNo = 7777;

app.use(
  "/user",

  // Request not handled/responded back with a response and hence stuck in indefinite loop
  // (req, res) => {
  //   console.log("Oops, still running...")
  // }

  // Request handled with res.send()
  // (req, res) => {
  //   console.log("Route Handler Executing...");
  //   res.send("response 1 returned.");
  // }

  // Multiple route handlers

  // Case 1: Response not sent from handler 1, stuck on loop
  // (req, res) => {
  //   console.log("Route Handler 1 Executing...");
  // },
  // (req, res) => {
  //   console.log("Route Handler 2 Executing...");
  //   res.send("response 1 returned.");
  // }

  // Case 2: calling the next() method to execute the handler 2
  // (req, res, next) => {
  //   console.log("Route Handler 1 Executed...");
  //   next();
  // },
  // (req, res) => {
  //   console.log("Route Handler 2 Executing...");
  //   res.send("response 2 returned.");
  // }

  // Case 3: calling the res.send() before next() method
  // (req, res, next) => {
  //   console.log("Route Handler 1 Executed...");
  //   res.send("response 1 returned");
  //   next();
  // },
  // (req, res) => {
  //   console.log("Route Handler 2 Executing...");
  //   res.send("response 2 returned.");
  // }

  // Case 4: calling the next() method before res.send()
  // (req, res, next) => {
  //   console.log("Route Handler 1 Executed...");
  //   next();
  //   res.send("response 1 returned");
  // },
  // (req, res) => {
  //   console.log("Route Handler 2 Executing...");
  //   res.send("response 2 returned.");
  // }

  // Case 5: ERROR - Missing subsequent route handler
  (req, res, next) => {
    console.log("Route Handler 1 Executed...");
    next();
  },
  (req, res, next) => {
    console.log("Route Handler 2 Executing...");
    next();
  }
);

app.listen(portNo, () => {
  console.log("Server successfully Up and Running on Port No: ", portNo);
});
