const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courtSearchStatusEnum = ["CLEAR", "CONSIDER"];

const courtSearchSchema = new Schema({
  search: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: courtSearchStatusEnum,
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

const CourtSearch = mongoose.model("CourtSearch", courtSearchSchema)

module.exports = {
  CourtSearch,
  courtSearchStatusEnum
}