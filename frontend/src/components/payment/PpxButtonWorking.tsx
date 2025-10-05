import { useEffect, useRef, useState } from "react";

interface PpxButtonWorkingProps {
  data: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const PpxButtonWorking = ({ data, onSuccess, onError }: PpxButtonWorkingProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estilo del botón - EXACTAMENTE como en el ejemplo que funciona
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

  // Inicializar Plux - BASADO EN EL EJEMPLO QUE FUNCIONA
  const initPlux = () => {
    console.log("=== INICIALIZANDO PLUX PAYBOX (VERSIÓN QUE FUNCIONA) ===");
    console.log("Datos:", data);
    console.log("window.Data:", !!window.Data);
    console.log("window.jQuery:", !!window.jQuery);

    if (window.Data && window.Data.init) {
      try {
        console.log("Inicializando Plux con window.Data.init...");
        
        // Usar EXACTAMENTE la misma estructura que en el ejemplo
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
            
            if (response.status === 'succeeded' || response.status === 'succeded') {
              console.log('✅ Pago exitoso! ID:', response.id_transaccion || 'N/A');
              alert('✅ Pago exitoso! ID: ' + (response.id_transaccion || 'N/A'));
              
              localStorage.setItem('pluxPaymentResult', JSON.stringify({
                success: true,
                data: {
                  status: response.status,
                  id_transaccion: response.id_transaccion,
                  amount: response.amount
                },
                timestamp: Date.now()
              }));
              
            } else if (response.status === 'failed') {
              console.log('❌ Pago fallido:', response.message || 'Error');
              alert('❌ Pago fallido: ' + (response.message || 'Error'));
              
              localStorage.setItem('pluxPaymentResult', JSON.stringify({
                success: false,
                data: {
                  status: response.status,
                  message: response.message
                },
                timestamp: Date.now()
              }));
              
            } else {
              console.log('ℹ️ Estado:', response.status);
              alert('ℹ️ Estado: ' + response.status);
            }
          }
        };

        window.Data.init(payboxData);
        setIsInitialized(true);
        console.log("✅ Plux inicializado correctamente");
        
        // Mostrar el botón después de 1 segundo (como en el ejemplo)
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
    console.log("Componente PpxButtonWorking montado");
    
    // Esperar un poco para que los scripts se carguen (como en el ejemplo)
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
        <div>Monto: ${data.PayboxBase12}</div>
        <div>Proyecto: {data.PayboxDescription}</div>
      </div>
    </>
  );
};

export default PpxButtonWorking;
