const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  candidates: [
    {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
