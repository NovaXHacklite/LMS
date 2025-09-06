"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    CheckCircle,
    XCircle,
    Clock,
    Trophy,
    Star,
    Target,
    ArrowRight,
    RotateCcw,
    Lightbulb,
    Volume2,
    VolumeX
} from "lucide-react";
import { useTimer } from "react-timer-hook";
import { useAuth } from "../../services/AuthContext";

const QuizWindow = ({ userId }) => {
    const { user } = useAuth();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [loading, setLoading] = useState(false);

    // Mock quiz data - replace with API call
    const [quizData] = useState([
        {
            id: 1,
            subject: "Algebra Basics",
            question: "What is the value of x in the equation 2x + 3 = 11?",
            options: ["2", "3", "4", "5"],
            correctAnswer: "4",
            hint: "Subtract 3 from both sides first, then divide by 2",
            explanation: "2x + 3 = 11 → 2x = 11 - 3 → 2x = 8 → x = 4",
            difficulty: "Beginner",
            points: 10
        },
        {
            id: 2,
            subject: "Algebra Basics",
            question: "Simplify: 3(x + 2) - 5",
            options: ["3x + 1", "3x + 6", "3x - 1", "3x - 3"],
            correctAnswer: "3x + 1",
            hint: "Distribute the 3 first, then combine like terms",
            explanation: "3(x + 2) - 5 = 3x + 6 - 5 = 3x + 1",
            difficulty: "Beginner",
            points: 10
        },
        {
            id: 3,
            subject: "Algebra Basics",
            question: "If y = 2x + 1 and x = 3, what is the value of y?",
            options: ["6", "7", "8", "9"],
            correctAnswer: "7",
            hint: "Substitute x = 3 into the equation",
            explanation: "y = 2x + 1 = 2(3) + 1 = 6 + 1 = 7",
            difficulty: "Intermediate",
            points: 15
        },
        {
            id: 4,
            subject: "Algebra Basics",
            question: "What is the slope of the line y = -3x + 5?",
            options: ["-3", "3", "5", "-5"],
            correctAnswer: "-3",
            hint: "In y = mx + b format, m is the slope",
            explanation: "In the equation y = mx + b, the coefficient of x (m) is the slope. Here m = -3",
            difficulty: "Intermediate",
            points: 15
        },
        {
            id: 5,
            subject: "Algebra Basics",
            question: "Solve for x: x² - 4 = 0",
            options: ["x = 2", "x = ±2", "x = 4", "x = ±4"],
            correctAnswer: "x = ±2",
            hint: "This is a difference of squares: x² - 4 = (x-2)(x+2)",
            explanation: "x² - 4 = 0 → x² = 4 → x = ±√4 = ±2",
            difficulty: "Advanced",
            points: 20
        }
    ]);

    // Timer setup (5 minutes)
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 300);
    const { seconds, minutes, isRunning, start, pause, restart } = useTimer({
        expiryTimestamp,
        onExpire: () => {
            setFeedback("Time's up! Quiz completed.");
            setQuizCompleted(true);
        },
    });

    useEffect(() => {
        if (quizData.length > 0 && !isRunning) {
            start();
        }
    }, [quizData, isRunning, start]);

    // Play sound effect
    const playSound = (type) => {
        if (!soundEnabled) return;
        // This would use howler.js or Web Audio API in a real implementation
        console.log(`Playing ${type} sound`);
    };

    const question = quizData[currentQuestion];
    const progressPercentage = ((currentQuestion + 1) / quizData.length) * 100;

    const handleAnswer = (option) => {
        setSelectedAnswer(option);
        const isCorrect = option === question.correctAnswer;
        const points = isCorrect ? question.points : 0;

        setFeedback(isCorrect ? "Correct! Well done!" : "Incorrect, but keep trying!");
        setScore(prevScore => prevScore + points);
        setAnsweredQuestions(prev => [...prev, {
            questionId: question.id,
            selectedAnswer: option,
            isCorrect,
            points
        }]);

        // Play sound feedback
        playSound(isCorrect ? 'correct' : 'incorrect');

        // Auto-show explanation for incorrect answers
        if (!isCorrect) {
            setTimeout(() => setShowExplanation(true), 1000);
        }
    };

    const handleNext = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setFeedback(null);
            setShowHint(false);
            setShowExplanation(false);
        } else {
            setQuizCompleted(true);
            pause();
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setFeedback(null);
        setScore(0);
        setAnsweredQuestions([]);
        setShowHint(false);
        setShowExplanation(false);
        setQuizCompleted(false);
        restart(expiryTimestamp);
    };

    const getFinalGrade = () => {
        const totalPossiblePoints = quizData.reduce((sum, q) => sum + q.points, 0);
        const percentage = (score / totalPossiblePoints) * 100;

        if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', message: 'Excellent!' };
        if (percentage >= 80) return { grade: 'A', color: 'text-green-500', message: 'Great job!' };
        if (percentage >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good work!' };
        if (percentage >= 60) return { grade: 'C', color: 'text-yellow-500', message: 'Keep practicing!' };
        return { grade: 'D', color: 'text-red-500', message: 'Need more practice!' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    <Brain className="w-8 h-8 text-blue-600" />
                </motion.div>
                <span className="ml-2 text-slate-600">Loading quiz...</span>
            </div>
        );
    }

    if (quizCompleted) {
        const finalGrade = getFinalGrade();

        return (
            <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-slate-200 max-w-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                    >
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
                    <div className={`text-6xl font-bold ${finalGrade.color} mb-2`}>
                        {finalGrade.grade}
                    </div>
                    <p className="text-lg text-slate-600 mb-4">{finalGrade.message}</p>

                    <div className="bg-white rounded-xl p-6 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{score}</div>
                                <div className="text-sm text-slate-600">Total Points</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    {answeredQuestions.filter(q => q.isCorrect).length}/{quizData.length}
                                </div>
                                <div className="text-sm text-slate-600">Correct Answers</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <motion.button
                            onClick={restartQuiz}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Try Again
                        </motion.button>

                        <motion.button
                            onClick={() => window.location.href = '/student'}
                            className="flex items-center gap-2 bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Back to Dashboard
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Brain className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {question.subject}
                        </h3>
                        <p className="text-sm text-slate-600">
                            Level: {question.difficulty}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Sound Toggle */}
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        {soundEnabled ? (
                            <Volume2 className="w-5 h-5 text-slate-600" />
                        ) : (
                            <VolumeX className="w-5 h-5 text-slate-400" />
                        )}
                    </button>

                    {/* Timer */}
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="font-mono font-semibold text-red-600">
                            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                        </span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">
                        Question {currentQuestion + 1} of {quizData.length}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                        Score: {score} pts
                    </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Question */}
            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
            >
                <h4 className="text-lg font-semibold text-slate-800 mb-4">
                    {question.question}
                </h4>

                {/* Answer Options */}
                <div className="space-y-3 mb-4">
                    {question.options.map((option, index) => (
                        <motion.button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            className={`w-full p-4 rounded-xl text-left border-2 transition-all duration-200 ${selectedAnswer === option
                                    ? feedback === "Correct! Well done!"
                                        ? "border-green-500 bg-green-50 text-green-800"
                                        : "border-red-500 bg-red-50 text-red-800"
                                    : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                                }`}
                            disabled={selectedAnswer !== null}
                            whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${selectedAnswer === option
                                        ? feedback === "Correct! Well done!"
                                            ? "border-green-500 bg-green-500 text-white"
                                            : "border-red-500 bg-red-500 text-white"
                                        : "border-slate-300"
                                    }`}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className="font-medium">{option}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${feedback === "Correct! Well done!"
                                    ? "bg-green-50 text-green-800"
                                    : "bg-red-50 text-red-800"
                                }`}
                        >
                            {feedback === "Correct! Well done!" ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="font-medium">{feedback}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hint and Explanation */}
                <div className="flex gap-2 mb-4">
                    {!selectedAnswer && (
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="flex items-center gap-2 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors text-sm"
                        >
                            <Lightbulb className="w-4 h-4" />
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                    )}

                    {selectedAnswer && (
                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm"
                        >
                            <Target className="w-4 h-4" />
                            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                        </button>
                    )}
                </div>

                {/* Hint Content */}
                <AnimatePresence>
                    {showHint && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"
                        >
                            <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-yellow-800">Hint:</p>
                                    <p className="text-sm text-yellow-700">{question.hint}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Explanation Content */}
                <AnimatePresence>
                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4"
                        >
                            <div className="flex items-start gap-2">
                                <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-800">Explanation:</p>
                                    <p className="text-sm text-blue-700">{question.explanation}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Action Button */}
            <motion.button
                onClick={handleNext}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${selectedAnswer
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                disabled={!selectedAnswer}
                whileHover={{ scale: selectedAnswer ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
            >
                {currentQuestion < quizData.length - 1 ? (
                    <>
                        Next Question
                        <ArrowRight className="w-4 h-4" />
                    </>
                ) : (
                    <>
                        Finish Quiz
                        <Trophy className="w-4 h-4" />
                    </>
                )}
            </motion.button>
        </motion.div>
    );
};

export default QuizWindow;
