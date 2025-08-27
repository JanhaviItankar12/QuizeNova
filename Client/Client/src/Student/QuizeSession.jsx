
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, ArrowRight, Flag, AlertTriangle } from "lucide-react";

export default function QuizeSession({ quiz, onComplete, onExit }) {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(quiz.time_limit ? quiz.time_limit * 60 : 0); // Handle time_limit possibly being 0 or undefined
    const [showConfirm, setShowConfirm] = useState(false);
    const startTime = useState(Date.now())[0];

    const handleSubmit = useCallback(() => {
        const timeSpent = (Date.now() - startTime) / (1000 * 60); // Convert to minutes
        const finalAnswers = Array.from({ length: quiz.questions.length }, (_, i) => answers[i] ?? -1);
        onComplete(finalAnswers, timeSpent);
    }, [answers, quiz.questions.length, onComplete, startTime]);

    useEffect(() => {
        if (!quiz.time_limit) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quiz.time_limit, handleSubmit]); // Add handleSubmit to dependencies

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (answerIndex) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: answerIndex
        }));
    };

    const nextQuestion = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
    const question = quiz.questions[currentQuestion];
    const answeredCount = Object.keys(answers).length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen p-6 flex items-center justify-center"
        >
            <div className="w-full max-w-4xl">
                {/* Header */}
                <Card className="mb-6 border-0 shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-slate-800">{quiz.title}</CardTitle>
                                <p className="text-slate-600">Question {currentQuestion + 1} of {quiz.questions.length}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                {quiz.time_limit && (
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
                                        }`}>
                                        <Clock className="w-4 h-4" />
                                        <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    onClick={onExit}
                                    className="text-slate-600 hover:text-slate-800"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Exit
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Progress value={progress} className="h-2" />
                            <p className="text-sm text-slate-500 mt-2">
                                {answeredCount} of {quiz.questions.length} questions answered
                            </p>
                        </div>
                    </CardHeader>
                </Card>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="mb-6 border-0 shadow-xl">
                            <CardContent className="p-8">
                                <div className="mb-6">
                                    <Badge variant="outline" className="mb-4">
                                        {question.points || 1} point{(question.points || 1) > 1 ? 's' : ''}
                                    </Badge>
                                    <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                                        {question.question_text}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {question.options.map((option, index) => {
                                        const optionLabel = String.fromCharCode(65 + index); // 65 -> 'A', 66 -> 'B', 67 -> 'C', 68 -> 'D'

                                        return (
                                            <motion.button
                                                key={index}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleAnswerSelect(index)} // still store index
                                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${answers[currentQuestion] === index
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion] === index
                                                            ? 'border-blue-500 bg-blue-500'
                                                            : 'border-slate-300'
                                                        }`}>
                                                        {answers[currentQuestion] === index && (
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium">
                                                        {optionLabel}. {option}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}

                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={prevQuestion}
                                disabled={currentQuestion === 0}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            {currentQuestion === quiz.questions.length - 1 ? (
                                <Button
                                    onClick={() => setShowConfirm(true)}
                                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Flag className="w-4 h-4" />
                                    Submit Quiz
                                </Button>
                            ) : (
                                <Button
                                    onClick={nextQuestion}
                                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Confirmation */}
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <Card className="w-full max-w-md border-0 shadow-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                                    <h3 className="text-lg font-semibold">Submit Quiz?</h3>
                                </div>

                                <p className="text-slate-600 mb-6">
                                    You have answered {answeredCount} of {quiz.questions.length} questions.
                                    Are you sure you want to submit your quiz?
                                </p>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1"
                                    >
                                        Continue Quiz
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        Submit Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

