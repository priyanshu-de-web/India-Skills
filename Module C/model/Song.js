const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    album_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
    title: {
      type: String,
      required: true,
    },
    duration_seconds: {
      type: Number,
      required: true,
    },
    order: {
      type: Number,
    },
    label: {
      type: [String],
      default: [],
    },
    is_cover: {
      type: Boolean,
      default: false,
    },
    view_count: {
      type: Number,
      default: 0,
    },
    lyrics: {
      type: String,
    },
    cover_image: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Song", songSchema);
