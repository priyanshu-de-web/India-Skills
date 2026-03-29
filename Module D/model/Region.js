const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  key: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  summary: { type: String, required: true },
});

module.exports = mongoose.model("Region", regionSchema);
