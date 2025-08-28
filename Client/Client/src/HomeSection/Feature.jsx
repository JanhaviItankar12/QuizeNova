import React from "react";
import { motion } from "framer-motion";
import { 
  PenTool, 
  Brain, 
  BarChart3, 
  Users, 
  Clock, 
  Shield,
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const features = [
  {
    icon: PenTool,
    title: "Intuitive Quiz Builder",
    description: "Create stunning quizzes with our drag-and-drop builder. Add images, videos, and rich formatting effortlessly.",
    color: "from-blue-500 to-cyan-500",
    delay: 0.1
  },
   {
  icon: Sparkles,
  title: "Custom Branding",
  description: "Personalize your quizzes with your own logo, colors, and themes to match your brand identity.",
  color: "from-pink-500 to-yellow-500",
  delay: 0.7
   },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track performance, identify knowledge gaps, and optimize your quizzes with detailed insights and reports.",
    color: "from-green-500 to-emerald-500",
    delay: 0.3
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team to create and manage quizzes. Assign roles and track contributions seamlessly.",
    color: "from-orange-500 to-red-500",
    delay: 0.4
  },
  {
    icon: Clock,
    title: "Real-time Results",
    description: "Get instant feedback and results. Monitor quiz-taking progress and engagement in real-time.",
    color: "from-indigo-500 to-blue-500",
    delay: 0.5
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is protected with enterprise-grade security. 99.9% uptime guaranteed for uninterrupted learning.",
    color: "from-teal-500 to-cyan-500",
    delay: 0.6
  }
];

export default function Feature() {
    const navigate=useNavigate();
    const { user, isAuthenticated } = useSelector(store => store.auth);

    const handleClick = () => {
    if (isAuthenticated && user?.role === "student") {
      navigate(`/student/${user.id}/take-quiz`);
    } else if(isAuthenticated && user?.role==="teacher"){
      navigate("/teacher/createQuize");
    }
    else{
      navigate("/login");
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to create
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> amazing quizzes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From intuitive creation tools to powerful analytics, we've built everything you need to engage your audience and measure success.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group-hover:-translate-y-2">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute bottom-10 left-1/4 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-10 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <Target className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to get started?
            </h3>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of educators and businesses creating engaging quizzes with our platform.
            </p>
            <button
             onClick={handleClick}
             className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors inline-flex items-center">
              Start Building Now
              <Zap className="ml-2 w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}