import { useEffect, useRef, useState } from "react";

interface PpxButtonSimpleProps {
  data: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const PpxButtonSimple = ({ data, onSuccess, onError }: PpxButtonSimpleProps) => {
  const [buttonVisible, setButtonVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estilo del botón - SIEMPRE VISIBLE
  const buttonStyle = {
    display: "block", // SIEMPRE VISIBLE
    backgroundColor: "#FAFAFA",
    right: "80px",
    bottom: "30px",
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
    zIndex: 1000,
  };

  // Verificar resultados de pago
  const checkResults = () => {
    const result = localStorage.getItem('pluxPaymentResult');
    if (result) {
      try {
        const parsed = JSON.parse(result);
        console.log("Resultado de pago encontrado:", parsed);
        
        if (parsed.success && onSuccess) {
          onSuccess(parsed.data);
        } else if (!parsed.success && onError) {
          onError(parsed.data);
        }
        localStorage.removeItem('pluxPaymentResult');
      } catch (e) {
        console.error("Error procesando resultado:", e);
        localStorage.removeItem('pluxPaymentResult');
      }
    }
  };

  // Inicializar Plux de forma simple
  const initPlux = () => {
    console.log("=== INICIALIZANDO PLUX PAYBOX SIMPLE ===");
    console.log("Datos:", data);
    console.log("window.Data:", !!window.Data);
    console.log("window.jQuery:", !!window.jQuery);

    if (window.Data && window.Data.init) {
      try {
        console.log("Inicializando Plux...");
        window.Data.init(data);
        console.log("✅ Plux inicializado correctamente");
        setButtonVisible(true);
      } catch (error) {
        console.error("❌ Error al inicializar Plux:", error);
        // Mostrar botón de todas formas
        setButtonVisible(true);
      }
    } else {
      console.log("Plux no disponible, pero mostrando botón de todas formas");
      setButtonVisible(true);
    }
  };

  useEffect(() => {
    console.log("Componente PpxButtonSimple montado");
    
    // Mostrar botón inmediatamente
    setButtonVisible(true);
    
    // Intentar inicializar Plux después de un delay
    initTimeoutRef.current = setTimeout(() => {
      initPlux();
    }, 2000);

    // Polling para resultados
    intervalRef.current = setInterval(checkResults, 2000);

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
        style={buttonStyle} 
        id="pay" 
        type="submit"
        title="Pagar con Plux Paybox"
        onClick={() => {
          console.log("Botón de pago clickeado");
          // Intentar inicializar Plux si no se ha hecho
          if (window.Data && window.Data.init) {
            try {
              window.Data.init(data);
              console.log("Plux inicializado al hacer clic");
            } catch (error) {
              console.error("Error al inicializar Plux:", error);
            }
          }
        }}
      ></button>
      
      {/* Debug info */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '11px',
        zIndex: 9999
      }}>
        <div>Botón: {buttonVisible ? '✅ Visible' : '❌ Oculto'}</div>
        <div>Plux: {window.Data ? '✅' : '❌'}</div>
        <div>Monto: ${data.PayboxBase12}</div>
        <div>Proyecto: {data.PayboxDescription}</div>
      </div>
    </>
  );
};

export default PpxButtonSimple;