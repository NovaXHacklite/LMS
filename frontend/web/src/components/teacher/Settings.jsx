import React from "react";

const Settings = ({ user }) => (
  <section className="p-4 border rounded-lg shadow">
    <h3 className="text-xl font-semibold mb-2">Settings</h3>
    <div className="space-y-2">
      {/* Example: Active/Non-active students */}
      <label className="flex items-center space-x-2">
        <input type="checkbox" />
        <span>Show only active students</span>
      </label>
      {/* Example: Display user role */}
      {user && (
        <div>
          <strong>Logged in as:</strong> {user?.role || "Unknown"}
        </div>
      )}
      {/* Add more settings as needed */}
    </div>
  </section>
);

export default Settings;
