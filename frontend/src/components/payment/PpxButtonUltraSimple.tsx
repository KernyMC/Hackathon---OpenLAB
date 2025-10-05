import { useEffect, useRef, useState } from "react";

interface PpxButtonUltraSimpleProps {
  data: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const PpxButtonUltraSimple = ({ data, onSuccess, onError }: PpxButtonUltraSimpleProps) => {
  const [buttonVisible, setButtonVisible] = useState(true); // SIEMPRE VISIBLE
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Estilo del botón - ULTRA SIMPLE
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

  // Manejar clic en el botón - INICIALIZAR PLUX AL HACER CLIC
  const handleButtonClick = () => {
    console.log("Botón de pago clickeado - Inicializando Plux...");
    
    if (window.Data && window.Data.init) {
      try {
        // Crear datos simples
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
          // Callback ultra simple
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
        console.log("✅ Plux inicializado al hacer clic");
        
      } catch (error) {
        console.error("❌ Error al inicializar Plux:", error);
        alert("Error al inicializar el sistema de pagos. Inténtalo de nuevo.");
      }
    } else {
      console.error("❌ Plux no está disponible");
      alert("Sistema de pagos no disponible. Inténtalo más tarde.");
    }
  };

  useEffect(() => {
    console.log("Componente PpxButtonUltraSimple montado");
    
    // Mostrar botón inmediatamente
    setButtonVisible(true);
    
    // Polling para resultados
    intervalRef.current = setInterval(checkResults, 2000);

    return () => {
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
        <div>Botón: ✅ SIEMPRE VISIBLE</div>
        <div>Plux: {window.Data ? '✅ Disponible' : '❌ No disponible'}</div>
        <div>Monto: ${data.PayboxBase12}</div>
        <div>Proyecto: {data.PayboxDescription}</div>
      </div>
    </>
  );
};

export default PpxButtonUltraSimple;
