const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    try {
        console.log('Connecting to database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: false
            }
        });

        console.log('Connected! Checking for media column...');

        // Check if column exists
        const [columns] = await connection.query(`
            SELECT * 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'projects' 
            AND COLUMN_NAME = 'media'
        `, [process.env.DB_NAME]);

        if (columns.length === 0) {
            console.log('Adding media column...');
            await connection.query('ALTER TABLE projects ADD COLUMN media JSON');
            console.log('Media column added.');

            // Migrate existing data
            console.log('Migrating existing image_url to media...');
            await connection.query(`
                UPDATE projects 
                SET media = JSON_ARRAY(image_url) 
                WHERE image_url IS NOT NULL AND image_url != ''
            `);
            console.log('Data migration complete.');
        } else {
            console.log('Media column already exists. Skipping...');
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
