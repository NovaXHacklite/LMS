import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import StudentDashboard from '../components/student/StudentDashboard';
import Sidebar from '../components/common/sidebar';
import Navbar from '../components/common/navbar';
import ProgressTracker from '../components/student/ProgressTracker';
import QuizComponent from '../components/student/QuizComponent';
import ChatbotInterface from '../components/student/ChatbotInterface';
import MessageThread from '../components/student/MessageThread';
import MyLessons from '../components/student/myLessons';
import AssignmentTab from '../components/student/AssignmentTab';

const NAVBAR_HEIGHT = 64;

const StudentPage = () => {
    const { user } = useAuth(); // Get user from AuthContext
    const [activeTab, setActiveTab] = useState('dashboard');

    let MainContent;
    switch (activeTab) {
        case 'dashboard':
            MainContent = <StudentDashboard user={user} />;
            break;
        case 'progress':
            MainContent = <ProgressTracker userId={user?.id} />;
            break;
        case 'quiz':
            MainContent = <QuizComponent userId={user?.id} />;
            break;
        case 'assignments':
            MainContent = <AssignmentTab />;
            break;
        case 'chatbot':
            MainContent = <ChatbotInterface userId={user?.id} />;
            break;
        case 'messages':
            MainContent = <MessageThread userId={user?.id} />;
            break;
        case 'my-lessons':
            MainContent = <MyLessons user={user} />;
            break;
        default:
            MainContent = <StudentDashboard user={user} />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Navbar userName={user?.name} userType={user?.role} />
            <div style={{ display: 'flex', flex: 1, marginTop: NAVBAR_HEIGHT }}>
                <Sidebar
                    type="student"
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <div style={{
                    flex: 1,

                    padding: '24px',
                    backgroundColor: '#f8fafc',
                    minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
                }}>
                    {MainContent}
                </div>
            </div>
        </div>
    );
};

export default StudentPage;
