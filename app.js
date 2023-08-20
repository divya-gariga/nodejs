const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const candidateRoutes = require("./routes/candidate");
const courtsearchRoutes = require("./routes/court-search");
const adverseactionRoutes = require("./routes/adverse-action");

const app = express();

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/auth", authRoutes);

app.use("/candidates", candidateRoutes);

app.use("/court-searches", courtsearchRoutes);

app.use("/adverse-actions", adverseactionRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://divyag20:divyag20@cluster0.qbrwldo.mongodb.net/checkr?retryWrites=true"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log("error", err));
