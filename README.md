# 🏆 Sistema de Reportería de Proyectos Sociales - Fundación Favorita

**Proyecto ganador del OpenLAB Hackathon 2025**

Sistema web integral para la gestión, seguimiento y reportería de proyectos sociales implementados por ONGs aliadas de la Fundación Favorita en Ecuador. Esta plataforma digital centraliza la información de 17 organizaciones sociales, facilitando la transparencia, medición de impacto y toma de decisiones basada en datos.

![Estado del Proyecto](https://img.shields.io/badge/estado-activo-success)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue)
![Versión](https://img.shields.io/badge/versión-1.0.0-orange)

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [El Problema que Resolvemos](#-el-problema-que-resolvemos)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Características Principales](#-características-principales)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [Uso de Inteligencia Artificial](#-uso-de-inteligencia-artificial)
- [Equipo de Desarrollo](#-equipo-de-desarrollo)
- [Roadmap](#-roadmap)
- [Contribución](#-contribución)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 📖 Descripción del Proyecto

Este sistema transforma la manera en que las organizaciones sociales reportan sus avances y resultados. Desarrollado específicamente para la **Fundación Favorita** de Ecuador, la plataforma permite:

- **Para ONGs**: Reportar mensualmente sus indicadores de impacto de forma estandarizada y sencilla
- **Para Administradores**: Visualizar en tiempo real el progreso de todos los proyectos a través de dashboards interactivos
- **Para Donantes**: Acceso transparente a métricas de impacto social con reportes profesionales descargables
- **Para la Sociedad**: Portal público con información de proyectos activos y sistema de donaciones integrado

### 🎯 Objetivos Cumplidos

✅ Centralización de reportes de 17 ONGs en una sola plataforma
✅ Estandarización de indicadores por eje temático (Nutrición, Educación, Emprendimiento, Medio Ambiente, Equidad de Género)
✅ Visualización de datos en tiempo real con gráficas interactivas
✅ Generación automática de reportes en PDF y Excel
✅ Sistema de donaciones con pasarela de pagos ecuatoriana (Plux Paybox)
✅ Interfaz responsive adaptada a dispositivos móviles
✅ Panel de administración con control total de proyectos

---

## 🔍 El Problema que Resolvemos

Antes de esta plataforma, la Fundación Favorita enfrentaba estos desafíos:

### 🚫 Problemas Identificados

| Problema | Impacto | Solución Implementada |
|----------|---------|----------------------|
| **Reportes desorganizados** | Información llegaba por email, WhatsApp, Excel, PDF sin formato estándar | Sistema centralizado con formularios guiados |
| **Falta de trazabilidad** | Imposible saber qué ONG reportó qué mes | Calendario visual con estados (reportado/pendiente) |
| **Consolidación manual** | Días de trabajo armando reportes para donantes | Generación automática de reportes profesionales |
| **Poca visibilidad de impacto** | Difícil comparar proyectos y medir tendencias | Dashboard con gráficas de tendencias y comparativas |
| **Indicadores no estandarizados** | Cada ONG medía cosas diferentes | Definición centralizada de indicadores por eje |

### ✅ Beneficios Logrados

- **Ahorro de tiempo**: De días a minutos en generación de reportes
- **Transparencia total**: Donantes ven resultados reales con datos verificables
- **Escalabilidad**: De 17 a 50+ ONGs sin aumentar personal administrativo
- **Profesionalización**: ONGs mejoran su imagen institucional con reportes estandarizados
- **Impacto medible**: 100% de los proyectos con métricas claras y verificables

---

## 🚀 Stack Tecnológico

### **Frontend**

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.3.1 | Biblioteca principal para UI |
| **TypeScript** | 5.6.2 | Tipado estático y desarrollo robusto |
| **Vite** | 6.0.1 | Build tool ultra rápido |
| **Tailwind CSS** | 3.4.17 | Framework de CSS utility-first |
| **shadcn/ui** | Latest | Componentes UI accesibles y personalizables |
| **Recharts** | 2.15.0 | Gráficas interactivas |
| **GridStack** | 11.1.1 | Dashboard reorganizable |
| **React Router** | 7.1.3 | Navegación SPA |
| **TanStack Query** | 5.64.2 | Gestión de estado servidor |

### **Backend**

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express** | 4.21.2 | Framework para API REST |
| **Prisma** | 6.2.0 | ORM para base de datos |
| **MySQL** | 8.0 | Base de datos relacional |
| **JWT** | - | Autenticación segura |
| **bcryptjs** | - | Encriptación de contraseñas |
| **Helmet** | - | Headers de seguridad |

### **Integraciones**

- **Plux Paybox**: Pasarela de pagos ecuatoriana para donaciones
- **OpenAI API**: Análisis inteligente de reportes y generación de insights
- **jsPDF**: Generación de reportes PDF
- **ExcelJS**: Exportación de datos a Excel

---

## 🏗️ Arquitectura del Sistema

```
ConquitoProject/
│
├── frontend/                    # Aplicación React + TypeScript
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   └── layout/         # Layout components (Sidebar, PageLayout)
│   │   ├── pages/              # Páginas del sistema
│   │   │   ├── admin/          # Portal administrador
│   │   │   │   ├── Dashboard.tsx       # Visualización de métricas
│   │   │   │   ├── Ngos.tsx           # Gestión de ONGs
│   │   │   │   ├── Projects.tsx       # Gestión de proyectos
│   │   │   │   └── Users.tsx          # Gestión de usuarios
│   │   │   ├── ngo/            # Portal ONG
│   │   │   │   └── Projects.tsx       # Reportería de proyectos
│   │   │   ├── Index.tsx       # Página pública
│   │   │   ├── Login.tsx       # Autenticación
│   │   │   └── NotFound.tsx    # 404
│   │   ├── services/           # Servicios API
│   │   ├── hooks/              # Custom hooks
│   │   ├── types/              # Definiciones TypeScript
│   │   └── lib/                # Utilidades
│   ├── public/                 # Recursos estáticos
│   └── package.json
│
├── backend/                     # API REST con Express
│   ├── routes/                 # Endpoints de la API
│   │   ├── ong.routes.js              # CRUD de ONGs
│   │   ├── proyecto.routes.js         # CRUD de proyectos
│   │   ├── item.routes.js             # CRUD de items de reporte
│   │   ├── kpi.routes.js              # Indicadores de rendimiento
│   │   ├── eje.routes.js              # Ejes temáticos
│   │   ├── openai.routes.js           # Integración con IA
│   │   └── usuarios.js                # Gestión de usuarios
│   ├── database/               # Configuración de Prisma
│   │   └── schema.prisma              # Esquema de base de datos
│   ├── middleware/             # Middleware de seguridad
│   ├── utils/                  # Utilidades y validadores
│   ├── config/                 # Configuración de la app
│   └── server.js               # Servidor principal
│
├── DOCUMENTACION_SISTEMA.md    # Documentación técnica completa
├── CONTRIBUTING.md             # Guía de contribución
└── README.md                   # Este archivo
```

---

## ✨ Características Principales

### 🎛️ Portal de Administración

#### 1. **Dashboard Interactivo**
- Tarjetas con KPIs en tiempo real (proyectos activos, indicadores, datos registrados)
- Gráficas de tendencia temporal con evolución mensual
- Comparativas año contra año
- Distribución por ejes temáticos (pie charts)
- Actividad reciente con últimos reportes
- **Dashboard reorganizable**: Arrastrar y redimensionar componentes con GridStack
- Filtros avanzados: ONG, Proyecto, Mes, Año
- Exportación a PDF y Excel con un clic

#### 2. **Gestión de Proyectos**
- **Wizard de creación en 3 pasos**:
  - Paso 1: Información básica (nombre, descripción, duración, período de reporte, ONG)
  - Paso 2: Selección de ejes temáticos (multi-selección)
  - Paso 3: Definición de indicadores personalizados por eje
- **Visualización por pestañas**:
  - Proyectos Activos
  - Pendientes de Aprobar (cuando llegan al 100%)
  - Histórico (proyectos terminados)
- Edición, eliminación y clonación de proyectos
- Simulación de progreso para demostraciones
- Barra de progreso visual (0-100%)

#### 3. **Gestión de ONGs**
- Lista completa de las 17 organizaciones aliadas
- Información de contacto (email, teléfono, responsable)
- Estadísticas por organización
- Visualización de proyectos asociados
- Filtros y búsqueda

#### 4. **Gestión de Usuarios** *(En desarrollo)*
- Roles: Super Admin, Admin ONG, Reportero, Visualizador
- Permisos granulares
- Auditoría de acciones

### 📊 Portal ONG

#### 1. **Reportería Guiada**
- Vista de proyectos asignados únicamente
- Calendario de 12 meses con estados visuales:
  - **Meses sin reportar**: Color claro
  - **Meses reportados**: Verde con ✓
- Formulario de reporte contextual:
  - Pre-llenado con información del proyecto y eje
  - Indicadores específicos definidos por el administrador
  - Cálculos automáticos (ej: % de recuperación de alimentos)
  - Validación de campos obligatorios
  - Confirmación antes de enviar
- **Bloqueo automático**: Reportes enviados no se pueden editar
- Vista de reportes históricos (solo lectura)

### 🌐 Portal Público

#### 1. **Página de Inicio Institucional**
- Misión y visión de la Fundación Favorita
- Estadísticas de impacto en tiempo real:
  - 15 ONGs asociadas
  - 50 proyectos activos
  - 5,000 familias beneficiadas
  - $2M+ inversión social
- **Carrusel de ONGs**: Información de organizaciones aliadas
- **Galería de proyectos**: 10 proyectos destacados con fotos
- Sistema de filtros por categoría

#### 2. **Sistema de Donaciones**
- Selección de proyecto para donar
- Montos predefinidos ($25, $50, $100, $250, $500, $1000) o personalizado
- Integración con **Plux Paybox** (pasarela ecuatoriana)
- Procesamiento seguro de tarjetas (VISA, Mastercard, Diners)
- Confirmación por email
- Modo sandbox para pruebas

---

## 🛠️ Instalación y Configuración

### Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **PostgreSQL** 12+ o **MySQL** 8+ ([Descargar PostgreSQL](https://www.postgresql.org/download/) | [Descargar MySQL](https://dev.mysql.com/downloads/))
- **npm** o **yarn** (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/))

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/KernyMC/Hackathon---OpenLAB.git
cd Hackathon---OpenLAB
```

### 2️⃣ Configurar Backend

```bash
cd backend
npm install
```

#### Configurar Base de Datos

**Para PostgreSQL:**

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE hackathon_db;
\q
```

**Para MySQL:**

```bash
# Crear base de datos
mysql -u root -p
CREATE DATABASE hackathon_db;
exit;
```

#### Crear Archivo `.env`

Crea un archivo `.env` en la carpeta `backend/`:

```env
# Base de Datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/hackathon_db"
# O para MySQL:
# DATABASE_URL="mysql://usuario:contraseña@localhost:3306/hackathon_db"

# Puerto del servidor
PORT=5000

# JWT Secret
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion

# OpenAI (Opcional - solo si usas análisis con IA)
OPENAI_API_KEY=tu_api_key_de_openai

# Plux Paybox (Modo Sandbox)
PLUX_CLIENT_ID=tu_client_id_de_plux
PLUX_CLIENT_SECRET=tu_client_secret_de_plux
PLUX_SANDBOX_MODE=true
```

#### Ejecutar Migraciones y Seed

```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar schema a la base de datos
npm run db:push

# (Opcional) Poblar con datos de ejemplo
npm run db:seed
```

#### Iniciar Backend

```bash
npm run dev
```

El backend estará corriendo en: **http://localhost:5000**

### 3️⃣ Configurar Frontend

En una nueva terminal:

```bash
cd frontend
npm install
```

#### Crear Archivo `.env` (Frontend)

Crea un archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_PLUX_PUBLIC_KEY=tu_public_key_de_plux
```

#### Iniciar Frontend

```bash
npm run dev
```

El frontend estará corriendo en: **http://localhost:3000**

### 4️⃣ Acceder al Sistema

- **Página Principal**: [http://localhost:3000](http://localhost:3000)
- **Portal Admin**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- **Portal ONG**: [http://localhost:3000/ngo/projects](http://localhost:3000/ngo/projects)
- **API Backend**: [http://localhost:5000/api](http://localhost:5000/api)

### 🔑 Credenciales de Prueba

**Administrador:**
- Email: `admin@fundacionfavorita.ec`
- Contraseña: `admin123`

**ONG (Ejemplo - Banco de Alimentos Cuenca):**
- Email: `baacuenca@example.com`
- Contraseña: `password123`

---

## 📱 Uso del Sistema

### Para Administradores

1. **Crear un Proyecto**
   - Ir a "Proyectos" → "Crear Proyecto"
   - Llenar Paso 1: Información básica
   - Paso 2: Seleccionar ejes (Nutrición, Educación, etc.)
   - Paso 3: Definir indicadores (estudiantes matriculados, kg de alimentos, etc.)
   - Clic en "Crear Proyecto"

2. **Ver Dashboard**
   - Ir a "Dashboard"
   - Seleccionar filtros (ONG, Proyecto, Mes, Año)
   - Ver gráficas en tiempo real
   - Reorganizar dashboard arrastrando componentes
   - Descargar reportes en PDF o Excel

3. **Aprobar Proyectos**
   - Ir a "Proyectos" → Pestaña "Pendientes de Aprobar"
   - Revisar proyectos al 100%
   - Clic en "Aprobar" o "Rechazar"

### Para ONGs

1. **Reportar Mensualmente**
   - Ir a "Proyectos"
   - Ver lista de proyectos asignados
   - Clic en el mes a reportar (ej: "Ene", "Feb")
   - Llenar indicadores en el formulario
   - Opcional: Subir evidencia (fotos, documentos)
   - Clic en "Enviar Reporte"
   - Confirmar

2. **Ver Reportes Anteriores**
   - Clic en meses con ✓ verde
   - Vista de solo lectura (no editable)

### Para Donantes

1. **Ver Proyectos**
   - Visitar página principal
   - Explorar galería de proyectos
   - Ver estadísticas de impacto

2. **Donar**
   - Seleccionar proyecto
   - Elegir monto
   - Ingresar datos de tarjeta
   - Confirmar pago
   - Recibir recibo por email

---

## 🤖 Uso de Inteligencia Artificial

### Integración Estratégica de IA

Este proyecto integra **OpenAI GPT-4** para potenciar las capacidades analíticas del sistema:

#### 1. **Análisis Inteligente de Reportes**

```javascript
// Endpoint: /api/openai/analyze-report
// Analiza reportes y genera insights automáticos
```

**Casos de uso:**
- Detectar anomalías en datos reportados (ej: caída de 50% en beneficiarios sin explicación)
- Generar resúmenes ejecutivos automáticos
- Comparar rendimiento con proyectos similares
- Sugerir mejoras basadas en tendencias

#### 2. **Procesamiento de PDF con IA**

```javascript
// Endpoint: /api/openai/extract-pdf
// Extrae información de reportes PDF legacy
```

**Casos de uso:**
- Migración de reportes históricos en PDF a la plataforma
- Extracción automática de métricas de documentos antiguos
- Conversión de formatos no estructurados a datos estructurados

#### 3. **Generación de Predicciones**

**Casos de uso futuros:**
- Predecir cumplimiento de metas basado en tendencias actuales
- Alertas tempranas de proyectos en riesgo
- Recomendaciones de optimización de recursos

### Configuración de OpenAI

Para habilitar las funcionalidades de IA:

1. Obtener API Key de OpenAI: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Agregar a `.env` del backend:
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
   ```
3. Reiniciar el servidor backend

### Consideraciones Éticas

- **Privacidad**: Los datos enviados a OpenAI son anonimizados
- **Transparencia**: Los usuarios son informados cuando se usa IA en análisis
- **Control humano**: Las decisiones finales siempre las toma el administrador
- **Opt-out**: Posibilidad de desactivar IA manteniendo funcionalidad core

---

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado por un equipo multidisciplinario durante el **OpenLAB Hackathon 2025**:

| Nombre | Rol | GitHub | LinkedIn |
|--------|-----|--------|----------|
| **Darwin Valdiviezo** | Lead Developer & Arquitecto de Software | [@DarwinValdiviezo](https://github.com/DarwinValdiviezo) | - |
| **Kevin** | Backend Developer & DevOps | [@KernyMC](https://github.com/KernyMC) | - |
| **Cris** | Frontend Developer & UI/UX | - | - |
| **Jair** | Full Stack Developer & QA | - | - |

### Contribuciones por Área

- **Darwin**: Arquitectura del sistema, integración IA, diseño de base de datos
- **Kevin**: API REST, autenticación, integración Plux Paybox, deployment
- **Cris**: Diseño UI/UX, componentes React, dashboard interactivo
- **Jair**: Testing, documentación, integración frontend-backend

---

## 🗓️ Roadmap

### ✅ Fase 1: MVP (Completado - Hackathon)
- [x] Autenticación y roles básicos
- [x] CRUD de ONGs y proyectos
- [x] Sistema de reportería mensual
- [x] Dashboard con gráficas básicas
- [x] Generación de PDF/Excel
- [x] Integración con pasarela de pagos
- [x] Portal público

### 🔄 Fase 2: Mejoras Core (Q1 2025)
- [ ] Autenticación con 2FA
- [ ] Sistema de notificaciones por email
- [ ] Edición de proyectos con historial de cambios
- [ ] Dashboard personalizable persistente
- [ ] Comparativas avanzadas entre ONGs
- [ ] Exportación a PowerPoint
- [ ] App móvil (React Native)

### 🚀 Fase 3: Escalabilidad (Q2 2025)
- [ ] Soporte para múltiples idiomas (EN/ES)
- [ ] API pública con documentación (Swagger)
- [ ] Integraciones: Google Sheets, Slack, Zoom
- [ ] Geolocalización de proyectos en mapa
- [ ] Certificaciones automáticas
- [ ] Dashboard predictivo con IA

### 🌟 Fase 4: Expansión (Q3-Q4 2025)
- [ ] Multi-tenancy (múltiples fundaciones en una instancia)
- [ ] Marketplace de proyectos sociales
- [ ] Blockchain para trazabilidad de donaciones
- [ ] Gamificación para donantes recurrentes
- [ ] Integración con gobiernos locales

---

**Convenciones de commits:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin afectar lógica)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en herramientas o configuración
---
