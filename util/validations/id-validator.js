const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");

exports.validateObjectId = (id) => {
  return (req, res, next) => {
    const objectId = req.params[id] || req.body[id];
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
      const error = new Error("Validation Failed!");
      error.statusCode = 422;
      error.data = ["Invalid ID format"];
      throw error;
    }
    next();
  };
};
