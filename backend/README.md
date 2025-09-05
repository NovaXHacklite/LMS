# LMS Backend

A comprehensive Learning Management System backend built with Node.js, Express, MongoDB, and AI integration.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control
- 📚 **Quiz Management**: Create, manage, and take adaptive quizzes
- 📁 **File Management**: Upload, store, and manage educational materials
- 💬 **Real-time Messaging**: Socket.IO-powered messaging system
- 📊 **Analytics & Reporting**: Comprehensive learning analytics
- 🤖 **AI Integration**: OpenAI-powered adaptive learning and recommendations
- 🎯 **Personalized Learning**: Adaptive quizzes and study recommendations
- 📈 **Progress Tracking**: Student performance monitoring and insights

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **AI**: OpenAI GPT-3.5/4
- **File Storage**: Multer (local/cloud storage)
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express-validator
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- OpenAI API key (for AI features)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LMS/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Required Environment Variables**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lms_database
   JWT_SECRET=your_super_secure_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or if using MongoDB service
   sudo systemctl start mongod
   ```

6. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `POST /api/v1/auth/change-password` - Change password

### Quiz Management
- `GET /api/v1/quiz` - Get all quizzes
- `POST /api/v1/quiz` - Create new quiz (Teacher/Admin)
- `GET /api/v1/quiz/:id` - Get quiz by ID
- `PUT /api/v1/quiz/:id` - Update quiz (Teacher/Admin)
- `DELETE /api/v1/quiz/:id` - Delete quiz (Teacher/Admin)
- `POST /api/v1/quiz/:id/start` - Start quiz attempt
- `POST /api/v1/quiz/:id/attempts/:attemptId/submit` - Submit quiz

### File Upload & Materials
- `POST /api/v1/upload/material` - Upload learning material
- `GET /api/v1/upload/materials` - Get all materials
- `GET /api/v1/upload/materials/:id` - Get material by ID
- `GET /api/v1/upload/materials/:id/download` - Download material
- `POST /api/v1/upload/materials/:id/like` - Like/unlike material

### Messaging
- `POST /api/v1/messages/send` - Send message
- `GET /api/v1/messages/conversations` - Get conversations
- `GET /api/v1/messages/threads/:threadId/messages` - Get thread messages
- `PUT /api/v1/messages/mark-read` - Mark messages as read

### Analytics
- `GET /api/v1/analytics/student` - Get student analytics
- `GET /api/v1/analytics/class` - Get class analytics (Teacher)
- `GET /api/v1/analytics/system` - Get system analytics (Admin)

### AI Features
- `POST /api/v1/ai/chat` - Chat with AI assistant
- `GET /api/v1/ai/recommendations/study` - Get study recommendations
- `POST /api/v1/ai/quiz/generate` - Generate adaptive quiz
- `GET /api/v1/ai/insights/learning` - Get learning insights

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── env.js               # Environment configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── quizController.js    # Quiz management
│   │   ├── uploadController.js  # File upload handling
│   │   ├── messageController.js # Messaging system
│   │   ├── analyticsController.js # Analytics and reporting
│   │   └── aiController.js      # AI integration
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT authentication
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Quiz.js              # Quiz schema
│   │   ├── Material.js          # Learning material schema
│   │   ├── Message.js           # Message schema
│   │   └── Analytics.js         # Analytics schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── quiz.js              # Quiz routes
│   │   ├── upload.js            # Upload routes
│   │   ├── message.js           # Message routes
│   │   ├── analytics.js         # Analytics routes
│   │   ├── ai.js                # AI routes
│   │   └── index.js             # Route aggregator
│   ├── services/
│   │   ├── aiService.js         # OpenAI integration
│   │   └── storageService.js    # File storage service
│   └── app.js                   # Express app configuration
├── uploads/                     # File upload directory
├── package.json
├── server.js                    # Server entry point
└── .env.example                 # Environment variables template
```

## User Roles

- **Student**: Take quizzes, view materials, messaging, analytics
- **Teacher**: Create quizzes, upload materials, view class analytics
- **Admin**: Full system access, user management, system analytics

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting per endpoint
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Role-based access control

## AI Features

- **Adaptive Quizzes**: AI generates personalized quizzes based on student performance
- **Study Recommendations**: Personalized study suggestions using AI analysis
- **Performance Analysis**: AI-powered insights into learning patterns
- **Content Suggestions**: AI recommends relevant learning materials
- **Chat Assistant**: AI-powered help and guidance

## Real-time Features

- Live messaging between users
- Real-time notifications
- Typing indicators
- Online status
- Quiz session events

## File Upload Support

- **Documents**: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX
- **Images**: JPG, JPEG, PNG, GIF
- **Media**: MP4, MP3
- **Archives**: ZIP
- File size limit: 10MB (configurable)

## Development

```bash
# Run in development mode with auto-restart
npm run dev

# Run tests (when available)
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Environment Variables

Key environment variables that need to be configured:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/lms_database
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key

# Optional but recommended
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
BCRYPT_ROUNDS=12
```

## API Documentation

When `ENABLE_API_DOCS=true`, API documentation will be available at:
- Development: `http://localhost:5000/api/v1/docs`

## Health Check

Health check endpoint is available at:
- `GET /api/v1/health`

## Performance

- Compression middleware for response optimization
- Request ID tracking for debugging
- Response time monitoring
- Connection pooling for database
- Rate limiting for API protection

## Error Handling

- Global error handler with detailed error responses
- Request ID for error tracking
- Environment-specific error details
- Graceful shutdown handling

## Logging

- Development: Console logging with colors
- Production: File-based logging
- Request/response logging
- Error logging with stack traces

## Database Schema

### User Schema
- Authentication fields (email, password)
- Profile information
- Role-based permissions
- Learning levels per subject

### Quiz Schema
- Questions with multiple choice answers
- Difficulty levels and subjects
- Attempt tracking and scoring
- Adaptive quiz support

### Material Schema
- File metadata and storage info
- Subject categorization and tagging
- Analytics (views, downloads, likes)
- Comments and ratings

### Message Schema
- Real-time messaging support
- Thread-based conversations
- Read receipts and reactions
- Broadcast messaging

### Analytics Schema
- Student performance tracking
- Subject-wise progress
- Study goals and achievements
- Learning recommendations

## Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Process Manager**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start server.js --name "lms-backend"
   pm2 startup
   pm2 save
   ```

3. **Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@lms.com or create an issue in the repository.

## Acknowledgments

- OpenAI for AI capabilities
- MongoDB team for the excellent database
- Express.js community
- Socket.IO for real-time features
