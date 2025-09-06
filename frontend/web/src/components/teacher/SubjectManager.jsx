import React, { useState } from 'react';

const SubjectManager = () => {
  // Sample data
  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'sci', name: 'Science' }
  ];

  const students = [
    { index: 'S001', name: 'Ayesha' },
    { index: 'S002', name: 'Nuwan' }
  ];

  const lessons = [
    { id: 'L01', title: 'Algebra Basics' },
    { id: 'L02', title: 'Newton’s Laws' }
  ];

  // State
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [view, setView] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [comment, setComment] = useState('');

  // Handlers
  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
    setView(null);
    setSelectedStudent('');
    setSelectedLesson('');
    setComment('');
  };

  const handleSubmitFeedback = () => {
    console.log('Feedback submitted:', {
      subject: selectedSubject,
      student: selectedStudent,
      lesson: selectedLesson,
      comment
    });
    alert('Feedback submitted successfully.');
  };

  // Views
  const renderNavigation = () => (
    <div>
      <h3>Selected Subject: {selectedSubject}</h3>
      <button onClick={() => setView('upload')}>Upload Materials</button>
      <button onClick={() => setView('chat')}>Chat Bot</button>
      <button onClick={() => setView('progress')}>Progress Check</button>
    </div>
  );

  const renderUpload = () => (
    <div>
      <h4>Upload Materials</h4>
      <input type="file" />
      <button>Upload</button>
    </div>
  );

  const renderChatBot = () => (
    <div>
      <h4>Chat Bot</h4>
      <p>Chat interface for subject <strong>{selectedSubject}</strong> goes here.</p>
    </div>
  );

  const renderProgressCheck = () => (
    <div>
      <h4>Progress Check</h4>

      <label>Student:</label>
      <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
        <option value="">-- Select Student --</option>
        {students.map((s) => (
          <option key={s.index} value={s.index}>{s.name}</option>
        ))}
      </select>

      <br />

      <label>Lesson:</label>
      <select value={selectedLesson} onChange={(e) => setSelectedLesson(e.target.value)}>
        <option value="">-- Select Lesson --</option>
        {lessons.map((l) => (
          <option key={l.id} value={l.id}>{l.title}</option>
        ))}
      </select>

      <div style={{ marginTop: '20px' }}>
        <h5>Graphical Analysis</h5>
        <div style={{ width: '400px', height: '300px', background: '#ddd', textAlign: 'center', lineHeight: '300px' }}>
          [Chart Placeholder]
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h5>Teacher Comment</h5>
        <textarea
          rows="4"
          cols="50"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <button onClick={handleSubmitFeedback}>Submit Feedback</button>
      </div>
    </div>
  );

  return (
    <div>
      <h2>Subject Manager</h2>

      <ul>
        {subjects.map((subj) => (
          <li key={subj.id}>
            <button onClick={() => handleSubjectSelect(subj.id)}>{subj.name}</button>
          </li>
        ))}
      </ul>

      {selectedSubject && renderNavigation()}

      {view === 'upload' && renderUpload()}
      {view === 'chat' && renderChatBot()}
      {view === 'progress' && renderProgressCheck()}
    </div>
  );
};

export default SubjectManager;
