import React from 'react';
import QuizComponent from './QuizComponent';
import ChatbotInterface from './ChatbotInterface';
import ProgressTracker from './ProgressTracker';
import MessageThread from './MessageThread';

const StudentDashboard = ({ user }) => (
    <div className="dashboard student-dashboard">
        <h2>Welcome, {user?.name || 'Student'}!</h2>
        <ProgressTracker userId={user?.id} />
        <QuizComponent userId={user?.id} />
        <ChatbotInterface userId={user?.id} />
        <MessageThread userId={user?.id} />
    </div>
);

export default StudentDashboard;
