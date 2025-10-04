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

// Obtener todos los tipos de datos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tiposDatos = await prisma.tipoDatoItem.findMany({
      include: {
        items: {
          select: {
            id: true,
            descripcion: true,
            kpi: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        },
        itemsObservables: {
          select: {
            id: true,
            descripcion: true,
            kpi: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      },
      orderBy: {
        descripcion: 'asc'
      }
    });

    res.json({
      message: 'Tipos de datos obtenidos exitosamente',
      tiposDatos,
      total: tiposDatos.length
    });

  } catch (error) {
    console.error('Error obteniendo tipos de datos:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener tipo de dato por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const tipoDatoId = parseInt(req.params.id);

    if (isNaN(tipoDatoId)) {
      return res.status(400).json({
        message: 'ID de tipo de dato inválido'
      });
    }

    const tipoDato = await prisma.tipoDatoItem.findUnique({
      where: { id: tipoDatoId },
      include: {
        items: {
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
            }
          }
        },
        itemsObservables: {
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
            }
          }
        }
      }
    });

    if (!tipoDato) {
      return res.status(404).json({
        message: 'Tipo de dato no encontrado'
      });
    }

    res.json({
      message: 'Tipo de dato obtenido exitosamente',
      tipoDato
    });

  } catch (error) {
    console.error('Error obteniendo tipo de dato:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Crear nuevo tipo de dato
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { descripcion } = req.body;

    // Validar entrada
    if (!descripcion) {
      return res.status(400).json({
        message: 'La descripción es requerida'
      });
    }

    // Crear tipo de dato
    const tipoDato = await prisma.tipoDatoItem.create({
      data: {
        descripcion
      }
    });

    res.status(201).json({
      message: 'Tipo de dato creado exitosamente',
      tipoDato
    });

  } catch (error) {
    console.error('Error creando tipo de dato:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar tipo de dato
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const tipoDatoId = parseInt(req.params.id);
    const { descripcion } = req.body;

    if (isNaN(tipoDatoId)) {
      return res.status(400).json({
        message: 'ID de tipo de dato inválido'
      });
    }

    // Validar entrada
    if (!descripcion) {
      return res.status(400).json({
        message: 'La descripción es requerida'
      });
    }

    // Verificar que el tipo de dato existe
    const existingTipoDato = await prisma.tipoDatoItem.findUnique({
      where: { id: tipoDatoId }
    });

    if (!existingTipoDato) {
      return res.status(404).json({
        message: 'Tipo de dato no encontrado'
      });
    }

    // Actualizar tipo de dato
    const tipoDato = await prisma.tipoDatoItem.update({
      where: { id: tipoDatoId },
      data: {
        descripcion
      }
    });

    res.json({
      message: 'Tipo de dato actualizado exitosamente',
      tipoDato
    });

  } catch (error) {
    console.error('Error actualizando tipo de dato:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar tipo de dato
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const tipoDatoId = parseInt(req.params.id);

    if (isNaN(tipoDatoId)) {
      return res.status(400).json({
        message: 'ID de tipo de dato inválido'
      });
    }

    // Verificar que el tipo de dato existe
    const existingTipoDato = await prisma.tipoDatoItem.findUnique({
      where: { id: tipoDatoId }
    });

    if (!existingTipoDato) {
      return res.status(404).json({
        message: 'Tipo de dato no encontrado'
      });
    }

    // Verificar si hay items asociados
    const itemsCount = await prisma.item.count({
      where: { idTipoDatoItem: tipoDatoId }
    });

    const itemsObservablesCount = await prisma.itemObservable.count({
      where: { idTipoDatoItem: tipoDatoId }
    });

    if (itemsCount > 0 || itemsObservablesCount > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar el tipo de dato porque tiene items asociados'
      });
    }

    // Eliminar tipo de dato
    await prisma.tipoDatoItem.delete({
      where: { id: tipoDatoId }
    });

    res.json({
      message: 'Tipo de dato eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando tipo de dato:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
