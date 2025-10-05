import { useEffect, useRef, useState } from "react";

interface PpxButtonGlobalProps {
  data: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const PpxButtonGlobal = ({ data, onSuccess, onError }: PpxButtonGlobalProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estilo del botón
  const buttonStyle = {
    display: buttonVisible ? "block" : "none",
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

  // Inicializar Plux con callback global
  const initPlux = () => {
    console.log("=== INICIALIZANDO PLUX PAYBOX (CALLBACK GLOBAL) ===");
    console.log("Datos:", data);
    console.log("window.Data:", !!window.Data);
    console.log("window.pluxPaymentCallback:", !!window.pluxPaymentCallback);

    if (window.Data && window.Data.init) {
      try {
        console.log("Inicializando Plux con callback global...");
        
        // Crear datos SIN onAuthorize - usar callback global
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
          // Usar callback global en lugar de función local
          onAuthorize: window.pluxPaymentCallback
        };

        window.Data.init(payboxData);
        setIsInitialized(true);
        console.log("✅ Plux inicializado correctamente con callback global");
        
        // Mostrar el botón después de 1 segundo
        setTimeout(() => {
          setButtonVisible(true);
          console.log("✅ Botón Paybox mostrado automáticamente");
        }, 1000);
        
      } catch (error) {
        console.error("❌ Error al inicializar Plux:", error);
        // Mostrar botón de todas formas
        setButtonVisible(true);
      }
    } else {
      console.error("❌ Plux Paybox no está disponible");
      // Mostrar botón de todas formas
      setButtonVisible(true);
    }
  };

  useEffect(() => {
    console.log("Componente PpxButtonGlobal montado");
    
    // Esperar un poco para que los scripts se carguen
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
        <div>Plux: {isInitialized ? '✅ Inicializado' : '⏳ Cargando...'}</div>
        <div>Botón: {buttonVisible ? '✅ Visible' : '❌ Oculto'}</div>
        <div>Callback: {window.pluxPaymentCallback ? '✅ Global' : '❌ No'}</div>
        <div>Monto: ${data.PayboxBase12}</div>
        <div>Proyecto: {data.PayboxDescription}</div>
      </div>
    </>
  );
};

export default PpxButtonGlobal;
