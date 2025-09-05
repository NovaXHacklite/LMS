const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Create indexes for better performance
        await createIndexes();

    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('⚠️  Server will continue running without database connection');
        console.log('📝 Please ensure MongoDB is running and connection string is correct');
        // Don't exit the process, let the server run without DB for now
    }
};

const createIndexes = async () => {
    try {
        const User = require('../models/User');
        const Material = require('../models/Material');
        const Quiz = require('../models/Quiz');
        const Message = require('../models/Message');
        const Analytics = require('../models/Analytics');

        // Create indexes for optimized queries
        await User.createIndexes();
        await Material.createIndexes();
        await Quiz.createIndexes();
        await Message.createIndexes();
        await Analytics.createIndexes();

        console.log('Database indexes created successfully');
    } catch (error) {
        console.error('Error creating indexes:', error.message);
    }
};

module.exports = connectDB;
