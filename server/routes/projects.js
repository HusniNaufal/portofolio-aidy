const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { handleUpload } = require('../middleware/upload');
const path = require('path');

// GET all projects
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// GET single project
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// POST new project
router.post('/', handleUpload('image'), async (req, res) => {
    try {
        const { title, description, category } = req.body;
        // Cloudinary puts the url in req.file.path
        const image_url = req.file ? req.file.path : null;

        const [result] = await pool.query(
            'INSERT INTO projects (title, description, image_url, category) VALUES (?, ?, ?, ?)',
            [title, description, image_url, category || 'Perumahan']
        );

        const [newProject] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
        res.status(201).json(newProject[0]);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// PUT update project
router.put('/:id', handleUpload('image'), async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const projectId = req.params.id;

        // Get existing project
        const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        let image_url = existing[0].image_url;

        // If new image uploaded, use the new Cloudinary URL
        if (req.file) {
            image_url = req.file.path;
            // TODO: Optional - Delete old image from Cloudinary using API
        }

        await pool.query(
            'UPDATE projects SET title = ?, description = ?, image_url = ?, category = ? WHERE id = ?',
            [title, description, image_url, category, projectId]
        );

        const [updated] = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);
        res.json(updated[0]);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// DELETE project
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Note: Removing file from Cloudinary requires separate API call, skipped for simplicity here

        await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;
