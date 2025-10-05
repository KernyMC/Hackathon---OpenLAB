const express = require("express");
const router = express.Router();
const tipoUsuarioService = require("../services/tipoUsuario.service");

// GET todos
router.get("/", async (req, res) => {
  try {
    const tipos = await tipoUsuarioService.getAllTipoUsuario();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET por id
router.get("/:id", async (req, res) => {
  try {
    const tipo = await tipoUsuarioService.getTipoUsuarioById(req.params.id);
    if (!tipo)
      return res.status(404).json({ message: "Tipo de usuario no encontrado" });
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST nuevo
router.post("/", async (req, res) => {
  try {
    const { descripcion } = req.body;
    if (!descripcion)
      return res.status(400).json({ message: "La descripción es requerida" });

    const nuevo = await tipoUsuarioService.createTipoUsuario(descripcion);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await tipoUsuarioService.deleteTipoUsuario(req.params.id);
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
