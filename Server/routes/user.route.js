import express from "express";
import { getCurrentUser, getRecentAttempts, login, signup, takeQuiz } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { studentOnly } from "../middleware/student.js";
import { getPublishedQuizzes } from "../controller/quize.controller.js";

const router=express.Router();

// auth routes
router.route("/signup").post(signup);
router.route("/login").post(login);

router.route("/auth/me").get(authMiddleware,getCurrentUser);

//published quizes
router.route("/publish-quize").get(authMiddleware,getPublishedQuizzes);

//recent attempted quizes
router.route("/student/recent-attempts").get(authMiddleware,studentOnly,getRecentAttempts);
router.route("/student/:id/take-quize/:qid").post(authMiddleware,studentOnly,takeQuiz);


export default router