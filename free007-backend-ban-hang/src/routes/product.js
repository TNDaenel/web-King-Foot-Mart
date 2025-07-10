import {
	create,
	get,
	getAll,
	getDeletedProducts,
	remove,
	removeProduct,
	restoreProduct,
	searchProducts,
	update,
} from '../controllers/product.js';

import express from 'express';

const router = express.Router();
router.get('/products', getAll);
router.get('/products-daleted', getDeletedProducts);
router.delete('/products/hard-delete/:id', removeProduct);
router.get('/products/:id', get);
router.get('/products/search/:name', searchProducts);
router.post('/products/', create);
router.put('/products/:id', update);
router.delete('/products/:id', remove);
router.patch('/products/restore/:id', restoreProduct);
// router.patch("/products/:id", updatePartial);
export default router;
