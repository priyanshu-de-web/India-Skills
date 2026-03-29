const mongoose = require("mongoose");

const infoItemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  category: { type: String, required: true },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
});

module.exports = mongoose.model("InfoItem", infoItemSchema);
