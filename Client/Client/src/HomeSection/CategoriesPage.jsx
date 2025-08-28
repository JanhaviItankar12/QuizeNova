import React from "react";
import { motion } from "framer-motion";
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
  Plus
} from "lucide-react";
import { useGetSujectsWithQuizCountQuery } from "@/store/authApi";
import { useNavigate } from "react-router-dom";


export default function CategoriesPage({ onCategoryClick }) {
    const navigate = useNavigate();
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

  const bgColorMapping = {
    'other': 'bg-gray-50',
    'technology': 'bg-blue-50',
    'science': 'bg-green-50',
    'history': 'bg-amber-50',
    'geography': 'bg-emerald-50',
    'sports': 'bg-orange-50',
    'entertainment': 'bg-purple-50',
    'business': 'bg-indigo-50',
    'health': 'bg-red-50',
    'art': 'bg-pink-50',
    'literature': 'bg-violet-50',
    'default': 'bg-gray-50'
  };

  const getIconComponent = (categoryName) => {
    const normalizedName = categoryName?.toLowerCase() || 'default';
    return iconMapping[normalizedName] || iconMapping['default'];
  };

  const getCategoryColor = (categoryName) => {
    const normalizedName = categoryName?.toLowerCase() || 'default';
    return colorMapping[normalizedName] || colorMapping['default'];
  };

  const getCategoryBgColor = (categoryName) => {
    const normalizedName = categoryName?.toLowerCase() || 'default';
    return bgColorMapping[normalizedName] || bgColorMapping['default'];
  };

  const { data: subjectData } = useGetSujectsWithQuizCountQuery();
  console.log(subjectData);
  const displayCategories = subjectData?.categories.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-white">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Explore Quiz Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover thousands of quizzes across different topics and challenge yourself in areas you're passionate about.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayCategories.map((category, index) => {
              const IconComponent = getIconComponent(category.name);
              const categoryColor = getCategoryColor(category.name);
              const categoryBgColor = getCategoryBgColor(category.name);
              
              return (
                <motion.div
                  key={category.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  onClick={() => onCategoryClick(category)}
                >
                  <div className={`${categoryBgColor} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-2 border border-gray-100`}>
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${categoryColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors capitalize">
                      {category.name}
                    </h3>
                    
                    <p className="text-sm text-gray-500">
                      {category.count || 0} quizzes
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button onClick={()=>navigate("/allCategories")} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2">
              <span>Browse All Categories</span>
              <Plus className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}