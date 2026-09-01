const mongoose = require('mongoose');

const enrollSchema = mongoose.Schema ({

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    courseName: {
        type: String,
    }
},

   {
    timestamps: true
   }
)

const Enroll = mongoose.model('Enroll', enrollSchema);
module.exports = Enroll