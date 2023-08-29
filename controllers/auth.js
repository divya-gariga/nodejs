const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array().map((error) => error.msg);
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (user) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = ["A user with this email already exists."];
      throw error;
    }
    const hashedPwd = await bcrypt.hash(password, 12);
    const newUser = new User({
      email: email,
      password: hashedPwd,
    });
    const savedUser = await newUser.save();
    return res
      .status(201)
      .json({ message: "User created!", data: { userId: savedUser._id } });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    if (!err.message) err.message = "unable to signup";
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array().map((error) => error.msg);
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("unable to login");
      error.statusCode = 401;
      error.data = ["A user with this email could not be found."];
      throw error;
    }
    loadedUser = user;
    const isEqual = bcrypt.compare(password, user.password);
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
    return res
      .status(200)
      .json({ userId: loadedUser._id.toString(), token: token });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    if (!err.message) err.message = "unable to login";
    next(err);
  }
};