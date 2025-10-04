const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Mock de datos de usuarios
const userProfiles = [
  {
    id: 1,
    name: 'Admin Hackathon',
    email: 'admin@hackathon.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

// Obtener perfil del usuario actual
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = userProfiles.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      message: 'Perfil obtenido exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
});

// Actualizar perfil del usuario
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name } = req.body;
    const userIndex = userProfiles.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    // Actualizar datos
    if (name) {
      userProfiles[userIndex].name = name;
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: userProfiles[userIndex].id,
        name: userProfiles[userIndex].name,
        email: userProfiles[userIndex].email,
        role: userProfiles[userIndex].role,
        createdAt: userProfiles[userIndex].createdAt,
        lastLogin: userProfiles[userIndex].lastLogin
      }
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
});

// Obtener lista de usuarios (solo admin)
router.get('/', authenticateToken, (req, res) => {
  try {
    const user = userProfiles.find(u => u.id === req.user.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Acceso denegado' 
      });
    }

    res.json({
      message: 'Usuarios obtenidos exitosamente',
      users: userProfiles.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin
      }))
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
});

module.exports = router;
