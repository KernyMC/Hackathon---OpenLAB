// Configuración simplificada para Plux Paybox (sin callbacks complejos)
// Este archivo evita el DataCloneError usando una configuración más simple

let data = {
  /* Requerido. Email de la cuenta PagoPlux del Establecimiento */
  PayboxRemail: "correoplux@gmail.com",
  
  /* Requerido. Email del usuario que realiza el pago */
  PayboxSendmail: "donante@ejemplo.com",
  
  /* Requerido. Nombre del establecimiento en PagoPlux */
  PayboxRename: "Fundación Favorita",
  
  /* Requerido. Nombre del usuario que realiza el pago */
  PayboxSendname: "Donante",
  
  /* Requerido. Monto total de productos o servicios que no aplican impuestos */
  PayboxBase0: "0.00",
  
  /* Requerido. Monto total de productos o servicios que aplican impuestos */
  PayboxBase12: "10.00",
  
  /* Requerido. Descripción del pago */
  PayboxDescription: "Donación a proyecto social",
  
  /* Requerido. Tipo de Ejecución */
  PayboxProduction: false, // false = Modo Prueba
  
  /* Requerido. Ambiente de ejecución */
  PayboxEnvironment: "sandbox", // sandbox = Modo Prueba
  
  /* Requerido. Lenguaje del Paybox */
  PayboxLanguage: "es",
  
  /* Requerido. Identifica el tipo de iframe de pagoplux */
  PayboxPagoPlux: true,
  
  /* Requerido. Dirección del tarjetahabiente */
  PayboxDirection: "Quito, Ecuador",
  
  /* Requerido. Teléfono del tarjetahabiente */
  PayBoxClientPhone: "0999999999",
  
  /* Requerido. Identificación del tarjetahabiente */
  PayBoxClientIdentification: "1234567890",
  
  /* Requerido. Solo para pagos recurrentes */
  PayboxRecurrent: false,
  
  /* Callback simple que evita DataCloneError */
  onAuthorize: function(response) {
    console.log("Respuesta del pago:", response);
    
    if (response.status === "succeeded") {
      console.log("Pago exitoso:", response);
      alert("¡Donación procesada con éxito!");
      
      // Guardar respuesta en localStorage para que React pueda leerla
      localStorage.setItem('pluxPaymentResponse', JSON.stringify({
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      }));
      
    } else {
      console.log("Pago fallido:", response);
      alert("El pago no pudo ser procesado. Inténtalo de nuevo.");
      
      // Guardar error en localStorage
      localStorage.setItem('pluxPaymentResponse', JSON.stringify({
        success: false,
        error: response,
        timestamp: new Date().toISOString()
      }));
    }
  }
};

export { data };
