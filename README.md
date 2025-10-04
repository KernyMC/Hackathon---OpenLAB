# Conquito Project - Hackathon

Proyecto desarrollado para hackathon con stack moderno y seguro.

## 🚀 Stack Tecnológico

### Backend
- **Node.js** + **Express** - API REST
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación segura
- **bcryptjs** - Hash de contraseñas
- **Helmet** - Headers de seguridad
- **Rate Limiting** - Protección contra ataques

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **Axios** - Cliente HTTP

## 👥 Equipo de Desarrollo

- **Darwin Valdiviezo** - Lead Developer
- **Cris** - Frontend Developer
- **Kevin** - Backend Developer
- **Jair** - Full Stack Developer

## 📁 Estructura del Proyecto

```
ConquitoProject/
├── backend/                 # API REST con Node.js + Express
│   ├── routes/             # Rutas de la API
│   ├── database/           # Configuración PostgreSQL
│   ├── middleware/         # Middleware de seguridad
│   ├── utils/             # Utilidades y validadores
│   ├── config/            # Configuración de la app
│   └── server.js          # Servidor principal
├── frontend/               # Aplicación React + Vite
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Servicios de API
│   │   └── App.jsx        # Componente principal
│   └── package.json       # Dependencias frontend
├── .gitignore             # Archivos a ignorar
└── README.md              # Este archivo
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/DarwinValdiviezo/ConquitoProject.git
cd ConquitoProject
```

### 2. Configurar Backend
```bash
cd backend
npm install

# Configurar PostgreSQL
psql -U postgres
CREATE DATABASE hackathon_db;
\q

# Ejecutar script de inicialización
psql -U postgres -d hackathon_db -f database/setup.sql

# Crear archivo .env
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
```

### 4. Ejecutar el proyecto
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔐 Credenciales de Prueba

- **Email**: admin@hackathon.com
- **Contraseña**: password

## 🚀 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📋 Guías de Desarrollo

### Para Backend
Ver [backend/README.md](backend/README.md)

### Para Frontend
Ver [frontend/README.md](frontend/README.md)

### Para Base de Datos
Ver [backend/database/README.md](backend/database/README.md)

## 🔒 Seguridad

El proyecto implementa múltiples capas de seguridad:
- ✅ Protección contra SQL Injection
- ✅ Protección contra XSS
- ✅ Rate Limiting
- ✅ Headers de seguridad
- ✅ Validación de entrada
- ✅ Autenticación JWT segura

## 🤝 Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Convenciones de Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en herramientas o configuración

### Estructura de Ramas
- `main` - Rama principal (producción)
- `develop` - Rama de desarrollo
- `feature/*` - Nuevas funcionalidades
- `bugfix/*` - Corrección de bugs
- `hotfix/*` - Correcciones urgentes

## 📞 Contacto

Para dudas o consultas sobre el proyecto, contactar al equipo de desarrollo.

## 📄 Licencia

Este proyecto es desarrollado para fines educativos en el contexto de un hackathon.