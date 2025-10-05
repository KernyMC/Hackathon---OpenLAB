// Configuración de Plux Paybox para diferentes entornos

export interface PluxConfig {
  environment: 'sandbox' | 'production';
  commerceEmail: string;
  commerceId: string;
  clientId: string;
  production: boolean;
}

// Configuración para Sandbox (Desarrollo/Pruebas)
export const sandboxConfig: PluxConfig = {
  environment: 'sandbox',
  commerceEmail: 'correoplux@gmail.com',
  commerceId: '921',
  clientId: 'uj8Yic1a8MbQTdZ0W1yXk524QP',
  production: false
};

// Configuración para Producción
export const productionConfig: PluxConfig = {
  environment: 'production',
  commerceEmail: 'tu-email-produccion@tudominio.com', // Cambiar por tu email de producción
  commerceId: 'TU_COMERCIO_ID', // Cambiar por tu ID de comercio de producción
  clientId: 'TU_CLIENT_ID', // Cambiar por tu Client ID de producción
  production: true
};

// Función para obtener la configuración según el entorno
export const getPluxConfig = (): PluxConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? productionConfig : sandboxConfig;
};

// URLs de los scripts de Plux
export const PLUX_SCRIPTS = {
  jquery: 'https://code.jquery.com/jquery-3.4.1.min.js',
  sandbox: 'https://sandbox-paybox.pagoplux.com/paybox/index_angular.js',
  production: 'https://paybox.pagoplux.com/paybox/index_angular.js'
};

// Tarjetas de prueba para Sandbox
export const TEST_CARDS = {
  visa: {
    number: '4540639936908783',
    cvv: '123',
    name: 'VISA'
  },
  mastercard: {
    number: '5230428590692129',
    cvv: '123',
    name: 'MASTERCARD'
  },
  diners: {
    number: '36417200103608',
    cvv: '123',
    otp: '123456',
    name: 'DINERS'
  }
};
