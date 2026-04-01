import express from 'express'
import multer from 'multer';

import{
    getProducts, 
    createProduct,
}from '../controllers/product.js';

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.get('/', getProducts);
router.post('/add', upload.array('productImage'), createProduct);

export default router;