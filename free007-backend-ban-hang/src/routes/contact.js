import {
	create,
	get,
	getById,
	remove,
	update,
} from '../controllers/contact.js';

import express from 'express';

const router = express.Router();
router.get('/contact', get);
router.get('/contact/:id', getById);
router.post('/contact', create);
router.patch('/contact/:id', update);
router.delete('/contact/:id', remove);

export default router;
