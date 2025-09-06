import React from 'react';

const NotesPanel = ({ userId }) => {
  return (
    <div>
      <h2>Notes Panel</h2>
      <p>View and organize notes for your lessons. (User ID: {userId})</p>
    </div>
  );
};

export default NotesPanel;
