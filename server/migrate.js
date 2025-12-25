const mysql = require('mysql2/promise');
require('dotenv').config();

const schema = `
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100) DEFAULT 'Perumahan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO categories (name) VALUES 
('Perumahan'), ('Komersial'), ('Interior'), ('Landscape');
`;

async function migrate() {
    try {
        console.log('Connecting to database with config:');
        console.log('Host:', process.env.DB_HOST);
        console.log('User:', process.env.DB_USER);
        console.log('Database:', process.env.DB_NAME);
        // Do not log password silently
        console.log('Password length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'undefined');
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

        console.log('Connected! Executing schema...');
        const statements = schema.split(';').filter(s => s.trim());
        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
                console.log('Executed:', statement.substring(0, 50) + '...');
            }
        }

        console.log('Migration successful!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
