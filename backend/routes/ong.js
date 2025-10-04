const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const prisma = require('../lib/prisma');

const router = express.Router();

// Middleware para verificar JWT
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token de acceso requerido'
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
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
            descripcion: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        message: 'Usuario no encontrado'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({
      message: 'Token inválido'
    });
  }
};

// Obtener todas las ONG
router.get('/', authenticateToken, async (req, res) => {
  try {
    const ongs = await prisma.oNG.findMany({
      include: {
        usuarioOngs: {
          include: {
            usuario: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true
              }
            }
          }
        },
        proyectos: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      message: 'ONGs obtenidas exitosamente',
      ongs,
      total: ongs.length
    });

  } catch (error) {
    console.error('Error obteniendo ONGs:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener ONG por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const ongId = parseInt(req.params.id);

    if (isNaN(ongId)) {
      return res.status(400).json({
        message: 'ID de ONG inválido'
      });
    }

    const ong = await prisma.oNG.findUnique({
      where: { id: ongId },
      include: {
        usuarioOngs: {
          include: {
            usuario: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true
              }
            }
          }
        },
        proyectos: {
          include: {
            ejes: {
              include: {
                kpis: true
              }
            },
            ejesObservables: {
              include: {
                kpisObservables: true
              }
            }
          }
        }
      }
    });

    if (!ong) {
      return res.status(404).json({
        message: 'ONG no encontrada'
      });
    }

    res.json({
      message: 'ONG obtenida exitosamente',
      ong
    });

  } catch (error) {
    console.error('Error obteniendo ONG:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Crear nueva ONG
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validar entrada
    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre es requerido'
      });
    }

    // Crear ONG
    const ong = await prisma.oNG.create({
      data: {
        nombre,
        descripcion: descripcion || null
      },
      include: {
        usuarioOngs: {
          include: {
            usuario: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'ONG creada exitosamente',
      ong
    });

  } catch (error) {
    console.error('Error creando ONG:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar ONG
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const ongId = parseInt(req.params.id);
    const { nombre, descripcion } = req.body;

    if (isNaN(ongId)) {
      return res.status(400).json({
        message: 'ID de ONG inválido'
      });
    }

    // Validar entrada
    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre es requerido'
      });
    }

    // Verificar que la ONG existe
    const existingOng = await prisma.oNG.findUnique({
      where: { id: ongId }
    });

    if (!existingOng) {
      return res.status(404).json({
        message: 'ONG no encontrada'
      });
    }

    // Actualizar ONG
    const ong = await prisma.oNG.update({
      where: { id: ongId },
      data: {
        nombre,
        descripcion: descripcion || null
      },
      include: {
        usuarioOngs: {
          include: {
            usuario: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'ONG actualizada exitosamente',
      ong
    });

  } catch (error) {
    console.error('Error actualizando ONG:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar ONG
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const ongId = parseInt(req.params.id);

    if (isNaN(ongId)) {
      return res.status(400).json({
        message: 'ID de ONG inválido'
      });
    }

    // Verificar que la ONG existe
    const existingOng = await prisma.oNG.findUnique({
      where: { id: ongId }
    });

    if (!existingOng) {
      return res.status(404).json({
        message: 'ONG no encontrada'
      });
    }

    // Eliminar ONG
    await prisma.oNG.delete({
      where: { id: ongId }
    });

    res.json({
      message: 'ONG eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando ONG:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Asociar usuario a ONG
router.post('/:id/usuarios', authenticateToken, async (req, res) => {
  try {
    const ongId = parseInt(req.params.id);
    const { idUsuario } = req.body;

    if (isNaN(ongId)) {
      return res.status(400).json({
        message: 'ID de ONG inválido'
      });
    }

    if (!idUsuario) {
      return res.status(400).json({
        message: 'ID de usuario es requerido'
      });
    }

    // Verificar que la ONG existe
    const ong = await prisma.oNG.findUnique({
      where: { id: ongId }
    });

    if (!ong) {
      return res.status(404).json({
        message: 'ONG no encontrada'
      });
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(idUsuario) }
    });

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si ya existe la asociación
    const existingAssociation = await prisma.usuarioOng.findFirst({
      where: {
        idOng: ongId,
        idUsuario: parseInt(idUsuario)
      }
    });

    if (existingAssociation) {
      return res.status(400).json({
        message: 'El usuario ya está asociado a esta ONG'
      });
    }

    // Crear asociación
    const usuarioOng = await prisma.usuarioOng.create({
      data: {
        idOng: ongId,
        idUsuario: parseInt(idUsuario)
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true
          }
        },
        ong: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Usuario asociado a ONG exitosamente',
      usuarioOng
    });

  } catch (error) {
    console.error('Error asociando usuario a ONG:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Desasociar usuario de ONG
router.delete('/:id/usuarios/:usuarioId', authenticateToken, async (req, res) => {
  try {
    const ongId = parseInt(req.params.id);
    const usuarioId = parseInt(req.params.usuarioId);

    if (isNaN(ongId) || isNaN(usuarioId)) {
      return res.status(400).json({
        message: 'IDs inválidos'
      });
    }

    // Verificar que la asociación existe
    const existingAssociation = await prisma.usuarioOng.findFirst({
      where: {
        idOng: ongId,
        idUsuario: usuarioId
      }
    });

    if (!existingAssociation) {
      return res.status(404).json({
        message: 'Asociación no encontrada'
      });
    }

    // Eliminar asociación
    await prisma.usuarioOng.delete({
      where: { id: existingAssociation.id }
    });

    res.json({
      message: 'Usuario desasociado de ONG exitosamente'
    });

  } catch (error) {
    console.error('Error desasociando usuario de ONG:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
