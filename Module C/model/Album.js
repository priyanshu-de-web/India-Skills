const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    release_year: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Album", albumSchema);
