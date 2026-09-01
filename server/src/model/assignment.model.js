const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
    {

        fileUrl: {
            type: String,
            required: true,
        },

        fileType: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;