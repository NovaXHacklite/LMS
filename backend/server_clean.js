#!/usr/bin/env node

/**
 * LMS Backend Server Entry Point
 * 
 * This file initializes and starts the LMS backend server with all necessary
 * configurations, middleware, and services.
 */

// Load environment variables first
require('dotenv').config();

const App = require('./src/app');

// Initialize and start the application
const app = new App();
app.listen();

// Export for testing purposes
module.exports = app;
