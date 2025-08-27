import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, Award, TrendingUp } from "lucide-react";

export default function RecentAttempts({ attemptData }) {
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };
  
  

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800">Recent Quiz Attempts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {attemptData?.attempts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No quiz attempts yet. Take your first quiz to see results here!</p>
          </div>
        ) : (
          attemptData?.attempts.slice(0, 5).map((attempt, index) => (
            <motion.div
              key={attempt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">
                  {attempt.quiz?.title || "Quiz"}
                </h3>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(attempt.created_date), "MMM d, yyyy")}
                  </span>
                  {attempt.time_taken && (
                    <span>{Math.round(attempt.time_taken)} min</span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(attempt.percentage)}`}>
                  <TrendingUp className="w-3 h-3" />
                  {Math.round(attempt.percentage)}%
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {attempt.score}/{attempt.max_score} points
                </div>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}