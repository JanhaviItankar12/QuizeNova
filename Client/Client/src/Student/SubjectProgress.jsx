import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

export default function SubjectProgress({ attempts }) {
  const subjectStats = {};
  
  attempts.forEach(attempt => {
    const subject = attempt.quiz?.subject || 'other';
    if (!subjectStats[subject]) {
      subjectStats[subject] = { attempts: 0, totalPercentage: 0 };
    }
    subjectStats[subject].attempts++;
    subjectStats[subject].totalPercentage += attempt.percentage;
  });

  const subjectData = Object.entries(subjectStats)
    .map(([subject, stats]) => ({
      subject: subject.replace('_', ' '),
      average: Math.round(stats.totalPercentage / stats.attempts),
      attempts: stats.attempts
    }))
    .sort((a, b) => b.average - a.average);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Subject Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjectData.length === 0 ? (
          <div className="text-center py-4 text-slate-500">
            <p className="text-sm">Complete quizzes to see your progress by subject</p>
          </div>
        ) : (
          subjectData.map((item, index) => (
            <div key={item.subject} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 capitalize">
                  {item.subject}
                </span>
                <span className="text-sm text-slate-600">
                  {item.average}% ({item.attempts} quiz{item.attempts > 1 ? 'es' : ''})
                </span>
              </div>
              <Progress value={item.average} className="h-2" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}