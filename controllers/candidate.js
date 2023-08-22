const { validationResult } = require("express-validator");

const Candidate = require("../models/candidate");
const CourtSearch = require("../models/court-search");
const AdverseAction = require("../models/adverse-action");
const User = require("../models/user");

exports.getCandidates = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 2;
  let totalItems;
  Candidate.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Candidate.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((candidates) => {
      return res.status(200).json({
        message: "Fetched candidates successfully.",
        data: candidates,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Fetching Candidates Failed.";
      next(err);
    });
};

exports.getCandidatesByUser = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 2;
  let totalItems;
  Candidate.find({ user: req.userId })
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Candidate.find({ user: req.userId })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((candidates) => {
      return res.status(200).json({
        message: "Fetched candidates successfully.",
        data: candidates,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Fetching Candidates Failed.";
      next(err);
    });
};

exports.getCandidate = (req, res, next) => {
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
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      return res
        .status(200)
        .json({ message: "candidate fetched.", data: candidate });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Fetching Candidates Failed.";
      next(err);
    });
};

exports.createCandidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array().map((error) => error.msg);
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const dob = req.body.dob;
  const location = req.body.location;
  const zipCode = req.body.zipCode;
  const socialSecurity = req.body.socialSecurity;
  const driverLicense = req.body.driverLicense;
  const reports = req.body.reports || {};
  const candidate = new Candidate({
    name: name,
    email: email,
    phone: phone,
    dob: dob,
    location: location,
    zipCode: zipCode,
    socialSecurity: socialSecurity,
    driverLicense: driverLicense,
    user: req.userId,
    reports: reports,
  });
  candidate
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.candidates.push(candidate);
      return user.save();
    })
    .then((result) => {
      console.log("Created Candidate");
      return res
        .status(201)
        .json({ message: "Candidate created successfully"});
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Creating Candidates Failed.";
      next(err);
    });
};

exports.deleteCandidate = (req, res, next) => {
  const candidateId = req.params.candidateId;
  Candidate.findByIdAndDelete(candidateId)
    .then(async (candidate) => {
      if (!candidate) {
        const error = new Error();
        error.statusCode = 404;
        error.data=["Could not find candidate."]
        throw error;
      }
      if (candidate.user.toString() !== req.userId) {
        const error = new Error();
        error.statusCode = 403;
        error.data=["Not authorized!"];
        throw error;
      }
      await CourtSearch.deleteMany({ candidateId: candidateId });
      await AdverseAction.deleteMany({ candidate: candidateId });
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.candidates.pull(candidateId);
      return user.save();
    })
    .then((result) => {
      return res.status(200).json({ message: "candidate deleted." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Deleting Candidates Failed.";
      next(err);
    });
};

exports.getReportByCandId = (req, res, next) => {
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
        const error = new Error("Could not find candidate.");
        error.statusCode = 404;
        throw error;
      }
      if (candidate.user.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      const candidateReports = candidate.reports;
      return res
        .status(200)
        .json({ message: "report fetched.", data: candidateReports });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Fetching Reports Failed.";
      next(err);
    });
};

exports.updateReportByCandId = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array().map((error) => error.msg);
    throw error;
  }
  const candidateId = req.params.candidateId;
  Candidate.findById(candidateId)
    .then(async (candidate) => {
      if (!candidate) {
        const error = new Error("Could not find candidate.");
        error.statusCode = 404;
        throw error;
      }
      if (candidate.user.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      const report = candidate.reports;
      report.set(req.body);
      await candidate.save();
      return res.status(200).json({ message: "updated report" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Updating Reports Failed.";
      next(err);
    });
};
