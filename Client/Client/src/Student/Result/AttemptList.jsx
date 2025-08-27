import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, Award, Calendar } from "lucide-react";

export default function AttemptList({ attempts }) {
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          All Quiz Attempts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {attempts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No quiz attempts yet. Take your first quiz to see results here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt, index) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {attempt.quiz?.title || "Quiz"}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(attempt.created_date), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    
                    {attempt.time_taken && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.round(attempt.time_taken)} min
                      </span>
                    )}
                    
                    {attempt.quiz?.subject && (
                      <Badge variant="outline" className="text-xs">
                        {attempt.quiz.subject.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className={`${getScoreColor(attempt.percentage)} border font-semibold`}>
                    {Math.round(attempt.percentage)}%
                  </Badge>
                  <div className="text-xs text-slate-500 mt-1">
                    {attempt.score}/{attempt.max_score} points
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}