import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Trophy, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Create & Take
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
                Amazing Quizzes
              </span>
            </h1>

            <p className="text-xl text-indigo-100 mb-8 max-w-lg">
              Build engaging quizzes in minutes, challenge your knowledge, and track your progress with our intuitive platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8 py-6 text-lg group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/20"
            >
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-indigo-200 text-sm">Quizzes Created</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-indigo-200 text-sm">Active Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">99%</div>
                <div className="text-indigo-200 text-sm">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right content - Interactive demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Quiz card mockup */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">JavaScript Fundamentals</h3>
                      <p className="text-sm text-gray-500">10 questions • 5 min</p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Beginner
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900 mb-3">
                      What is the correct way to declare a variable in JavaScript?
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center p-3 bg-indigo-50 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                        <div className="w-4 h-4 border-2 border-indigo-600 rounded-full mr-3 bg-indigo-600"></div>
                        <span className="text-gray-800">let myVariable = 'Hello';</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3"></div>
                        <span className="text-gray-800">variable myVariable = 'Hello';</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3"></div>
                        <span className="text-gray-800">var = 'Hello' myVariable;</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-xl font-semibold shadow-lg"
              >
                +100 points!
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-green-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
                234 completed
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
