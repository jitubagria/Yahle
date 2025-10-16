import express from 'express';
const router = express.Router();
function lazy(p: string) { return require(p).default || require(p); }
const { verifyToken } = require('./middleware/auth');

// core mounts used by tests (clean router mirrors production /api mounts)
router.use('/health', lazy('./routes/health'));
router.use('/auth', lazy('./routes/auth'));
router.use('/courses', lazy('./modules/courses/routes'));
router.use('/jobs', lazy('./modules/jobs/routes'));
router.use('/quizzes', lazy('./modules/quizzes/routes'));
router.use('/research', lazy('./modules/research/routes'));
router.use('/course-modules', verifyToken, lazy('./modules/courseModules/routes'));
router.use('/enrollments', verifyToken, lazy('./modules/enrollments/routes'));
router.use('/job-applications', verifyToken, lazy('./modules/jobApplications/routes'));

// Phase 6 mounts (ensure tests that expect these endpoints do not 404)
router.use('/ai-tools', lazy('./modules/aiTools/routes'));
router.use('/public', lazy('./modules/publicApi/routes'));
router.use('/certificates', verifyToken, lazy('./modules/certificates/routes'));

router.use((_req, res) => res.status(404).json({ message: 'Not Found' }));
export default router;
