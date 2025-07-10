import {
	add,
	deletenews,
	get,
	getAll,
	update,
} from '../controllers/tb_news.js';

import express from 'express';

const router = express.Router();
router.get('/tintuc', getAll);
router.get('/tintuc/:id', get);
router.post('/tintuc', add);
router.put('/tintuc/:id', update);
router.delete('/tintuc/:id', deletenews);

export default router;
