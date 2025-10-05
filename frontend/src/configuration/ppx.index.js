// Funciones para el manejo de Plux Paybox según documentación oficial

const iniciarDatos = (dataPago) => {
  console.log("Intentando inicializar Plux Paybox...");
  console.log("window.Data disponible:", !!window.Data);
  console.log("Datos a enviar:", dataPago);
  
  if (window.Data && window.Data.init) {
    try {
      window.Data.init(dataPago);
      console.log("Plux Paybox inicializado correctamente");
    } catch (error) {
      console.error("Error al inicializar Plux Paybox:", error);
    }
  } else {
    console.error("Plux Paybox no está disponible. Verifica que los scripts estén cargados correctamente.");
    console.log("Scripts disponibles:", {
      jQuery: !!window.jQuery,
      Data: !!window.Data,
      iniciarDatos: !!window.iniciarDatos
    });
  }
};

const reload = (data) => {
  if (window.Data && window.Data.reload) {
    try {
      window.Data.reload(data);
      console.log("Plux Paybox recargado correctamente");
    } catch (error) {
      console.error("Error al recargar Plux Paybox:", error);
    }
  } else {
    console.error("Plux Paybox no está disponible para recargar.");
  }
};

export { iniciarDatos, reload };