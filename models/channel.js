const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    channelname: { unique: true, type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    channel_bio: String,
    avtid: { type: mongoose.Schema.Types.ObjectId, ref: 'Avatar' },
    password: { type: String, required: true },
    phone_no: Number,
    recipe_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    emailToken: { type: String },
    isVerified: { type: Boolean },
    time: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Channel', channelSchema);