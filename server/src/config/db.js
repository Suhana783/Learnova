const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/learnova';
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (error) {
        console.log('Database connection error with primary URI:', error.message);
        if (uri !== 'mongodb://localhost:27017/learnova') {
            try {
                console.log('Attempting fallback to local MongoDB...');
                await mongoose.connect('mongodb://localhost:27017/learnova');
                console.log("MongoDB connected to local instance");
                return;
            } catch (fallbackError) {
                console.log('Local MongoDB fallback also failed:', fallbackError.message);
            }
        }
        process.exit(1);
    }
};

module.exports = connectDB