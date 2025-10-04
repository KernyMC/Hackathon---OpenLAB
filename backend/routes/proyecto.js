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

// Obtener todos los proyectos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const proyectos = await prisma.proyecto.findMany({
      include: {
        ong: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        },
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
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      message: 'Proyectos obtenidos exitosamente',
      proyectos,
      total: proyectos.length
    });

  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener proyectos por ONG
router.get('/ong/:ongId', authenticateToken, async (req, res) => {
  try {
    const ongId = parseInt(req.params.ongId);

    if (isNaN(ongId)) {
      return res.status(400).json({
        message: 'ID de ONG inválido'
      });
    }

    const proyectos = await prisma.proyecto.findMany({
      where: { idOng: ongId },
      include: {
        ong: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        },
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
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      message: 'Proyectos obtenidos exitosamente',
      proyectos,
      total: proyectos.length
    });

  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener proyecto por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const proyectoId = parseInt(req.params.id);

    if (isNaN(proyectoId)) {
      return res.status(400).json({
        message: 'ID de proyecto inválido'
      });
    }

    const proyecto = await prisma.proyecto.findUnique({
      where: { id: proyectoId },
      include: {
        ong: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        },
        ejes: {
          include: {
            kpis: {
              include: {
                items: {
                  include: {
                    tipoDatoItem: true
                  }
                }
              }
            }
          }
        },
        ejesObservables: {
          include: {
            kpisObservables: {
              include: {
                itemsObservables: {
                  include: {
                    tipoDatoItem: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!proyecto) {
      return res.status(404).json({
        message: 'Proyecto no encontrado'
      });
    }

    res.json({
      message: 'Proyecto obtenido exitosamente',
      proyecto
    });

  } catch (error) {
    console.error('Error obteniendo proyecto:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Crear nuevo proyecto
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, descripcion, idOng } = req.body;

    // Validar entrada
    if (!nombre || !idOng) {
      return res.status(400).json({
        message: 'El nombre y ID de ONG son requeridos'
      });
    }

    // Verificar que la ONG existe
    const ong = await prisma.oNG.findUnique({
      where: { id: parseInt(idOng) }
    });

    if (!ong) {
      return res.status(404).json({
        message: 'ONG no encontrada'
      });
    }

    // Crear proyecto
    const proyecto = await prisma.proyecto.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        idOng: parseInt(idOng)
      },
      include: {
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
      message: 'Proyecto creado exitosamente',
      proyecto
    });

  } catch (error) {
    console.error('Error creando proyecto:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar proyecto
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const proyectoId = parseInt(req.params.id);
    const { nombre, descripcion, idOng } = req.body;

    if (isNaN(proyectoId)) {
      return res.status(400).json({
        message: 'ID de proyecto inválido'
      });
    }

    // Validar entrada
    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre es requerido'
      });
    }

    // Verificar que el proyecto existe
    const existingProyecto = await prisma.proyecto.findUnique({
      where: { id: proyectoId }
    });

    if (!existingProyecto) {
      return res.status(404).json({
        message: 'Proyecto no encontrado'
      });
    }

    // Si se proporciona un nuevo ID de ONG, verificar que existe
    if (idOng && parseInt(idOng) !== existingProyecto.idOng) {
      const ong = await prisma.oNG.findUnique({
        where: { id: parseInt(idOng) }
      });

      if (!ong) {
        return res.status(404).json({
          message: 'ONG no encontrada'
        });
      }
    }

    // Actualizar proyecto
    const proyecto = await prisma.proyecto.update({
      where: { id: proyectoId },
      data: {
        nombre,
        descripcion: descripcion || null,
        ...(idOng && { idOng: parseInt(idOng) })
      },
      include: {
        ong: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        }
      }
    });

    res.json({
      message: 'Proyecto actualizado exitosamente',
      proyecto
    });

  } catch (error) {
    console.error('Error actualizando proyecto:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar proyecto
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const proyectoId = parseInt(req.params.id);

    if (isNaN(proyectoId)) {
      return res.status(400).json({
        message: 'ID de proyecto inválido'
      });
    }

    // Verificar que el proyecto existe
    const existingProyecto = await prisma.proyecto.findUnique({
      where: { id: proyectoId }
    });

    if (!existingProyecto) {
      return res.status(404).json({
        message: 'Proyecto no encontrado'
      });
    }

    // Eliminar proyecto
    await prisma.proyecto.delete({
      where: { id: proyectoId }
    });

    res.json({
      message: 'Proyecto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
