import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
export const defaultModel = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) ?? "gpt-4o-mini";

if (!apiKey) {
  // Fail fast in dev; in prod this will simply disable the feature gracefully
  // without crashing the whole app.
  // eslint-disable-next-line no-console
  console.warn("VITE_OPENAI_API_KEY no está definido. El chatbot estará deshabilitado.");
}

export function createOpenAIClient() {
  if (!apiKey) return null;
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

export async function getAnswerFromPdfContext(params: {
  client: OpenAI;
  model?: string;
  systemPrompt?: string;
  pdfText: string;
  userMessage: string;
}) {
  const { client, systemPrompt, pdfText, userMessage } = params;
  const preferredModel = params.model ?? defaultModel;

  const system =
    systemPrompt ??
    "Responde únicamente usando el contenido del PDF proporcionado. Si la respuesta no está en el PDF, responde exactamente: 'No cuento con esa información por el momento.'";

  const context = pdfText.slice(0, 120_000);

  try {
    const response = await client.chat.completions.create({
      model: preferredModel,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Contexto del PDF:\n\n${context}\n\nPregunta: ${userMessage}`,
        },
      ],
    });
    return response.choices?.[0]?.message?.content ?? "";
  } catch (err: any) {
    const errorMessage: string = err?.error?.message || err?.message || "Error en la solicitud";
    const isModelError = /model/i.test(errorMessage) || err?.status === 400;
    if (isModelError && preferredModel !== "gpt-4o-mini") {
      // Reintento con un modelo soportado ampliamente
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Contexto del PDF:\n\n${context}\n\nPregunta: ${userMessage}`,
          },
        ],
      });
      return response.choices?.[0]?.message?.content ?? "";
    }
    throw err;
  }
}


