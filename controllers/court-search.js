const { validationResult } = require("express-validator");

const { CourtSearch } = require("../models/court-search");
const Candidate = require("../models/candidate");

exports.getCourtSearches = (req, res, next) => {
  CourtSearch.find()
    .then((result) => {
      return res.status(200).json({
        message: "Fetched court searches successfully.",
        data: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Fetching court searches Failed.";
      next(err);
    });
};

exports.createCourtSearches = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array().map((error) => error.msg);
    throw error;
  }
  const search = req.body.search;
  const status = req.body.status;
  const date = req.body.date;
  const candidateId = req.body.candidateId;
  Candidate.findOne({ _id: candidateId })
    .then((candidate) => {
      if (!candidate) {
        const error = new Error();
        error.statusCode = 404;
        error.data = ["Could not find candidate."];
        throw error;
      }
      if (candidate.user.toString() !== req.userId) {
        const error = new Error("Forbidden access!");
        error.statusCode = 403;
        error.data = ["Not Authorized!"];
        throw error;
      }
      const courtSearch = new CourtSearch({
        search,
        status,
        date,
        candidateId,
      });
      return courtSearch.save();
    })
    .then(() => {
      return res.status(200).json({ message: "court search created." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Creating court searches Failed.";
      next(err);
    });
};

exports.getCourtSearchesByCandId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array().map((error) => error.msg);
    throw error;
  }
  const candidateId = req.params.candidateId;
  Candidate.findById(candidateId)
    .then((candidate) => {
      if (!candidate) {
        const error = new Error();
        error.statusCode = 404;
        error.data = ["Could not find candidate."];
        throw error;
      }
      if (candidate.user.toString() !== req.userId) {
        const error = new Error("Forbidden access!");
        error.statusCode = 403;
        error.data = ["Not Authorized!"];
      }
      return CourtSearch.find({ candidateId: candidateId });
    })
    .then((result) => {
      return res.status(200).json({
        message: "court searches fetched for given candidate id.",
        data: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Fetching court searches Failed.";
      next(err);
    });
};
