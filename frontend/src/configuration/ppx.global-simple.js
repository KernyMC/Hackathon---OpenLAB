// Configuración con callback global simple - Evita DataCloneError
let data = {
  PayboxRemail: "correoplux@gmail.com",
  PayboxSendmail: "usuario@ejemplo.com",
  PayboxRename: "Fundación Favorita",
  PayboxSendname: "Donante",
  PayboxBase0: "0",
  PayboxBase12: "10.00",
  PayboxDescription: "Donación a proyecto social",
  PayboxProduction: false,
  PayboxEnvironment: "sandbox",
  PayboxLanguage: "es",
  PayboxPagoPlux: true,
  PayboxDirection: "Quito, Ecuador",
  PayBoxClientPhone: "0999999999",
  PayBoxClientName: "Donante",
  PayBoxClientIdentification: "1234567890",
  PayboxRecurrent: false,
  // Usar callback global simple
  onAuthorize: window.pluxGlobalCallback || function(response) {
    console.log('Respuesta Paybox:', response);
    // Solo logging - sin funciones complejas
  }
};

// Callback global simple
window.pluxGlobalCallback = function(response) {
  console.log('Respuesta Paybox:', response);
  
  if (response.status === 'succeeded' || response.status === 'succeded') {
    console.log('✅ Pago exitoso!');
    alert('✅ Pago exitoso!');
    
    localStorage.setItem('pluxPaymentResult', JSON.stringify({
      success: true,
      data: response,
      timestamp: Date.now()
    }));
    
  } else {
    console.log('❌ Pago fallido');
    alert('❌ Pago fallido');
    
    localStorage.setItem('pluxPaymentResult', JSON.stringify({
      success: false,
      data: response,
      timestamp: Date.now()
    }));
  }
};

export { data };
