import { useState } from "react";
import PpxButtonSimple from "./PpxButtonSimple";
import { data as pluxData } from "../../configuration/ppx.simple";

// Componente de prueba para Plux Paybox
const PluxTest = () => {
  const [amount, setAmount] = useState(10);
  const [description, setDescription] = useState("Prueba de pago");
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handleSuccess = (response: any) => {
    console.log("Pago exitoso:", response);
    setPaymentResult({ success: true, data: response });
  };

  const handleError = (error: any) => {
    console.log("Error en pago:", error);
    setPaymentResult({ success: false, error });
  };

  const createPaymentData = () => {
    return {
      ...pluxData,
      PayboxBase12: amount.toFixed(2),
      PayboxDescription: description,
    };
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Prueba de Plux Paybox</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <label>
          Monto: 
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <label>
          Descripción: 
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Tarjetas de Prueba:</h3>
        <ul>
          <li><strong>VISA:</strong> 4540639936908783 | CVV: 123</li>
          <li><strong>MASTERCARD:</strong> 5230428590692129 | CVV: 123</li>
          <li><strong>DINERS:</strong> 36417200103608 | CVV: 123 | OTP: 123456</li>
        </ul>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Instrucciones:</h3>
        <ol>
          <li>El botón de pago aparecerá en la esquina inferior derecha</li>
          <li>Haz clic en el botón para abrir Plux Paybox</li>
          <li>Usa una de las tarjetas de prueba</li>
          <li>Completa el pago</li>
          <li>Verifica el resultado abajo</li>
        </ol>
      </div>

      <PpxButtonSimple
        data={createPaymentData()}
        amount={amount}
        description={description}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      {paymentResult && (
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: paymentResult.success ? "#d4edda" : "#f8d7da",
          border: `1px solid ${paymentResult.success ? "#c3e6cb" : "#f5c6cb"}`,
          borderRadius: "5px"
        }}>
          <h3>{paymentResult.success ? "✅ Pago Exitoso" : "❌ Error en Pago"}</h3>
          <pre style={{ fontSize: "12px", overflow: "auto" }}>
            {JSON.stringify(paymentResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PluxTest;
