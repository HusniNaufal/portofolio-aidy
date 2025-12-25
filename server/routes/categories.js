const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all categories
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// POST new category
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Nama kategori tidak boleh kosong' });
        }

        const trimmedName = name.trim();

        // Check if category already exists
        const [existing] = await pool.query('SELECT * FROM categories WHERE name = ?', [trimmedName]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Kategori sudah ada' });
        }

        const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [trimmedName]);
        const [newCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);

        res.status(201).json(newCategory[0]);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// DELETE category
router.delete('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Get category name first
        const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
        if (category.length === 0) {
            return res.status(404).json({ error: 'Kategori tidak ditemukan' });
        }

        // Check if any projects are using this category
        const [projects] = await pool.query('SELECT COUNT(*) as count FROM projects WHERE category = ?', [category[0].name]);
        if (projects[0].count > 0) {
            return res.status(400).json({
                error: `Tidak dapat menghapus kategori. ${projects[0].count} proyek masih menggunakan kategori ini.`
            });
        }

        await pool.query('DELETE FROM categories WHERE id = ?', [categoryId]);
        res.json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

module.exports = router;
