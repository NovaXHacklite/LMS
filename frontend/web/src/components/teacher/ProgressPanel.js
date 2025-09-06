import React, { useState } from 'react';

const ProgressPanel = () => {
  const students = [
    { index: 'S001', name: 'Ayesha' },
    { index: 'S002', name: 'Nuwan' }
  ];
  const lessons = ['Algebra', 'Geometry', 'Physics'];

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [comment, setComment] = useState('');

  return (
    <div>
      <h3>Progress Panel</h3>

      <label>Select Student:</label>
      <select onChange={(e) => setSelectedStudent(e.target.value)}>
        <option value="">-- Select --</option>
        {students.map((s) => (
          <option key={s.index} value={s.index}>{s.name}</option>
        ))}
      </select>

      <label>Select Lesson:</label>
      <select onChange={(e) => setSelectedLesson(e.target.value)}>
        <option value="">-- Select --</option>
        {lessons.map((l) => <option key={l}>{l}</option>)}
      </select>

      {selectedStudent && selectedLesson && (
        <div style={{ marginTop: '20px' }}>
          <h4>Progress Chart</h4>
          <div style={{ width: '400px', height: '300px', background: '#ccc', textAlign: 'center', lineHeight: '300px' }}>
            [Chart Placeholder]
          </div>

          <h4>Teacher Comment</h4>
          <textarea
            rows="4"
            cols="50"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <br />
          <button>Submit Comment</button>
        </div>
      )}
    </div>
  );
};

export default ProgressPanel;
