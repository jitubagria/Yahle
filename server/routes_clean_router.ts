import express from 'express';
const router = express.Router();
function lazy(p: string) { return require(p).default || require(p); }
const { verifyToken } = require('./middleware/auth');

router.use('/health', lazy('./routes/health'));
router.use('/auth', lazy('./routes/auth'));
router.use('/courses', lazy('./modules/courses/routes'));
router.use('/jobs', lazy('./modules/jobs/routes'));
router.use('/quizzes', lazy('./modules/quizzes/routes'));
router.use('/research', lazy('./modules/research/routes'));
router.use('/course-modules', verifyToken, lazy('./modules/courseModules/routes'));
router.use('/enrollments', verifyToken, lazy('./modules/enrollments/routes'));
router.use('/job-applications', verifyToken, lazy('./modules/jobApplications/routes'));

router.use((_req, res) => res.status(404).json({ message: 'Not Found' }));
export default router;
