const express = require('express');
const router = express.Router();
const auth = require('../middelsware/user-founde');
const productController = require('../Controller/product.controller');
const { body } = require('express-validator');
const multer  = require('multer')
const upload = multer({ dest: "uploads/" });

router.post('/owner',upload.single("image"), [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('discount').isNumeric().withMessage('Discount must be a number'),
    body('isNewCollection').isBoolean().withMessage('isNewCollection must be a boolean'),
    body('stock').isNumeric().withMessage('Stock must be a number'),
    body('image').notEmpty().withMessage('Image is required'),
    body('category').notEmpty().withMessage('Category is required'),
], productController.createProduct);

module.exports = router;