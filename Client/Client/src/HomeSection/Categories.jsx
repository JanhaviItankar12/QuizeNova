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
  BookOpen
} from "lucide-react";

const categories = [
  {
    name: "Technology",
    icon: Code,
    count: "1,247",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    delay: 0.1
  },
  {
    name: "Science",
    icon: Beaker,
    count: "892",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    delay: 0.2
  },
  {
    name: "History",
    icon: Clock,
    count: "756",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    delay: 0.3
  },
  {
    name: "Geography",
    icon: Globe,
    count: "634",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    delay: 0.4
  },
  {
    name: "Sports",
    icon: Trophy,
    count: "523",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    delay: 0.5
  },
  {
    name: "Entertainment",
    icon: Tv,
    count: "445",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    delay: 0.6
  },
  {
    name: "Business",
    icon: Briefcase,
    count: "398",
    color: "from-gray-500 to-gray-700",
    bgColor: "bg-gray-50",
    delay: 0.7
  },
  {
    name: "Health",
    icon: Heart,
    count: "367",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50",
    delay: 0.8
  },
  {
    name: "Art",
    icon: Palette,
    count: "289",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    delay: 0.9
  },
  {
    name: "Literature",
    icon: BookOpen,
    count: "256",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    delay: 1.0
  }
];

export default function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Explore Quiz Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover thousands of quizzes across different topics and challenge yourself in areas you're passionate about.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: category.delay }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className={`${category.bgColor} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-2 border border-gray-100`}>
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-sm text-gray-500">
                  {category.count} quizzes
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors">
            Browse All Categories
          </button>
        </motion.div>
      </div>
    </section>
  );
}