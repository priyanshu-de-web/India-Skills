const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  region_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Attraction", attractionSchema);
