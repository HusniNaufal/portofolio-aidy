-- Migration: Add categories table
-- Run this script to add dynamic categories support

USE aidy_portfolio;

-- Create categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories (ignore if already exists)
INSERT IGNORE INTO categories (name) VALUES 
('Perumahan'), ('Komersial'), ('Interior'), ('Landscape');

-- Alter projects table to use VARCHAR instead of ENUM (if needed)
-- First check if the column is ENUM, then alter it
-- Note: This might fail if column is already VARCHAR, which is fine

ALTER TABLE projects MODIFY COLUMN category VARCHAR(100) DEFAULT 'Perumahan';

SELECT 'Migration completed successfully!' as status;
