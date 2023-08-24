const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');

const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array().map(error => error.msg);
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        const error = new Error("Validation failed");
        error.statusCode = 400;
        error.data = ["A user with this email already exists."];
        throw error;
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashedPwd) => {
      const user = new User({
        email: email,
        password: hashedPwd,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "User created!", data: { userId: result._id } });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "unable to signup";
      next(err);
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array().map(error => error.msg);
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("unable to login");
        error.statusCode = 401;
        error.data = ["A user with this email could not be found."];
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("unable to login");
        error.statusCode = 401;
        error.data = ["Wrong password!"];
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "secret",
        { expiresIn: "1h" }
      );
      res.status(200).json({ userId: loadedUser._id.toString(), token: token });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "unable to login";
      next(err);
    });
};
