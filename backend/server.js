const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./config/swagger");

// Importar rutas
const tipoUsuarioRoutes = require("./routes/tipoUsuario.route");
const usuariosRoutes = require("./routes/usuarios");
const ongRoutes = require("./routes/ong.routes");
const usuarioOngRoutes = require("./routes/usuario_ong.routes");
const proyectoRoutes = require("./routes/proyecto.routes");
const ejeRoutes = require("./routes/eje.routes");
const ejeObservableRoutes = require("./routes/ejeObservable.routes");
const kpiRoutes = require("./routes/kpi.routes");
const kpiObservableRoutes = require("./routes/kpiObservable.routes");
const mesRoutes = require("./routes/mes.routes");
const tipoDatoItemRoutes = require("./routes/tipoDatoItem.routes");
const itemRoutes = require("./routes/item.routes");
const itemObservableRoutes = require("./routes/itemObservable.routes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Log para ver si llegan peticiones (ANTES de las rutas)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log("Body:", req.body);
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/tipo-usuario", tipoUsuarioRoutes);
app.use("/api/usuario", usuariosRoutes);
app.use("/api/ong", ongRoutes);
app.use("/api/usuario-ong", usuarioOngRoutes);
app.use("/api/proyecto", proyectoRoutes);
app.use("/api/eje", ejeRoutes);
app.use("/api/eje-observable", ejeObservableRoutes);
app.use("/api/kpi", kpiRoutes);
app.use("/api/kpi-observable", kpiObservableRoutes);
app.use("/api/mes", mesRoutes);
app.use("/api/tipo-dato-item", tipoDatoItemRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/item-observable", itemObservableRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
