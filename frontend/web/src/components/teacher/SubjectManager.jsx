import React, { useState, useEffect } from "react";
import { subjectsByGrade, lessonsData } from "../../data/lessonsData";
import { BookIcon, CalculatorIcon, ScienceIcon, ComputerIcon } from "../icons/Icons";
import Card from "../ui/Card";
import Breadcrumb from "../ui/Breadcrumb";
import ProgressTracker from "../student/ProgressTracker"; 

const SubjectManager = () => {
  const [grade, setGrade] = useState(null);
  const [subject, setSubject] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const breadcrumbs = [
    { label: "Dashboard", active: !grade },
    { label: grade ? `Grade ${grade}` : "Grade", active: !!grade && !subject },
    { label: subject || "Subject", active: !!subject },
  ];

  const subjectIcons = {
    Mathematics: <CalculatorIcon />,
    Science: <ScienceIcon />,
    English: <BookIcon />,
    ICT: <ComputerIcon />,
  };

  useEffect(() => {
    if (subject) {
      // Simulate fetching analytics for selected subject
      const lessons = lessonsData[subject] || [];
      const mockAnalytics = lessons.map((lesson) => ({
        lessonId: lesson.id,
        title: lesson.title,
        views: Math.floor(Math.random() * 100),
        avgPreQuizScore: Math.floor(Math.random() * 50 + 50),
        avgFinalScore: Math.floor(Math.random() * 50 + 50),
        completionRate: Math.floor(Math.random() * 100),
        retryRate: Math.floor(Math.random() * 30),
      }));
      setAnalytics(mockAnalytics);
    }
  }, [subject]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CAF0F8]/40 via-[#90E0EF]/40 to-[#00B4D8]/40">
      <Breadcrumb items={breadcrumbs} />
      <section className="max-w-7xl mx-auto px-6 py-8">
        {!grade ? (
          <>
            <h2 className="text-3xl font-bold text-[#03045E] mb-4">Select Grade to View Subjects</h2>
            <div className="flex flex-wrap justify-center">
              {[6, 7, 8, 9, 10, 11].map((g) => (
                <Card
                  key={g}
                  title={`Grade ${g}`}
                  subtitle={`${subjectsByGrade[g]?.length || 0} subjects`}
                  icon={<span className="text-2xl font-bold">{g}</span>}
                  onClick={() => setGrade(g)}
                />
              ))}
            </div>
          </>
        ) : !subject ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-[#03045E]">Subjects for Grade {grade}</h2>
              <button
                className="px-4 py-2 bg-white text-[#0077B6] rounded-lg font-medium shadow-sm hover:shadow-md"
                onClick={() => setGrade(null)}
              >
                ← Change Grade
              </button>
            </div>
            <div className="flex flex-wrap justify-center">
              {(subjectsByGrade[grade] || []).map((s) => (
                <Card
                  key={s}
                  title={s}
                  subtitle={`${lessonsData[s]?.length || 0} lessons`}
                  icon={subjectIcons[s]}
                  onClick={() => setSubject(s)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-[#03045E]">{subject} Analytics</h2>
              <button
                className="px-4 py-2 bg-white text-[#0077B6] rounded-lg font-medium shadow-sm hover:shadow-md"
                onClick={() => setSubject(null)}
              >
                ← Change Subject
              </button>
            </div>
            <SubjectStatsPanel subject={subject} analytics={analytics} />
          </>
        )}
      </section>
    </div>
  );
};

export default SubjectManager;
