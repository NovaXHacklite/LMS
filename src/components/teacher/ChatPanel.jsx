import React, { useState } from 'react';

const ChatPanel = () => {
  const students = [
    { grade: '10', index: 'S001', name: 'Ayesha' },
    { grade: '11', index: 'S002', name: 'Nuwan' }
  ];

  const [selectedStudent, setSelectedStudent] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-[#03045E] mb-4">Chat Panel</h2>
      <p className="text-[#0077B6] mb-6">Use this panel to communicate with students directly.</p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <label className="block mb-2 text-[#0077B6] font-medium">Select Student:</label>
        <select
          className="w-full border border-[#90E0EF] rounded-md px-3 py-2 mb-4"
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select --</option>
          {students.map((s) => (
            <option key={s.index} value={s.index}>
              {s.name} (Grade {s.grade})
            </option>
          ))}
        </select>

        {selectedStudent && (
          <div className="mt-4">
            <textarea
              rows="4"
              className="w-full border border-[#90E0EF] rounded-md px-3 py-2 mb-3"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input type="file" accept="image/*" className="mb-3" />
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[#CAF0F8] rounded">😊</button>
              <button className="px-3 py-1 bg-[#CAF0F8] rounded">👍</button>
              <button
                className="px-4 py-2 bg-[#00B4D8] text-white rounded hover:bg-[#0077B6]"
                onClick={() => {
                  console.log(`Message to ${selectedStudent}: ${message}`);
                  setMessage('');
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
