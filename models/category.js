const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  isMore: { type: Boolean, default: false },
  name: { type: String, required: true },
  photo: { type: String, required: true },
});

module.exports = mongoose.model("Category", categorySchema);
