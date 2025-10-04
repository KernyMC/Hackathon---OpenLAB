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

// Obtener todos los items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        kpi: {
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
        },
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
        tipoDatoItem: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    res.json({
      message: 'Items obtenidos exitosamente',
      items,
      total: items.length
    });

  } catch (error) {
    console.error('Error obteniendo items:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener items por KPI
router.get('/kpi/:kpiId', authenticateToken, async (req, res) => {
  try {
    const kpiId = parseInt(req.params.kpiId);

    if (isNaN(kpiId)) {
      return res.status(400).json({
        message: 'ID de KPI inválido'
      });
    }

    const items = await prisma.item.findMany({
      where: { idKpi: kpiId },
      include: {
        kpi: {
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
        },
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
        tipoDatoItem: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    res.json({
      message: 'Items obtenidos exitosamente',
      items,
      total: items.length
    });

  } catch (error) {
    console.error('Error obteniendo items:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener items por proyecto
router.get('/proyecto/:proyectoId', authenticateToken, async (req, res) => {
  try {
    const proyectoId = parseInt(req.params.proyectoId);

    if (isNaN(proyectoId)) {
      return res.status(400).json({
        message: 'ID de proyecto inválido'
      });
    }

    const items = await prisma.item.findMany({
      where: { idProyecto: proyectoId },
      include: {
        kpi: {
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
        },
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
        tipoDatoItem: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    res.json({
      message: 'Items obtenidos exitosamente',
      items,
      total: items.length
    });

  } catch (error) {
    console.error('Error obteniendo items:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener item por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);

    if (isNaN(itemId)) {
      return res.status(400).json({
        message: 'ID de item inválido'
      });
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        kpi: {
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
        },
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
        tipoDatoItem: true
      }
    });

    if (!item) {
      return res.status(404).json({
        message: 'Item no encontrado'
      });
    }

    res.json({
      message: 'Item obtenido exitosamente',
      item
    });

  } catch (error) {
    console.error('Error obteniendo item:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Crear nuevo item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { idKpi, idProyecto, descripcion, idTipoDatoItem } = req.body;

    // Validar entrada
    if (!idKpi || !idProyecto || !idTipoDatoItem) {
      return res.status(400).json({
        message: 'ID de KPI, ID de proyecto e ID de tipo de dato son requeridos'
      });
    }

    // Verificar que el KPI existe
    const kpi = await prisma.kPI.findUnique({
      where: { id: parseInt(idKpi) }
    });

    if (!kpi) {
      return res.status(404).json({
        message: 'KPI no encontrado'
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

    // Verificar que el tipo de dato existe
    const tipoDato = await prisma.tipoDatoItem.findUnique({
      where: { id: parseInt(idTipoDatoItem) }
    });

    if (!tipoDato) {
      return res.status(404).json({
        message: 'Tipo de dato no encontrado'
      });
    }

    // Crear item
    const item = await prisma.item.create({
      data: {
        idKpi: parseInt(idKpi),
        idProyecto: parseInt(idProyecto),
        descripcion: descripcion || null,
        idTipoDatoItem: parseInt(idTipoDatoItem)
      },
      include: {
        kpi: {
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
        },
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
        tipoDatoItem: true
      }
    });

    res.status(201).json({
      message: 'Item creado exitosamente',
      item
    });

  } catch (error) {
    console.error('Error creando item:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { idKpi, idProyecto, descripcion, idTipoDatoItem } = req.body;

    if (isNaN(itemId)) {
      return res.status(400).json({
        message: 'ID de item inválido'
      });
    }

    // Verificar que el item existe
    const existingItem = await prisma.item.findUnique({
      where: { id: itemId }
    });

    if (!existingItem) {
      return res.status(404).json({
        message: 'Item no encontrado'
      });
    }

    // Si se proporciona un nuevo ID de KPI, verificar que existe
    if (idKpi && parseInt(idKpi) !== existingItem.idKpi) {
      const kpi = await prisma.kPI.findUnique({
        where: { id: parseInt(idKpi) }
      });

      if (!kpi) {
        return res.status(404).json({
          message: 'KPI no encontrado'
        });
      }
    }

    // Si se proporciona un nuevo ID de proyecto, verificar que existe
    if (idProyecto && parseInt(idProyecto) !== existingItem.idProyecto) {
      const proyecto = await prisma.proyecto.findUnique({
        where: { id: parseInt(idProyecto) }
      });

      if (!proyecto) {
        return res.status(404).json({
          message: 'Proyecto no encontrado'
        });
      }
    }

    // Si se proporciona un nuevo ID de tipo de dato, verificar que existe
    if (idTipoDatoItem && parseInt(idTipoDatoItem) !== existingItem.idTipoDatoItem) {
      const tipoDato = await prisma.tipoDatoItem.findUnique({
        where: { id: parseInt(idTipoDatoItem) }
      });

      if (!tipoDato) {
        return res.status(404).json({
          message: 'Tipo de dato no encontrado'
        });
      }
    }

    // Actualizar item
    const item = await prisma.item.update({
      where: { id: itemId },
      data: {
        ...(idKpi && { idKpi: parseInt(idKpi) }),
        ...(idProyecto && { idProyecto: parseInt(idProyecto) }),
        ...(descripcion !== undefined && { descripcion }),
        ...(idTipoDatoItem && { idTipoDatoItem: parseInt(idTipoDatoItem) })
      },
      include: {
        kpi: {
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
        },
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
        tipoDatoItem: true
      }
    });

    res.json({
      message: 'Item actualizado exitosamente',
      item
    });

  } catch (error) {
    console.error('Error actualizando item:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);

    if (isNaN(itemId)) {
      return res.status(400).json({
        message: 'ID de item inválido'
      });
    }

    // Verificar que el item existe
    const existingItem = await prisma.item.findUnique({
      where: { id: itemId }
    });

    if (!existingItem) {
      return res.status(404).json({
        message: 'Item no encontrado'
      });
    }

    // Eliminar item
    await prisma.item.delete({
      where: { id: itemId }
    });

    res.json({
      message: 'Item eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando item:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
