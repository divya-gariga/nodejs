const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["CLEAR", "CONSIDER"],
      default: "CLEAR",
    },
    adjudication: {
      type: String,
      enum: ["", "ENGAGED", "ADVERSE ACTION"],
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
exports.reportSchema = reportSchema;
exports.reportModel = reportModel;
