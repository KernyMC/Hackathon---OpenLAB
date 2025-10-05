// Configuración que funciona - Basada en el ejemplo sin errores
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
  // Función onAuthorize ULTRA SIMPLE - Sin referencias complejas
  onAuthorize: function(response) {
    console.log('Respuesta Paybox:', response);
    
    if (response.status === 'succeeded' || response.status === 'succeded') {
      console.log('✅ Pago exitoso! ID:', response.id_transaccion || 'N/A');
      alert('✅ Pago exitoso! ID: ' + (response.id_transaccion || 'N/A'));
      
      // Guardar resultado simple en localStorage
      localStorage.setItem('pluxPaymentResult', JSON.stringify({
        success: true,
        data: {
          status: response.status,
          id_transaccion: response.id_transaccion,
          amount: response.amount
        },
        timestamp: Date.now()
      }));
      
    } else if (response.status === 'failed') {
      console.log('❌ Pago fallido:', response.message || 'Error');
      alert('❌ Pago fallido: ' + (response.message || 'Error'));
      
      // Guardar error simple en localStorage
      localStorage.setItem('pluxPaymentResult', JSON.stringify({
        success: false,
        data: {
          status: response.status,
          message: response.message
        },
        timestamp: Date.now()
      }));
      
    } else {
      console.log('ℹ️ Estado:', response.status);
      alert('ℹ️ Estado: ' + response.status);
    }
  }
};

export { data };
