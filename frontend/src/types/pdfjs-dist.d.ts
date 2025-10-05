declare module "pdfjs-dist/build/pdf" {
  export const GlobalWorkerOptions: { workerSrc?: string; workerPort?: any };
  export function getDocument(src: any): { promise: Promise<any>; destroy?: () => void };
}

declare module "pdfjs-dist/build/pdf.worker.mjs" {
  const url: string;
  export default url;
}


