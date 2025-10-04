// Ejemplo de configuración de base de datos
// Copiar este archivo como database.js y ajustar valores

module.exports = {
  // URL completa de PostgreSQL para Prisma
  DATABASE_URL: "postgresql://postgres:password@localhost:5432/hackathon_db?schema=public",
  
  // Configuración alternativa con variables separadas
  DATABASE: {
    host: 'localhost',
    port: 5432,
    database: 'hackathon_db',
    user: 'postgres',
    password: 'password',
    ssl: false
  },
  
  // Configuración de Prisma
  PRISMA: {
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty'
  }
};
