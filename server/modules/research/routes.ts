// Research Services Routes
import express from 'express';
import * as controller from './controller';
const router = express.Router();

router.get('/', controller.listRequests);
router.get('/:id', controller.getRequest);
router.post('/', controller.createRequest);
router.put('/:id', controller.updateRequest);
router.delete('/:id', controller.deleteRequest);

export default router;
