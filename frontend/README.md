# Frontend - Hackathon

## Descripción
Frontend desarrollado con React + Vite para el proyecto de hackathon.

## Tecnologías
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **Axios** - Cliente HTTP
- **React Router** - Enrutamiento (preparado para futuras funcionalidades)

## Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

### 3. Build para producción
```bash
npm run build
```

### 4. Preview del build
```bash
npm run preview
```

## Estructura del Proyecto
```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Login.jsx       # Componente de login/registro
│   │   └── Dashboard.jsx   # Dashboard principal
│   ├── services/           # Servicios de API
│   │   └── auth.js         # Servicio de autenticación
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos estáticos
├── index.html              # HTML principal
├── package.json            # Dependencias
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
└── postcss.config.js       # Configuración de PostCSS
```

## Funcionalidades Implementadas

### ✅ **Autenticación**
- Login con email y contraseña
- Registro de nuevos usuarios
- Verificación automática de token
- Logout seguro
- Persistencia de sesión

### ✅ **Dashboard**
- Información del perfil de usuario
- Estadísticas básicas
- Estado de conexión con API
- Interfaz responsive

### ✅ **Conectividad**
- Conexión automática con backend
- Manejo de errores de API
- Interceptors para tokens
- Configuración de CORS

## Credenciales de Prueba
- **Email**: admin@hackathon.com
- **Contraseña**: password

## Configuración

### Variables de Entorno
El frontend se conecta automáticamente al backend en:
- **Desarrollo**: http://localhost:5000
- **Producción**: Configurar en `vite.config.js`

### Proxy de Desarrollo
Vite está configurado para hacer proxy de `/api` al backend:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

## Características de Seguridad

### ✅ **Protección Frontend**
- Validación de entrada en formularios
- Sanitización de datos
- Manejo seguro de tokens
- Headers de seguridad

### ✅ **Comunicación Segura**
- Tokens JWT en localStorage
- Interceptors para renovación automática
- Manejo de errores 401
- CORS configurado

## Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter (si está configurado)
```

### Hot Reload
Vite proporciona hot reload instantáneo para:
- Cambios en componentes React
- Cambios en CSS
- Cambios en archivos de configuración

## Próximos Pasos
- [ ] Implementar más funcionalidades según el tema del hackathon
- [ ] Agregar más componentes de UI
- [ ] Implementar routing avanzado
- [ ] Agregar tests unitarios
- [ ] Optimizar para producción
