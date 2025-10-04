const validator = require('validator');

class InputValidator {
  // Validar email
  static validateEmail(email) {
    if (!email) {
      return { isValid: false, error: 'Email es requerido' };
    }
    
    if (!validator.isEmail(email)) {
      return { isValid: false, error: 'Formato de email inválido' };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: 'Email demasiado largo' };
    }
    
    // Normalizar email
    const normalizedEmail = validator.normalizeEmail(email);
    if (!normalizedEmail) {
      return { isValid: false, error: 'Email inválido' };
    }
    
    return { isValid: true, value: normalizedEmail };
  }
  
  // Validar nombre
  static validateName(name) {
    if (!name) {
      return { isValid: false, error: 'Nombre es requerido' };
    }
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      return { isValid: false, error: 'Nombre debe tener al menos 2 caracteres' };
    }
    
    if (trimmedName.length > 50) {
      return { isValid: false, error: 'Nombre demasiado largo' };
    }
    
    // Solo letras, números, espacios y algunos caracteres especiales
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-'\.]+$/.test(trimmedName)) {
      return { isValid: false, error: 'Nombre contiene caracteres inválidos' };
    }
    
    // Escapar caracteres especiales
    const escapedName = validator.escape(trimmedName);
    
    return { isValid: true, value: escapedName };
  }
  
  // Validar contraseña
  static validatePassword(password) {
    if (!password) {
      return { isValid: false, error: 'Contraseña es requerida' };
    }
    
    if (password.length < 8) {
      return { isValid: false, error: 'Contraseña debe tener al menos 8 caracteres' };
    }
    
    if (password.length > 128) {
      return { isValid: false, error: 'Contraseña demasiado larga' };
    }
    
    return { isValid: true, value: password };
  }
  
  // Sanitizar entrada general
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }
    
    // Remover caracteres de control
    let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');
    
    // Escapar HTML
    sanitized = validator.escape(sanitized);
    
    // Normalizar espacios
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    
    return sanitized;
  }
  
  // Validar JWT token
  static validateToken(token) {
    if (!token) {
      return { isValid: false, error: 'Token es requerido' };
    }
    
    if (!validator.isJWT(token)) {
      return { isValid: false, error: 'Formato de token inválido' };
    }
    
    return { isValid: true, value: token };
  }
  
  // Validar ID numérico
  static validateId(id) {
    if (!id) {
      return { isValid: false, error: 'ID es requerido' };
    }
    
    const numId = parseInt(id);
    
    if (isNaN(numId) || numId <= 0) {
      return { isValid: false, error: 'ID inválido' };
    }
    
    return { isValid: true, value: numId };
  }
  
  // Validar URL
  static validateUrl(url) {
    if (!url) {
      return { isValid: false, error: 'URL es requerida' };
    }
    
    if (!validator.isURL(url, { protocols: ['http', 'https'] })) {
      return { isValid: false, error: 'URL inválida' };
    }
    
    return { isValid: true, value: url };
  }
  
  // Validar entrada completa de usuario
  static validateUserInput({ email, password, name }) {
    const errors = [];
    const validatedData = {};
    
    // Validar email
    const emailValidation = this.validateEmail(email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error);
    } else {
      validatedData.email = emailValidation.value;
    }
    
    // Validar contraseña
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.error);
    } else {
      validatedData.password = passwordValidation.value;
    }
    
    // Validar nombre
    const nameValidation = this.validateName(name);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error);
    } else {
      validatedData.name = nameValidation.value;
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      data: validatedData
    };
  }
}

module.exports = InputValidator;
