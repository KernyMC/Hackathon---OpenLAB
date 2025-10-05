import { useEffect, useRef, useState } from "react";

interface PpxButtonMinimalProps {
  data: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const PpxButtonMinimal = ({ data, onSuccess, onError }: PpxButtonMinimalProps) => {
  const [isReady, setIsReady] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initAttempts = useRef(0);

  // Estilo del botón
  const buttonStyle = {
    display: isReady ? "block" : "none",
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
        if (parsed.success && onSuccess) {
          onSuccess(parsed.data);
        } else if (!parsed.success && onError) {
          onError(parsed.data);
        }
        localStorage.removeItem('pluxPaymentResult');
      } catch (e) {
        localStorage.removeItem('pluxPaymentResult');
      }
    }
  };

  // Inicializar Plux
  const initPlux = () => {
    initAttempts.current++;
    console.log(`Intento ${initAttempts.current} de inicializar Plux...`);

    if (window.Data && window.Data.init) {
      try {
        // Crear datos sin callback complejo
        const simpleData = {
          ...data,
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

        window.Data.init(simpleData);
        setIsReady(true);
        console.log("✅ Plux inicializado correctamente");
        
      } catch (error) {
        console.error("❌ Error:", error);
        if (initAttempts.current < 5) {
          setTimeout(initPlux, 2000);
        }
      }
    } else {
      console.log("Plux no disponible, reintentando...");
      if (initAttempts.current < 10) {
        setTimeout(initPlux, 1000);
      }
    }
  };

  useEffect(() => {
    // Esperar un poco antes de inicializar
    const timer = setTimeout(initPlux, 3000);
    
    // Polling para resultados
    intervalRef.current = setInterval(checkResults, 2000);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data, onSuccess, onError]);

  return (
    <>
      <div id="modalPaybox"></div>
      <button style={buttonStyle} id="pay" type="submit"></button>
      
      {/* Debug */}
      {process.env.NODE_ENV === 'development' && (
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
          <div>Plux: {isReady ? '✅' : '⏳'}</div>
          <div>Monto: ${data.PayboxBase12}</div>
        </div>
      )}
    </>
  );
};

export default PpxButtonMinimal;
