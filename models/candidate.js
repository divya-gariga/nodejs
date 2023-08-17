const mongoose = require("mongoose");
const reportSchema = require("./report").reportSchema;
const Schema = mongoose.Schema;

const candidateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    reports: reportSchema,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);
