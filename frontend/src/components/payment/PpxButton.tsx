import { useEffect, useRef } from "react";
import { iniciarDatos } from "../../configuration/ppx.index";

interface PpxButtonProps {
  data: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const PpxButton = ({ data, onSuccess, onError }: PpxButtonProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Estilo del botón según la documentación oficial
  const estiloBoton = {
    display: "none",
    backgroundColor: "#FAFAFA",
    right: "80px",
    backgroundImage: "url(https://sandbox-paybox.pagoplux.com/img/pagar.png?v1)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "96px",
    width: "215px",
    border: "none",
    cursor: "pointer",
    backgroundSize: "contain",
    outline: "0",
    boxShadow: "0px 2px 2px lightgray",
    position: "fixed" as const,
    bottom: "30px",
    zIndex: 1000,
  };

  // Función para verificar respuestas de pago
  const checkPaymentResult = () => {
    const result = localStorage.getItem('pluxPaymentResult');
    if (result) {
      try {
        const parsedResult = JSON.parse(result);
        const now = Date.now();
        const resultTime = parsedResult.timestamp;
        
        // Solo procesar resultados de los últimos 30 segundos
        if (now - resultTime < 30000) {
          if (parsedResult.success && onSuccess) {
            onSuccess(parsedResult.data);
          } else if (!parsedResult.success && onError) {
            onError(parsedResult.error);
          }
          
          // Limpiar el resultado procesado
          localStorage.removeItem('pluxPaymentResult');
        }
      } catch (error) {
        console.error('Error procesando resultado de pago:', error);
        localStorage.removeItem('pluxPaymentResult');
      }
    }
  };

  useEffect(() => {
    console.log("=== INICIALIZANDO PLUX PAYBOX ===");
    console.log("Datos recibidos:", data);
    console.log("window.Data disponible:", !!window.Data);
    console.log("window.jQuery disponible:", !!window.jQuery);
    
    // Esperar a que los scripts estén cargados
    const checkAndInit = () => {
      if (window.Data && window.Data.init) {
        console.log("Scripts cargados, inicializando...");
        iniciarDatos(data);
        
        // Mostrar el botón después de inicializar
        setTimeout(() => {
          const button = document.getElementById("pay");
          if (button) {
            button.style.display = "block";
            console.log("✅ Botón Plux Paybox mostrado correctamente");
          } else {
            console.error("❌ No se encontró el botón con id 'pay'");
          }
        }, 500);
      } else {
        console.log("Scripts no cargados aún, reintentando en 500ms...");
        setTimeout(checkAndInit, 500);
      }
    };

    checkAndInit();

    // Iniciar polling para verificar resultados de pago
    intervalRef.current = setInterval(checkPaymentResult, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data, onSuccess, onError]);

  return (
    <>
      <div id="modalPaybox"></div>
      <button style={estiloBoton} id="pay" type="submit"></button>
    </>
  );
};

export default PpxButton;