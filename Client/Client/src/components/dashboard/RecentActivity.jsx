import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function RecentActivity({ submissions = [] }) {
  const activities = [
    {
      type: "submission",
      student: "John Smith",
      quiz: "Math Quiz #1",
      score: 85,
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      type: "submission",
      student: "Sarah Johnson",
      quiz: "Science Quiz #2",
      score: 92,
      time: "4 hours ago",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      type: "submission",
      student: "Mike Davis",
      quiz: "History Quiz #1",
      score: 78,
      time: "6 hours ago",
      icon: CheckCircle,
      color: "text-green-500"
    }
  ];

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-slate-100`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{activity.student}</p>
                  <p className="text-sm text-slate-500">completed {activity.quiz}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-semibold">
                  {activity.score}%
                </Badge>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}