// NPA Automation Routes
import express from 'express';
import * as controller from './controller';
const router = express.Router();


router.get('/', (req, res) => {
	res.json({
		message: "NPA Automation API working",
		endpoints: ["/templates", "/opt-ins", "/automation"]
	});
});

router.get('/templates', controller.listTemplates);
router.post('/templates', controller.createTemplate);
router.get('/opt-ins', controller.listOptIns);
router.post('/opt-ins', controller.createOptIn);
router.get('/automation', controller.listAutomation);
router.post('/automation', controller.createAutomation);

export default router;
