# Backend API - Hackathon

## Descripción
API REST desarrollada con Node.js + Express para el proyecto de hackathon.

## Tecnologías Utilizadas
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web para APIs REST
- **PostgreSQL** - Base de datos relacional robusta
- **pg** - Cliente oficial de PostgreSQL para Node.js
- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **bcryptjs** - Hash seguro de contraseñas
- **CORS** - Cross-Origin Resource Sharing
- **express-rate-limit** - Limitación de requests para seguridad
- **dotenv** - Manejo de variables de entorno

## Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar PostgreSQL
```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE hackathon_db;
\q

# Ejecutar script de inicialización
psql -U postgres -d hackathon_db -f database/setup.sql
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la carpeta `backend/`:
```env
# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=hackathon_super_secret_key_2024

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hackathon_db
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false

# CORS
FRONTEND_URL=http://localhost:3000
```

### 4. Ejecutar aplicación
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Arquitectura de Base de Datos

### ¿Por qué PostgreSQL + pg (no Prisma)?
- **Simplicidad**: Para hackathon, menos dependencias = menos problemas
- **Control directo**: Queries SQL nativas para máximo rendimiento
- **Flexibilidad**: Fácil de modificar y adaptar rápidamente
- **Estabilidad**: pg es el cliente oficial de PostgreSQL

### Pool de Conexiones
```javascript
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'hackathon_db',
  user: 'postgres',
  password: 'password',
  max: 20,        // máximo 20 conexiones
  min: 5,         // mínimo 5 conexiones
  acquireTimeoutMillis: 60000
});
```

### Estructura de Tablas
```sql
-- Tabla usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Tabla sesiones
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## Endpoints Disponibles

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario  
- `GET /api/auth/verify` - Verificar token

### Usuarios
- `GET /api/users/profile` - Obtener perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil
- `GET /api/users/` - Lista de usuarios (solo admin)

### Sistema
- `GET /` - Información de la API
- `GET /api/health` - Health check con métricas

## Usuario por Defecto
- **Email**: admin@hackathon.com
- **Contraseña**: password
- **Rol**: admin

## Ejemplos de Uso

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hackathon.com","password":"password"}'
```

### Obtener perfil
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## Estructura del Proyecto
```
backend/
├── routes/              # Rutas de la API
│   ├── auth.js         # Autenticación (login, register, verify)
│   └── users.js        # Gestión de usuarios
├── database/           # Configuración de PostgreSQL
│   ├── init.js         # Inicialización y pool de conexiones
│   ├── config.js       # Configuración específica de DB
│   ├── setup.sql       # Script SQL de inicialización
│   └── README.md       # Documentación de PostgreSQL
├── config.js           # Configuración general de la app
├── server.js           # Servidor principal Express
├── package.json        # Dependencias y scripts
└── README.md           # Esta documentación
```

## Características de Seguridad Avanzada

### 🛡️ **Protección contra Ataques Comunes**

#### **SQL Injection - COMPLETAMENTE PROTEGIDO**
- ✅ Parámetros preparados en todas las queries
- ✅ Validación de entrada estricta
- ✅ Sanitización de datos
```javascript
// Ejemplo seguro
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1 AND active = $2',
  [email, true] // Parámetros seguros
);
```

#### **XSS (Cross-Site Scripting) - PROTEGIDO**
- ✅ Validación y escape de entrada
- ✅ Headers de seguridad (CSP)
- ✅ Sanitización de HTML
- ✅ Validación de tipos de datos

#### **CSRF (Cross-Site Request Forgery) - PROTEGIDO**
- ✅ CORS configurado correctamente
- ✅ Validación de origen
- ✅ Tokens JWT con verificación

#### **Rate Limiting - MULTI-NIVEL**
- ✅ **General**: 100 requests/15min por IP
- ✅ **Autenticación**: 5 intentos/15min por IP
- ✅ **Estricto**: 20 requests/5min por IP

#### **Headers de Seguridad - COMPLETOS**
- ✅ **Helmet.js**: Headers de seguridad automáticos
- ✅ **CSP**: Content Security Policy
- ✅ **HSTS**: HTTP Strict Transport Security
- ✅ **X-Frame-Options**: Prevenir clickjacking
- ✅ **X-Content-Type-Options**: Prevenir MIME sniffing

### 🔐 **Autenticación y Autorización**

#### **JWT Seguro**
- ✅ Algoritmo HS256
- ✅ Expiración de 24 horas
- ✅ Verificación de formato
- ✅ Validación de firma

#### **Contraseñas Robustas**
- ✅ Mínimo 8 caracteres
- ✅ Requiere mayúsculas, minúsculas, números y símbolos
- ✅ Hash con bcrypt (12 salt rounds)
- ✅ Validación de contraseñas comunes
- ✅ Medición de fortaleza

#### **Validación de Entrada**
- ✅ Validación de email con normalización
- ✅ Sanitización de nombres
- ✅ Escape de caracteres especiales
- ✅ Límites de longitud
- ✅ Validación de tipos de datos

### 📊 **Logging y Monitoreo**
- ✅ Log de eventos de seguridad
- ✅ Monitoreo de intentos fallidos
- ✅ Tracking de IPs sospechosas
- ✅ Métricas de rendimiento

## Troubleshooting

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status

# Verificar conexión
psql -U postgres -h localhost -p 5432
```

### Error de permisos
```bash
# Dar permisos al usuario
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE hackathon_db TO postgres;
```

### Puerto ocupado
```bash
# Cambiar puerto en .env
PORT=5001
```
