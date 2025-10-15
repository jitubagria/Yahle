// Quizzes Routes
import express from 'express';
import * as controller from './controller';
const router = express.Router();

router.get('/', controller.listQuizzes);
router.get('/:id', controller.getQuiz);
router.post('/', controller.createQuiz);
router.put('/:id', controller.updateQuiz);
router.delete('/:id', controller.deleteQuiz);

export default router;
