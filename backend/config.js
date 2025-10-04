// Configuración de la aplicación
module.exports = {
  // Configuración del servidor
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || 'hackathon_super_secret_key_2024',
  JWT_EXPIRES_IN: '24h',
  
  // Base de datos PostgreSQL con Prisma
  DATABASE_URL: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'hackathon_db'}?schema=public`,
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutos
  RATE_LIMIT_MAX: 100 // máximo 100 requests por IP
};
