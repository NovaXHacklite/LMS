import React from 'react';
import StudentDashboard from '../components/student/StudentDashboard';
import Sidebar from '../components/common/sidebar';
import Navbar from '../components/common/navbar';

const NAVBAR_HEIGHT = 64;

const StudentPage = ({ user }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar userName={user?.name} userType={user?.role} />
        <div style={{ 
            display: 'flex', 
            flex: 1, 
            marginTop: NAVBAR_HEIGHT // Push content below navbar
        }}>
            <Sidebar type="student" user={user} />
            <div style={{ 
                flex: 1, 
                marginLeft: 280, // Account for sidebar width
                padding: '24px',
                backgroundColor: '#f8fafc',
                minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
            }}>
                <StudentDashboard user={user} />
            </div>
        </div>
    </div>
);

export default StudentPage;
