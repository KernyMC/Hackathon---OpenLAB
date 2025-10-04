const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

// Mock de usuarios (en producción usarías una base de datos)
const users = [
  {
    id: 1,
    email: 'admin@hackathon.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Admin Hackathon'
  }
];

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validaciones básicas
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Email, contraseña y nombre son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'El usuario ya existe' 
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name
    };

    users.push(newUser);

    // Generar JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
});

// Verificar token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      message: 'Token no proporcionado' 
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      message: 'Token válido',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    res.status(401).json({ 
      message: 'Token inválido' 
    });
  }
});

module.exports = router;
