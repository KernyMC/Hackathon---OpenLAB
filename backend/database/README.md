# Base de Datos PostgreSQL - Hackathon

## Configuración Inicial

### 1. Instalar PostgreSQL
Si no tienes PostgreSQL instalado:
- **Windows**: Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### 2. Configurar Usuario y Base de Datos

```bash
# Conectar como usuario postgres
sudo -u postgres psql

# Crear base de datos
CREATE DATABASE hackathon_db;

# Crear usuario (opcional, puedes usar postgres)
CREATE USER hackathon_user WITH PASSWORD 'password';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE hackathon_db TO hackathon_user;

# Salir
\q
```

### 3. Ejecutar Script de Inicialización

```bash
# Ejecutar el script SQL
psql -U postgres -d hackathon_db -f setup.sql
```

### 4. Variables de Entorno

Crear archivo `.env` en la carpeta `backend/`:

```env
# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hackathon_db
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false
```

### 5. Probar Conexión

```bash
# Desde el directorio backend
npm install
npm run dev
```

## Estructura de Tablas

### Tabla `users`
- `id`: ID único (SERIAL)
- `email`: Email único del usuario
- `password`: Contraseña hasheada
- `name`: Nombre del usuario
- `role`: Rol (user/admin)
- `created_at`: Fecha de creación
- `last_login`: Último acceso

### Tabla `sessions`
- `id`: ID único (SERIAL)
- `user_id`: Referencia al usuario
- `token`: Token JWT
- `expires_at`: Fecha de expiración
- `created_at`: Fecha de creación

## Usuario por Defecto
- **Email**: admin@hackathon.com
- **Contraseña**: password
- **Rol**: admin

## Comandos Útiles

```bash
# Conectar a la base de datos
psql -U postgres -d hackathon_db

# Ver tablas
\dt

# Ver estructura de una tabla
\d users

# Ver usuarios
SELECT * FROM users;

# Salir
\q
```
