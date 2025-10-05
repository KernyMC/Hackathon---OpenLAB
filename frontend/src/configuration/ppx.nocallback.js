// Configuración SIN onAuthorize - Evita DataCloneError completamente
let data = {
  PayboxRemail: "correoplux@gmail.com",
  PayboxSendmail: "usuario@ejemplo.com",
  PayboxRename: "Fundación Favorita",
  PayboxSendname: "Donante",
  PayboxBase0: "0",
  PayboxBase12: "10.00",
  PayboxDescription: "Donación a proyecto social",
  PayboxProduction: false,
  PayboxEnvironment: "sandbox",
  PayboxLanguage: "es",
  PayboxPagoPlux: true,
  PayboxDirection: "Quito, Ecuador",
  PayBoxClientPhone: "0999999999",
  PayBoxClientName: "Donante",
  PayBoxClientIdentification: "1234567890",
  PayboxRecurrent: false
  // SIN onAuthorize - esto evita DataCloneError
};

export { data };
