import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["multiple_choice", "true_false", "short_answer"], 
    default: "multiple_choice" 
  },
  options: [{ type: String }], // For multiple choice
  correct_answer: { type: String, required: true },
  points: { type: Number, default: 1 }
});

//quize schema

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { 
    //take from subject model
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true

  },
  difficulty: { 
    type: String, 
    enum: ["beginner", "intermediate", "advanced"], 
    default: "beginner" 
  },
  time_limit: { type: Number, default: 30 }, // minutes
  questions: [questionSchema],
  is_published: { type: Boolean, default: false },
  total_questions: { type: Number, default: 0 },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Quiz", quizSchema);
