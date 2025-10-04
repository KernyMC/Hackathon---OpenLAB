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

// Obtener todos los ejes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const ejes = await prisma.eje.findMany({
      include: {
        proyecto: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            ong: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        },
        kpis: true
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      message: 'Ejes obtenidos exitosamente',
      ejes,
      total: ejes.length
    });

  } catch (error) {
    console.error('Error obteniendo ejes:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener ejes por proyecto
router.get('/proyecto/:proyectoId', authenticateToken, async (req, res) => {
  try {
    const proyectoId = parseInt(req.params.proyectoId);

    if (isNaN(proyectoId)) {
      return res.status(400).json({
        message: 'ID de proyecto inválido'
      });
    }

    const ejes = await prisma.eje.findMany({
      where: { idProyecto: proyectoId },
      include: {
        proyecto: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            ong: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        },
        kpis: true
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      message: 'Ejes obtenidos exitosamente',
      ejes,
      total: ejes.length
    });

  } catch (error) {
    console.error('Error obteniendo ejes:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener eje por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const ejeId = parseInt(req.params.id);

    if (isNaN(ejeId)) {
      return res.status(400).json({
        message: 'ID de eje inválido'
      });
    }

    const eje = await prisma.eje.findUnique({
      where: { id: ejeId },
      include: {
        proyecto: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            ong: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        },
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
    });

    if (!eje) {
      return res.status(404).json({
        message: 'Eje no encontrado'
      });
    }

    res.json({
      message: 'Eje obtenido exitosamente',
      eje
    });

  } catch (error) {
    console.error('Error obteniendo eje:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Crear nuevo eje
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, idProyecto } = req.body;

    // Validar entrada
    if (!nombre || !idProyecto) {
      return res.status(400).json({
        message: 'El nombre y ID de proyecto son requeridos'
      });
    }

    // Verificar que el proyecto existe
    const proyecto = await prisma.proyecto.findUnique({
      where: { id: parseInt(idProyecto) }
    });

    if (!proyecto) {
      return res.status(404).json({
        message: 'Proyecto no encontrado'
      });
    }

    // Crear eje
    const eje = await prisma.eje.create({
      data: {
        nombre,
        idProyecto: parseInt(idProyecto)
      },
      include: {
        proyecto: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            ong: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Eje creado exitosamente',
      eje
    });

  } catch (error) {
    console.error('Error creando eje:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar eje
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const ejeId = parseInt(req.params.id);
    const { nombre, idProyecto } = req.body;

    if (isNaN(ejeId)) {
      return res.status(400).json({
        message: 'ID de eje inválido'
      });
    }

    // Validar entrada
    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre es requerido'
      });
    }

    // Verificar que el eje existe
    const existingEje = await prisma.eje.findUnique({
      where: { id: ejeId }
    });

    if (!existingEje) {
      return res.status(404).json({
        message: 'Eje no encontrado'
      });
    }

    // Si se proporciona un nuevo ID de proyecto, verificar que existe
    if (idProyecto && parseInt(idProyecto) !== existingEje.idProyecto) {
      const proyecto = await prisma.proyecto.findUnique({
        where: { id: parseInt(idProyecto) }
      });

      if (!proyecto) {
        return res.status(404).json({
          message: 'Proyecto no encontrado'
        });
      }
    }

    // Actualizar eje
    const eje = await prisma.eje.update({
      where: { id: ejeId },
      data: {
        nombre,
        ...(idProyecto && { idProyecto: parseInt(idProyecto) })
      },
      include: {
        proyecto: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            ong: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Eje actualizado exitosamente',
      eje
    });

  } catch (error) {
    console.error('Error actualizando eje:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar eje
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const ejeId = parseInt(req.params.id);

    if (isNaN(ejeId)) {
      return res.status(400).json({
        message: 'ID de eje inválido'
      });
    }

    // Verificar que el eje existe
    const existingEje = await prisma.eje.findUnique({
      where: { id: ejeId }
    });

    if (!existingEje) {
      return res.status(404).json({
        message: 'Eje no encontrado'
      });
    }

    // Eliminar eje
    await prisma.eje.delete({
      where: { id: ejeId }
    });

    res.json({
      message: 'Eje eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando eje:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
