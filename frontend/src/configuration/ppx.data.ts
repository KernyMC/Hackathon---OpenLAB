// Configuración de datos para Plux Paybox (TypeScript)
// Este archivo contiene la variable data con los valores requeridos

export interface PluxPaymentData {
  PayboxRemail: string;
  PayboxSendmail: string;
  PayboxRename: string;
  PayboxSendname: string;
  PayboxBase0: string;
  PayboxBase12: string;
  PayboxDescription: string;
  PayboxProduction: boolean;
  PayboxEnvironment: string;
  PayboxLanguage: string;
  PayboxPagoPlux: boolean;
  PayboxDirection: string;
  PayBoxClientPhone: string;
  PayBoxClientIdentification: string;
  PayboxRecurrent: boolean;
  onAuthorize: (response: any) => void;
}

let data: PluxPaymentData = {
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
  
  /* Callback que se ejecuta cuando el pago es exitoso */
  onAuthorize: (response: any) => {
    console.log("Respuesta del pago:", response);
    
    if (response.status === "succeeded") {
      console.log("Pago exitoso:", response);
      alert("¡Donación procesada con éxito!");
      
      // Aquí puedes agregar lógica adicional después del pago exitoso
      // Por ejemplo, enviar datos al backend, mostrar confirmación, etc.
      
      // Información disponible en response:
      // response.amount - monto
      // response.id_transaccion - ID de transacción
      // response.cardIssuer - marca de tarjeta (Visa, Mastercard, etc.)
      // response.cardType - tipo de tarjeta (Crédito, Débito)
      // response.clientName - nombre del tarjetahabiente
      // response.fecha - fecha de pago
      // response.token - voucher del pago
      // response.tipoPago - tipo de pago usado
    } else {
      console.log("Pago fallido:", response);
      alert("El pago no pudo ser procesado. Inténtalo de nuevo.");
    }
  }
};

export { data };
