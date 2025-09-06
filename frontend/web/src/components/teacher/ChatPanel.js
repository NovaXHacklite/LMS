import React, { useState } from 'react';

const ChatPanel = () => {
  const students = [
    { grade: '10', index: 'S001', name: 'Ayesha' },
    { grade: '11', index: 'S002', name: 'Nuwan' }
  ];

  const [selectedStudent, setSelectedStudent] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div>
      <h3>Chat Panel</h3>

      <label>Select Student:</label>
      <select onChange={(e) => setSelectedStudent(e.target.value)}>
        <option value="">-- Select --</option>
        {students.map((s) => (
          <option key={s.index} value={s.index}>
            {s.name} (Grade {s.grade})
          </option>
        ))}
      </select>

      {selectedStudent && (
        <div style={{ marginTop: '20px' }}>
          <textarea
            rows="3"
            cols="50"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <br />
          <input type="file" accept="image/*" />
          <br />
          <button>😊</button>
          <button>👍</button>
          <button>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
