const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');
const { 
  securityHeaders, 
  strictLimiter, 
  authLimiter, 
  validateInput, 
  validateJWT, 
  securityLogger, 
  secureCORS 
} = require('./middleware/security');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad (orden importante)
app.use(securityHeaders);        // Headers de seguridad
app.use(secureCORS);            // CORS seguro
app.use(securityLogger);        // Logging de seguridad
app.use(express.json({ limit: '10mb' })); // Límite de tamaño
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(strictLimiter);         // Rate limiting general

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hackathon API - Sistema de Gestión de Proyectos',
    status: 'success',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      ongs: '/api/ongs',
      proyectos: '/api/proyectos',
      ejes: '/api/ejes',
      kpis: '/api/kpis',
      items: '/api/items',
      tiposDatos: '/api/tipos-datos',
      health: '/api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'operational',
    uptime: `${Math.floor(process.uptime())}s`,
    memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de autenticación con validación y rate limiting
app.use('/api/auth', authLimiter, validateInput, require('./routes/auth'));

// Rutas de usuarios con validación JWT
app.use('/api/users', validateJWT, require('./routes/users'));

// Rutas de ONGs con validación JWT
app.use('/api/ongs', validateJWT, require('./routes/ong'));

// Rutas de proyectos con validación JWT
app.use('/api/proyectos', validateJWT, require('./routes/proyecto'));

// Rutas de ejes con validación JWT
app.use('/api/ejes', validateJWT, require('./routes/eje'));

// Rutas de KPIs con validación JWT
app.use('/api/kpis', validateJWT, require('./routes/kpi'));

// Rutas de items con validación JWT
app.use('/api/items', validateJWT, require('./routes/item'));

// Rutas de tipos de datos con validación JWT
app.use('/api/tipos-datos', validateJWT, require('./routes/tipo-dato-item'));

// Middleware de error
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Contacte al administrador',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint no disponible',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/auth', 
      '/api/users', 
      '/api/ongs',
      '/api/proyectos',
      '/api/ejes',
      '/api/kpis',
      '/api/items',
      '/api/tipos-datos',
      '/api/health'
    ],
    timestamp: new Date().toISOString()
  });
});

// Inicializar Prisma y luego iniciar servidor
async function startServer() {
  try {
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('Conexión a PostgreSQL establecida con Prisma');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('=====================================');
      console.log('HACKATHON API - SERVIDOR INICIADO');
      console.log('=====================================');
      console.log(`Puerto: ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log('-------------------------------------');
      console.log('Credenciales de acceso:');
      console.log('Email: admin@hackathon.com');
      console.log('Password: password');
      console.log('=====================================');
    });
  } catch (error) {
    console.error('Error inicializando servidor:', error);
    process.exit(1);
  }
}

// Manejar cierre graceful
process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
