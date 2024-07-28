const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rname: { type: String, required: true },
  ulink: String,
  desc: { type: String, required: true },
  steps: { type: Array, required: true },
  ingre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
  ctime: { type: Number, required: true },
  playlist: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist" },
  isLike: { type: Boolean, default: false },
  Rpic: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", recipeSchema);
