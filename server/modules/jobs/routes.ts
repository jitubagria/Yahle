import express from 'express';

const router = express.Router();

// Minimal jobs router — expand later as needed.
router.get('/', (_req, res) => {
  res.json({ data: [] });
});

router.post('/', (_req, res) => {
  // For now accept creation but return a 201 with a placeholder id
  res.status(201).json({ id: 'job_1', message: 'Job created (stub)' });
});

export default router;
