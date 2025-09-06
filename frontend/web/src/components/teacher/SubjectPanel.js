import React, { useState } from 'react';

const SubjectPanel = () => {
  const subjects = ['Math', 'Science'];
  const lessons = {
    Math: ['Algebra', 'Geometry'],
    Science: ['Physics', 'Biology']
  };

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

  return (
    <div>
      <h3>Subject Panel</h3>

      <label>Select Subject:</label>
      <select onChange={(e) => setSelectedSubject(e.target.value)}>
        <option value="">-- Select --</option>
        {subjects.map((s) => <option key={s}>{s}</option>)}
      </select>

      {selectedSubject && (
        <>
          <label>Select Lesson:</label>
          <select onChange={(e) => setSelectedLesson(e.target.value)}>
            <option value="">-- Select --</option>
            {lessons[selectedSubject].map((l) => <option key={l}>{l}</option>)}
          </select>
        </>
      )}

      {selectedLesson && (
        <div style={{ marginTop: '20px' }}>
          <h4>Upload Materials</h4>
          <input type="file" />
          <button>Upload</button>

          <h4>Create Quiz</h4>
          <button>Create Quiz</button>

          <h4>Assign Homework</h4>
          <button>Create Assignment</button>
        </div>
      )}
    </div>
  );
};

export default SubjectPanel;
