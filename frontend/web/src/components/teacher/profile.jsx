import React from "react";

const TeacherProfile = ({ user }) => (
  <section className="p-4 border rounded-lg shadow">
    <h3 className="text-xl font-semibold mb-2">Teacher Profile</h3>
    <div className="mb-1"><strong>Name:</strong> {user?.name || "Teacher"}</div>
    <div className="mb-1"><strong>Email:</strong> {user?.email || "teacher@example.com"}</div>
    {/* Add more profile info as needed */}
  </section>
);

export default TeacherProfile;
