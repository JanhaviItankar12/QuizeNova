import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play, Clock, BookOpen, Filter } from "lucide-react";

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

export default function QuizeBrowser({ quizzes, onQuizSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || quiz.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const subjects = [...new Set(quizzes.map(q => q.subject))];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Choose Your Quiz</h1>
        <p className="text-slate-600">Select a quiz to test your knowledge and skills</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject?.name.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={`${subjectColors[quiz.subject]} border`}>
                    <BookOpen className="w-3 h-3 mr-1" />
                    {quiz.subject?.name.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={difficultyColors[quiz.difficulty]}>
                    {quiz.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {quiz.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-slate-600 text-sm mb-4 flex-1">
                  {quiz.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span>{quiz.questions?.length || 0} questions</span>
                  {quiz.time_limit && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {quiz.time_limit} min
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span>{quiz.total_points || quiz.questions?.length || 0} pts</span>
                </div>
                
                <Button 
                  onClick={() => onQuizSelect(quiz)}
                  className="w-full bg-blue-600 hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No quizzes found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </motion.div>
  );
}