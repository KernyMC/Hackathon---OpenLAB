import { useEffect, useMemo, useRef, useState } from "react";
import { createOpenAIClient, getAnswerFromPdfContext, defaultModel } from "@/lib/openai";
import { extractTextFromPdf, extractTextFromPdfUrl } from "@/lib/pdf";

type Message = { id: string; role: "user" | "assistant"; content: string };

const cornerClasses =
  "fixed bottom-4 right-4 z-50 shadow-xl rounded-xl overflow-hidden border bg-background text-foreground";

export default function ChatbotFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfText, setPdfText] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");
  const client = useMemo(() => createOpenAIClient(), []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadDisabled = Boolean(import.meta.env.VITE_CHATBOT_PDF_URL);

  useEffect(() => {
    if (!client) {
      setMessages([
        {
          id: "init",
          role: "assistant",
          content:
            "Chatbot deshabilitado: falta VITE_OPENAI_API_KEY en variables de entorno.",
        },
      ]);
    }
    // Auto-cargar PDF desde env si está definido
    const presetUrl = import.meta.env.VITE_CHATBOT_PDF_URL as string | undefined;
    if (presetUrl) {
      (async () => {
        try {
          setLoading(true);
          const text = await extractTextFromPdfUrl(presetUrl);
          setPdfText(text);
          setPdfName(presetUrl.split("/").pop() || "Documento");
          if (!isOpen) setIsOpen(true);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: `Hola, soy el chat de ${import.meta.env.VITE_CHATBOT_NAME ?? "Fundación Favorita"}. ¿En qué te puedo ayudar? Ya he leído el documento para responder con base en su contenido.`,
            },
          ]);
        } catch (e) {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: "No pude cargar el PDF predefinido.",
            },
          ]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [client]);

  const onUploadPdf = async (file: File) => {
    setLoading(true);
    try {
      const text = await extractTextFromPdf(file);
      setPdfText(text);
      setPdfName(file.name);
      if (!isOpen) setIsOpen(true);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `He leído el PDF "${file.name}". Ya puedes preguntar.`,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "No pude leer el PDF." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (!client) return;
    setLoading(true);
    try {
      const answer = await getAnswerFromPdfContext({
        client,
        model: defaultModel,
        pdfText,
        userMessage: userMsg.content,
      });
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: answer || "(sin respuesta)" },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Ocurrió un error al consultar el modelo." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cornerClasses} style={{ width: isOpen ? 360 : 64, height: isOpen ? 520 : 64 }}>
      {isOpen ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="text-sm font-medium">Asistente PDF {pdfName ? `· ${pdfName}` : ""}</div>
            <div className="flex items-center gap-2">
              {!uploadDisabled && (
                <button
                  className="text-xs px-2 py-1 rounded bg-secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  Subir PDF
                </button>
              )}
              <button className="text-xl leading-none" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>
            {!uploadDisabled && (
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUploadPdf(f);
                  e.currentTarget.value = "";
                }}
              />
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={
                    m.role === "user"
                      ? "inline-block max-w-[80%] rounded-lg bg-primary text-primary-foreground px-3 py-2"
                      : "inline-block max-w-[80%] rounded-lg bg-muted px-3 py-2"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-muted-foreground">Pensando…</div>}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder={pdfText ? "Escribe tu pregunta…" : uploadDisabled ? "Cargando documento…" : "Sube un PDF para comenzar"}
              disabled={!pdfText || loading || !client}
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button onClick={onSend} disabled={!pdfText || loading || !client} className="px-3 py-2 text-sm rounded bg-primary text-primary-foreground">
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <button
          className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground"
          onClick={() => setIsOpen(true)}
          title="Chat PDF"
        >
          💬
        </button>
      )}
    </div>
  );
}


