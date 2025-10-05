// Configuración ultra simple para Plux Paybox - Sin callbacks complejos
let data = {
  PayboxRemail: "correoplux@gmail.com",
  PayboxSendmail: "donante@ejemplo.com",
  PayboxRename: "Fundación Favorita",
  PayboxSendname: "Donante",
  PayboxBase0: "0.00",
  PayboxBase12: "10.00",
  PayboxDescription: "Donación a proyecto social",
  PayboxProduction: false,
  PayboxEnvironment: "sandbox",
  PayboxLanguage: "es",
  PayboxPagoPlux: true,
  PayboxDirection: "Quito, Ecuador",
  PayBoxClientPhone: "0999999999",
  PayBoxClientIdentification: "1234567890",
  PayboxRecurrent: false,
  // Callback ultra simple
  onAuthorize: function(response) {
    const result = {
      success: response.status === "succeeded",
      data: response,
      timestamp: Date.now()
    };
    localStorage.setItem('pluxPaymentResult', JSON.stringify(result));
    alert(result.success ? "¡Pago exitoso!" : "Pago fallido");
  }
};

export { data };
