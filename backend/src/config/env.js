const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Validate required environment variables
const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please check your .env file');
    process.exit(1);
}

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your_actual_openai_api_key_here',
    NODE_ENV: process.env.NODE_ENV || 'development',
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '50mb',
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
};
