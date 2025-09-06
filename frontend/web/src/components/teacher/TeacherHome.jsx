import React from 'react';

const TeacherHome = ({ user }) => {
  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <p>This is your teacher dashboard overview.</p>
    </div>
  );
};

export default TeacherHome;
