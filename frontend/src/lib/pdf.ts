// Usamos el build ESM recomendado para bundlers
// @ts-ignore - tipos locales declarados en src/types/pdfjs-dist.d.ts
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf";

// Configuramos el worker como módulo ESM para Vite
// @ts-ignore - URL worker resuelta por Vite
const worker = new Worker(new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url), { type: "module" });
// @ts-ignore - propiedad soportada por pdfjs al usar workerPort
GlobalWorkerOptions.workerPort = worker;

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content: any = await page.getTextContent();
    const strings = content.items
      .map((item: any) => ("str" in item ? (item as any).str : ""))
      .filter(Boolean);
    fullText += strings.join(" ") + "\n\n";
  }

  return fullText.trim();
}

export async function extractTextFromPdfUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar el PDF: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item: any) => ("str" in item ? (item as any).str : ""))
      .filter(Boolean);
    fullText += strings.join(" ") + "\n\n";
  }

  return fullText.trim();
}

