// Configuración de la aplicación
module.exports = {
  // Configuración del servidor
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || 'hackathon_super_secret_key_2024',
  JWT_EXPIRES_IN: '24h',
  
  // Base de datos PostgreSQL
  DATABASE: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'hackathon_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  },
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutos
  RATE_LIMIT_MAX: 100 // máximo 100 requests por IP
};
