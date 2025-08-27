import React from "react";
import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";

export default function WelcomeSection({ user, attempts }) {
  

  console.log(attempts);

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to challenge yourself?",
      "Every question is a step forward!",
      "Knowledge is power in action!",
      "Your learning journey continues!",
      "Excellence is a habit, not an act!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome Back {user?.user.name || 'Student'}!
              </h1>
              <p className="text-blue-100 flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4" />
                {getMotivationalMessage()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{attempts?.submissions.length}</div>
              <div className="text-blue-200 text-sm">Quizzes Taken</div>
            </div>
            <div className="w-px h-12 bg-blue-300/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {attempts?.submissions.length > 0 
                  ? Math.round(attempts?.submissions.reduce((sum, a) => sum + a.percentage, 0) / attempts?.submissions.length)
                  : 0}%
              </div>
              <div className="text-blue-200 text-sm">Average Score</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}