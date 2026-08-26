const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    bio: {
        type: String,
        required: true,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('About', aboutSchema);