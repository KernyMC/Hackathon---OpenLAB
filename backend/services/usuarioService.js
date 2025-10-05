const prisma = require("../lib/prisma");

/**
 * Servicio para manejar la lógica de negocio de Usuario
 * Incluye operaciones CRUD básicas
 */
class UsuarioService {
  /**
   * Crear un nuevo usuario
   * @param {Object} data - Datos del usuario
   * @param {string} data.nombres - Nombres del usuario
   * @param {string} data.apellidos - Apellidos del usuario
   * @param {string} data.email - Email del usuario
   * @param {string} data.password - Contraseña del usuario
   * @param {string} data.cedula - Cédula del usuario
   * @param {number} data.idTipoUsuario - ID del tipo de usuario
   * @returns {Promise<Object>} Usuario creado (sin password)
   */
  async crear(data) {
    const { nombres, apellidos, email, password, cedula, idTipoUsuario } = data;
    // Verificar si el email ya existe
    const emailExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (emailExistente) {
      throw new Error("Ya existe un usuario con este email");
    }

    // Verificar si la cédula ya existe
    const cedulaExistente = await prisma.usuario.findFirst({
      where: { cedula },
    });

    if (cedulaExistente) {
      throw new Error("Ya existe un usuario con esta cédula");
    }

    // Verificar que el tipo de usuario existe
    const tipoUsuario = await prisma.tipoUsuario.findUnique({
      where: { id: parseInt(idTipoUsuario) },
    });

    if (!tipoUsuario) {
      throw new Error("Tipo de usuario no encontrado");
    }

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombres,
        apellidos,
        email,
        password,
        cedula,
        idTipoUsuario: parseInt(idTipoUsuario),
      },
      include: {
        tipoUsuario: {
          select: {
            id: true,
            descripcion: true,
          },
        },
      },
    });

    return nuevoUsuario;
  }

  /**
   * Obtener todos los usuarios con paginación y filtros
   * @param {Object} filtros - Filtros de búsqueda
   * @param {number} filtros.page - Número de página
   * @param {number} filtros.limit - Límite por página
   * @param {string} filtros.search - Término de búsqueda
   * @param {number} filtros.tipoUsuario - Filtrar por tipo de usuario
   * @returns {Promise<Object>} Lista paginada de usuarios
   */
  async obtenerTodos(filtros = {}) {
    const { page = 1, limit = 10, search, tipoUsuario } = filtros;
    const skip = (page - 1) * limit;

    // Construir filtros
    let where = {};

    if (search) {
      where.OR = [
        { nombres: { contains: search, mode: "insensitive" } },
        { apellidos: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { cedula: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tipoUsuario) {
      where.idTipoUsuario = parseInt(tipoUsuario);
    }

    // Obtener usuarios con paginación
    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        select: {
          id: true,
          nombres: true,
          apellidos: true,
          email: true,
          password: true,
          cedula: true,
          idTipoUsuario: true,
          createdAt: true,
          lastLogin: true,
          tipoUsuario: {
            select: {
              id: true,
              descripcion: true,
            },
          },
          usuarioOngs: {
            include: {
              ong: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
          _count: {
            select: {
              usuarioOngs: true,
            },
          },
        },
        orderBy: [{ nombres: "asc" }, { apellidos: "asc" }],
      }),
      prisma.usuario.count({ where }),
    ]);

    return {
      data: usuarios,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  /**
   * Obtener usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object>} Usuario encontrado (sin password)
   */
  async obtenerPorId(id) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        cedula: true,
        idTipoUsuario: true,
        createdAt: true,
        lastLogin: true,
        tipoUsuario: {
          select: {
            id: true,
            descripcion: true,
          },
        },
        usuarioOngs: {
          include: {
            ong: {
              select: {
                id: true,
                nombre: true,
                descripcion: true,
              },
            },
          },
        },
        _count: {
          select: {
            usuarioOngs: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    return usuario;
  }

  /**
   * Actualizar usuario
   * @param {number} id - ID del usuario
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado (sin password)
   */
  async actualizar(id, data) {
    const { nombres, apellidos, email, password, cedula, idTipoUsuario } = data;

    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
    });

    if (!usuarioExistente) {
      throw new Error("Usuario no encontrado");
    }

    // Verificar duplicados de email (excluyendo el usuario actual)
    if (email && email !== usuarioExistente.email) {
      const emailDuplicado = await prisma.usuario.findUnique({
        where: { email },
      });

      if (emailDuplicado) {
        throw new Error("Ya existe otro usuario con este email");
      }
    }

    // Verificar duplicados de cédula (excluyendo el usuario actual)
    if (cedula && cedula !== usuarioExistente.cedula) {
      const cedulaDuplicada = await prisma.usuario.findFirst({
        where: {
          AND: [{ cedula }, { id: { not: parseInt(id) } }],
        },
      });

      if (cedulaDuplicada) {
        throw new Error("Ya existe otro usuario con esta cédula");
      }
    }

    // Verificar tipo de usuario si se está actualizando
    if (idTipoUsuario) {
      const tipoUsuario = await prisma.tipoUsuario.findUnique({
        where: { id: parseInt(idTipoUsuario) },
      });

      if (!tipoUsuario) {
        throw new Error("Tipo de usuario no encontrado");
      }
    }

    // Preparar datos de actualización
    const datosActualizacion = {};

    if (nombres) datosActualizacion.nombres = nombres;
    if (apellidos) datosActualizacion.apellidos = apellidos;
    if (email) datosActualizacion.email = email;
    if (cedula) datosActualizacion.cedula = cedula;
    if (idTipoUsuario)
      datosActualizacion.idTipoUsuario = parseInt(idTipoUsuario);

    // Agregar contraseña si se proporciona
    if (password) {
      datosActualizacion.password = password;
    }

    // Actualizar usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: datosActualizacion,
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        cedula: true,
        idTipoUsuario: true,
        createdAt: true,
        lastLogin: true,
        tipoUsuario: {
          select: {
            id: true,
            descripcion: true,
          },
        },
      },
    });

    return usuarioActualizado;
  }

  /**
   * Eliminar usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async eliminar(id) {
    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            usuarioOngs: true,
          },
        },
      },
    });

    if (!usuarioExistente) {
      throw new Error("Usuario no encontrado");
    }

    // El usuario puede eliminarse aunque tenga relaciones
    // Las relaciones usuario-ong se eliminarán manualmente

    await prisma.$transaction(async (tx) => {
      // Eliminar relaciones usuario-ong
      await tx.usuarioOng.deleteMany({
        where: { idUsuario: parseInt(id) },
      });

      // Eliminar usuario
      await tx.usuario.delete({
        where: { id: parseInt(id) },
      });
    });

    return {
      message: "Usuario eliminado exitosamente",
      eliminado: {
        id: usuarioExistente.id,
        nombres: usuarioExistente.nombres,
        apellidos: usuarioExistente.apellidos,
        email: usuarioExistente.email,
      },
    };
  }

  /**
   * Obtener estadísticas de usuarios
   * @returns {Promise<Object>} Estadísticas generales
   */
  async obtenerEstadisticas() {
    const [
      totalUsuarios,
      usuariosPorTipo,
      usuariosRegistradosHoy,
      usuariosRegistradosEstesMes,
    ] = await Promise.all([
      prisma.usuario.count(),

      prisma.tipoUsuario.findMany({
        select: {
          id: true,
          descripcion: true,
          _count: {
            select: {
              usuarios: true,
            },
          },
        },
        orderBy: {
          usuarios: {
            _count: "desc",
          },
        },
      }),

      prisma.usuario.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      prisma.usuario.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      totalUsuarios,
      usuariosPorTipo,
      usuariosRegistradosHoy,
      usuariosRegistradosEstesMes,
    };
  }
}

module.exports = new UsuarioService();
