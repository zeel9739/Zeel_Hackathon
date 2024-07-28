const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    comment: { type: String, required: true },
    time : { type : Date, default: Date.now }
});     

module.exports = mongoose.model('Comment', commentSchema);