import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, TrendingUp, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

// Mock data for quiz submissions
const mockSubmissions = [
  {
    id: "1",
    student_name: "John Doe",
    student_email: "john.doe@example.com",
    percentage: 85,
    submitted_at: "2023-10-15T14:30:00Z"
  },
  {
    id: "2",
    student_name: "John Doe",
    student_email: "john.doe@example.com",
    percentage: 92,
    submitted_at: "2023-10-20T09:15:00Z"
  },
  {
    id: "3",
    student_name: "Jane Smith",
    student_email: "jane.smith@example.com",
    percentage: 78,
    submitted_at: "2023-10-18T11:45:00Z"
  },
  {
    id: "4",
    student_name: "Jane Smith",
    student_email: "jane.smith@example.com",
    percentage: 88,
    submitted_at: "2023-10-22T16:20:00Z"
  },
  {
    id: "5",
    student_name: "Alex Johnson",
    student_email: "alex.johnson@example.com",
    percentage: 95,
    submitted_at: "2023-10-21T13:10:00Z"
  },
  {
    id: "6",
    student_name: "Alex Johnson",
    student_email: "alex.johnson@example.com",
    percentage: 91,
    submitted_at: "2023-10-25T10:05:00Z"
  },
  {
    id: "7",
    student_name: "Sarah Wilson",
    student_email: "sarah.wilson@example.com",
    percentage: 72,
    submitted_at: "2023-10-19T15:40:00Z"
  },
  {
    id: "8",
    student_name: "Mike Brown",
    student_email: "mike.brown@example.com",
    percentage: 68,
    submitted_at: "2023-10-16T08:55:00Z"
  },
  {
    id: "9",
    student_name: "Emily Davis",
    student_email: "emily.davis@example.com",
    percentage: 89,
    submitted_at: "2023-10-23T14:20:00Z"
  },
  {
    id: "10",
    student_name: "Emily Davis",
    student_email: "emily.davis@example.com",
    percentage: 84,
    submitted_at: "2023-10-24T11:30:00Z"
  }
];

export default function StudentRecord() {
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    setIsLoading(true);
    try {
      // Use mock data instead of API call
      const submissionsData = mockSubmissions;
      setSubmissions(submissionsData);
      
      // Group submissions by student
      const studentMap = {};
      submissionsData.forEach(submission => {
        const key = submission.student_email;
        if (!studentMap[key]) {
          studentMap[key] = {
            name: submission.student_name,
            email: submission.student_email,
            submissions: [],
            totalQuizzes: 0,
            averageScore: 0,
            lastActive: null
          };
        }
        studentMap[key].submissions.push(submission);
      });

      // Calculate stats for each student
      const studentsData = Object.values(studentMap).map(student => {
        const totalQuizzes = student.submissions.length;
        const averageScore = totalQuizzes > 0 
          ? Math.round(student.submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / totalQuizzes)
          : 0;
        const lastActive = totalQuizzes > 0 
          ? new Date(Math.max(...student.submissions.map(s => new Date(s.submitted_at))))
          : null;

        return {
          ...student,
          totalQuizzes,
          averageScore,
          lastActive
        };
      });

      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading student data:', error);
    }
    setIsLoading(false);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatLastActive = (date) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Students</h1>
          <p className="text-slate-600">Track student progress and performance</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Students</p>
                  <p className="text-2xl font-bold text-slate-900">{students.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 bg-opacity-20">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average Score</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {students.length > 0 
                      ? Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)
                      : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 bg-opacity-20">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Top Performer</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {students.length > 0 ? Math.max(...students.map(s => s.averageScore)) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 bg-opacity-20">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Today</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {students.filter(s => s.lastActive && new Date().toDateString() === s.lastActive.toDateString()).length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 bg-opacity-20">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 backdrop-blur-sm border-0 shadow-lg"
            />
          </div>
        </motion.div>

        {/* Students List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isLoading ? (
            <div className="grid gap-4">
              {Array(5).fill(0).map((_, i) => (
                <Card key={i} className="bg-white/70 backdrop-blur-sm animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded mb-2" />
                        <div className="h-3 bg-slate-200 rounded w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="grid gap-4">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.email}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600">
                            <AvatarFallback className="text-white font-semibold">
                              {getInitials(student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg">{student.name}</h3>
                            <p className="text-slate-600 text-sm">{student.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-slate-500">Quizzes Taken</p>
                            <p className="text-lg font-semibold text-slate-900">{student.totalQuizzes}</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-slate-500">Average Score</p>
                            <Badge className={getPerformanceColor(student.averageScore)}>
                              {student.averageScore}%
                            </Badge>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-slate-500">Last Active</p>
                            <p className="text-sm font-medium text-slate-700">
                              {formatLastActive(student.lastActive)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No students found</h3>
                <p className="text-slate-500">
                  {searchTerm ? "Try adjusting your search" : "Students will appear here once they start taking your quizzes"}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}