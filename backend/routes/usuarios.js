const express = require("express");
const { body, query, param, validationResult } = require("express-validator");
const usuarioService = require("../services/usuarioService");

const router = express.Router();

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// Middleware para manejar errores de servicio
const handleServiceError = (error, req, res, next) => {
  console.error("Error en Usuario Service:", error);

  if (error.message === "Usuario no encontrado") {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message === "Tipo de usuario no encontrado") {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message.includes("Ya existe")) {
    return res.status(409).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message === "Credenciales inválidas") {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message === "La contraseña actual es incorrecta") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Contacte al administrador",
  });
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioCompleto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario
 *         nombres:
 *           type: string
 *           description: Nombres del usuario
 *           example: "Juan Carlos"
 *         apellidos:
 *           type: string
 *           description: Apellidos del usuario
 *           example: "Pérez López"
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: "juan.perez@example.com"
 *         cedula:
 *           type: string
 *           description: Cédula de identidad
 *           example: "1234567890"
 *         idTipoUsuario:
 *           type: integer
 *           description: ID del tipo de usuario
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: Último login
 *         tipoUsuario:
 *           $ref: '#/components/schemas/TipoUsuario'
 */

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema con validación de datos únicos.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombres
 *               - apellidos
 *               - email
 *               - password
 *               - cedula
 *               - idTipoUsuario
 *             properties:
 *               nombres:
 *                 type: string
 *                 description: Nombres del usuario
 *                 example: "Juan Carlos"
 *               apellidos:
 *                 type: string
 *                 description: Apellidos del usuario
 *                 example: "Pérez López"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email único del usuario
 *                 example: "juan.perez@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario (mínimo 6 caracteres)
 *                 example: "password123"
 *               cedula:
 *                 type: string
 *                 description: Cédula de identidad única
 *                 example: "1234567890"
 *               idTipoUsuario:
 *                 type: integer
 *                 description: ID del tipo de usuario
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/UsuarioCompleto'
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Tipo de usuario no encontrado
 *       409:
 *         description: Email o cédula ya existen
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/",
  [
    body("nombres")
      .notEmpty()
      .withMessage("Los nombres son requeridos")
      .isLength({ min: 2, max: 100 })
      .withMessage("Los nombres deben tener entre 2 y 100 caracteres")
      .trim(),
    body("apellidos")
      .notEmpty()
      .withMessage("Los apellidos son requeridos")
      .isLength({ min: 2, max: 100 })
      .withMessage("Los apellidos deben tener entre 2 y 100 caracteres")
      .trim(),
    body("email")
      .isEmail()
      .withMessage("Debe ser un email válido")
      .normalizeEmail()
      .isLength({ max: 150 })
      .withMessage("El email no puede exceder 150 caracteres"),
    body("password")
      .isLength({ min: 6, max: 255 })
      .withMessage("La contraseña debe tener entre 6 y 255 caracteres"),
    body("cedula")
      .notEmpty()
      .withMessage("La cédula es requerida")
      .isLength({ min: 8, max: 15 })
      .withMessage("La cédula debe tener entre 8 y 15 caracteres")
      .trim(),
    body("idTipoUsuario")
      .isInt({ min: 1 })
      .withMessage("El tipo de usuario debe ser un número válido"),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const nuevoUsuario = await usuarioService.crear(req.body);

      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: nuevoUsuario,
      });
    } catch (error) {
      handleServiceError(error, req, res, next);
    }
  }
);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Obtiene una lista paginada de usuarios con filtros opcionales.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Cantidad de elementos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda en nombres, apellidos, email o cédula
 *       - in: query
 *         name: tipoUsuario
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de tipo de usuario
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UsuarioCompleto'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("La página debe ser un número mayor a 0"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("El límite debe ser entre 1 y 100"),
    query("search")
      .optional()
      .isLength({ max: 100 })
      .withMessage("El término de búsqueda no puede exceder 100 caracteres")
      .trim(),
    query("tipoUsuario")
      .optional()
      .isInt({ min: 1 })
      .withMessage("El tipo de usuario debe ser un número válido"),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const resultado = await usuarioService.obtenerTodos(req.query);

      res.json({
        success: true,
        ...resultado,
      });
    } catch (error) {
      handleServiceError(error, req, res, next);
    }
  }
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Obtiene los detalles completos de un usuario específico incluyendo ONGs y sesiones.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UsuarioCompleto'
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero válido"),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const usuario = await usuarioService.obtenerPorId(req.params.id);

      res.json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      handleServiceError(error, req, res, next);
    }
  }
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza los datos de un usuario existente. Todos los campos son opcionales.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *                 description: Nuevos nombres del usuario
 *                 example: "Juan Carlos"
 *               apellidos:
 *                 type: string
 *                 description: Nuevos apellidos del usuario
 *                 example: "Pérez López"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo email del usuario
 *                 example: "nuevo.email@example.com"
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *                 example: "newpassword123"
 *               cedula:
 *                 type: string
 *                 description: Nueva cédula del usuario
 *                 example: "0987654321"
 *               idTipoUsuario:
 *                 type: integer
 *                 description: Nuevo tipo de usuario
 *                 example: 2
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/UsuarioCompleto'
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Usuario o tipo de usuario no encontrado
 *       409:
 *         description: Email o cédula ya existen
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero válido"),
    body("nombres")
      .optional()
      .notEmpty()
      .withMessage("Los nombres no pueden estar vacíos")
      .isLength({ min: 2, max: 100 })
      .withMessage("Los nombres deben tener entre 2 y 100 caracteres")
      .trim(),
    body("apellidos")
      .optional()
      .notEmpty()
      .withMessage("Los apellidos no pueden estar vacíos")
      .isLength({ min: 2, max: 100 })
      .withMessage("Los apellidos deben tener entre 2 y 100 caracteres")
      .trim(),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Debe ser un email válido")
      .normalizeEmail()
      .isLength({ max: 150 })
      .withMessage("El email no puede exceder 150 caracteres"),
    body("password")
      .optional()
      .isLength({ min: 6, max: 255 })
      .withMessage("La contraseña debe tener entre 6 y 255 caracteres"),
    body("cedula")
      .optional()
      .notEmpty()
      .withMessage("La cédula no puede estar vacía")
      .isLength({ min: 8, max: 15 })
      .withMessage("La cédula debe tener entre 8 y 15 caracteres")
      .trim(),
    body("idTipoUsuario")
      .optional()
      .isInt({ min: 1 })
      .withMessage("El tipo de usuario debe ser un número válido"),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const usuarioActualizado = await usuarioService.actualizar(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        message: "Usuario actualizado exitosamente",
        data: usuarioActualizado,
      });
    } catch (error) {
      handleServiceError(error, req, res, next);
    }
  }
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     description: Elimina un usuario del sistema junto con sus relaciones.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado exitosamente"
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero válido"),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const resultado = await usuarioService.eliminar(req.params.id);

      res.json({
        success: true,
        message: resultado.message,
      });
    } catch (error) {
      handleServiceError(error, req, res, next);
    }
  }
);

/**
 * @swagger
 * /api/usuarios/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de usuarios
 *     description: Obtiene estadísticas generales sobre los usuarios en el sistema.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsuarios:
 *                       type: integer
 *                       description: Total de usuarios registrados
 *                     usuariosPorTipo:
 *                       type: array
 *                       description: Distribución de usuarios por tipo
 *                     usuariosConSesionesActivas:
 *                       type: integer
 *                       description: Usuarios con sesiones activas
 *                     usuariosRegistradosHoy:
 *                       type: integer
 *                       description: Usuarios registrados hoy
 *                     usuariosRegistradosEstesMes:
 *                       type: integer
 *                       description: Usuarios registrados este mes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/estadisticas", async (req, res, next) => {
  try {
    const estadisticas = await usuarioService.obtenerEstadisticas();

    res.json({
      success: true,
      data: estadisticas,
    });
  } catch (error) {
    handleServiceError(error, req, res, next);
  }
});

/**
 * @swagger
 * /api/usuarios/{id}/cambiar-password:
 *   put:
 *     summary: Cambiar contraseña del usuario
 *     description: Permite a un usuario cambiar su contraseña proporcionando la actual y la nueva.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Contraseña actual del usuario
 *                 example: "currentpassword123"
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *                 example: "newpassword456"
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada exitosamente"
 *       400:
 *         description: Contraseña actual incorrecta o errores de validación
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  "/:id/cambiar-password",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero válido"),
    body("currentPassword")
      .notEmpty()
      .withMessage("La contraseña actual es requerida"),
    body("newPassword")
      .isLength({ min: 6, max: 255 })
      .withMessage("La nueva contraseña debe tener entre 6 y 255 caracteres"),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const resultado = await usuarioService.cambiarPassword(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        message: resultado.message,
      });
    } catch (error) {
      handleServiceError(error, req, res, next);
    }
  }
);

module.exports = router;
