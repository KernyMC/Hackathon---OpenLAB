# Configuración del Backend con Prisma

## 🚀 Instalación Rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus credenciales
```

### 3. Configurar base de datos PostgreSQL
```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE hackathon_db;
\q
```

### 4. Generar cliente Prisma y aplicar schema
```bash
# Generar cliente
npm run db:generate

# Aplicar schema a la base de datos
npm run db:push

# Crear usuario admin inicial
npm run db:seed
```

### 5. Ejecutar servidor
```bash
npm run dev
```

## 📝 Variables de Entorno

### Archivo `.env` requerido:
```env
# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=hackathon_super_secret_key_2024

# Base de datos PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/hackathon_db?schema=public"

# CORS
FRONTEND_URL=http://localhost:3000
```

### Configuración de DATABASE_URL:
```
postgresql://[usuario]:[contraseña]@[host]:[puerto]/[nombre_db]?schema=public
```

**Ejemplo:**
```
postgresql://postgres:password@localhost:5432/hackathon_db?schema=public
```

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor en desarrollo |
| `npm run start` | Servidor en producción |
| `npm run db:generate` | Generar cliente Prisma |
| `npm run db:push` | Aplicar schema a DB |
| `npm run db:migrate` | Crear migración |
| `npm run db:seed` | Crear datos iniciales |
| `npm run db:studio` | Abrir GUI de Prisma |
| `npm run db:reset` | Resetear base de datos |

## 🔧 Comandos Útiles

### Generar cliente Prisma
```bash
npm run db:generate
```

### Aplicar cambios al schema
```bash
npm run db:push
```

### Crear migración
```bash
npm run db:migrate
```

### Abrir Prisma Studio
```bash
npm run db:studio
```

### Resetear base de datos
```bash
npm run db:reset
```

## 🗄️ Estructura de Base de Datos

### Tabla `users`
- `id` - ID único (SERIAL)
- `email` - Email único
- `password` - Contraseña hasheada
- `name` - Nombre del usuario
- `role` - Rol (user/admin)
- `createdAt` - Fecha de creación
- `lastLogin` - Último acceso

### Tabla `sessions`
- `id` - ID único (SERIAL)
- `userId` - Referencia al usuario
- `token` - Token JWT
- `expiresAt` - Fecha de expiración
- `createdAt` - Fecha de creación

## 🔐 Usuario por Defecto

Después de ejecutar `npm run db:seed`:
- **Email**: admin@hackathon.com
- **Contraseña**: password
- **Rol**: admin

## 🚨 Troubleshooting

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

### Error de Prisma
```bash
# Regenerar cliente
npm run db:generate

# Resetear base de datos
npm run db:reset
```

## 📡 Endpoints Disponibles

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/logout` - Logout

### Usuarios
- `GET /api/users/profile` - Perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil
- `GET /api/users/` - Lista de usuarios (admin)
- `GET /api/users/:id` - Usuario por ID (admin)

### Sistema
- `GET /` - Información de la API
- `GET /api/health` - Health check
