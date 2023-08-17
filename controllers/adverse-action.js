const AdverseAction = require("../models/adverse-action");
const Candidate = require("../models/candidate");

exports.getAdverseActions = (req, res, next) => {
  AdverseAction.find()
    .populate("candidate", "name")
    .exec()
    .then((result) => {
      return res.status(200).json({
        message: "Fetched Adverse Actions successfully.",
        adverseActions: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createAdverseAction = (req, res, next) => {
  const status = req.body.status;
  const prenoticeDate = req.body.prenoticeDate;
  const postnoticeDate = req.body.postnoticeDate;
  const candidate = req.body.candidate;
  Candidate.findById(candidate)
    .then((res) => {
      if (!res) {
        const error = new Error("Could not find candidate.");
        error.statusCode = 404;
        throw error;
      }
      const adverseAction = new AdverseAction({
        status,
        prenoticeDate,
        postnoticeDate,
        candidate,
      });
      return adverseAction.save();
    })
    .then(() => {
      return res.status(200).json({ message: "Adverse Action created." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
