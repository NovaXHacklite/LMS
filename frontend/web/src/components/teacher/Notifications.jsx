import React from "react";

const Notifications = ({ notifications = [] }) => (
  <section className="p-4 border rounded-lg shadow">
    <h3 className="text-xl font-semibold mb-2">Notifications</h3>
    {notifications.length === 0 ? (
      <p>No notifications.</p>
    ) : (
      <ul className="list-disc pl-6">
        {notifications.map((n) => (
          <li key={n.id || Math.random()}>{n.text || "No text"}</li>
        ))}
      </ul>
    )}
  </section>
);

export default Notifications;
