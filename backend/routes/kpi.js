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

// Obtener todos los KPIs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const kpis = await prisma.kPI.findMany({
      include: {
        eje: {
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
        },
        items: {
          include: {
            tipoDatoItem: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      message: 'KPIs obtenidos exitosamente',
      kpis,
      total: kpis.length
    });

  } catch (error) {
    console.error('Error obteniendo KPIs:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener KPIs por eje
router.get('/eje/:ejeId', authenticateToken, async (req, res) => {
  try {
    const ejeId = parseInt(req.params.ejeId);

    if (isNaN(ejeId)) {
      return res.status(400).json({
        message: 'ID de eje inválido'
      });
    }

    const kpis = await prisma.kPI.findMany({
      where: { idEje: ejeId },
      include: {
        eje: {
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
        },
        items: {
          include: {
            tipoDatoItem: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      message: 'KPIs obtenidos exitosamente',
      kpis,
      total: kpis.length
    });

  } catch (error) {
    console.error('Error obteniendo KPIs:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener KPI por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const kpiId = parseInt(req.params.id);

    if (isNaN(kpiId)) {
      return res.status(400).json({
        message: 'ID de KPI inválido'
      });
    }

    const kpi = await prisma.kPI.findUnique({
      where: { id: kpiId },
      include: {
        eje: {
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
        },
        items: {
          include: {
            tipoDatoItem: true
          }
        }
      }
    });

    if (!kpi) {
      return res.status(404).json({
        message: 'KPI no encontrado'
      });
    }

    res.json({
      message: 'KPI obtenido exitosamente',
      kpi
    });

  } catch (error) {
    console.error('Error obteniendo KPI:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Crear nuevo KPI
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, idEje } = req.body;

    // Validar entrada
    if (!nombre || !idEje) {
      return res.status(400).json({
        message: 'El nombre y ID de eje son requeridos'
      });
    }

    // Verificar que el eje existe
    const eje = await prisma.eje.findUnique({
      where: { id: parseInt(idEje) }
    });

    if (!eje) {
      return res.status(404).json({
        message: 'Eje no encontrado'
      });
    }

    // Crear KPI
    const kpi = await prisma.kPI.create({
      data: {
        nombre,
        idEje: parseInt(idEje)
      },
      include: {
        eje: {
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
        }
      }
    });

    res.status(201).json({
      message: 'KPI creado exitosamente',
      kpi
    });

  } catch (error) {
    console.error('Error creando KPI:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar KPI
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const kpiId = parseInt(req.params.id);
    const { nombre, idEje } = req.body;

    if (isNaN(kpiId)) {
      return res.status(400).json({
        message: 'ID de KPI inválido'
      });
    }

    // Validar entrada
    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre es requerido'
      });
    }

    // Verificar que el KPI existe
    const existingKpi = await prisma.kPI.findUnique({
      where: { id: kpiId }
    });

    if (!existingKpi) {
      return res.status(404).json({
        message: 'KPI no encontrado'
      });
    }

    // Si se proporciona un nuevo ID de eje, verificar que existe
    if (idEje && parseInt(idEje) !== existingKpi.idEje) {
      const eje = await prisma.eje.findUnique({
        where: { id: parseInt(idEje) }
      });

      if (!eje) {
        return res.status(404).json({
          message: 'Eje no encontrado'
        });
      }
    }

    // Actualizar KPI
    const kpi = await prisma.kPI.update({
      where: { id: kpiId },
      data: {
        nombre,
        ...(idEje && { idEje: parseInt(idEje) })
      },
      include: {
        eje: {
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
        }
      }
    });

    res.json({
      message: 'KPI actualizado exitosamente',
      kpi
    });

  } catch (error) {
    console.error('Error actualizando KPI:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar KPI
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const kpiId = parseInt(req.params.id);

    if (isNaN(kpiId)) {
      return res.status(400).json({
        message: 'ID de KPI inválido'
      });
    }

    // Verificar que el KPI existe
    const existingKpi = await prisma.kPI.findUnique({
      where: { id: kpiId }
    });

    if (!existingKpi) {
      return res.status(404).json({
        message: 'KPI no encontrado'
      });
    }

    // Eliminar KPI
    await prisma.kPI.delete({
      where: { id: kpiId }
    });

    res.json({
      message: 'KPI eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando KPI:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
