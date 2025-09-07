-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS edusync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS 'edusync'@'%' IDENTIFIED BY 'password';

-- Grant all privileges on edusync database to edusync user
GRANT ALL PRIVILEGES ON edusync.* TO 'edusync'@'%';

-- Flush privileges to ensure changes take effect
FLUSH PRIVILEGES;

-- Use the edusync database
USE edusync;
