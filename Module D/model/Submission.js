const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String },
  interests: { type: String },
  message: { type: String, required: true },
  submitted_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
