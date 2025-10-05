// Declaraciones de tipos para Plux Paybox
declare global {
  interface Window {
    Data: {
      init: (data: any) => void;
      reload: (data: any) => void;
    };
    jQuery: any;
    iniciarDatos: (data: any) => void;
  }
}

export {};
