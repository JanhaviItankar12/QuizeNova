import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Submission from "../models/submission.model.js";
import Quiz from "../models/quize.model.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (role === 'admin') {
            return res.status(403).json({ message: "Admin signup not allowed" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        await newUser.save();

        //generate JWT
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            message: "Signup successful",
            user: { id: newUser._id, name: newUser.name, role: newUser.role },
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: "Signup failed", error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //    find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            user: { id: user._id, name: user.name, role: user.role },
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: "Login failed", error: error.message });
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch user", error: error.message });
    }
}

//user quize controller
// recent attempted quizes
export const getRecentAttempts = async (req, res) => {
    try {
        const userId = req.user.id;

        const attempts = await Submission.find({ student: userId })
            .sort({ submittedAt: -1 })
            .limit(5)
            .populate("quiz");

        // normalize attempts
        const formattedAttempts = attempts.map(a => {
            const totalQuestions = a.answers.length;
            const percentage = totalQuestions > 0 ? (a.score / totalQuestions) * 100 : 0;

            return {
                id: a._id,
                quiz: a.quiz ? { title: a.quiz.title } : null,
                score: a.score,
                max_score: totalQuestions,
                percentage,
                created_date: a.submittedAt,
                time_taken: null // add if you store timeTaken later
            };
        });

        return res.status(200).json({ attempts: formattedAttempts });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch attempts", error: error.message });
    }
};


export const takeQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { qid } = req.params;
    const { answers, timeTaken } = req.body;

    // Fetch quiz
    const quiz = await Quiz.findById(qid);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Calculate score + build answers
    let score = 0;
    const optionLetters = ["A", "B", "C", "D"];

    const submissionAnswers = quiz.questions.map((question, index) => {
      const selectedIndex = answers[index] ?? -1;
      const selectedOption = selectedIndex !== -1 ? optionLetters[selectedIndex] : null;
      const isCorrect = selectedOption === question.correct_answer;

      if (isCorrect) {
        score += question.points || 1;
      }

      return {
        questionId: index + 1,
        selectedOption,
        isCorrect
      };
    });

    const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const percentage = (score / maxScore) * 100;

    // Save submission
    const submission = new Submission({
      quiz: qid,
      student: userId,
      answers: submissionAnswers,
      score,
      submittedAt: new Date(),
      timeTaken
    });

    await submission.save();

    // Return full result object
    return res.status(200).json({
      message: "Quiz submitted",
      submissionId: submission._id,
      score,
      maxScore,
      percentage,
      timeSpent: timeTaken,
      answers: submissionAnswers.map(a => a.selectedOption),
      quiz: {
        title: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        questions: quiz.questions
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Failed to submit quiz", error: error.message });
  }
};

