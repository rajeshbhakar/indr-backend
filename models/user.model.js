const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    mobile: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    coins: {
        type: Number,
        default: 1000
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("User", userSchema);
