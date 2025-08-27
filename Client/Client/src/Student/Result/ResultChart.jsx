import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function ResultChart({ attempts }) {
  const chartData = attempts?.submissions
    .slice(-10) // Last 10 attempts
    .reverse()
    .map((attempt, index) => ({
      quiz: `Quiz ${index + 1}`,
      score: Math.round(attempt.percentage),
      date: format(new Date(attempt.created_date), "MMM d")
    }));

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="quiz" 
                tick={{ fontSize: 12 }}
                className="text-slate-600"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-slate-600"
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `${payload[0].payload.date}`;
                  }
                  return label;
                }}
                formatter={(value) => [`${value}%`, 'Score']}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No quiz data yet. Complete some quizzes to see your progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}