const AdverseAction = require("../models/adverse-action");
const Candidate = require("../models/candidate");

exports.getAdverseActions = (req, res, next) => {
  AdverseAction.find()
    .populate("candidate", "name user")
    .exec()
    .then((adverseActions) => {
      const userAdverseActions = adverseActions.filter((action) =>
        action.candidate.user.equals(req.userId)
      );
      return res.status(200).json({
        message: "Fetched Adverse Actions successfully.",
        data: userAdverseActions,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (!err.message) err.message = "Fetching Adverse Actions Failed.";
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
      if (res.user.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
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
      if (!err.message) err.message = "Creating Adverse Actions Failed.";
      next(err);
    });
};
