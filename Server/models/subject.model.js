import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Subject = mongoose.model("Subject", subjectSchema);

// Predefined subjects
const predefinedSubjects = [
  { name: "Technology", icon: "💻" },
  { name: "Science", icon: "🔬" },
  { name: "History", icon: "📜" },
  { name: "Geography", icon: "🌍" },
  { name: "Sports", icon: "🏆" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Business", icon: "💼" },
  { name: "Health", icon: "❤️" },
  { name: "Art", icon: "🎨" },
  { name: "Literature", icon: "📖" },
  { name: "Other", icon: "❓" },
];

// Seeder function
export async function seedSubjects() {
  try {
    for (const subj of predefinedSubjects) {
      const exists = await Subject.findOne({ name: subj.name });
      if (!exists) {
        await Subject.create(subj);
      }
    }
    console.log(" Subjects seeding complete");
  } catch (err) {
    console.error(" Error seeding subjects:", err);
  }
}

export default Subject;
