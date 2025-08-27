import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, BookOpen, Clock, Users, Settings, Eye, Edit } from "lucide-react";
import { useGetQuizzesByTeacherQuery } from "@/store/quizeApi";
import { useNavigate } from "react-router-dom";


export default function MyQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSubject, setFilterSubject] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    const { data: quizeData,isLoading,error,refetch } = useGetQuizzesByTeacherQuery();
    
    const navigate = useNavigate();

    useEffect(() => {
        if (quizeData) {
            // Sort quizzes by creation date (most recent first)
            const sortedData = [...quizeData].sort((a, b) =>
                new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
            );
            setQuizzes(sortedData);
        }
    }, [quizeData]);

  

    useEffect(() => {
        filterQuizzes();
    }, [quizzes, searchTerm, filterSubject, filterStatus]);

   

    const filterQuizzes = () => {
        let filtered = quizzes;

        if (searchTerm) {
            filtered = filtered.filter(quiz =>
                quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterSubject !== "all") {
            filtered = filtered.filter(quiz => quiz.subject === filterSubject);
        }

        if (filterStatus !== "all") {
            filtered = filtered.filter(quiz =>
                filterStatus === "published" ? quiz.is_published : !quiz.is_published
            );
        }

        setFilteredQuizzes(filtered);
    };

    const subjectColors = {
        math: "bg-blue-100 text-blue-800",
        science: "bg-green-100 text-green-800",
        english: "bg-purple-100 text-purple-800",
        history: "bg-amber-100 text-amber-800",
        geography: "bg-cyan-100 text-cyan-800",
        art: "bg-pink-100 text-pink-800",
        music: "bg-indigo-100 text-indigo-800",
        other: "bg-gray-100 text-gray-800"
    };

    const handleCreateQuiz = () => {
        navigate('/teacher/createQuize');
    };

    const handleViewQuiz = (quizId) => {
        alert(`View quiz with ID: ${quizId}`);
    };

    const handleEditQuiz = (quizId) => {
        navigate(`/teacher/editQuize/${quizId}`);
    };

    return (
        <div className="p-4 mt-16 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">My Quizzes</h1>
                        <p className="text-slate-600">Manage and organize all your quizzes</p>
                    </div>
                    <Button
                        onClick={handleCreateQuiz}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Quiz
                    </Button>
                </div>

                {/* Filters */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search quizzes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white/50"
                            />
                        </div>
                        <Select value={filterSubject} onValueChange={setFilterSubject}>
                            <SelectTrigger className="w-full md:w-48 bg-white/50">
                                <SelectValue placeholder="Filter by subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                <SelectItem value="math">Mathematics</SelectItem>
                                <SelectItem value="science">Science</SelectItem>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="history">History</SelectItem>
                                <SelectItem value="geography">Geography</SelectItem>
                                <SelectItem value="art">Art</SelectItem>
                                <SelectItem value="music">Music</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full md:w-48 bg-white/50">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Quiz Grid */}
                <div>
                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill(0).map((_, i) => (
                                <Card key={i} className="bg-white/70 backdrop-blur-sm animate-pulse">
                                    <CardHeader>
                                        <div className="h-6 bg-slate-200 rounded mb-2" />
                                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-slate-200 rounded" />
                                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredQuizzes.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredQuizzes.map((quiz) => (
                                <Card
                                    key={quiz.id}
                                    className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Badge className={subjectColors[quiz.subject] || subjectColors.other}>
                                                    {quiz.subject?.replace('_', ' ') || 'Other'}
                                                </Badge>
                                                <Badge variant={quiz.is_published ? "default" : "secondary"}>
                                                    {quiz.is_published ? 'Published' : 'Draft'}
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {quiz.title}
                                        </CardTitle>
                                        <p className="text-slate-600 text-sm line-clamp-2">
                                            {quiz.description || 'No description provided'}
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>{quiz.total_questions || 0} questions</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{quiz.time_limit || 30}min</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span>0</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                                                onClick={() => handleViewQuiz(quiz._id)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 hover:bg-emerald-50 hover:border-emerald-200"
                                                onClick={() => handleEditQuiz(quiz._id)}
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-600 mb-2">No quizzes found</h3>
                            <p className="text-slate-500 mb-6">
                                {searchTerm || filterSubject !== "all" || filterStatus !== "all"
                                    ? "Try adjusting your filters"
                                    : "Start by creating your first quiz"
                                }
                            </p>
                            {(!searchTerm && filterSubject === "all" && filterStatus === "all") && (
                                <Button
                                    onClick={handleCreateQuiz}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Quiz
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}