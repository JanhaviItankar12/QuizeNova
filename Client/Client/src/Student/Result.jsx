import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TrendingUp, Clock, Target, Award } from "lucide-react";
import { motion } from "framer-motion";
import ResultsHeader from "./Result/ResultHeader";
import ResultChart from "./Result/ResultChart";
import AttemptList from "./Result/AttemptList";
import SubjectBreakdown from "./Result/SubjectBreakdown";
import { useGetCurrentUserQuery, useGetUserSubmissionsQuery } from "@/store/authApi";
import { useEffect } from "react";

export default function Result() {
  // Fetch current user
  const { 
    data: user, 
    isLoading: userLoading, 
    error: userError 
  } = useGetCurrentUserQuery();

  const id = user?.user?._id;

  // Setup submissions query with skip (initially skipped)
  const { 
    data: submissions, 
    isLoading: submissionsLoading, 
    error: submissionsError,
    refetch: refetchSubmissions 
  } = useGetUserSubmissionsQuery(id, {
    skip: !id,
  });

  // 🔑 Once id is available, refetch submissions
  useEffect(() => {
    if (id) {
      refetchSubmissions();
    }
  }, [id, refetchSubmissions]);

  // Combined loading state
  const loading = userLoading || submissionsLoading;

  // Error handling
  if (userError || submissionsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">⚠️ Error Loading Results</div>
            <p className="text-sm text-slate-600 mb-4">
              {userError?.data?.message || submissionsError?.data?.message || "Something went wrong"}
            </p>
            <button 
              onClick={() => refetchSubmissions()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading || !id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const attempts = submissions || [];

  return (
    <div className="p-6 mt-16 space-y-8 max-w-7xl mx-auto">
      <ResultsHeader attempts={attempts} user={user} />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ResultChart attempts={attempts} />
          <AttemptList attempts={attempts} />
        </div>
        
        <div className="space-y-6">
          <SubjectBreakdown attempts={attempts} />
        </div>
      </div>
    </div>
  );
}
