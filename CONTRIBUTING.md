# Guía de Contribución - Conquito Project

## 🎯 Para el Equipo de Desarrollo

### Darwin Valdiviezo (Lead Developer)
- Responsable de la arquitectura general
- Revisión de Pull Requests críticos
- Configuración de CI/CD
- Decisiones técnicas importantes

### Cris (Frontend Developer)
- Desarrollo de componentes React
- Implementación de UI/UX
- Optimización de rendimiento frontend
- Testing de componentes

### Kevin (Backend Developer)
- Desarrollo de APIs REST
- Implementación de seguridad
- Optimización de base de datos
- Testing de endpoints

### Jair (Full Stack Developer)
- Desarrollo de funcionalidades completas
- Integración frontend-backend
- Testing end-to-end
- Documentación técnica

## 🔄 Flujo de Trabajo

### 1. Configuración Inicial
```bash
# Clonar el repositorio
git clone https://github.com/DarwinValdiviezo/ConquitoProject.git
cd ConquitoProject

# Configurar upstream
git remote add upstream https://github.com/DarwinValdiviezo/ConquitoProject.git

# Crear rama develop
git checkout -b develop
git push -u origin develop
```

### 2. Trabajo Diario
```bash
# Actualizar desde main
git checkout main
git pull upstream main

# Crear nueva rama para feature
git checkout -b feature/nombre-funcionalidad
# o
git checkout -b bugfix/descripcion-bug
# o
git checkout -b hotfix/descripcion-urgente

# Trabajar en la funcionalidad
# ... hacer cambios ...

# Commit con convención
git add .
git commit -m "feat: agregar login con validación"

# Push a tu fork
git push origin feature/nombre-funcionalidad
```

### 3. Crear Pull Request
1. Ir a GitHub
2. Click en "Compare & pull request"
3. Seleccionar rama base: `develop`
4. Seleccionar rama feature: `feature/nombre-funcionalidad`
5. Agregar descripción detallada
6. Asignar reviewers
7. Crear PR

## 📝 Convenciones de Commits

### Formato
```
tipo(scope): descripción breve

Descripción detallada (opcional)

- Lista de cambios
- Si es necesario
```

### Tipos
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (espacios, comas, etc.)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en herramientas o configuración
- `perf:` Mejoras de rendimiento
- `ci:` Cambios en CI/CD

### Ejemplos
```bash
git commit -m "feat(auth): agregar validación de contraseñas robustas"
git commit -m "fix(api): corregir error 500 en endpoint de usuarios"
git commit -m "docs(readme): actualizar instrucciones de instalación"
git commit -m "style(frontend): formatear código con prettier"
git commit -m "refactor(database): optimizar queries de usuarios"
git commit -m "test(auth): agregar tests unitarios para login"
git commit -m "chore(deps): actualizar dependencias de seguridad"
```

## 🌳 Estructura de Ramas

### Ramas Principales
- `main` - Código de producción estable
- `develop` - Rama de desarrollo integrada

### Ramas de Trabajo
- `feature/nombre-funcionalidad` - Nuevas funcionalidades
- `bugfix/descripcion-bug` - Corrección de bugs
- `hotfix/descripcion-urgente` - Correcciones urgentes para producción

### Ejemplos
```bash
feature/user-authentication
feature/dashboard-analytics
bugfix/login-validation-error
hotfix/security-vulnerability
```

## 🔍 Proceso de Revisión

### Para el Autor del PR
1. **Autorevisión**: Revisar tu propio código antes de crear PR
2. **Testing**: Asegurar que todo funciona correctamente
3. **Documentación**: Actualizar README si es necesario
4. **Descripción clara**: Explicar qué hace el PR y por qué

### Para el Reviewer
1. **Revisar código**: Verificar calidad y buenas prácticas
2. **Probar funcionalidad**: Ejecutar y probar los cambios
3. **Verificar seguridad**: Revisar aspectos de seguridad
4. **Comentarios constructivos**: Sugerir mejoras específicas

### Criterios de Aprobación
- ✅ Código funciona correctamente
- ✅ Sigue las convenciones del proyecto
- ✅ No introduce bugs
- ✅ Mantiene o mejora la seguridad
- ✅ Documentación actualizada si es necesario

## 🚨 Reglas Importantes

### Nunca Hacer
- ❌ Commit directo a `main` o `develop`
- ❌ Merge sin revisión
- ❌ Commits sin mensaje descriptivo
- ❌ Push de archivos sensibles (.env, passwords, etc.)

### Siempre Hacer
- ✅ Crear ramas para cada funcionalidad
- ✅ Hacer commits pequeños y frecuentes
- ✅ Escribir mensajes de commit claros
- ✅ Actualizar documentación
- ✅ Probar antes de hacer PR

## 🛠️ Herramientas Recomendadas

### Para Desarrollo
- **VS Code** con extensiones:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - GitLens
  - Prettier
  - ESLint

### Para Git
- **GitHub Desktop** (para principiantes)
- **Git CLI** (para avanzados)
- **SourceTree** (alternativa gráfica)

## 📞 Comunicación

### Canales de Comunicación
- **GitHub Issues** - Para bugs y mejoras
- **GitHub Discussions** - Para preguntas generales
- **Pull Request Comments** - Para revisión de código
- **WhatsApp/Telegram** - Para coordinación rápida

### Horarios de Trabajo
- **Desarrollo activo**: 9:00 AM - 6:00 PM
- **Revisión de PRs**: 10:00 AM - 5:00 PM
- **Sprints**: Lunes y Viernes

## 🎯 Metas del Proyecto

### Objetivos Técnicos
- ✅ Código limpio y mantenible
- ✅ Seguridad robusta
- ✅ Performance optimizado
- ✅ Documentación completa
- ✅ Testing adecuado

### Objetivos de Equipo
- ✅ Colaboración efectiva
- ✅ Comunicación clara
- ✅ Aprendizaje continuo
- ✅ Entrega a tiempo
- ✅ Calidad alta

## 📚 Recursos Útiles

### Documentación
- [React Docs](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Herramientas Online
- [GitHub](https://github.com/DarwinValdiviezo/ConquitoProject)
- [Postman](https://www.postman.com/) - Para testing de APIs
- [Figma](https://figma.com/) - Para diseño UI/UX

¡Éxito en el desarrollo del proyecto! 🚀
