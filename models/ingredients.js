const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    isActive: {type:Boolean, default: false}
});

module.exports = mongoose.model('Ingredient', ingredientSchema);