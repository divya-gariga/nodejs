const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courtSearchSchema = new Schema({
  search: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["CLEAR", "CONSIDER"],
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Candidate",
  },
});

module.exports = mongoose.model("CourtSearch", courtSearchSchema);
