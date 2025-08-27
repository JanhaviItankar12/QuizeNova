import Quiz from "../models/quize.model.js";

// Create Quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, subject, difficulty, time_limit, questions, is_published } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title and questions are required" });
    }

    const quiz = new Quiz({
      title,
      description,
      subject,
      difficulty,
      time_limit,
      questions,
      is_published,
      total_questions: questions.length,
      teacher: req.user.id  // comes from JWT middleware
    });

    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get Quizzes for a Teacher
export const getQuizzesByTeacher = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ teacher: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

// Get a single Quiz by ID
export const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
       
        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


// Update Quiz
export const updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        // Ensure the requesting user is the owner of the quiz
        if (quiz.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const { title, description, subject, difficulty, time_limit, questions, is_published } = req.body;

        if (title) quiz.title = title;
        if (description) quiz.description = description;
        if (subject) quiz.subject = subject;
        if (difficulty) quiz.difficulty = difficulty;
        if (time_limit) quiz.time_limit = time_limit;
        if (questions) {
            quiz.questions = questions;
            quiz.total_questions = questions.length;
        }
        if (typeof is_published === 'boolean') quiz.is_published = is_published;

        await quiz.save();
        res.status(200).json({ message: "Quiz updated successfully", quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


// Delete Quiz
export const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        // Ensure the requesting user is the owner of the quiz
        if (quiz.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        //remove is not working
        await quiz.deleteOne();
        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

//delete question from quize
export const deleteQuestionFromQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        // Ensure the requesting user is the owner of the quiz
        if (quiz.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const questionId = req.params.questionId;
        quiz.questions = quiz.questions.filter(q => q._id.toString() !== questionId);
        quiz.total_questions = quiz.questions.length;

        await quiz.save();
        res.status(200).json({ message: "Question deleted successfully", quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

//analytics
export const getQuizAnalytics = async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        // Ensure the requesting user is the owner of the quiz
        if (quiz.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        // use quize submission model Hears
        const submissions = await Submission.find({ quiz: quizId });
        const totalSubmissions = submissions.length;
        const avgScore = totalSubmissions > 0
            ? Math.round(submissions.reduce((sum, s) => sum + (s.score || 0), 0) / totalSubmissions)
            : 0;
        res.status(200).json({ totalSubmissions, avgScore, submissions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


//student side
// get all published quizzes
export const getPublishedQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ is_published: true }).sort({ createdAt: -1 });
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}



//get recent published quizzes
export const getRecentPublishedQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ is_published: true }).sort({ createdAt: -1 }).limit(5);
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}





