import React from "react";
import { BookIcon, CheckIcon, StarIcon } from "../icons/Icons";
import { finalTestQuestions } from "../../data/lessonsData";

const FinalResult = ({ result, onRetry, onFinish }) => {
  const getResultColor = (percentage) => {
    if (percentage >= 70) return "bg-emerald-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const getResultIcon = (percentage) => {
    if (percentage >= 70) return <StarIcon className="w-16 h-16 text-white" />;
    if (percentage >= 40) return <CheckIcon className="w-16 h-16 text-white" />;
    return <BookIcon className="w-16 h-16 text-white" />;
  };

  return (
    <div className="max-w-2xl mx-auto px-6 mt-6">
      <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] overflow-hidden text-center">
        <div className={`${getResultColor(result.percentage)} p-8`}>
          <div className="mb-4 flex justify-center">{getResultIcon(result.percentage)}</div>
          <h2 className="text-2xl font-bold text-white mb-2">Assessment Complete!</h2>
          <div className="text-white/90">
            Your Score: <span className="font-bold text-xl">{result.percentage}%</span>
          </div>
          <div className="text-white/80 text-sm">
            {result.correct} out of {finalTestQuestions.length} questions correct
          </div>
        </div>
        <div className="p-6 bg-[#f8fafc]">
          <div className="mb-6">
            <p className="text-[#374151] leading-relaxed">
              {result.percentage >= 70
                ? "Outstanding! You've mastered this topic. You're ready to tackle more advanced concepts!"
                : result.percentage >= 40
                ? "Good work! You're making solid progress. Review the challenging areas and keep practicing."
                : "Keep going! Learning takes time. Review the lesson materials and try again when you're ready."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={onRetry} 
              className="px-6 py-2 rounded-lg border-2 border-[#e2e8f0] text-[#374151] hover:bg-[#f1f5f9] hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all font-medium"
            >
              Retake Assessment
            </button>
            <button 
              onClick={onFinish} 
              className="px-6 py-2 rounded-lg bg-[#0077B6] text-white hover:bg-[#0ea5e9] transition-all font-medium shadow-sm"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalResult;