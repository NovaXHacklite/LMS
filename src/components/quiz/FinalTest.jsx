import React, { useState } from "react";
import { finalTestQuestions } from "../../data/lessonsData";

const FinalTest = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const total = finalTestQuestions.length;

  const handleSelect = (i, opt) => setAnswers({ ...answers, [i]: opt });

  const submit = () => {
    const correct = finalTestQuestions.reduce(
      (acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc),
      0
    );
    const percentage = Math.round((correct / total) * 100);
    onComplete({ correct, percentage });
  };

  const progress = (Object.keys(answers).length / total) * 100;

  return (
    <div className="max-w-4xl mx-auto px-6 mt-6">
      <div className="bg-white/60 rounded-2xl shadow-lg border border-[#CAF0F8] overflow-hidden">
        <div className="bg-[#F8FAFC]/60 p-6 text-center">
          <h2 className="text-2xl font-bold text-[#03045E] mb-2">Final Assessment</h2>
          <p className="text-[#0077B6]">Test your understanding of the lesson concepts</p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#03045E] font-medium">Progress</span>
              <span className="text-[#0077B6] font-medium">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-[#CAF0F8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] h-2 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="space-y-6">
            {finalTestQuestions.map((q, i) => (
              <div key={i} className="bg-[#F1F5F9]/60 p-4 rounded-xl border border-[#90E0EF]">
                <p className="text-lg font-medium text-[#03045E] mb-4">
                  {i + 1}. {q.q}
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  {q.options.map((opt) => {
                    const selected = answers[i] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelect(i, opt)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
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
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={submit}
              disabled={Object.keys(answers).length !== total}
              className="px-8 py-3 rounded-xl bg-[#03045E] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0077B6] transition-all duration-200"
            >
              Submit Final Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalTest;