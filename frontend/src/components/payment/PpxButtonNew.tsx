import { useEffect, useRef, useState } from "react";

interface PpxButtonNewProps {
  data: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const PpxButtonNew = ({ data, onSuccess, onError }: PpxButtonNewProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estilo del botón según la documentación oficial
  const estiloBoton = {
    display: buttonVisible ? "block" : "none",
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
        
        // Solo procesar resultados de los últimos 60 segundos
        if (now - resultTime < 60000) {
          console.log("Resultado de pago encontrado:", parsedResult);
          
          if (parsedResult.success && onSuccess) {
            onSuccess(parsedResult.data);
          } else if (!parsedResult.success && onError) {
            onError(parsedResult.data);
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

  // Función para inicializar Plux de forma segura
  const initializePlux = () => {
    console.log("=== INICIALIZANDO PLUX PAYBOX (VERSIÓN SIMPLE) ===");
    console.log("Datos:", data);
    console.log("window.Data:", !!window.Data);
    console.log("window.jQuery:", !!window.jQuery);

    if (window.Data && window.Data.init) {
      try {
        // Usar los datos directamente sin modificar el callback
        window.Data.init(data);
        setIsInitialized(true);
        console.log("✅ Plux Paybox inicializado correctamente");
        
        // Mostrar el botón después de un breve delay
        setTimeout(() => {
          setButtonVisible(true);
          console.log("✅ Botón Plux Paybox mostrado");
        }, 1000);
        
      } catch (error) {
        console.error("❌ Error al inicializar Plux Paybox:", error);
      }
    } else {
      console.error("❌ Plux Paybox no está disponible");
    }
  };

  useEffect(() => {
    // Limpiar timeouts anteriores
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    // Esperar un poco para que los scripts se carguen completamente
    initTimeoutRef.current = setTimeout(() => {
      initializePlux();
    }, 2000);

    // Iniciar polling para verificar resultados de pago
    intervalRef.current = setInterval(checkPaymentResult, 3000);

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data, onSuccess, onError]);

  return (
    <>
      <div id="modalPaybox"></div>
      <button 
        style={estiloBoton} 
        id="pay" 
        type="submit"
        title="Pagar con Plux Paybox"
      ></button>
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          <div>Plux Status: {isInitialized ? '✅ Inicializado' : '⏳ Cargando...'}</div>
          <div>Botón: {buttonVisible ? '✅ Visible' : '❌ Oculto'}</div>
          <div>Monto: ${data.PayboxBase12}</div>
        </div>
      )}
    </>
  );
};

export default PpxButtonNew;
