const mongoose = require("mongoose");

const { mongoConnectionString } = require("./db.credentials");

const mongoConnect = (callback) => {
  mongoose
    .connect(mongoConnectionString)
    .then((client) => {
      console.log("Connected!");
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.mongoConnect = mongoConnect;
