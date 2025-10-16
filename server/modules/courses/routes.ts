import express from 'express';

const router = express.Router();

// Minimal courses router — expand later as needed.
router.get('/', (_req, res) => {
  res.json({ data: [] });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, title: `Course ${id}`, description: 'Placeholder course' });
});

export default router;
