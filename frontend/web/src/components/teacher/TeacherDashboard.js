import React, { useState } from 'react';
import SubjectPanel from './SubjectPanel';
import ChatPanel from './ChatPanel';
import ProgressPanel from './ProgressPanel';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('subject');

  const renderContent = () => {
    switch (activeTab) {
      case 'subject':
        return <SubjectPanel />;
      case 'chat':
        return <ChatPanel />;
      case 'progress':
        return <ProgressPanel />;
      default:
        return <SubjectPanel />;
    }
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <div>
        <button onClick={() => setActiveTab('subject')}>Subject</button>
        <button onClick={() => setActiveTab('chat')}>Chat</button>
        <button onClick={() => setActiveTab('progress')}>Progress</button>
      </div>
      <hr />
      {renderContent()}
    </div>
  );
};

export default TeacherDashboard;

