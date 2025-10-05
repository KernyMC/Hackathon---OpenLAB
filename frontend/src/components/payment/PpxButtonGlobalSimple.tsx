import { useEffect, useRef } from "react";

interface PpxButtonGlobalSimpleProps {
  data: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const PpxButtonGlobalSimple = ({ data, onSuccess, onError }: PpxButtonGlobalSimpleProps) => {
  const pollingRef = useRef<number | null>(null);

  const initPlux = () => {
    if (typeof window !== "undefined" && (window as any).Data && (window as any).Data.init) {
      try {
        const copy = { ...data };
        // Evita DataCloneError: usa callback global si existe
        (copy as any).onAuthorize = (window as any).pluxGlobalCallback || undefined;
        (window as any).Data.init(copy);
      } catch (e) {
        // no-op
      }
    }
  };

  const startPolling = () => {
    stopPolling();
    pollingRef.current = window.setInterval(() => {
      const raw = localStorage.getItem("pluxPaymentResult");
      if (!raw) return;
      try {
        const res = JSON.parse(raw);
        if (res?.success) onSuccess && onSuccess(res.data);
        else onError && onError(res?.data || res);
      } catch {}
      localStorage.removeItem("pluxPaymentResult");
    }, 800);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    initPlux();
    startPolling();
    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify({
    PayboxBase12: data?.PayboxBase12,
    PayboxDescription: data?.PayboxDescription,
    PayboxRemail: data?.PayboxRemail,
  })]);

  const buttonStyle: React.CSSProperties = {
    display: "block",
    backgroundColor: "#FAFAFA",
    background: "url(https://sandbox-paybox.pagoplux.com/img/pagar.png?v1) no-repeat center center",
    backgroundSize: "contain",
    height: "72px",
    width: "180px",
    border: "none",
    cursor: "pointer",
    outline: 0,
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  };

  return (
    <div style={{ display: "grid", gap: 8, placeItems: "center" }}>
      <div id="modalPaybox" />
      <button id="pay" type="submit" style={buttonStyle} title="Pagar con Plux Paybox" />
    </div>
  );
};

export default PpxButtonGlobalSimple;
