const mongoose = require("mongoose");

const avatarSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  avtname: { type: String, required: true },
  avtpic: { type: String, required: true },
});

module.exports = mongoose.model("Avatar", avatarSchema);
