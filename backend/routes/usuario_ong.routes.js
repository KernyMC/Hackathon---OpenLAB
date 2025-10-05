const express = require("express");
const router = express.Router();
const usuarioOngService = require("../services/usuario_ong.service");

// GET todas las relaciones
router.get("/", async (req, res) => {
  try {
    const relaciones = await usuarioOngService.getAllUsuarioOng();
    res.json(relaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET por ID
router.get("/:id", async (req, res) => {
  try {
    const relacion = await usuarioOngService.getUsuarioOngById(req.params.id);
    if (!relacion)
      return res.status(404).json({ message: "Relación no encontrada" });
    res.json(relacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST nueva relación
router.post("/", async (req, res) => {
  try {
    const { idUsuario, idOng } = req.body;
    if (!idUsuario || !idOng)
      return res.status(400).json({ message: "Se requiere idUsuario e idOng" });

    const nuevaRelacion = await usuarioOngService.createUsuarioOng(
      idUsuario,
      idOng
    );
    res.status(201).json(nuevaRelacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE relación
router.delete("/:id", async (req, res) => {
  try {
    await usuarioOngService.deleteUsuarioOng(req.params.id);
    res.json({ message: "Relación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
