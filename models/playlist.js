const mongoose = require("mongoose");

const playlistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  channel: { type: mongoose.Schema.ObjectId, ref: "Channel" },
  name: { type: String, required: true },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  photo: { type: String, required: false },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Playlist", playlistSchema);
