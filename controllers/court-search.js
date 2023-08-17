const CourtSearch = require("../models/court-search");
const Candidate = require("../models/candidate");

exports.getCourtSearches = (req, res, next) => {
  CourtSearch.find()
    .then((result) => {
      return res.status(200).json({
        message: "Fetched court searches successfully.",
        courtsearches: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createCourtSearches = (req, res, next) => {
  const search = req.body.search;
  const status = req.body.status;
  const date = req.body.date;
  const candidateId = req.body.candidateId;
  Candidate.findOne({ _id: candidateId })
    .then((candidate) => {
      if (!candidate) {
        const error = new Error("Could not find candidate.");
        error.statusCode = 404;
        throw error
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
      next(err);
    });
};

exports.getCourtSearchesByCandId = async (req, res, next) => {
  const candidateId = req.params.candidateId;
  Candidate.findById(candidateId)
    .then((candidate) => {
      if (!candidate) {
        const error = new Error("Could not find candidate.");
        error.statusCode = 404;
        throw error;
      }
      return CourtSearch.find({'candidateId':candidateId})
    })
    .then((result) => {
      return res.status(200).json({
        message: "court searches fetched for given candidate id.",
        courtSearches: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
