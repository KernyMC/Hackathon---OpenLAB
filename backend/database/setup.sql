-- Script de inicialización de la base de datos PostgreSQL para Hackathon
-- Ejecutar este script como usuario postgres

-- Crear base de datos (si no existe)
-- CREATE DATABASE hackathon_db;

-- Conectar a la base de datos hackathon_db
-- \c hackathon_db;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Crear tabla de sesiones
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Insertar usuario administrador por defecto
-- La contraseña es 'password' hasheada con bcrypt
INSERT INTO users (email, password, name, role) 
VALUES (
    'admin@hackathon.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Admin Hackathon', 
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Mostrar información de la base de datos
SELECT 'Base de datos inicializada correctamente' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT email, name, role FROM users WHERE role = 'admin';
