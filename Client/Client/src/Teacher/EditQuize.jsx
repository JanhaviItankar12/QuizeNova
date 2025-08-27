import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Eye, ChevronLeft, ChevronRight, Plus, Minus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDeleteQuestionFromQuizMutation, useDeleteQuizMutation, useGetQuizByIdQuery, useUpdateQuizMutation } from "@/store/quizeApi";
import { useNavigate, useParams } from "react-router-dom";

// Constants
const SUBJECTS = [
    { value: "math", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
    { value: "history", label: "History" },
    { value: "geography", label: "Geography" },
    { value: "art", label: "Art" },
    { value: "music", label: "Music" },
    { value: "other", label: "Other" }
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



export default function EditQuize() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState('details');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;

    const { data: QuizeData } = useGetQuizByIdQuery(id);
    const [updateQuize, { data: updatedData }] = useUpdateQuizMutation();
    const [deleteQuestionFromQuiz, { data: deletedQuestionData }] = useDeleteQuestionFromQuizMutation();
    const [deleteQuize, { data: deletedQuizeData }] = useDeleteQuizMutation();

    const [quiz, setQuiz] = useState({
        id: null,
        title: "",
        description: "",
        subject: "other",
        difficulty: "beginner",
        time_limit: 30,
        questions: [],
        is_published: false
    });

    const [originalQuestionCount, setOriginalQuestionCount] = useState(0);



    useEffect(() => {
        if (QuizeData) {
            setQuiz(QuizeData);
            setOriginalQuestionCount(QuizeData.questions?.length || 0);
            setIsLoading(false);
        }
    }, [QuizeData]);


    const updateQuizDetails = (field, value) => {
        setQuiz(prev => ({ ...prev, [field]: value }));
        setHasUnsavedChanges(true);
    };

    const updateQuestion = (field, value) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === currentQuestionIndex ? { ...q, [field]: value } : q
            )
        }));
        setHasUnsavedChanges(true);
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
        setHasUnsavedChanges(true);
    };

const addQuestion = () => {
    const newQuestion = {
        id: Date.now(),
        question_text: "",
        type: "multiple_choice",
        options: ["", "", "", ""],
        correct_answer: "",
        points: 1
    };

    // First update quiz
    setQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
    }));

    // Then update index based on *new* length
    setCurrentQuestionIndex(prevIndex => quiz.questions.length); 
    // quiz.questions.length here = old length, so the new index is oldLength
    // which is correct for the new last question
    setHasUnsavedChanges(true);
};


    const removeQuestion = async (questionIndex) => {
        const questionToDelete = quiz.questions[questionIndex];

        if (quiz.questions.length <= 1) {
            alert("Quiz must have at least one question,You can't delete this question.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this question?")) {
            // Remove from UI first
            setQuiz(prev => ({
                ...prev,
                questions: prev.questions.filter((_, i) => i !== questionIndex)
            }));

            setHasUnsavedChanges(true);

            // Call API only if the question exists in DB (i.e., has an _id)
            if (questionToDelete._id) {
                try {
                    await deleteQuestionFromQuiz({ quizId: quiz._id, qid: questionToDelete._id }).unwrap();
                    console.log("Question deleted from backend");
                } catch (err) {
                    console.error("Error deleting question from backend:", err);
                    alert("Failed to delete question from server.");
                }
            }

            // Adjust current question index
            if (currentQuestionIndex >= quiz.questions.length - 1) {
                setCurrentQuestionIndex(Math.max(0, quiz.questions.length - 2));
            }
        }
    };


    const handleSaveQuiz = async (publish = false) => {
        setIsSaving(true);
        try {
            const quizData = {
                ...quiz,
                is_published: publish,
                total_questions: quiz.questions.length
            };


            await updateQuize({ id: quiz._id, quizData }).unwrap();
            alert(`Quiz ${publish ? 'published' : 'saved'} successfully!`);
            refetch();
            setHasUnsavedChanges(false);

        } catch (error) {
            console.error('Error updating quiz:', error);
            alert('Error updating quiz. Please try again.');
        }
        setIsSaving(false);
    };

    const handleGoBack = () => {
        if (hasUnsavedChanges) {
            if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                alert("Navigate back to quiz list");
                navigate(-1);
            }
        } else {
            alert("Navigate back to quiz list");
            navigate(-1);
        }
    };

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

    const canPublish = quiz.title && quiz.description && allQuestionsComplete;

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-200 rounded"></div>
                            <div>
                                <div className="h-8 bg-slate-200 rounded w-64 mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-48"></div>
                            </div>
                        </div>
                        <div className="bg-white/70 rounded-xl p-6 shadow-lg">
                            <div className="space-y-4">
                                <div className="h-6 bg-slate-200 rounded w-32"></div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="h-10 bg-slate-200 rounded"></div>
                                    <div className="h-10 bg-slate-200 rounded"></div>
                                </div>
                                <div className="h-20 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 mt-16  md:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Edit Quiz</h1>
                        <p className="text-slate-600">Modify your quiz details and questions</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={quiz.is_published ? "default" : "secondary"}>
                            {quiz.is_published ? 'Published' : 'Draft'}
                        </Badge>

                        <Button
                            variant="destructive"
                            className={"bg-red-50 text-red-600 hover:bg-red-100"}
                            onClick={async () => {
                                if (window.confirm("Are you sure you want to delete this entire quiz? This cannot be undone.")) {
                                    try {
                                        await deleteQuize(id).unwrap(); // pass the quiz id
                                        alert("Quiz deleted successfully.");
                                        navigate("/teacher/quizzes"); // redirect back to quiz list
                                    } catch (error) {
                                        console.error("Failed to delete quiz:", error);
                                        alert("Failed to delete quiz. Please try again.");
                                    }
                                }
                            }}
                        >
                            Delete Quiz
                        </Button>

                        {hasUnsavedChanges && (
                            <Badge variant="outline" className="text-amber-600 border-amber-200">
                                Unsaved Changes
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Unsaved Changes Alert */}
                {hasUnsavedChanges && (
                    <Alert className="mb-6 border-amber-200 bg-amber-50">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-700">
                            You have unsaved changes. Don't forget to save your quiz!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === 'details' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                            }`}>
                            1
                        </div>
                        <div className={`h-1 w-16 ${currentStep === 'questions' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === 'questions' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
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
                                        onChange={(e) => updateQuizDetails('title', e.target.value)}
                                        className="bg-white/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Select value={quiz.subject} onValueChange={(value) => updateQuizDetails('subject', value)}>
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
                                    onChange={(e) => updateQuizDetails('description', e.target.value)}
                                    className="bg-white/50 h-20"
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Total Questions</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={quiz.questions.length}
                                            disabled
                                            className="bg-gray-100"
                                        />
                                        <div className="flex gap-1">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={addQuestion}
                                                className="w-8 h-8 hover:bg-green-50"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => removeQuestion(currentQuestionIndex)}
                                                disabled={quiz.questions.length <= 1}
                                                className="w-8 h-8 hover:bg-red-50"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Original: {originalQuestionCount} questions
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty</Label>
                                    <Select value={quiz.difficulty} onValueChange={(value) => updateQuizDetails('difficulty', value)}>
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
                                        onChange={(e) => updateQuizDetails('time_limit', parseInt(e.target.value))}
                                        className="bg-white/50"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={() => setCurrentStep('questions')}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                                >
                                    Edit Questions
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
                                    Edit the details for this question
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    Question {currentQuestionIndex + 1}
                                </Badge>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeQuestion(currentQuestionIndex)}
                                    
                                    className="text-red-600 hover:bg-red-50"
                                >
                                    Delete
                                </Button>
                            </div>
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
                                    <div className={`w-3 h-3 rounded-full ${isQuestionComplete ? 'bg-green-500' : 'bg-yellow-500'
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
                            <Button
                                variant="outline"
                                onClick={addQuestion}
                                className="hover:bg-green-50 border-green-200 text-green-600"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Question
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
                                        onClick={() => handleSaveQuiz(false)}
                                        disabled={isSaving || !quiz.title}
                                        className="hover:bg-slate-50"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        onClick={() => handleSaveQuiz(true)}
                                        disabled={isSaving || !canPublish}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        {quiz.is_published ? 'Update & Publish' : 'Publish Quiz'}
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