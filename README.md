<<<<<<< HEAD
# 🎓 Learning Management System (LMS) - NovaXHacklite

A comprehensive, modern Learning Management System built with cutting-edge technologies to facilitate seamless education delivery, student engagement, and teacher productivity.

## 🌟 Overview

This LMS platform provides a complete solution for educational institutions, featuring an intuitive teacher dashboard with advanced analytics, student management, real-time communication, and AI-powered assistance. The system is designed to enhance the learning experience through personalized content delivery and comprehensive progress tracking.

## 🚀 Key Features

### 📊 **Teacher Dashboard**
- **Comprehensive Analytics Dashboard** - Student performance metrics, engagement analytics, and progress visualization
- **Advanced Lesson Planner** - Drag-and-drop lesson creation with multimedia support
- **Dynamic Gradebook** - Real-time grade management with automated calculations
- **Smart Notification System** - Assignment alerts, deadline reminders, and parent communications
- **Professional Sidebar Navigation** - Scrollable, responsive interface with search functionality
- **Profile Management** - Complete teacher profile customization and settings

### 👨‍🎓 **Student Features**
- **Interactive Learning Dashboard** - Personalized learning paths and progress tracking
- **AI Chatbot Assistant** - Intelligent tutoring and instant help
- **Real-time Chat System** - Communication with teachers and peers
- **Quiz & Assessment Engine** - Interactive quizzes with immediate feedback
- **Progress Tracker** - Visual representation of learning milestones
- **Resource Library** - Access to learning materials and assignments

### 🔧 **Advanced Capabilities**
- **Real-time Communication** - Live messaging and notifications
- **File Upload & Management** - Secure document and media handling
- **Authentication System** - JWT-based secure login with role management
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Data Analytics** - Comprehensive reporting and insights
- **Search Functionality** - Global search across students, materials, and content

## 🛠️ Technology Stack

### **Frontend Technologies**
- **React.js 18** - Modern component-based UI library
- **Framer Motion** - Smooth animations and micro-interactions
- **Tailwind CSS** - Utility-first styling framework
- **Lucide React** - Beautiful, customizable icons
- **React Query** - Efficient data fetching and state management
- **React Router DOM** - Client-side routing and navigation
- **Chart.js & Recharts** - Interactive data visualization
- **React Beautiful DnD** - Drag and drop functionality
- **React Quill** - Rich text editor for content creation
- **LocalForage** - Offline storage capabilities

### **Backend Technologies**
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling library
- **Socket.io** - Real-time bidirectional communication
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **Bcrypt** - Password hashing and security
- **Multer** - File upload middleware
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

### **Development Tools & Libraries**
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-restart
- **Concurrently** - Run multiple commands simultaneously
- **React Scripts** - Create React App build tools

## 📁 Project Structure

```
LMS/
├── 📂 backend/                     # Server-side application
│   ├── 📂 src/
│   │   ├── 📂 controllers/         # Business logic handlers
│   │   │   ├── aiController.js
│   │   │   ├── analyticsController.js
│   │   │   ├── authController.js
│   │   │   ├── materialsController.js
│   │   │   ├── messageController.js
│   │   │   ├── quizController.js
│   │   │   ├── teacherController.js
│   │   │   └── uploadController.js
│   │   ├── 📂 middleware/          # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validation.js
│   │   ├── 📂 models/              # Database schemas
│   │   │   ├── Analytics.js
│   │   │   ├── Material.js
│   │   │   ├── Message.js
│   │   │   ├── Quiz.js
│   │   │   └── User.js
│   │   ├── 📂 routes/              # API endpoints
│   │   │   ├── ai.js
│   │   │   ├── analytics.js
│   │   │   ├── auth.js
│   │   │   ├── materials.js
│   │   │   ├── message.js
│   │   │   ├── quiz.js
│   │   │   ├── teacher.js
│   │   │   └── upload.js
│   │   ├── 📂 services/            # External service integrations
│   │   │   ├── aiService.js
│   │   │   └── storageService.js
│   │   ├── 📂 config/              # Configuration files
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   └── app.js                  # Main application file
│   ├── server.js                   # Server entry point
│   └── package.json                # Backend dependencies
│
├── 📂 frontend/web/                # React web application
│   ├── 📂 public/                  # Static assets
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── 📂 src/
│   │   ├── 📂 components/          # Reusable UI components
│   │   │   ├── 📂 common/          # Shared components
│   │   │   │   ├── navbar.jsx
│   │   │   │   └── sidebar.jsx
│   │   │   ├── 📂 student/         # Student-specific components
│   │   │   │   ├── AIChatbot.jsx
│   │   │   │   ├── DynamicStudentDashboard.jsx
│   │   │   │   ├── ProgressTracker.jsx
│   │   │   │   └── QuizComponent.jsx
│   │   │   ├── 📂 teacher/         # Teacher-specific components
│   │   │   │   ├── AnalyticsDashboard.jsx
│   │   │   │   ├── Gradebook.jsx
│   │   │   │   ├── LessonPlanner.jsx
│   │   │   │   ├── NotificationSystem.jsx
│   │   │   │   └── TeacherDashboard.js
│   │   │   ├── 📂 quiz/            # Quiz system components
│   │   │   ├── 📂 lesson/          # Lesson components
│   │   │   └── 📂 ui/              # UI utility components
│   │   ├── 📂 pages/               # Main page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── StudentPage.jsx
│   │   │   └── TeacherPage.jsx
│   │   ├── 📂 services/            # API and external services
│   │   │   ├── api.js
│   │   │   ├── AuthContext.js
│   │   │   ├── dynamicAPI.js
│   │   │   └── socketService.js
│   │   ├── 📂 hooks/               # Custom React hooks
│   │   │   └── useDynamicData.js
│   │   ├── 📂 context/             # React context providers
│   │   │   └── UserContext.js
│   │   ├── 📂 data/                # Static data and mock data
│   │   ├── 📂 styles/              # CSS and styling files
│   │   │   ├── global.css
│   │   │   └── TeacherDashboard.css
│   │   ├── App.js                  # Main React component
│   │   └── index.js                # React DOM entry point
│   ├── package.json                # Frontend dependencies
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── postcss.config.js           # PostCSS configuration
│
├── start-frontend.bat              # Windows batch file for easy frontend startup
└── README.md                       # Project documentation
```

## 🔄 Project Flow & Architecture

### **1. Authentication Flow**
```
User Login → JWT Token Generation → Role-based Routing → Dashboard Access
```

### **2. Teacher Workflow**
```
Login → Teacher Dashboard → Analytics/Lessons/Gradebook → Student Management → Real-time Communication
```

### **3. Student Workflow**
```
Login → Student Dashboard → Course Access → Quiz/Assignments → Progress Tracking → AI Assistance
```

### **4. Data Flow**
```
Frontend (React) ↔ REST API (Express) ↔ Database (MongoDB)
                 ↕
        Real-time Updates (Socket.io)
```

### **5. Component Hierarchy**
```
App.js
├── AuthContext (Authentication State)
├── UserContext (User Data Management)
├── Router (Page Navigation)
│   ├── LandingPage
│   ├── TeacherPage
│   │   └── TeacherDashboard
│   │       ├── AnalyticsDashboard
│   │       ├── LessonPlanner
│   │       ├── Gradebook
│   │       └── NotificationSystem
│   └── StudentPage
│       └── StudentDashboard
│           ├── AIChatbot
│           ├── ProgressTracker
│           └── QuizComponent
```

## ⚙️ Setup & Installation

### **Prerequisites**
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Git** for version control

### **1. Clone the Repository**
```bash
git clone https://github.com/NovaXHacklite/LMS.git
cd LMS
```

### **2. Backend Setup**
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Configure your environment variables in .env

# Start the backend server
npm start
```

### **3. Frontend Setup**
```bash
cd frontend/web
npm install

# Start the frontend development server
npm start
```

### **4. Quick Start (Windows)**
```bash
# Use the provided batch file for easy frontend startup
start-frontend.bat
```

## 🚀 Running the Application

### **Development Mode**
1. **Backend Server**: `http://localhost:5000`
2. **Frontend Application**: `http://localhost:3000`
3. **Database**: MongoDB connection (local or cloud)

### **Production Deployment**
- **Frontend**: Can be deployed to Vercel, Netlify, or any static hosting
- **Backend**: Compatible with Heroku, AWS, DigitalOcean, or any Node.js hosting
- **Database**: MongoDB Atlas for cloud database

## 🔑 Environment Configuration

### **Backend (.env)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key
```

### **Frontend**
Environment variables can be configured in the React app for API endpoints and external service keys.

## 📊 Features in Detail

### **Analytics Dashboard**
- Real-time student performance metrics
- Interactive charts and graphs
- Engagement analytics
- Progress tracking visualizations
- Exportable reports

### **Lesson Planner**
- Drag-and-drop lesson creation
- Multimedia content integration
- Scheduling and calendar integration
- Template library
- Collaborative planning tools

### **Gradebook**
- Automated grade calculations
- Multiple grading scales
- Grade export functionality
- Parent/student access controls
- Historical grade tracking

### **Communication System**
- Real-time messaging
- Announcement broadcasting
- Parent-teacher communication
- Student discussion forums
- Notification management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**NovaXHacklite** - Development Team
- Project Architecture & Backend Development
- Frontend Development & UI/UX Design
- Database Design & API Development
- Testing & Quality Assurance

## 📞 Support

For support, email support@novaxhacklite.com or join our Slack channel.

## 🔄 Version History

- **v1.0.0** - Initial release with basic LMS functionality
- **v1.1.0** - Added teacher dashboard with advanced features
- **v1.2.0** - Enhanced UI/UX with sidebar navigation and animations
- **v1.3.0** - Implemented search functionality and notification system

---

**Built with ❤️ by NovaXHacklite Team**
