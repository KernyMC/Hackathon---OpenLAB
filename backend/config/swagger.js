const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Configuración de Swagger
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "ConquitoProject API",
    version: "1.0.0",
    description: "API para gestión de ONGs, Proyectos y KPIs - ConquitoProject",
    contact: {
      name: "API Support",
      email: "support@conquitoproject.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Servidor de desarrollo",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Ingresa tu token JWT en el formato: Bearer <token>",
      },
    },
    schemas: {
      // =====================================================
      // ESQUEMAS DE DATOS
      // =====================================================
      TipoUsuario: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "ID único del tipo de usuario",
          },
          descripcion: {
            type: "string",
            description: "Descripción del tipo de usuario",
            example: "Administrador",
          },
          _count: {
            type: "object",
            properties: {
              usuarios: {
                type: "integer",
                description: "Cantidad de usuarios de este tipo",
              },
            },
          },
        },
      },
      Usuario: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "ID único del usuario",
          },
          nombres: {
            type: "string",
            description: "Nombres del usuario",
            example: "Juan Carlos",
          },
          apellidos: {
            type: "string",
            description: "Apellidos del usuario",
            example: "Pérez López",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email del usuario",
            example: "juan.perez@example.com",
          },
          cedula: {
            type: "string",
            description: "Cédula de identidad",
            example: "1234567890",
          },
          idTipoUsuario: {
            type: "integer",
            description: "ID del tipo de usuario",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Fecha de creación",
          },
          lastLogin: {
            type: "string",
            format: "date-time",
            description: "Último login",
          },
          tipoUsuario: {
            $ref: "#/components/schemas/TipoUsuario",
          },
        },
      },
      // =====================================================
      // ESQUEMAS DE RESPUESTA
      // =====================================================
      SuccessResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Operación exitosa",
          },
          data: {
            type: "object",
            description: "Datos de respuesta",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Error en la operación",
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                },
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      PaginationResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          data: {
            type: "array",
            items: {
              type: "object",
            },
          },
          pagination: {
            type: "object",
            properties: {
              page: {
                type: "integer",
                example: 1,
              },
              limit: {
                type: "integer",
                example: 10,
              },
              total: {
                type: "integer",
                example: 25,
              },
              pages: {
                type: "integer",
                example: 3,
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Opciones para swagger-jsdoc
const options = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js", "./server.js"],
};

// Generar especificación de Swagger
const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
