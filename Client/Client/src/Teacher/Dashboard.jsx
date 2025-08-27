import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Users, BarChart3, TrendingUp, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock quiz data
const mockQuizzes = [
  {
    id: 1,
    title: "Advanced Calculus Quiz",
    description: "Test your knowledge of derivatives, integrals, and limits",
    subject: "Mathematics",
    is_published: true,
    total_questions: 25,
    time_limit: 45,
    created_date: "2025-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Organic Chemistry Basics",
    description: "Cover fundamental concepts of organic chemistry",
    subject: "Science",
    is_published: false,
    total_questions: 20,
    time_limit: 30,
    created_date: "2025-01-12T14:20:00Z"
  },
  {
    id: 3,
    title: "Shakespeare's Hamlet Analysis",
    description: "Deep dive into themes and characters in Hamlet",
    subject: "English",
    is_published: true,
    total_questions: 15,
    time_limit: 35,
    created_date: "2025-01-10T09:15:00Z"
  },
  {
    id: 4,
    title: "World War II Timeline",
    description: "Major events and battles from WWII",
    subject: "History",
    is_published: true,
    total_questions: 30,
    time_limit: 40,
    created_date: "2025-01-08T16:45:00Z"
  },
  {
    id: 5,
    title: "European Geography Quiz",
    description: "Countries, capitals, and landmarks",
    subject: "Geography",
    is_published: false,
    total_questions: 18,
    time_limit: 25,
    created_date: "2025-01-05T11:30:00Z"
  }
];

// Mock submission data
const mockSubmissions = [
  {
    id: 1,
    quiz_id: 1,
    student_name: "Alice Johnson",
    student_email: "alice.johnson@school.edu",
    percentage: 92,
    score: 23,
    total_questions: 25,
    time_taken: 38,
    completed_at: "2025-01-20T14:30:00Z"
  },
  {
    id: 2,
    quiz_id: 3,
    student_name: "Bob Smith",
    student_email: "bob.smith@school.edu",
    percentage: 87,
    score: 13,
    total_questions: 15,
    time_taken: 32,
    completed_at: "2025-01-19T16:15:00Z"
  },
  {
    id: 3,
    quiz_id: 4,
    student_name: "Carol Davis",
    student_email: "carol.davis@school.edu",
    percentage: 95,
    score: 28,
    total_questions: 30,
    time_taken: 35,
    completed_at: "2025-01-18T11:45:00Z"
  },
  {
    id: 4,
    quiz_id: 1,
    student_name: "David Wilson",
    student_email: "david.wilson@school.edu",
    percentage: 78,
    score: 19,
    total_questions: 25,
    time_taken: 42,
    completed_at: "2025-01-17T13:20:00Z"
  },
  {
    id: 5,
    quiz_id: 3,
    student_name: "Eva Martinez",
    student_email: "eva.martinez@school.edu",
    percentage: 89,
    score: 13,
    total_questions: 15,
    time_taken: 28,
    completed_at: "2025-01-16T10:30:00Z"
  }
];

// StatsCard Component
const StatsCard = ({ title, value, icon: Icon, gradient, delay = 0 }) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${gradient} text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// RecentActivity Component
const RecentActivity = ({ submissions }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg ">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.slice(0, 5).map((submission, index) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {submission.student_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{submission.student_name}</p>
                    <p className="text-sm text-slate-500">Quiz #{submission.quiz_id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(submission.percentage)}`}>
                    {submission.percentage}%
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{formatDate(submission.completed_at)}</p>
                    <p className="text-xs text-slate-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {submission.time_taken}min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No submissions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Sort by created_date descending (most recent first)
      const sortedQuizzes = [...mockQuizzes].sort((a, b) => 
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
      const sortedSubmissions = [...mockSubmissions].sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      );
      
      setQuizzes(sortedQuizzes);
      setSubmissions(sortedSubmissions);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setIsLoading(false);
  };

  const totalQuizzes = quizzes.length;
  const publishedQuizzes = quizzes.filter(q => q.is_published).length;
  const totalSubmissions = submissions.length;
  const avgScore = submissions.length > 0 
    ? Math.round(submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / submissions.length)
    : 0;

  const handleNavigation = (page) => {
    navigate(`/teacher/${page.toLowerCase()}`);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white/70 rounded-xl p-6 shadow-lg">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white/70 rounded-xl p-6 shadow-lg">
                <div className="h-6 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-16 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white/70 rounded-xl p-6 shadow-lg">
                  <div className="h-6 bg-slate-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="h-10 bg-slate-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Welcome back, Teacher! 👋
            </h1>
            <p className="text-slate-600 text-lg">Here's what's happening with your quizzes today.</p>
          </div>
          <Button 
            onClick={() => handleNavigation('createQuize')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Quiz
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Quizzes"
            value={totalQuizzes}
            icon={BookOpen}
            gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
            delay={0}
          />
          <StatsCard
            title="Published Quizzes"
            value={publishedQuizzes}
            icon={TrendingUp}
            gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
            delay={0.1}
          />
          <StatsCard
            title="Student Submissions"
            value={totalSubmissions}
            icon={Users}
            gradient="bg-gradient-to-r from-purple-500 to-pink-600"
            delay={0.2}
          />
          <StatsCard
            title="Average Score"
            value={`${avgScore}%`}
            icon={BarChart3}
            gradient="bg-gradient-to-r from-amber-500 to-orange-600"
            delay={0.3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity submissions={submissions} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                  onClick={() => handleNavigation('createQuize')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Quiz
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300"
                  onClick={() => handleNavigation('Quizzes')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Quizzes
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 transition-all duration-300"
                  onClick={() => handleNavigation('Students')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Students
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-amber-50 hover:border-amber-200 transition-all duration-300"
                  onClick={() => handleNavigation('Analytics')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Recent Quizzes */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Recent Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                {quizzes.length > 0 ? (
                  <div className="space-y-3">
                    {quizzes.slice(0, 3).map((quiz) => (
                      <div
                        key={quiz.id}
                        className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleNavigation(`Quiz-${quiz.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">{quiz.title}</p>
                            <p className="text-sm text-slate-500">{quiz.subject || 'No subject'}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${quiz.is_published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <span className="text-xs text-slate-400">
                              {quiz.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-500">No quizzes created yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}