const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportStatusEnum = ["CLEAR", "CONSIDER"];
const reportAdjudicationEnum = ["", "ENGAGED", "ADVERSE ACTION"];

const reportSchema = new Schema(
  {
    status: {
      type: String,
      enum: reportStatusEnum,
      default: "CLEAR",
    },
    adjudication: {
      type: String,
      enum: reportAdjudicationEnum,
      default: "",
    },
    package: {
      type: String,
      default: "Employee Pro",
    },
    turnAroundTime: {
      type: String,
      default:"NA"
    }
  },
  {
    timestamps: true,
  }
);

const reportModel = mongoose.model("Report", reportSchema);

module.exports = {
  reportSchema,
  reportModel,
  reportStatusEnum,
  reportAdjudicationEnum
}
