import express from 'express';
import { createQuiz, deleteQuestionFromQuiz, deleteQuiz, getQuizById, getQuizzesByTeacher, getRecentPublishedQuizzes, updateQuiz } from '../controller/quize.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { teacherOnly } from '../middleware/teacher.js';
import { studentOnly } from '../middleware/student.js';

const router = express.Router();

router.route("/getQuize/:id").get(authMiddleware,getQuizById);

//create quize
router.route("/teacher/create-quize").post(authMiddleware,teacherOnly,createQuiz);
router.route("/teacher/quizes").get(authMiddleware,teacherOnly,getQuizzesByTeacher);
router.route("/teacher/editQuize/:id").put(authMiddleware,teacherOnly,updateQuiz);

router.route("/teacher/deleteQuize/:id").delete(authMiddleware,teacherOnly,deleteQuiz);
router.route("/teacher/editQuize/:id/:qid").delete(authMiddleware,teacherOnly,deleteQuestionFromQuiz);


//student side
router.route("/student/:id/quizzes").get(authMiddleware,getQuizById);
router.route("/student/quizzes/recent").get(authMiddleware,studentOnly,getRecentPublishedQuizzes);
export default router;