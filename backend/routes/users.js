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

// Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: 'Perfil obtenido exitosamente',
      user: req.user
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar perfil del usuario
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { nombres, apellidos, email, cedula } = req.body;
    const userId = req.user.id;

    // Validar entrada
    if (!nombres || !apellidos || !email || !cedula) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el email ya existe en otro usuario
    if (email !== req.user.email) {
      const existingUser = await prisma.usuario.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'El email ya está en uso'
        });
      }
    }

    // Verificar si la cédula ya existe en otro usuario
    if (cedula !== req.user.cedula) {
      const existingCedula = await prisma.usuario.findFirst({
        where: { cedula }
      });

      if (existingCedula) {
        return res.status(400).json({
          message: 'La cédula ya está en uso'
        });
      }
    }

    // Actualizar usuario
    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: {
        nombres,
        apellidos,
        email,
        cedula
      },
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

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener lista de usuarios (solo admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Verificar si es admin (asumiendo que el tipo de usuario 1 es admin)
    if (req.user.idTipoUsuario !== 1) {
      return res.status(403).json({
        message: 'Acceso denegado. Se requieren permisos de administrador'
      });
    }

    const users = await prisma.usuario.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      message: 'Usuarios obtenidos exitosamente',
      users,
      total: users.length
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener usuario por ID (solo admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Verificar si es admin (asumiendo que el tipo de usuario 1 es admin)
    if (req.user.idTipoUsuario !== 1) {
      return res.status(403).json({
        message: 'Acceso denegado. Se requieren permisos de administrador'
      });
    }

    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: 'ID de usuario inválido'
      });
    }

    const user = await prisma.usuario.findUnique({
      where: { id: userId },
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
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Usuario obtenido exitosamente',
      user
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;