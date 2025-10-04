const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const prisma = require('../lib/prisma');
const InputValidator = require('../utils/inputValidator');
const PasswordValidator = require('../utils/passwordValidator');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { nombres, apellidos, email, password, cedula, idTipoUsuario } = req.body;

    // Validar entrada básica
    if (!nombres || !apellidos || !email || !password || !cedula || !idTipoUsuario) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos',
        errors: ['nombres', 'apellidos', 'email', 'password', 'cedula', 'idTipoUsuario']
      });
    }

    // Validar email
    const emailValidation = InputValidator.validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        message: 'Email inválido',
        errors: [emailValidation.error]
      });
    }

    // Validar contraseña
    const passwordValidation = PasswordValidator.validate(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: 'Contraseña inválida',
        errors: passwordValidation.errors
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: emailValidation.value }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'El usuario ya existe con este email'
      });
    }

    // Verificar si la cédula ya existe
    const existingCedula = await prisma.usuario.findFirst({
      where: { cedula }
    });

    if (existingCedula) {
      return res.status(400).json({
        message: 'Ya existe un usuario con esta cédula'
      });
    }

    // Verificar que el tipo de usuario existe
    const tipoUsuario = await prisma.tipoUsuario.findUnique({
      where: { id: parseInt(idTipoUsuario) }
    });

    if (!tipoUsuario) {
      return res.status(400).json({
        message: 'Tipo de usuario no válido'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await PasswordValidator.hash(password);

    // Crear usuario
    const user = await prisma.usuario.create({
      data: {
        nombres,
        apellidos,
        email: emailValidation.value,
        password: hashedPassword,
        cedula,
        idTipoUsuario: parseInt(idTipoUsuario)
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        email: true,
        cedula: true,
        idTipoUsuario: true,
        createdAt: true,
        tipoUsuario: {
          select: {
            id: true,
            descripcion: true
          }
        }
      }
    });

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user
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

    // Validar entrada
    const emailValidation = InputValidator.validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        message: emailValidation.error
      });
    }

    // Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { email: emailValidation.value },
      include: {
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
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await PasswordValidator.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    await prisma.usuario.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // Crear sesión
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      }
    });

    // Respuesta sin contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token requerido'
      });
    }

    // Verificar JWT
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

    // Verificar sesión activa
    const session = await prisma.session.findFirst({
      where: {
        token,
        userId: user.id,
        expiresAt: { gt: new Date() }
      }
    });

    if (!session) {
      return res.status(401).json({
        message: 'Sesión expirada'
      });
    }

    res.json({
      message: 'Token válido',
      user
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({
      message: 'Token inválido'
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      // Eliminar sesión
      await prisma.session.deleteMany({
        where: { token }
      });
    }

    res.json({
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;