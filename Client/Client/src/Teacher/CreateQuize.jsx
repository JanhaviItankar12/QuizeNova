import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Save, Eye, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateQuizMutation } from "@/store/quizeApi";
import { toast } from "sonner";

// Constants
const SUBJECTS = [
  { value: "Technology", label: "Technology" },
  { value: "Science", label: "Science" },
  { value: "History", label: "History" },
  { value: "Geography", label: "Geography" },
  { value: "Sports", label: "Sports" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Business", label: "Business" },
  { value: "Health", label: "Health" },
  { value: "Art", label: "Art" },
  { value: "Literature", label: "Literature" },
  { value: "Other", label: "Other" }
  
];

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" }
];

const QUESTION_TYPES = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "true_false", label: "True/False" },
  { value: "short_answer", label: "Short Answer" }
];

export default function CreateQuiz() {
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState('details'); // 'details' or 'questions'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestionsSet, setTotalQuestionsSet] = useState(false);
  const navigate = useNavigate();

   const [createQuiz,{isLoading,error}]=useCreateQuizMutation();

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    subject: "other",
    difficulty: "beginner",
    time_limit: 30,
    total_questions: 5,
    questions: [],
    is_published: false
  });

  const initializeQuestions = (count) => {
    const questions = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      question_text: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      correct_answer: "",
      points: 1
    }));
    
    setQuiz(prev => ({ ...prev, questions }));
    setTotalQuestionsSet(true);
    setCurrentStep('questions');
    setCurrentQuestionIndex(0);
  };

  const updateQuestion = (field, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === currentQuestionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateQuestionOption = (optionIndex, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === currentQuestionIndex 
          ? { ...q, options: q.options.map((opt, j) => j === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const handleCreateQuiz = async (publish = false) => {
    setIsCreating(true);
    try {
      const quizData = {
        ...quiz,
        is_published: publish,
        total_questions: quiz.questions.length
      };
      
     await createQuiz(quizData).unwrap();
     toast.success(`Quiz ${publish ? 'published' : 'saved as draft'} successfully`);
     handleGoBack();
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    }
    setIsCreating(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const canProceedToQuestions = quiz.title && quiz.description && quiz.total_questions > 0;
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isQuestionComplete = currentQuestion && 
    currentQuestion.question_text && 
    currentQuestion.correct_answer && 
    (currentQuestion.type !== 'multiple_choice' || currentQuestion.options.every(opt => opt.trim()));

  const allQuestionsComplete = quiz.questions.every(q => 
    q.question_text && 
    q.correct_answer && 
    (q.type !== 'multiple_choice' || q.options.every(opt => opt.trim()))
  );

  const resetQuestions = () => {
    setQuiz(prev => ({ ...prev, questions: [] }));
    setTotalQuestionsSet(false);
    setCurrentStep('details');
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="p-4 mt-16 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handleGoBack}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Create New Quiz</h1>
            <p className="text-slate-600">Build engaging quizzes for your students</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep === 'details' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
            }`}>
              1
            </div>
            <div className={`h-1 w-16 ${currentStep === 'questions' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep === 'questions' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>

        {currentStep === 'details' && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter quiz title..."
                    value={quiz.title}
                    onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  
                  <Select value={quiz.subject} onValueChange={(value) => setQuiz(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(subject => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this quiz covers..."
                  value={quiz.description}
                  onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/50 h-20"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_questions">Total Questions *</Label>
                  <Input
                    id="total_questions"
                    type="number"
                    min="1"
                    max="50"
                    value={quiz.total_questions}
                    onChange={(e) => setQuiz(prev => ({ ...prev, total_questions: parseInt(e.target.value) || 1 }))}
                    className="bg-white/50"
                    disabled={totalQuestionsSet}
                  />
                  {totalQuestionsSet && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetQuestions}
                      className="text-blue-600 hover:text-blue-700 text-xs p-1 h-auto"
                    >
                      Change Question Count
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={quiz.difficulty} onValueChange={(value) => setQuiz(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map(diff => (
                        <SelectItem key={diff.value} value={diff.value}>
                          {diff.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                  <Input
                    id="time_limit"
                    type="number"
                    min="5"
                    value={quiz.time_limit}
                    onChange={(e) => setQuiz(prev => ({ ...prev, time_limit: parseInt(e.target.value) }))}
                    className="bg-white/50"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => initializeQuestions(quiz.total_questions)}
                  disabled={!canProceedToQuestions}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  Add Questions
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'questions' && currentQuestion && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Fill in the details for this question
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Question {currentQuestionIndex + 1}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Textarea
                    placeholder="Enter your question..."
                    value={currentQuestion.question_text}
                    onChange={(e) => updateQuestion('question_text', e.target.value)}
                    className="bg-white/70 h-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={currentQuestion.type}
                    onValueChange={(value) => updateQuestion('type', value)}
                  >
                    <SelectTrigger className="bg-white/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUESTION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {currentQuestion.type === 'multiple_choice' && (
                <div className="space-y-2">
                  <Label>Answer Options *</Label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <span className="text-sm font-medium w-8">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                          value={option}
                          onChange={(e) => updateQuestionOption(optionIndex, e.target.value)}
                          className="bg-white/70"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentQuestion.type === 'true_false' && (
                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">A.</span>
                      <Input value="True" disabled className="bg-gray-100" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">B.</span>
                      <Input value="False" disabled className="bg-gray-100" />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Correct Answer *</Label>
                  <Input
                    placeholder={
                      currentQuestion.type === 'multiple_choice' ? 'A, B, C, or D' :
                      currentQuestion.type === 'true_false' ? 'True or False' :
                      'Enter correct answer'
                    }
                    value={currentQuestion.correct_answer}
                    onChange={(e) => updateQuestion('correct_answer', e.target.value)}
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentQuestion.points}
                    onChange={(e) => updateQuestion('points', parseInt(e.target.value))}
                    className="bg-white/70"
                  />
                </div>
              </div>

              {/* Question Status */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isQuestionComplete ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm text-slate-600">
                    {isQuestionComplete ? 'Question complete' : 'Question incomplete'}
                  </span>
                </div>
                <div className="text-sm text-slate-500">
                  {quiz.questions.filter(q => q.question_text && q.correct_answer).length} of {quiz.questions.length} questions completed
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation and Action Buttons */}
        {currentStep === 'questions' && (
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('details')}
                className="hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Details
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleCreateQuiz(false)}
                    disabled={isCreating || !quiz.title || quiz.questions.length === 0}
                    className="hover:bg-slate-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleCreateQuiz(true)}
                    disabled={isCreating || !quiz.title || quiz.questions.length === 0 || !allQuestionsComplete}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Publish Quiz
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {currentStep === 'questions' && (
          <div className="mt-6">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` 
                }}
              ></div>
            </div>
            <p className="text-center text-sm text-slate-600 mt-2">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}