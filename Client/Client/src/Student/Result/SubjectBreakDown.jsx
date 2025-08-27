import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, TrendingUp } from "lucide-react";

export default function SubjectBreakdown({ attempts }) {
  const subjectStats = {};
  
  attempts.forEach(attempt => {
    const subject = attempt.quiz?.subject || 'other';
    if (!subjectStats[subject]) {
      subjectStats[subject] = { 
        attempts: 0, 
        totalPercentage: 0,
        bestScore: 0,
        totalPoints: 0,
        maxPoints: 0
      };
    }
    subjectStats[subject].attempts++;
    subjectStats[subject].totalPercentage += attempt.percentage;
    subjectStats[subject].bestScore = Math.max(subjectStats[subject].bestScore, attempt.percentage);
    subjectStats[subject].totalPoints += attempt.score;
    subjectStats[subject].maxPoints += attempt.max_score;
  });

  const subjectData = Object.entries(subjectStats)
    .map(([subject, stats]) => ({
      subject: subject.replace('_', ' '),
      average: Math.round(stats.totalPercentage / stats.attempts),
      best: Math.round(stats.bestScore),
      attempts: stats.attempts,
      efficiency: Math.round((stats.totalPoints / stats.maxPoints) * 100)
    }))
    .sort((a, b) => b.average - a.average);

  const getPerformanceColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Subject Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {subjectData.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Complete quizzes to see your progress by subject</p>
          </div>
        ) : (
          <div className="space-y-6">
            {subjectData.map((item) => (
              <div key={item.subject} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 capitalize">
                    {item.subject}
                  </h4>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getPerformanceColor(item.average)}`}>
                      {item.average}%
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.attempts} quiz{item.attempts > 1 ? 'es' : ''}
                    </div>
                  </div>
                </div>
                
                <Progress value={item.average} className="h-3" />
                
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Best: {item.best}%</span>
                  </div>
                  <span>Efficiency: {item.efficiency}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}