import React, { useState } from "react";
import { subjectsByGrade, lessonsData } from "../../data/lessonsData";
import Card from "../components/ui/Card";
import SubjectManager from "../components/teacher/SubjectManager";

const SubjectPanel = () => {
  const [grade, setGrade] = useState(null);
  const [subject, setSubject] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const breadcrumbs = [
    { label: "Dashboard", active: !grade },
    { label: grade ? `Grade ${grade}` : "Grade", active: !!grade && !subject },
    { label: subject || "Subject", active: !!subject && !selectedLesson },
    { label: selectedLesson?.title || "Lesson", active: !!selectedLesson },
  ];

  return (
    <div className="panel">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <ul className="flex gap-2 text-sm text-blue-700 font-medium">
          {breadcrumbs.map((b, i) => (
            <li key={i} className={b.active ? "underline" : ""}>{b.label}</li>
          ))}
        </ul>
      </div>

      {/* Grade Selection */}
      {!grade && (
        <>
          <h2 className="text-2xl font-bold text-[#03045E] mb-4">Select Grade</h2>
          <div className="flex flex-wrap gap-4">
            {[6, 7, 8, 9, 10, 11].map((g) => (
              <Card
                key={g}
                title={`Grade ${g}`}
                subtitle={`${subjectsByGrade[g]?.length || 0} subjects`}
                icon={<span className="text-xl font-bold">{g}</span>}
                onClick={() => setGrade(g)}
              />
            ))}
          </div>
        </>
      )}

      {/* Subject Selection */}
      {grade && !subject && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#03045E]">Subjects for Grade {grade}</h2>
            <button onClick={() => setGrade(null)} className="text-blue-600">← Change Grade</button>
          </div>
          <div className="flex flex-wrap gap-4">
            {(subjectsByGrade[grade] || []).map((s) => (
              <Card
                key={s}
                title={s}
                subtitle={`${lessonsData[s]?.length || 0} lessons`}
                icon={<span className="text-xl">📘</span>}
                onClick={() => setSubject(s)}
              />
            ))}
          </div>
        </>
      )}

      {/* Lesson Selection */}
      {subject && !selectedLesson && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#03045E]">{subject} Lessons</h2>
            <button onClick={() => setSubject(null)} className="text-blue-600">← Change Subject</button>
          </div>
          <div className="flex flex-wrap gap-4">
            {(lessonsData[subject] || []).map((lesson) => (
              <Card
                key={lesson.id}
                title={lesson.title}
                subtitle={lesson.description}
                icon={<span className="text-xl">📗</span>}
                onClick={() => setSelectedLesson(lesson)}
              />
            ))}
          </div>
        </>
      )}

      {/* Lesson Manager */}
      {selectedLesson && (
        <SubjectManager
          lesson={selectedLesson}
          onBack={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
};

export default SubjectPanel;
