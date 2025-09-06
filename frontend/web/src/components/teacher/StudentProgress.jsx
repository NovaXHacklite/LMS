import React from "react";

const StudentProgress = ({ students = [] }) => (
  <section className="p-4 border rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-2">Student Progress</h2>
    {students.length === 0 ? (
      <p>No student data available.</p>
    ) : (
      <ul>
        {students.map((s) => (
          <li key={s.id || Math.random()} className="mb-2">
            <strong>{s.name || "Unknown"}</strong> ({s.category || "N/A"}) - {s.subject || "N/A"}
            <div className="w-full bg-gray-200 rounded h-4 mt-1">
              <div
                className="bg-green-500 h-4 rounded"
                style={{ width: `${s.progress || 0}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default StudentProgress;
