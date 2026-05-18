const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Product = require('../models/products');

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'Public', 'uploads'));
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + file.originalname;
        cb(null, unique);
    }
});

const upload = multer({ storage });

// Admin dashboard - list products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/dashboard', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// New product form
router.get('/products/new', (req, res) => {
    res.render('admin/new');
});

// Create product
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, rating, stock } = req.body;
        if (!name || !price || !category) {
            return res.status(400).send('Name, price, and category are required');
        }

        const imagePath = req.file ? '/uploads/' + req.file.filename : '';

        const product = new Product({
            name,
            price: parseFloat(price),
            category,
            rating: parseFloat(rating) || 0,
            stock: parseInt(stock) || 0,
            imagePath
        });

        await product.save();
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating product');
    }
});

// Edit form
router.get('/products/:id/edit', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Not found');
        res.render('admin/edit', { product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update product
router.post('/products/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, rating, stock } = req.body;
        if (!name || !price || !category) {
            return res.status(400).send('Name, price, and category are required');
        }

        const updates = {
            name,
            price: parseFloat(price),
            category,
            rating: parseFloat(rating) || 0,
            stock: parseInt(stock) || 0
        };

        if (req.file) {
            updates.imagePath = '/uploads/' + req.file.filename;
        }

        await Product.findByIdAndUpdate(req.params.id, updates);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product');
    }
});

// Delete product
router.post('/products/:id/delete', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting product');
    }
});

module.exports = router;
