const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    username: { unique: true, type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    bio: String,
    avtid: { type: mongoose.Schema.Types.ObjectId, ref: 'Avatar' },
    password: { type: String, required: true },
    phone_no: Number,
    notification: { type: Boolean, default: true },
    favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    emailToken: { type: String },
    isVerified: { type: Boolean },
    time: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('User', userSchema);