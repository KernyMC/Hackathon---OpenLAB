const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');

// Configuración de seguridad con Helmet
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "same-origin" }
});

// Rate limiting más estricto
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // máximo 50 requests por IP
  message: {
    error: 'Demasiadas solicitudes desde esta IP',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para autenticación (más restrictivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP
  message: {
    error: 'Demasiados intentos de login',
    retryAfter: '15 minutos'
  },
  skipSuccessfulRequests: true
});

// Validación de entrada
const validateInput = (req, res, next) => {
  const { email, password, name } = req.body;
  
  // Validar email
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Formato de email inválido'
    });
  }
  
  // Validar longitud de contraseña
  if (password && (password.length < 6 || password.length > 128)) {
    return res.status(400).json({
      error: 'La contraseña debe tener entre 6 y 128 caracteres'
    });
  }
  
  // Validar nombre (solo letras, números y espacios)
  if (name && !validator.isAlphanumeric(name.replace(/\s/g, ''))) {
    return res.status(400).json({
      error: 'El nombre solo puede contener letras, números y espacios'
    });
  }
  
  // Sanitizar entrada
  if (email) req.body.email = validator.normalizeEmail(email);
  if (name) req.body.name = validator.escape(name.trim());
  
  next();
};

// Validación de JWT
const validateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      error: 'Token de acceso requerido'
    });
  }
  
  // Verificar formato del token
  if (!validator.isJWT(token)) {
    return res.status(401).json({
      error: 'Formato de token inválido'
    });
  }
  
  next();
};

// Logging de seguridad
const securityLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`
    };
    
    // Log solo errores de seguridad
    if (res.statusCode >= 400) {
      console.log('SECURITY LOG:', JSON.stringify(logData));
    }
  });
  
  next();
};

// CORS seguro
const secureCORS = (req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

module.exports = {
  securityHeaders,
  strictLimiter,
  authLimiter,
  validateInput,
  validateJWT,
  securityLogger,
  secureCORS
};
