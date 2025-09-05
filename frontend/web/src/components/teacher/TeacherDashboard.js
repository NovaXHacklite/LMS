import React from 'react';
import MessageThread from '../MessageThread';

const TeacherDashboard = ({ user }) => (
    <div className="dashboard teacher-dashboard">
        <h2>Welcome, {user?.name || 'Teacher'}!</h2>
        {/* Uploads, analytics, messaging */}
        <div className="dashboard-section">
            <h3>Upload Materials</h3>
            {/* Upload form placeholder */}
            <input type="file" />
            <button>Upload</button>
        </div>
        <div className="dashboard-section">
            <h3>Analytics</h3>
            {/* Analytics charts placeholder */}
            <div style={{ height: 200, background: '#f0f0f0' }}>Analytics Chart</div>
        </div>
        <MessageThread userId={user?.id} />
    </div>
);

export default TeacherDashboard;
