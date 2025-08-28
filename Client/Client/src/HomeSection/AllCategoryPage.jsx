import React, { useState } from 'react';
import {
    Search,
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
    BookOpen,
    HelpCircle,
    ArrowRight,
    Filter,
    Sparkles,
    Loader,
    AlertCircle
} from 'lucide-react';
import {  useGetSujectsWithQuizCountQuery } from '@/store/authApi'; // Adjust this import based on your actual API hook

const AllCategoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('name');

    // Use your actual RTK Query hook
    const { data: categoriesData, error, isLoading } = useGetSujectsWithQuizCountQuery();
    console.log(categoriesData);

    // Enhanced subject icons & colors mapping
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

     // Transform your API data to match the component format
    const categories = categoriesData?.categories?.map(category => {
        const categoryName = category.name || "Other";
        const meta = subjectMeta[categoryName] || subjectMeta["Other"];
        
        return {
            id: category._id,
            name: categoryName,
            description: category.description || `Learn about ${categoryName}`,
            icon: meta.icon,
            color: meta.color,
            bgColor: meta.bgColor,
            textColor: meta.textColor,
            borderColor: meta.borderColor,
            hoverColor: meta.hoverColor,
            quizCount: category.quizCount || 0,
        };
    }) || [];

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

      const sortedCategories = [...filteredCategories].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'popular':
                return b.quizCount - a.quizCount;
            default:
                return 0;
        }
    });

    const handleCategoryClick = (category) => {
        // Use proper navigation instead of window.location.href
        // Depending on your routing library (React Router, Next.js, etc.)
        // Example with React Router: navigate(`/quizzes?category=${encodeURIComponent(category.name)}`);
        window.location.href = `/quizzes?category=${encodeURIComponent(category.name)}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl">
                    <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4 font-medium">
                        {error?.data?.message || 'Failed to fetch categories. Please try again later.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-25 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
                            <div className="text-2xl font-bold">{categories.length}</div>
                            <div className="text-blue-100 text-sm">Categories</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                            <div className="text-2xl font-bold">{categories.reduce((sum, cat) => sum + cat.quizCount, 0)}</div>
                            <div className="text-green-100 text-sm">Total Quizzes</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white lg:block hidden">
                            <div className="text-2xl font-bold">{categories.filter(cat => cat.quizCount > 5).length}</div>
                            <div className="text-purple-100 text-sm">Active Topics</div>
                        </div>
                    </div>

                    {/* Search and Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg bg-white/90 backdrop-blur-sm"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm shadow-lg bg-white/90 backdrop-blur-sm"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="popular">Most Quizzes</option>
                            </select>

                            <div className="flex border border-gray-200 rounded-2xl overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
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
                {sortedCategories.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-white/20">
                            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
                            <p className="text-gray-600">Try adjusting your search term.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedCategories.map((category) => {
                                    const IconComponent = category.icon;
                                    return (
                                        <div
                                            key={category.id}
                                            className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border-2 ${category.borderColor} ${category.hoverColor} hover:scale-105`}
                                            onClick={() => handleCategoryClick(category)}
                                        >
                                            {/* Header with gradient background */}
                                            <div className={`${category.bgColor} p-6 relative overflow-hidden`}>
                                                <div className="flex flex-col items-center text-center">
                                                    <div className={`w-20 h-20 flex items-center justify-center rounded-3xl text-white shadow-2xl mb-4 ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                                                        <IconComponent className="w-10 h-10" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {category.name}
                                                    </h3>
                                                </div>
                                                
                                                {/* Decorative elements */}
                                                <div className="absolute -top-4 -right-4 w-16 h-16 opacity-10">
                                                    <div className={`w-full h-full rounded-full ${category.color}`}></div>
                                                </div>
                                                <div className="absolute -bottom-2 -left-2 w-12 h-12 opacity-10">
                                                    <div className={`w-full h-full rounded-full ${category.color}`}></div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                    {category.description}
                                                </p>

                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        <span>{category.quizCount} quizzes</span>
                                                    </div>
                                                </div>

                                                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center group-hover:shadow-lg">
                                                    Explore Quizzes
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                                {sortedCategories.map((category) => {
                                    const IconComponent = category.icon;
                                    return (
                                        <div
                                            key={category.id}
                                            className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${category.borderColor} ${category.hoverColor} p-6`}
                                            onClick={() => handleCategoryClick(category)}
                                        >
                                            <div className="flex items-center space-x-6">
                                                {/* Icon */}
                                                <div className={`w-20 h-20 flex items-center justify-center rounded-3xl text-white shadow-2xl ${category.color} flex-shrink-0`}>
                                                    <IconComponent className="w-10 h-10" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-2xl font-bold text-gray-900">
                                                            {category.name}
                                                        </h3>
                                                    </div>

                                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                                        {category.description}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                <span>{category.quizCount} quizzes available</span>
                                                            </div>
                                                        </div>

                                                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-6 rounded-2xl font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl">
                                                            Explore
                                                            <ArrowRight className="w-4 h-4 ml-2" />
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

export default AllCategoryPage;