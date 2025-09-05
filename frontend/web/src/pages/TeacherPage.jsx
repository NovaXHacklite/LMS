import React from 'react';
import TeacherDashboard from '../components/teacher/TeacherDashboard';
import Sidebar from '../components/common/sidebar';
import Navbar from '../components/common/navbar';
const TeacherPage = ({ user }) => (
    <>
        <Navbar />
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <TeacherDashboard user={user} />
            </div>
        </div>
    </>
);

export default TeacherPage;
