import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import QuizeBrowser from "./QuizeBrowser";
import QuizeSession from "./QuizeSession";
import QuizeComplete from "./QuizeComplete";
import { useGetPublishedQuizzesQuery, useTakeQuizMutation } from "@/store/authApi";
import { useGetQuizByIdQuery } from "@/store/quizeApi";
import { useParams } from "react-router-dom";

export default function TakeQuize() {
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const params=useParams();
  const id=params.id;

  // fetch all published quizzes
  const { data: publishedQuizeData, isLoading: publishedQuizeLoading, isError } =
    useGetPublishedQuizzesQuery();

  // fetch quiz details by ID (only when quiz is selected)
  const { data: quizDetails, isLoading: quizDetailsLoading } =
    useGetQuizByIdQuery(selectedQuizId, { skip: !selectedQuizId });

  // mutation to submit quiz attempt
  const [takeQuiz, { isLoading: takeQuizLoading }] = useTakeQuizMutation();

  const handleQuizSelect = (quiz) => {
    setSelectedQuizId(quiz._id); 
    setStartTime(Date.now());  
    setQuizStarted(true);
  };

const handleQuizComplete = async (finalAnswers, timeSpent) => {
  try {
    const result = await takeQuiz({
      id, 
      qid: selectedQuizId, 
      answers: finalAnswers, 
      timeTaken: timeSpent  // 
    }).unwrap();

    setFinalResults(result);
    setQuizCompleted(true);
  } catch (error) {
    console.error("Failed to submit quiz:", error);
  }
};


  const resetQuiz = () => {
    setSelectedQuizId(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setFinalResults(null);
  };

  if (publishedQuizeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-600 text-center mt-10">Failed to load quizzes.</div>;
  }

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <AnimatePresence mode="wait">
        {!quizStarted && (
          <QuizeBrowser 
            quizzes={publishedQuizeData || []}
            onQuizSelect={handleQuizSelect}
          />
        )}

        {quizStarted && !quizCompleted && (
          <>
            {quizDetailsLoading ? (
              <div className="text-center py-10">Loading quiz...</div>
            ) : (
              <QuizeSession 
                quiz={quizDetails}   // send fetched quiz details
                onComplete={handleQuizComplete}
                onExit={resetQuiz}
              />
            )}
          </>
        )}

        {quizCompleted && (
          <QuizeComplete 
            results={finalResults}
            onReturnToBrowser={resetQuiz}
          />
        )}
      </AnimatePresence>
    </div>
  );
}