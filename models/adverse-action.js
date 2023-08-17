const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adverseActionSchema = new Schema({
  status: {
    type: String,
    enum: ["SCHEDULED", "CLEAR"],
    default:"SCHEDULED",
    required: true,
  },
  prenoticeDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  postnoticeDate: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Candidate",
  },
});

module.exports = mongoose.model("AdverseAction", adverseActionSchema);
