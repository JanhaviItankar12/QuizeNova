import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Clock,
    Users,
    Star,
    ChevronLeft,
    Play,
    BookOpen,
    Award,
    Calendar,
    Loader,
    AlertCircle,
    Grid,
    List,
    Code,
    Palette,
    Database,
    Globe,
    Microscope,
    ScrollText,
    Trophy,
    Film,
    Briefcase,
    Heart,
    Paintbrush,
    HelpCircle
} from 'lucide-react';
import { useGetQuizeByCategoryQuery } from '@/store/authApi';

const QuizeListPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    // Subject metadata for icons and colors
  const subjectMeta = {
          JavaScript: { 
              icon: Code, 
              color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
              bgColor: "bg-yellow-50",
              textColor: "text-yellow-700",
              borderColor: "border-yellow-200",
              hoverColor: "hover:border-yellow-400"
          },
          React: { 
              icon: Code, 
              color: "bg-gradient-to-br from-blue-400 to-cyan-500",
              bgColor: "bg-blue-50",
              textColor: "text-blue-700",
              borderColor: "border-blue-200",
              hoverColor: "hover:border-blue-400"
          },
          CSS: { 
              icon: Palette, 
              color: "bg-gradient-to-br from-pink-400 to-purple-500",
              bgColor: "bg-pink-50",
              textColor: "text-pink-700",
              borderColor: "border-pink-200",
              hoverColor: "hover:border-pink-400"
          },
          Nodejs: { 
              icon: Code, 
              color: "bg-gradient-to-br from-green-500 to-emerald-600",
              bgColor: "bg-green-50",
              textColor: "text-green-700",
              borderColor: "border-green-200",
              hoverColor: "hover:border-green-400"
          },
          Database: { 
              icon: Database, 
              color: "bg-gradient-to-br from-purple-500 to-indigo-600",
              bgColor: "bg-purple-50",
              textColor: "text-purple-700",
              borderColor: "border-purple-200",
              hoverColor: "hover:border-purple-400"
          },
          Technology: { 
              icon: Code, 
              color: "bg-gradient-to-br from-gray-500 to-slate-600",
              bgColor: "bg-gray-50",
              textColor: "text-gray-700",
              borderColor: "border-gray-200",
              hoverColor: "hover:border-gray-400"
          },
          Science: { 
              icon: Microscope, 
              color: "bg-gradient-to-br from-green-500 to-teal-600",
              bgColor: "bg-green-50",
              textColor: "text-green-700",
              borderColor: "border-green-200",
              hoverColor: "hover:border-green-400"
          },
          History: { 
              icon: ScrollText, 
              color: "bg-gradient-to-br from-amber-500 to-orange-600",
              bgColor: "bg-amber-50",
              textColor: "text-amber-700",
              borderColor: "border-amber-200",
              hoverColor: "hover:border-amber-400"
          },
          Geography: { 
              icon: Globe, 
              color: "bg-gradient-to-br from-blue-500 to-indigo-600",
              bgColor: "bg-blue-50",
              textColor: "text-blue-700",
              borderColor: "border-blue-200",
              hoverColor: "hover:border-blue-400"
          },
          Sports: { 
              icon: Trophy, 
              color: "bg-gradient-to-br from-orange-500 to-red-600",
              bgColor: "bg-orange-50",
              textColor: "text-orange-700",
              borderColor: "border-orange-200",
              hoverColor: "hover:border-orange-400"
          },
          Entertainment: { 
              icon: Film, 
              color: "bg-gradient-to-br from-red-500 to-pink-600",
              bgColor: "bg-red-50",
              textColor: "text-red-700",
              borderColor: "border-red-200",
              hoverColor: "hover:border-red-400"
          },
          Business: { 
              icon: Briefcase, 
              color: "bg-gradient-to-br from-slate-500 to-gray-600",
              bgColor: "bg-slate-50",
              textColor: "text-slate-700",
              borderColor: "border-slate-200",
              hoverColor: "hover:border-slate-400"
          },
          Health: { 
              icon: Heart, 
              color: "bg-gradient-to-br from-pink-500 to-rose-600",
              bgColor: "bg-pink-50",
              textColor: "text-pink-700",
              borderColor: "border-pink-200",
              hoverColor: "hover:border-pink-400"
          },
          Art: { 
              icon: Paintbrush, 
              color: "bg-gradient-to-br from-violet-500 to-purple-600",
              bgColor: "bg-violet-50",
              textColor: "text-violet-700",
              borderColor: "border-violet-200",
              hoverColor: "hover:border-violet-400"
          },
          Literature: { 
              icon: BookOpen, 
              color: "bg-gradient-to-br from-indigo-500 to-blue-600",
              bgColor: "bg-indigo-50",
              textColor: "text-indigo-700",
              borderColor: "border-indigo-200",
              hoverColor: "hover:border-indigo-400"
          },
          Other: { 
              icon: HelpCircle, 
              color: "bg-gradient-to-br from-gray-400 to-gray-600",
              bgColor: "bg-gray-50",
              textColor: "text-gray-700",
              borderColor: "border-gray-200",
              hoverColor: "hover:border-gray-400"
          },
      };

    // Use RTK Query to fetch quizzes
    const queryParams = new URLSearchParams(window.location.search);
    const subjectName = queryParams.get('category') || '';
    const { data: quizzesData, error, isLoading } = useGetQuizeByCategoryQuery(subjectName);

    // Debug: Check what data is being returned
    console.log("API Response:", quizzesData);

 const mapDifficulty = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "beginner":
      return "easy";
    case "intermediate":
      return "medium";
    case "advanced":
      return "hard";
    default:
      return difficulty || "other";
  }
};

const quizzes = quizzesData?.quizzes?.map((quiz) => {
  const subjectName = quiz.subject?.name || "Other";
  const meta = subjectMeta[subjectName] || subjectMeta["Other"];

  return {
    id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    difficulty: mapDifficulty(quiz.difficulty), // ✅ mapped here
    duration: quiz.time_limit,
    totalQuestions: quiz.questions?.length || 0,
    subject: {
      name: subjectName,
      icon: meta.icon,
      color: meta.color,
      bgColor: meta.bgColor,
      textColor: meta.textColor,
    },
    tags: [mapDifficulty(quiz.difficulty), subjectName], // ✅ mapped in tags too
    createdAt: quiz.createdAt || new Date().toISOString(),
  };
}) || [];


    // Helper functions
    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleQuizClick = (quiz) => {
        // Navigate to quiz taking page
        window.location.href = `/quiz/${quiz.id}`;
    };

    // Filter and sort logic
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);

    const handleBackClick = () => {
        window.history.back();
    };

    useEffect(() => {
        if (quizzes.length > 0) {
            let filtered = quizzes.filter(quiz => {
                const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    quiz.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

                const matchesDifficulty = difficultyFilter === 'all' ||
                    quiz.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

                return matchesSearch && matchesDifficulty;
            });

            // Sort quizzes
            filtered.sort((a, b) => {
                switch (sortBy) {
                    case 'newest':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case 'oldest':
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case 'difficulty':
                        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
                    default:
                        return 0;
                }
            });

            setFilteredQuizzes(filtered);
        }
    }, [searchTerm, difficultyFilter, sortBy, quizzes]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading quizzes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4 font-medium">
                        {error?.data?.message || 'Failed to fetch quizzes. Please try again later.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-16 bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Back Button */}
                    <button
                        onClick={handleBackClick}
                        className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Categories
                    </button>

                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-2">
                            {subjectName || 'Subject'} Quizzes
                        </h1>
                        <p className="text-gray-600">
                            Test your knowledge with our carefully crafted quizzes
                        </p>
                        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                                <span className="text-blue-700 font-medium">{filteredQuizzes.length} quizzes available</span>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search quizzes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/80 backdrop-blur-sm"
                            />
                        </div>

                        {/* Filters and Controls */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Difficulty Filter */}
                            <select
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm shadow-sm bg-white/80 backdrop-blur-sm"
                            >
                                <option value="all">All Levels</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm shadow-sm bg-white/80 backdrop-blur-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="difficulty">By Difficulty</option>
                            </select>

                            {/* View Mode */}
                            <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white/80 backdrop-blur-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredQuizzes.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                            <div className="text-gray-300 mb-6">
                                <BookOpen className="w-20 h-20 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes found</h3>
                            <p className="text-gray-600">Try adjusting your search term or filters.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredQuizzes.map((quiz) => {
                                    const IconComponent = quiz.subject.icon;
                                    return (
                                        <div
                                            key={quiz.id}
                                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100 hover:border-blue-200"
                                            onClick={() => handleQuizClick(quiz)}
                                        >
                                            {/* Header with gradient background and icon */}
                                            <div className={`${quiz.subject.bgColor} p-6 relative overflow-hidden`}>
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-16 h-16 flex items-center justify-center rounded-2xl text-white shadow-lg ${quiz.subject.color}`}>
                                                        <IconComponent className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-medium ${quiz.subject.textColor} mb-1`}>
                                                            {quiz.subject.name}
                                                        </p>
                                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                                                            {quiz.difficulty}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Decorative gradient overlay */}
                                                <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                                                    <div className={`w-full h-full rounded-full ${quiz.subject.color} transform translate-x-8 -translate-y-8`}></div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {quiz.title}
                                                </h3>
                                                
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                    {quiz.description}
                                                </p>

                                                {/* Quiz Stats */}
                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                                                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {quiz.duration} min
                                                    </div>
                                                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                                                        <BookOpen className="w-3 h-3 mr-1" />
                                                        {quiz.totalQuestions} Questions
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group-hover:scale-105 shadow-lg hover:shadow-xl">
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Start Quiz
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <div className="space-y-4">
                                {filteredQuizzes.map((quiz) => {
                                    const IconComponent = quiz.subject.icon;
                                    return (
                                        <div
                                            key={quiz.id}
                                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 p-6"
                                            onClick={() => handleQuizClick(quiz)}
                                        >
                                            <div className="flex items-center space-x-6">
                                                {/* Icon */}
                                                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl text-white shadow-lg ${quiz.subject.color} flex-shrink-0`}>
                                                    <IconComponent className="w-8 h-8" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center space-x-3">
                                                            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                                                {quiz.title}
                                                            </h3>
                                                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                                                                {quiz.difficulty}
                                                            </span>
                                                        </div>
                                                        <span className={`text-sm font-medium px-3 py-1 rounded-lg ${quiz.subject.bgColor} ${quiz.subject.textColor}`}>
                                                            {quiz.subject.name}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {quiz.description}
                                                    </p>

                                                    {/* Stats + Start Button */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                                                                <Clock className="w-4 h-4 mr-1" />
                                                                {quiz.duration} min
                                                            </div>
                                                            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                                                                <BookOpen className="w-4 h-4 mr-1" />
                                                                {quiz.totalQuestions} Questions
                                                            </div>
                                                        </div>

                                                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-6 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl">
                                                            <Play className="w-4 h-4 mr-2" />
                                                            Start Quiz
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizeListPage;