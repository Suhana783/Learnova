const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
    {

        title: {
            type: String,
            default: 'Assignment Submission',
        },

        description: {
            type: String,
            default: '',
        },

        fileUrl: {
            type: String,
            required: true,
        },

        fileType: {
            type: String,
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },

        studentName: {
            type: String,
        },

        studentEmail: {
            type: String,
        },

        status: {
            type: String,
            enum: ['Submitted', 'Under Review', 'Approved'],
            default: 'Submitted',
        },
    },
    {
        timestamps: true,
    }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;