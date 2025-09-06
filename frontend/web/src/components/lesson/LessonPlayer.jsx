import React, { useMemo, useState } from "react";
import { PlayIcon, CheckIcon } from "../icons/Icons";

const LessonPlayer = ({ lesson, level, onFinishRequired }) => {
  const [completed, setCompleted] = useState([]);
  const requiredCount = useMemo(() => {
    if (level === "Advanced") return Math.min(3, lesson.videos.length);
    if (level === "Intermediate") return Math.min(4, lesson.videos.length);
    return lesson.videos.length;
  }, [level, lesson.videos.length]);

  const requiredDone = completed.filter((id) =>
    lesson.videos.findIndex((v) => v.id === id) < requiredCount
  ).length;

  const progressPct = Math.round((requiredDone / requiredCount) * 100);

  const toggleComplete = (id) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Advanced": return "bg-emerald-500";
      case "Intermediate": return "bg-amber-500";
      default: return "bg-[#0077B6]";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 mt-6">
      <div className="bg-white/60 rounded-2xl shadow-lg border border-[#CAF0F8] overflow-hidden">
        <div className="bg-[#F8FAFC]/60 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#03045E] mb-2">{lesson.title}</h2>
              <p className="text-[#0077B6]">{lesson.description}</p>
            </div>
            <div className={`inline-flex items-center px-3 py-1 ${getLevelColor(level)} text-white rounded-lg font-medium shadow-sm`}>
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              {level} Level
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6 bg-[#F1F5F9]/60 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-[#03045E]">Learning Progress</h3>
              <span className="text-xl font-bold text-[#0077B6]">{progressPct}%</span>
            </div>
            <div className="w-full bg-white/80 h-3 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] h-3 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-[#03045E] font-medium">Required videos: {requiredDone}/{requiredCount}</span>
              <span className="text-[#0077B6] font-medium">
                {progressPct === 100 ? "Ready for final test!" : `${requiredCount - requiredDone} more to go`}
              </span>
            </div>
          </div>
          <div className="space-y-6">
            {lesson.videos.map((v, idx) => {
              const isRequired = idx < requiredCount;
              const isDone = completed.includes(v.id);
              return (
                <div
                  key={v.id}
                  className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                    isDone 
                      ? "border-emerald-300 bg-emerald-50/60" 
                      : isRequired 
                        ? "border-[#00B4D8] bg-white/80 shadow-md" 
                        : "border-[#90E0EF] bg-gray-50/60"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <PlayIcon className="w-5 h-5 text-[#0077B6]" />
                          <h3 className="text-lg font-semibold text-[#03045E]">{v.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isRequired 
                              ? "bg-red-100 text-red-700" 
                              : "bg-[#90E0EF] text-[#03045E]"
                          }`}>
                            {isRequired ? "REQUIRED" : "OPTIONAL"}
                          </span>
                        </div>
                        <p className="text-gray-700">{v.description}</p>
                      </div>
                      <button
                        onClick={() => toggleComplete(v.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isDone
                            ? "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
                            : "bg-white/80 border-2 border-[#00B4D8] text-[#0077B6] hover:bg-[#CAF0F8]/80"
                        }`}
                      >
                        {isDone ? (
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-4 h-4" />
                            Completed
                          </div>
                        ) : (
                          "Mark Complete"
                        )}
                      </button>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-lg border-2 border-[#CAF0F8]">
                      <div className="aspect-video w-full">
                        <iframe
                          className="w-full h-full"
                          src={v.url}
                          title={v.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={onFinishRequired}
              disabled={requiredDone < requiredCount}
              className="px-8 py-3 rounded-xl bg-[#03045E] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0077B6] transition-all duration-200"
            >
              {requiredDone < requiredCount 
                ? `Complete ${requiredCount - requiredDone} more videos to continue` 
                : "Start Final Test"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;