import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Play, Clock, BookOpen } from "lucide-react";


const subjectColors = {
  mathematics: "bg-blue-100 text-blue-800 border-blue-200",
  science: "bg-green-100 text-green-800 border-green-200",
  history: "bg-yellow-100 text-yellow-800 border-yellow-200",
  english: "bg-purple-100 text-purple-800 border-purple-200",
  geography: "bg-teal-100 text-teal-800 border-teal-200",
  physics: "bg-indigo-100 text-indigo-800 border-indigo-200",
  chemistry: "bg-pink-100 text-pink-800 border-pink-200",
  biology: "bg-emerald-100 text-emerald-800 border-emerald-200",
  computer_science: "bg-gray-100 text-gray-800 border-gray-200",
  art: "bg-rose-100 text-rose-800 border-rose-200",
  music: "bg-amber-100 text-amber-800 border-amber-200"
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700", 
  advanced: "bg-red-100 text-red-700"
};

export default function RecentQuizzes({ quizzes , loading}) {

    const navigate=useNavigate();
    const id=localStorage.getItem("id");

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-800">Available Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <p>Loading quizzes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800">Available Quizzes</CardTitle>
          <Link to={`/student/${id}/take-quiz`}>
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{quiz.description}</p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${subjectColors[quiz.subject]} border`}>
                    <BookOpen className="w-3 h-3 mr-1" />
                    {quiz.subject?.name.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={difficultyColors[quiz.difficulty]}>
                    {quiz.difficulty}
                  </Badge>
                  {quiz.time_limit && (
                    <Badge variant="outline" className="text-slate-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {quiz.time_limit}min
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-slate-600">
                    {quiz.questions?.length || 0} questions
                  </Badge>
                </div>
              </div>
              
              
                <Button size="sm"
                 onClick={() => navigate(`/student/${quiz._id}/take-quiz`, { state: { quizId: quiz._id } })}
                 className="ml-4 bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
             
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}