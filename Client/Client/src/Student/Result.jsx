import React, { useState, useEffect } from "react";
import { QuizAttempt, Quiz, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TrendingUp, Clock, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

import ResultsHeader from "../components/results/ResultsHeader";
import ResultsChart from "../components/results/ResultsChart";
import AttemptsList from "../components/results/AttemptsList";
import SubjectBreakdown from "../components/results/SubjectBreakdown";

export default function Result() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const userAttempts = await QuizAttempt.filter(
        { student_email: currentUser.email }, 
        "-created_date"
      );
      
      // Get quiz details for each attempt
      const attemptsWithQuizDetails = await Promise.all(
        userAttempts.map(async (attempt) => {
          try {
            const quiz = await Quiz.get(attempt.quiz_id);
            return { ...attempt, quiz };
          } catch {
            return attempt;
          }
        })
      );
      
      setAttempts(attemptsWithQuizDetails);
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <ResultsHeader attempts={attempts} />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ResultsChart attempts={attempts} />
          <AttemptsList attempts={attempts} />
        </div>
        
        <div className="space-y-6">
          <SubjectBreakdown attempts={attempts} />
        </div>
      </div>
    </div>
  );
}