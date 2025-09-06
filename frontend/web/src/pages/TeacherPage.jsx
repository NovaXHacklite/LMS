import React, { useState } from 'react';
import Sidebar from '../components/common/sidebar';
import Navbar from '../components/common/navbar';
import TeacherHome from '../components/teacher/TeacherHome';
import SubjectManager from '../components/teacher/SubjectManager';
import NotesPanel from '../components/teacher/NotesPanel';
import SettingsPage from '../components/teacher/SettingsPage';
import CalendarView from '../components/teacher/CalendarView';

const NAVBAR_HEIGHT = 64;

const TeacherPage = ({ user }) => {
    const [activeTab, setActiveTab] = useState('home');

    let MainContent;
    switch (activeTab) {
        case 'home':
            MainContent = <TeacherHome user={user} />;
            break;
        case 'subject':
            MainContent = <SubjectManager userId={user?.id} />;
            break;
        case 'notes':
            MainContent = <NotesPanel userId={user?.id} />;
            break;
        case 'settings':
            MainContent = <SettingsPage user={user} />;
            break;
        case 'calendar':
            MainContent = <CalendarView userId={user?.id} />;
            break;
        default:
            MainContent = <TeacherHome user={user} />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Navbar userName={user?.name} userType={user?.role} />
            <div style={{ display: 'flex', flex: 1, marginTop: NAVBAR_HEIGHT }}>
                <Sidebar
                    type="teacher"
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

export default TeacherPage;
