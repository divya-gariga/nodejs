const Candidate = require("../models/candidate");
const CourtSearch = require("../models/court-search");
const AdverseAction = require("../models/adverse-action");

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

exports.getCandidate = (req, res, next) => {
  const candidateId = req.params.candidateId;
  Candidate.findById(candidateId)
    .then((candidate) => {
      if (!candidate) {
        const error = new Error("Could not find candidate.");
        error.statusCode = 404;
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
    reports: reports,
  });
  candidate
    .save()
    .then((result) => {
      console.log("Created Candidate");
      return res
        .status(201)
        .json({ message: "Candidate created successfully", data: result });
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
        const error = new Error("Could not find candidate.");
        error.statusCode = 404;
        throw error;
      }
      await CourtSearch.deleteMany({ candidateId: candidateId });
      await AdverseAction.deleteMany({ candidate: candidateId });
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
  const candidateId = req.params.candidateId;
  Candidate.findById(candidateId)
    .then((candidate) => {
      if (!candidate) {
        const error = new Error("Could not find candidate.");
        error.statusCode = 404;
        throw error;
      }
      const candidateReport = candidate.reports;
      return res
        .status(200)
        .json({ message: "report fetched.", data: candidateReport });
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
  const candidateId = req.params.candidateId;
  Candidate.findById(candidateId)
    .then(async (candidate) => {
      if (!candidate) {
        const error = new Error("Could not find candidate.");
        error.statusCode = 404;
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
