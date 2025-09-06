import React, { useState } from "react";
import { subjectsByGrade, lessonsData } from "../../data/lessonsData";
import { BookIcon, CalculatorIcon, ScienceIcon, ComputerIcon } from "../icons/Icons";
import Card from "../ui/Card";
import Breadcrumb from "../ui/Breadcrumb";
import PreLessonQuiz from "../quiz/PreLessonQuiz";
import LessonPlayer from "../lesson/LessonPlayer";
import FinalTest from "../quiz/FinalTest";
import FinalResult from "../quiz/FinalResult";

const LMSApp = () => {
  const [grade, setGrade] = useState(null);
  const [subject, setSubject] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [preQuizResult, setPreQuizResult] = useState(null);
  const [phase, setPhase] = useState("nav");

  const resetToSubjects = () => {
    setSubject(null);
    setLesson(null);
    setPreQuizResult(null);
    setPhase("nav");
  };

  const breadcrumbs = [
    { label: "Home", active: !grade },
    { label: grade ? `Grade ${grade}` : "Grade", active: !!grade && !subject },
    { label: subject || "Subject", active: !!subject && !lesson },
    { label: lesson?.title || "Lesson", active: !!lesson && phase !== "nav" },
  ];

  const subjectIcons = {
    Mathematics: <CalculatorIcon />,
    Science: <ScienceIcon />,
    English: <BookIcon />,
    ICT: <ComputerIcon />,
  };

  // NAV: Grade → Subject → Lesson
  if (phase === "nav") {
    if (!grade) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#CAF0F8]/40 via-[#90E0EF]/40 to-[#00B4D8]/40">
          <Breadcrumb items={breadcrumbs} />
          <section className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#03045E] mb-3">Choose Your Grade Level</h2>
              <p className="text-lg text-[#0077B6] font-medium">Start your personalized learning journey</p>
            </div>
            <div className="flex flex-wrap justify-center">
              {[6, 7, 8, 9, 10, 11].map((g) => (
                <Card 
                  key={g} 
                  title={`Grade ${g}`}
                  subtitle={`${subjectsByGrade[g]?.length || 0} subjects available`}
                  icon={<span className="text-2xl font-bold">{g}</span>}
                  onClick={() => setGrade(g)} 
                />
              ))}
            </div>
          </section>
        </div>
      );
    }

    if (!subject) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#CAF0F8]/40 via-[#90E0EF]/40 to-[#00B4D8]/40">
          <Breadcrumb items={breadcrumbs} />
          <section className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#03045E] mb-2">Grade {grade} Subjects</h2>
                <p className="text-lg text-[#0077B6]">Select a subject to begin learning</p>
              </div>
              <button 
                className="px-4 py-2 bg-white/90 hover:bg-white text-[#0077B6] rounded-lg font-medium transition-all shadow-sm hover:shadow-md" 
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
                  subtitle={`${lessonsData[s]?.length || 0} lessons available`}
                  icon={subjectIcons[s]}
                  onClick={() => setSubject(s)} 
                />
              ))}
            </div>
          </section>
        </div>
      );
    }

    if (!lesson) {
      const options = lessonsData[subject] || [];
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#CAF0F8]/40 via-[#90E0EF]/40 to-[#00B4D8]/40">
          <Breadcrumb items={breadcrumbs} />
          <section className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#03045E] mb-2">{subject} Lessons</h2>
                <p className="text-lg text-[#0077B6]">Choose a lesson to start learning</p>
              </div>
              <button 
                className="px-4 py-2 bg-white/90 hover:bg-white text-[#0077B6] rounded-lg font-medium transition-all shadow-sm hover:shadow-md" 
                onClick={() => setSubject(null)}
              >
                ← Change Subject
              </button>
            </div>
            <div className="flex flex-wrap justify-center">
              {options.length === 0 ? (
                <div className="text-center py-12">
                  <BookIcon className="w-16 h-16 mx-auto mb-4 text-[#0077B6]" />
                  <p className="text-xl text-[#03045E] font-semibold">No lessons available yet for {subject}</p>
                  <p className="text-[#0077B6] mt-2">Check back soon for new content!</p>
                </div>
              ) : (
                options.map((l) => (
                  <Card
                    key={l.id}
                    title={l.title}
                    subtitle={l.description}
                    icon={<BookIcon />}
                    onClick={() => {
                      setLesson(l);
                      setPhase("pre");
                    }}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      );
    }
  }

  // Other phases with background
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CAF0F8]/40 via-[#90E0EF]/40 to-[#00B4D8]/40">
      <Breadcrumb items={breadcrumbs} />
      {phase === "pre" && lesson && (
        <PreLessonQuiz
          onComplete={({ level, score, percentage }) => {
            setPreQuizResult({ level, score, percentage });
            setPhase("lesson");
          }}
        />
      )}
      {phase === "lesson" && lesson && preQuizResult && (
        <LessonPlayer
          lesson={lesson}
          level={preQuizResult.level}
          onFinishRequired={() => setPhase("final")}
        />
      )}
      {phase === "final" && lesson && (
        <FinalTest
          onComplete={(result) => {
            setPreQuizResult((prev) => ({ ...(prev || {}), final: result }));
            setPhase("result");
          }}
        />
      )}
      {phase === "result" && preQuizResult?.final && (
        <FinalResult
          result={preQuizResult.final}
          onRetry={() => setPhase("final")}
          onFinish={() => {
            resetToSubjects();
          }}
        />
      )}
    </div>
  );
};

export default LMSApp;
