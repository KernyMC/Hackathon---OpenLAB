// Configuración de seguridad avanzada
module.exports = {
  // Configuración de JWT
  JWT: {
    secret: process.env.JWT_SECRET || 'hackathon_super_secret_key_2024',
    expiresIn: '24h',
    algorithm: 'HS256',
    issuer: 'hackathon-api',
    audience: 'hackathon-frontend'
  },
  
  // Configuración de bcrypt
  BCRYPT: {
    saltRounds: 12, // Más seguro que 10
    maxPasswordLength: 128,
    minPasswordLength: 8
  },
  
  // Configuración de rate limiting
  RATE_LIMITS: {
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100,
      message: 'Demasiadas solicitudes desde esta IP'
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 5, // Solo 5 intentos de login
      message: 'Demasiados intentos de login'
    },
    strict: {
      windowMs: 5 * 60 * 1000, // 5 minutos
      max: 20,
      message: 'Límite de solicitudes excedido'
    }
  },
  
  // Configuración de CORS
  CORS: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://yourdomain.com' // Cambiar en producción
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization'
    ],
    credentials: true
  },
  
  // Configuración de validación
  VALIDATION: {
    email: {
      minLength: 5,
      maxLength: 254
    },
    password: {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    name: {
      minLength: 2,
      maxLength: 50
    }
  },
  
  // Configuración de headers de seguridad
  SECURITY_HEADERS: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    hsts: {
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
      preload: true
    }
  },
  
  // Configuración de logging
  LOGGING: {
    logLevel: process.env.LOG_LEVEL || 'info',
    logSecurityEvents: true,
    logFailedAttempts: true,
    logSuccessfulLogins: false // Por privacidad
  },
  
  // Configuración de base de datos
  DATABASE_SECURITY: {
    connectionTimeout: 30000, // 30 segundos
    queryTimeout: 10000,      // 10 segundos
    maxConnections: 20,
    minConnections: 5,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
};
