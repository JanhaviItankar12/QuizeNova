import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default function AttemptList({ attempts }) {
  const [currentAttemptIndex, setCurrentAttemptIndex] = useState(0);

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const submissions = attempts?.submissions || [];

  const nextAttempt = () => {
    if (currentAttemptIndex < submissions.length - 1) {
      setCurrentAttemptIndex(currentAttemptIndex + 1);
    }
  };

  const prevAttempt = () => {
    if (currentAttemptIndex > 0) {
      setCurrentAttemptIndex(currentAttemptIndex - 1);
    }
  };

  if (submissions.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            All Quiz Attempts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No quiz attempts yet. Take your first quiz to see results here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentAttempt = submissions[currentAttemptIndex];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            All Quiz Attempts
          </CardTitle>
          <div className="text-sm text-slate-500">
            {currentAttemptIndex + 1} of {submissions.length}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={prevAttempt}
            disabled={currentAttemptIndex === 0}
            variant="outline"
            className={`flex items-center gap-2 ${
              currentAttemptIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex gap-2 max-w-md overflow-x-auto">
            {submissions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAttemptIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  index === currentAttemptIndex
                    ? 'bg-blue-600 text-white'
                    : submissions[index].percentage >= 80
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : submissions[index].percentage >= 60
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <Button
            onClick={nextAttempt}
            disabled={currentAttemptIndex === submissions.length - 1}
            variant="outline"
            className={`flex items-center gap-2 ${
              currentAttemptIndex === submissions.length - 1 
                ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Attempt Display */}
        <div className="p-6 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {currentAttempt.quiz?.title || "Quiz"}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(currentAttempt.created_date), "MMM d, yyyy 'at' h:mm a")}
                </span>
                
                {currentAttempt.time_taken && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.round(currentAttempt.time_taken)} min
                  </span>
                )}
                
                {currentAttempt.quiz?.subject && (
                  <Badge variant="outline" className="text-xs">
                    {currentAttempt.quiz.subject.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <Badge className={`${getScoreColor(currentAttempt.percentage)} border font-semibold text-lg px-3 py-1`}>
                {Math.round(currentAttempt.percentage)}%
              </Badge>
              <div className="text-sm text-slate-500 mt-2">
                {currentAttempt.score}/{currentAttempt.max_score} points
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {Math.round(currentAttempt.percentage)}%
              </div>
              <div className="text-xs text-slate-500">Score</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {currentAttempt.score}/{currentAttempt.max_score}
              </div>
              <div className="text-xs text-slate-500">Points</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {currentAttempt.time_taken ? Math.round(currentAttempt.time_taken) : 'N/A'}
              </div>
              <div className="text-xs text-slate-500">Minutes</div>
            </div>
          </div>

          {/* Quiz Details */}
          {currentAttempt.quiz && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-4 text-sm">
                {currentAttempt.quiz.difficulty && (
                  <Badge variant="outline" className="capitalize">
                    {currentAttempt.quiz.difficulty}
                  </Badge>
                )}
                {currentAttempt.quiz.questions && (
                  <span className="text-slate-600">
                    {currentAttempt.quiz.questions.length} Questions
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}