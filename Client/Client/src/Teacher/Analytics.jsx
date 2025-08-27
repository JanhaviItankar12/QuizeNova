import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Target, Clock } from "lucide-react";
import { motion } from "framer-motion";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Mock data
const quizzesMock = [
  { id: "q1", title: "Math Basics" },
  { id: "q2", title: "Science Quiz" },
  { id: "q3", title: "History Challenge" },
];

const submissionsMock = [
  { id: "s1", quiz_id: "q1", percentage: 85, time_taken: 12, submitted_at: new Date().toISOString() },
  { id: "s2", quiz_id: "q1", percentage: 92, time_taken: 10, submitted_at: new Date().toISOString() },
  { id: "s3", quiz_id: "q2", percentage: 75, time_taken: 15, submitted_at: new Date(Date.now() - 86400000).toISOString() }, // yesterday
  { id: "s4", quiz_id: "q3", percentage: 55, time_taken: 20, submitted_at: new Date(Date.now() - 2 * 86400000).toISOString() }, // 2 days ago
  { id: "s5", quiz_id: "q2", percentage: 68, time_taken: 18, submitted_at: new Date(Date.now() - 3 * 86400000).toISOString() }, // 3 days ago
];

export default function Analytics() {
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Mock fetch simulation
      await new Promise(resolve => setTimeout(resolve, 500));
      setQuizzes(quizzesMock);
      setSubmissions(submissionsMock);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
    setIsLoading(false);
  };

  // Filter submissions based on selected quiz
  const filteredSubmissions = selectedQuiz === "all" 
    ? submissions 
    : submissions.filter(s => s.quiz_id === selectedQuiz);

  // Performance distribution data
  const performanceData = [
    { name: '90-100%', value: filteredSubmissions.filter(s => s.percentage >= 90).length },
    { name: '80-89%', value: filteredSubmissions.filter(s => s.percentage >= 80 && s.percentage < 90).length },
    { name: '70-79%', value: filteredSubmissions.filter(s => s.percentage >= 70 && s.percentage < 80).length },
    { name: '60-69%', value: filteredSubmissions.filter(s => s.percentage >= 60 && s.percentage < 70).length },
    { name: 'Below 60%', value: filteredSubmissions.filter(s => s.percentage < 60).length },
  ].filter(item => item.value > 0);

  // Quiz stats data
  const quizStatsData = quizzes.map(quiz => {
    const quizSubmissions = submissions.filter(s => s.quiz_id === quiz.id);
    const avgScore = quizSubmissions.length > 0 
      ? Math.round(quizSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / quizSubmissions.length)
      : 0;
    
    return {
      name: quiz.title.length > 20 ? quiz.title.substring(0, 20) + '...' : quiz.title,
      submissions: quizSubmissions.length,
      avgScore: avgScore
    };
  });

  // Recent activity timeline (last 7 days)
  const getActivityData = () => {
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();

    return last7Days.map(dateStr => {
      const daySubmissions = filteredSubmissions.filter(s => 
        new Date(s.submitted_at).toDateString() === dateStr
      );
      
      return {
        date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        submissions: daySubmissions.length,
        avgScore: daySubmissions.length > 0 
          ? Math.round(daySubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / daySubmissions.length)
          : 0
      };
    });
  };

  const activityData = getActivityData();

  // Key metrics
  const totalSubmissions = filteredSubmissions.length;
  const avgScore = totalSubmissions > 0 
    ? Math.round(filteredSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / totalSubmissions)
    : 0;
  const avgTime = totalSubmissions > 0
    ? Math.round(filteredSubmissions.reduce((sum, s) => sum + (s.time_taken || 0), 0) / totalSubmissions)
    : 0;
  const passRate = totalSubmissions > 0
    ? Math.round((filteredSubmissions.filter(s => s.percentage >= 70).length / totalSubmissions) * 100)
    : 0;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
            <p className="text-slate-600">Insights into quiz performance and student engagement</p>
          </div>
          
          <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
            <SelectTrigger className="w-64 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quizzes</SelectItem>
              {quizzes.map(quiz => (
                <SelectItem key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Key Metrics */}
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
                  <p className="text-sm font-medium text-slate-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-slate-900">{totalSubmissions}</p>
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
                  <p className="text-2xl font-bold text-slate-900">{avgScore}%</p>
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
                  <p className="text-sm font-medium text-slate-600">Pass Rate (70%+)</p>
                  <p className="text-2xl font-bold text-slate-900">{passRate}%</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 bg-opacity-20">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Time</p>
                  <p className="text-2xl font-bold text-slate-900">{avgTime}min</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 bg-opacity-20">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="submissions" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quiz Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">Quiz Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={quizStatsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="submissions" fill="#3B82F6" name="Submissions" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgScore" fill="#10B981" name="Avg Score %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}