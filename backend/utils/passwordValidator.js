const bcrypt = require('bcryptjs');

// Validación robusta de contraseñas
class PasswordValidator {
  static validate(password) {
    const errors = [];
    
    // Longitud mínima
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    // Longitud máxima
    if (password.length > 128) {
      errors.push('La contraseña no puede tener más de 128 caracteres');
    }
    
    // Al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    
    // Al menos una minúscula
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    
    // Al menos un número
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    
    // Al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }
    
    // No espacios
    if (/\s/.test(password)) {
      errors.push('La contraseña no puede contener espacios');
    }
    
    // Contraseñas comunes (lista básica)
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Esta contraseña es muy común, elige una más segura');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static async hash(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }
  
  static async compare(password, hash) {
    return await bcrypt.compare(password, hash);
  }
  
  static getStrength(password) {
    let score = 0;
    
    // Longitud
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Complejidad
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    
    // Determinar nivel
    if (score <= 3) return 'Débil';
    if (score <= 5) return 'Media';
    if (score <= 7) return 'Fuerte';
    return 'Muy Fuerte';
  }
}

module.exports = PasswordValidator;
