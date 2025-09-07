import React, { useState } from 'react';
import ProgressPanel from './ProgressPanel';

const TeacherHome = ({ user }) => {
  const [viewProgress, setViewProgress] = useState(false);

  if (viewProgress) {
    return <ProgressPanel userId={user?.id} />;
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        Welcome, {user?.name}
      </h2>

      <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '1.5rem' }}>
        "Education is not the filling of a pail, but the lighting of a fire." – W.B. Yeats
      </p>

      <p style={{ marginBottom: '1rem' }}>
        This dashboard helps you manage lesson notes, student progress, and teaching resources.
      </p>

      <ul style={{ marginBottom: '2rem', paddingLeft: '1.2rem' }}>
        <li>📘 Notes</li>
        <li>📊 Student Progress</li>
        <li>📁 Material Upload</li>
        <li>🤖 ChatPanel</li>
        <li>📝 Assignments</li>
      
      </ul>

      <button
        style={{
          padding: '0.6rem 1.2rem',
          backgroundColor: '#0077B6',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => setViewProgress(true)}
      >
        View Student Progress
      </button>
    </div>
  );
};

export default TeacherHome;
