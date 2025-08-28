import React from "react";
import { 
  Code, 
  Beaker, 
  Clock, 
  Globe, 
  Trophy, 
  Tv,
  Briefcase,
  Heart,
  Palette,
  BookOpen,
  ChevronLeft, 
  Search, 
  User 
} from "lucide-react";
import { useGetQuizeByCategoryQuery } from "@/store/authApi";

export default function Category({ category, onBackClick }) {
  const iconMapping = {
    'other': Code,
    'technology': Code,
    'science': Beaker,
    'history': Clock,
    'geography': Globe,
    'sports': Trophy,
    'entertainment': Tv,
    'business': Briefcase,
    'health': Heart,
    'art': Palette,
    'literature': BookOpen,
    'default': Code
  };

  const colorMapping = {
    'other': 'from-gray-500 to-gray-600',
    'technology': 'from-blue-500 to-blue-600',
    'science': 'from-green-500 to-green-600',
    'history': 'from-amber-500 to-amber-600',
    'geography': 'from-emerald-500 to-emerald-600',
    'sports': 'from-orange-500 to-orange-600',
    'entertainment': 'from-purple-500 to-purple-600',
    'business': 'from-indigo-500 to-indigo-600',
    'health': 'from-red-500 to-red-600',
    'art': 'from-pink-500 to-pink-600',
    'literature': 'from-violet-500 to-violet-600',
    'default': 'from-gray-500 to-gray-600'
  };

  const getIconComponent = (categoryName) => {
    const normalizedName = categoryName?.toLowerCase() || 'default';
    return iconMapping[normalizedName] || iconMapping['default'];
  };

  const getCategoryColor = (categoryName) => {
    const normalizedName = categoryName?.toLowerCase() || 'default';
    return colorMapping[normalizedName] || colorMapping['default'];
  };

  const { data: categoryQuizzes, isLoading: quizzesLoading } = useGetQuizeByCategoryQuery(category?.id, {
    skip: !category?.id
  });

  const IconComponent = getIconComponent(category?.name);
  const categoryColor = getCategoryColor(category?.name);

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Category Header */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={onBackClick}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Categories</span>
        </button>

        <div className="flex items-center space-x-6 mb-8">
          <div className={`bg-gradient-to-r ${categoryColor} w-20 h-20 rounded-3xl flex items-center justify-center`}>
            <IconComponent className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">{category?.name}</h1>
            <p className="text-gray-600 text-lg mb-2">{category?.description || `Explore ${category?.name} quizzes to test your knowledge and learn something new.`}</p>
            <p className="text-gray-500">
              {category?.count || 0} quizzes available
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className={`bg-gradient-to-r ${categoryColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{category?.count || 0}</p>
                <p className="text-gray-500">Total Quizzes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-gray-500">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1.2k</p>
                <p className="text-gray-500">Active Learners</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Sort */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>All Difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Sort by: Popular</option>
              <option>Sort by: Newest</option>
              <option>Sort by: Rating</option>
              <option>Sort by: Duration</option>
            </select>
          </div>
          <p className="text-gray-500">
            Showing {categoryQuizzes?.length || 0} quizzes
          </p>
        </div>

        {/* Loading State */}
        {quizzesLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading quizzes...</p>
          </div>
        )}

        {/* No Results Found */}
        {!quizzesLoading && (!categoryQuizzes || categoryQuizzes.length === 0) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Results Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any quizzes in the {category?.name} category yet. 
              New quizzes are added regularly, so check back soon!
            </p>
            <div className="space-x-4">
              <button 
                onClick={onBackClick}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Explore Other Categories
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Request Quiz Topic
              </button>
            </div>
          </div>
        )}

        {/* Quiz Grid */}
        {!quizzesLoading && categoryQuizzes && categoryQuizzes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryQuizzes.map((quiz, index) => (
              <div key={quiz.id || index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-r ${categoryColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    quiz.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {quiz.difficulty || 'Medium'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {quiz.title || quiz.name}
                </h3>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {quiz.description || `Test your knowledge in ${category?.name} with this comprehensive quiz.`}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{quiz.questions || quiz.questionCount || Math.floor(Math.random() * 20) + 10} questions</span>
                    <span>•</span>
                    <span>{quiz.duration || Math.floor(Math.random() * 20) + 10} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <span className="text-sm text-gray-600">{(Math.random() * 2 + 3).toFixed(1)}</span>
                  </div>
                </div>
                
                <button className={`w-full bg-gradient-to-r ${categoryColor} text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200`}>
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 