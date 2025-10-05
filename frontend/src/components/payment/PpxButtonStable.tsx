import { useEffect, useRef, useState } from "react";

interface PpxButtonStableProps {
  data: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const PpxButtonStable = ({ data, onSuccess, onError }: PpxButtonStableProps) => {
  const [buttonVisible, setButtonVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Estilo del botón - SIEMPRE VISIBLE
  const buttonStyle = {
    display: "block", // SIEMPRE VISIBLE
    backgroundColor: "#FAFAFA",
    right: "30px",
    bottom: "30px",
    position: "fixed" as const,
    background: "url(https://sandbox-paybox.pagoplux.com/img/pagar.png?v1) no-repeat center center",
    height: "96px",
    width: "215px",
    border: "none",
    cursor: "pointer",
    backgroundSize: "contain",
    outline: "0",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
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

  // Inicializar Plux de forma simple y estable
  const initPlux = () => {
    console.log("=== INICIALIZANDO PLUX PAYBOX (ESTABLE) ===");
    console.log("Datos:", data);
    console.log("window.Data:", !!window.Data);

    // Mostrar botón inmediatamente
    setButtonVisible(true);

    if (window.Data && window.Data.init) {
      try {
        console.log("Inicializando Plux...");
        
        // Crear datos simples sin funciones complejas
        const payboxData = {
          PayboxRemail: data.PayboxRemail,
          PayboxSendmail: data.PayboxSendmail,
          PayboxRename: data.PayboxRename,
          PayboxSendname: data.PayboxSendname,
          PayboxBase0: data.PayboxBase0,
          PayboxBase12: data.PayboxBase12,
          PayboxDescription: data.PayboxDescription,
          PayboxProduction: data.PayboxProduction,
          PayboxEnvironment: data.PayboxEnvironment,
          PayboxLanguage: data.PayboxLanguage,
          PayboxPagoPlux: data.PayboxPagoPlux,
          PayboxDirection: data.PayboxDirection,
          PayBoxClientPhone: data.PayBoxClientPhone,
          PayBoxClientName: data.PayBoxClientName,
          PayBoxClientIdentification: data.PayBoxClientIdentification,
          PayboxRecurrent: data.PayboxRecurrent,
          // Callback simple que evita DataCloneError
          onAuthorize: function(response) {
            console.log('Respuesta Paybox:', response);
            
            // Usar setTimeout para evitar DataCloneError
            setTimeout(() => {
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
            }, 100);
          }
        };

        window.Data.init(payboxData);
        setIsInitialized(true);
        console.log("✅ Plux inicializado correctamente");
        
      } catch (error) {
        console.error("❌ Error al inicializar Plux:", error);
        // El botón sigue visible aunque falle
      }
    } else {
      console.log("Plux no disponible, pero botón visible");
      // El botón sigue visible aunque Plux no esté disponible
    }
  };

  // Manejar clic en el botón
  const handleButtonClick = () => {
    console.log("Botón de pago clickeado");
    
    // Si Plux no está inicializado, intentar inicializarlo
    if (!isInitialized && window.Data && window.Data.init) {
      try {
        const payboxData = {
          PayboxRemail: data.PayboxRemail,
          PayboxSendmail: data.PayboxSendmail,
          PayboxRename: data.PayboxRename,
          PayboxSendname: data.PayboxSendname,
          PayboxBase0: data.PayboxBase0,
          PayboxBase12: data.PayboxBase12,
          PayboxDescription: data.PayboxDescription,
          PayboxProduction: data.PayboxProduction,
          PayboxEnvironment: data.PayboxEnvironment,
          PayboxLanguage: data.PayboxLanguage,
          PayboxPagoPlux: data.PayboxPagoPlux,
          PayboxDirection: data.PayboxDirection,
          PayBoxClientPhone: data.PayBoxClientPhone,
          PayBoxClientName: data.PayBoxClientName,
          PayBoxClientIdentification: data.PayBoxClientIdentification,
          PayboxRecurrent: data.PayboxRecurrent,
          onAuthorize: function(response) {
            console.log('Respuesta Paybox:', response);
            setTimeout(() => {
              if (response.status === 'succeeded' || response.status === 'succeded') {
                alert('✅ Pago exitoso!');
                localStorage.setItem('pluxPaymentResult', JSON.stringify({
                  success: true,
                  data: response,
                  timestamp: Date.now()
                }));
              } else {
                alert('❌ Pago fallido');
                localStorage.setItem('pluxPaymentResult', JSON.stringify({
                  success: false,
                  data: response,
                  timestamp: Date.now()
                }));
              }
            }, 100);
          }
        };
        
        window.Data.init(payboxData);
        setIsInitialized(true);
        console.log("Plux inicializado al hacer clic");
      } catch (error) {
        console.error("Error al inicializar Plux:", error);
      }
    }
  };

  useEffect(() => {
    console.log("Componente PpxButtonStable montado");
    
    // Mostrar botón inmediatamente
    setButtonVisible(true);
    
    // Intentar inicializar Plux después de un delay
    initTimeoutRef.current = setTimeout(() => {
      initPlux();
    }, 1000);

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
        ref={buttonRef}
        style={buttonStyle} 
        id="pay" 
        type="submit"
        title="Pagar con Plux Paybox"
        onClick={handleButtonClick}
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
        <div>Plux: {isInitialized ? '✅ Inicializado' : '⏳ Cargando...'}</div>
        <div>Monto: ${data.PayboxBase12}</div>
        <div>Proyecto: {data.PayboxDescription}</div>
      </div>
    </>
  );
};

export default PpxButtonStable;
