import {
	create,
	get,
	getAll,
	remove,
	update,
} from '../controllers/image_news.js';

import express from 'express';

const router = express.Router();
router.get('/imagetintuc', getAll);
router.get('/imagetintuc/:id', get);
router.post('/imagetintuc/', create);
router.put('/imagetintuc/:id', update);
router.delete('/imagetintuc/:id', remove);
export default router;
