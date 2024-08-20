const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    email: {
        type: String,
        required: true
    },
    problemStatement: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    error: {
        type: String,
        required: true
    }
}, {
    timestamps: true // This adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Post', postSchema);
