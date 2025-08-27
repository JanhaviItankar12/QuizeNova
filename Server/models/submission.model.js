import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [
    {
      questionId: Number,
      selectedOption: String,
      isCorrect: Boolean
    }
  ],
  score: Number,
  submittedAt: { type: Date, default: Date.now },
  timeTaken: { type: Number, required: true } // store in minutes

});

export default mongoose.model("Submission", submissionSchema);
