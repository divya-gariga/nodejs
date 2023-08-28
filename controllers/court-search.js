const { validationResult } = require("express-validator");

const { CourtSearch } = require("../models/court-search");
const Candidate = require("../models/candidate");
exports.getCourtSearches = async (req, res, next) => {
  try {
    const courtSearches = await CourtSearch.find();
    if (courtSearches) {
      return res.status(200).json({
        message: "Fetched court searches successfully.",
        data: courtSearches,
      });
    } else {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    if (!err.message) err.message = "Fetching Adverse Actions Failed.";
    next(err);
  }
};
exports.createCourtSearches = async (req, res, next) => {
  try {
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

    const candidate = await Candidate.findOne({ _id: candidateId });

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

    await courtSearch.save();

    return res.status(200).json({ message: "court search created." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    if (!err.message) err.message = "Creating court searches Failed.";
    next(err);
  }
};
exports.getCourtSearchesByCandId = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array().map((error) => error.msg);
      throw error;
    }
    const candidateId = req.params.candidateId;
    const candidate = await Candidate.findById(candidateId);
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
    const courtSearches = await CourtSearch.find({ candidateId: candidateId });
    if (courtSearches) {
      return res.status(200).json({
        message: "court searches fetched for given candidate id.",
        data: courtSearches,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    if (!err.message) err.message = "Fetching court searches Failed.";
    next(err);
  }
};