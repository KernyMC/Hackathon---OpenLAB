// Configuración específica de la base de datos PostgreSQL
module.exports = {
  // Configuración de conexión
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'hackathon_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  },
  
  // Configuración del pool de conexiones
  pool: {
    max: 20, // máximo 20 conexiones
    min: 5,  // mínimo 5 conexiones
    acquireTimeoutMillis: 60000, // 60 segundos
    createTimeoutMillis: 30000,  // 30 segundos
    destroyTimeoutMillis: 5000,  // 5 segundos
    idleTimeoutMillis: 30000,   // 30 segundos
    reapIntervalMillis: 1000,   // 1 segundo
    createRetryIntervalMillis: 200 // 200ms
  }
};
