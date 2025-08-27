import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Award, Clock } from "lucide-react";

export default function ResultHeader({ attempts }) {
  const totalQuizzes = attempts.length;
  const averageScore = totalQuizzes > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzes)
    : 0;
  const bestScore = totalQuizzes > 0 
    ? Math.max(...attempts.map(a => a.percentage))
    : 0;
  const totalTime = Math.round(attempts.reduce((sum, a) => sum + (a.time_taken || 0), 0));

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Quiz Results</h1>
        <p className="text-slate-600">Track your progress and performance over time</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Quizzes",
            value: totalQuizzes,
            icon: BarChart3,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700"
          },
          {
            title: "Average Score",
            value: `${averageScore}%`,
            icon: TrendingUp,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-700"
          },
          {
            title: "Best Score",
            value: `${Math.round(bestScore)}%`,
            icon: Award,
            color: "from-yellow-500 to-yellow-600",
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-700"
          },
          {
            title: "Total Time",
            value: `${totalTime}m`,
            icon: Clock,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${stat.color}`}></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}