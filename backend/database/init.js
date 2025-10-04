const { Pool } = require('pg');
const config = require('../config');

// Crear pool de conexiones a PostgreSQL
const pool = new Pool(config.DATABASE);

// Función para probar la conexión
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Conexión a PostgreSQL establecida correctamente');
    client.release();
    return true;
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error.message);
    return false;
  }
}

// Inicializar base de datos
async function initDatabase() {
  try {
    // Probar conexión
    const connected = await testConnection();
    if (!connected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    const client = await pool.connect();
    
    try {
      // Crear tabla de usuarios
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP
        )
      `);

      // Crear tabla de sesiones
      await client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          token TEXT NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Verificar si existe el usuario admin
      const adminCheck = await client.query(
        'SELECT COUNT(*) as count FROM users WHERE email = $1',
        ['admin@hackathon.com']
      );

      if (parseInt(adminCheck.rows[0].count) === 0) {
        // Crear usuario admin
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('password', 10);
        
        await client.query(
          'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
          ['admin@hackathon.com', hashedPassword, 'Admin Hackathon', 'admin']
        );
        
        console.log('Usuario administrador creado correctamente');
      } else {
        console.log('Base de datos verificada y lista');
      }

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error inicializando base de datos:', error.message);
    throw error;
  }
}

// Función para obtener el pool de conexiones
function getPool() {
  return pool;
}

// Función para cerrar todas las conexiones
async function closeDatabase() {
  try {
    await pool.end();
    console.log('Conexión a base de datos cerrada');
  } catch (error) {
    console.error('Error cerrando conexión a base de datos:', error.message);
  }
}

module.exports = {
  initDatabase,
  getPool,
  closeDatabase,
  testConnection
};