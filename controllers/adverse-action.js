const { validationResult } = require("express-validator");

const { AdverseAction } = require("../models/adverse-action");
const Candidate = require("../models/candidate");
exports.getAdverseActions = async (req, res, next) => {
  try {
    const adverseActions = await AdverseAction.find()
      .populate("candidate", "name user")
      .exec();
    if (!adverseActions) {
      const error = new Error('Fetching Adverse Actions Failed.');
      throw error;
    }
    const userAdverseActions = adverseActions.filter((action) =>
      (action.candidate.user)==(req.userId)
    );
    return res.status(200).json({
      message: "Fetched Adverse Actions successfully.",
      data: userAdverseActions,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    if (!err.message) err.message = "Fetching Adverse Actions Failed.";
    next(err);
  }
};

exports.createAdverseAction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array().map((error) => error.msg);
      throw error;
    }
    const status = req.body.status;
    const prenoticeDate = req.body.prenoticeDate;
    const postnoticeDate = req.body.postnoticeDate;
    const candidate = req.body.candidate;
    const result = await Candidate.findById(candidate);
    if (!result) {
      const error = new Error();
      error.statusCode = 404;
      error.data = ['Could not find candidate.'];
      throw error;
    }
    
    if (result.user.toString() !== req.userId) {
      const unauthorizedError = new Error();
      unauthorizedError.statusCode = 403;
      unauthorizedError.data=['Not authorized']
      throw unauthorizedError;
    }
    const adverseAction = new AdverseAction({
      status,
      prenoticeDate,
      postnoticeDate,
      candidate,
    });
    await adverseAction.save();
    return res.status(200).json({ message: "Adverse Action created." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    if (!err.message) err.message = "Creating Adverse Actions Failed.";
    next(err);
  }
};