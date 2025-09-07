import React, { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "../icons/Icons";
import { preQuizQuestions } from "../../data/lessonsData";

const PreLessonQuiz = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const total = preQuizQuestions.length;
  const q = preQuizQuestions[index];
  const percent = Math.round(((index) / total) * 100);

  const selectOption = (opt) => setAnswers({ ...answers, [index]: opt });

  const next = () => {
    if (index < total - 1) setIndex(index + 1);
  };
  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const submit = () => {
    const score = preQuizQuestions.reduce(
      (acc, item, i) => (answers[i] === item.answer ? acc + 1 : acc),
      0
    );
    const percentage = (score / total) * 100;
    let level = "Beginner";
    if (percentage >= 70) level = "Advanced";
    else if (percentage >= 40) level = "Intermediate";

    setSubmitting(true);
    setTimeout(() => onComplete({ level, score, percentage: Math.round(percentage) }), 1000);
  };

  const canSubmit = Object.keys(answers).length === total;

  return (
    <div className="max-w-4xl mx-auto px-6 mt-6">
      <div className="bg-white/60 rounded-2xl shadow-lg border border-[#CAF0F8] overflow-hidden">
        <div className="bg-[#F8FAFC]/60 p-6 text-center">
          <h2 className="text-2xl font-bold text-[#03045E] mb-2">Pre-Lesson Assessment</h2>
          <p className="text-[#0077B6]">Determine your current level to personalize your learning</p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#03045E] font-medium">Question {index + 1} of {total}</span>
              <span className="text-[#0077B6] font-medium">{percent}% Complete</span>
            </div>
            <div className="w-full bg-[#CAF0F8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] h-2 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="bg-[#F1F5F9]/60 p-4 rounded-xl mb-4">
              <p className="text-lg font-medium text-[#03045E] text-center">{q.q}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {q.options.map((opt) => {
                const selected = answers[index] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => selectOption(opt)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 font-medium ${
                      selected
                        ? "bg-[#0077B6] text-white border-[#0077B6] shadow-md"
                        : "bg-white/80 hover:bg-[#CAF0F8]/80 border-[#90E0EF] text-[#03045E] hover:border-[#00B4D8]"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={prev}
              disabled={index === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#90E0EF] text-[#03045E] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#CAF0F8]/80 transition-all font-medium"
            >
              <ArrowLeftIcon />
              Previous
            </button>
            {index < total - 1 ? (
              <button
                onClick={next}
                disabled={!answers[index]}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#0077B6] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00B4D8] transition-all font-medium"
              >
                Next
                <ArrowRightIcon />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!canSubmit || submitting}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#03045E] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0077B6] transition-all font-medium"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Complete Assessment
                    <CheckIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreLessonQuiz;