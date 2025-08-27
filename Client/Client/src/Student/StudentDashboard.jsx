import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { BookOpen, TrendingUp, Clock, Award, Play, BarChart3 } from "lucide-react";
import { useGetRecentPublishedQuizzesQuery } from "@/store/quizeApi";
import { useGetCurrentUserQuery, useGetRecentAttemptedQuizzesQuery, useGetUserSubmissionsQuery } from "@/store/authApi";
import RecentQuizzes from "./RecentQuizzes";
import RecentAttempts from "./RecentAttempts";

// Welcome Section Component
 import WelcomeSection from "./WelcomeSection";
// Stats Overview Component
 import StatsOverview from "./StatsOverview";

// Main Dashboard Component
export default function StudentDashboard() {
  
  
  const params=useParams();
  const id=params.id;

 const {data:currentUser}=useGetCurrentUserQuery(id);
 const {data: quizzesData, isLoading, isError} = useGetRecentPublishedQuizzesQuery();
 const {data: attemptsData, isLoading:attemptsLoading, isError:attemptsError} = useGetRecentAttemptedQuizzesQuery();
  const { 
     data: submissions, 
     isLoading: submissionsLoading, 
     error: submissionsError,
     refetch: refetchSubmissions 
   } = useGetUserSubmissionsQuery(
     id);
   

 if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  

  return (
    <div className="p-6 mt-16 space-y-8 max-w-7xl mx-auto">
      <WelcomeSection user={currentUser} attempts={submissions} />
      
      <StatsOverview attempts={submissions}  />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RecentQuizzes quizzes={quizzesData} loading={isLoading} />
          <RecentAttempts attemptData={attemptsData} />
        </div>
        
        <div className="space-y-6">
          {/* <SubjectProgress attempts={attempts} /> */}
          
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Award className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Ready for more?</h3>
                  <p className="text-blue-100">Challenge yourself with new quizzes</p>
                </div>
              </div>
              <Link to={`/student/${id}/take-quiz`}>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                  <Play className="w-4 h-4 mr-2" />
                  Start New Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}