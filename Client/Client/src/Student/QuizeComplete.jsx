import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Target, CheckCircle, XCircle, Home, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";


export default function QuizeComplete({ results, onReturnToBrowser }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const params=useParams();
  const id=params.id;

   
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return "Outstanding! 🌟";
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 70) return "Great job! 👏";
    if (percentage >= 60) return "Good effort! 👍";
    return "Keep practicing! 💪";
  };

  // Helper function to convert letter to index
  const letterToIndex = (letter) => {
    if (!letter) return -1;
    const letters = ["A", "B", "C", "D"];
    return letters.indexOf(letter);
  };

  const currentQuestion = results.quiz.questions[currentQuestionIndex];
  const userAnswerLetter = results.answers[currentQuestionIndex];
  const correctAnswerLetter = currentQuestion.correct_answer;
  
  // Convert letters to indices for array access
  const userAnswer = letterToIndex(userAnswerLetter);
  const correctAnswer = letterToIndex(correctAnswerLetter);
  const isCorrect = userAnswerLetter === correctAnswerLetter;

  const nextQuestion = () => {
    if (currentQuestionIndex < results.quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen p-6 flex items-center justify-center"
    >
      <div className="w-full max-w-4xl">
        {/* Results Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h1>
          <p className="text-xl text-slate-600">{getPerformanceMessage(results.percentage)}</p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-8 border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <CardTitle className="text-2xl font-bold mb-2">{results.quiz.title}</CardTitle>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {results.quiz.subject.replace('_', ' ')}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {results.quiz.difficulty}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(results.percentage)}`}>
                    {Math.round(results.percentage)}%
                  </div>
                  <div className="text-slate-600">Final Score</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-slate-800">
                    {results.score}/{results.maxScore}
                  </div>
                  <div className="text-slate-600">Points</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-slate-800 flex items-center justify-center gap-1">
                    <Clock className="w-6 h-6" />
                    {Math.round(results.timeSpent)}
                  </div>
                  <div className="text-slate-600">Minutes</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-slate-800">
                    {results.answers.filter((answerLetter, i) => answerLetter === results.quiz.questions[i].correct_answer).length}
                  </div>
                  <div className="text-slate-600">Correct</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Question Review - Updated with Prev/Next Navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Question Review
                </CardTitle>
                <div className="text-sm text-slate-500">
                  {currentQuestionIndex + 1} of {results.quiz.questions.length}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Question Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className={`flex items-center gap-2 ${
                    currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {results.quiz.questions.map((question, index) => {
                    const userAnswerLetter = results.answers[index];
                    const correctAnswerLetter = question.correct_answer;
                    const isQuestionCorrect = userAnswerLetter === correctAnswerLetter;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                          index === currentQuestionIndex
                            ? 'bg-blue-600 text-white'
                            : isQuestionCorrect
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                
                <Button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === results.quiz.questions.length - 1}
                  variant="outline"
                  className={`flex items-center gap-2 ${
                    currentQuestionIndex === results.quiz.questions.length - 1 
                      ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Current Question Display */}
              <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-4 text-lg">
                      {currentQuestionIndex + 1}. {currentQuestion.question}
                    </h4>
                    
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, optionIndex) => {
                        let className = "p-3 rounded-lg border text-sm transition-colors ";
                        
                        if (optionIndex === correctAnswer) {
                          className += "border-green-500 bg-green-50 text-green-700";
                        } else if (optionIndex === userAnswer && userAnswer !== correctAnswer) {
                          className += "border-red-500 bg-red-50 text-red-700";
                        } else {
                          className += "border-slate-200 bg-white text-slate-600";
                        }
                        
                        return (
                          <div key={optionIndex} className={className}>
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              <div className="flex gap-2">
                                {optionIndex === correctAnswer && (
                                  <Badge variant="outline" className="text-green-700 border-green-500">
                                    Correct Answer
                                  </Badge>
                                )}
                                {optionIndex === userAnswer && userAnswer !== correctAnswer && (
                                  <Badge variant="outline" className="text-red-700 border-red-500">
                                    Your Answer
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Answer Summary - Debug Version */}
                    <div className="mt-4 p-3 rounded-lg bg-white border border-slate-300">
                     
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-700">Your Answer:</span>
                          <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {userAnswer !== undefined && currentQuestion.options[userAnswer] ? 
                              currentQuestion.options[userAnswer] : 
                              `Not answered (index: ${userAnswer})`
                            }
                          </span>
                        </div>
                        <div className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </div>
                      </div>
                      
                      {!isCorrect && (
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <span className="font-medium text-slate-700">Correct Answer:</span>
                          <span className="font-medium text-green-600">
                            {correctAnswer !== undefined && currentQuestion.options[correctAnswer] ? 
                              currentQuestion.options[correctAnswer] : 
                              `Index: ${correctAnswer}`
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            onClick={onReturnToBrowser}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            Take Another Quiz
          </Button>
          
          <Link to={`/student/${id}/view-results`}>
            <Button variant="outline" className="px-8">
              <BarChart3 className="w-4 h-4 mr-2" />
              View All Results
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" className="px-8">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}