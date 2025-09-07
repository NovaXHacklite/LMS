import React, { useState } from 'react';

const NotesPanel = ({ userId }) => {
  const [lessonNotes, setLessonNotes] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    officeHours: ''
  });
  

  const handleSave = () => {
    console.log('Saved Notes:', lessonNotes);
    console.log('Saved Edits:', editNotes);
    console.log('Contact Info:', contactInfo);
    alert('Notes and contact details saved.');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-[#03045E] mb-4">Notes Panel</h2>
      <p className="text-[#0077B6] mb-6">Manage your lesson notes and contact details. (User ID: {userId})</p>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Lesson Notes */}
        <div>
          <label className="block text-[#0077B6] font-medium mb-2">Lesson Notes:</label>
          <textarea
            rows="5"
            className="w-full border border-[#90E0EF] rounded-md px-3 py-2"
            placeholder="Write your lesson notes here..."
            value={lessonNotes}
            onChange={(e) => setLessonNotes(e.target.value)}
          />
        </div>

        {/* Editable Comments */}
        <div>
          <label className="block text-[#0077B6] font-medium mb-2">Edits / Annotations:</label>
          <textarea
            rows="4"
            className="w-full border border-[#90E0EF] rounded-md px-3 py-2"
            placeholder="Add any edits or personal annotations..."
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
          />
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-xl font-semibold text-[#03045E] mb-2">Contact Details</h3>
          <div className="space-y-3">
            <input
              type="email"
              className="w-full border border-[#90E0EF] rounded-md px-3 py-2"
              placeholder="Email address"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            />
            <input
              type="tel"
              className="w-full border border-[#90E0EF] rounded-md px-3 py-2"
              placeholder="Phone number"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            />
            <input
              type="text"
              className="w-full border border-[#90E0EF] rounded-md px-3 py-2"
              placeholder="Office hours (e.g., Mon–Fri 9am–3pm)"
              value={contactInfo.officeHours}
              onChange={(e) => setContactInfo({ ...contactInfo, officeHours: e.target.value })}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button
            className="px-6 py-2 bg-[#00B4D8] text-white rounded hover:bg-[#0077B6]"
            onClick={handleSave}
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
