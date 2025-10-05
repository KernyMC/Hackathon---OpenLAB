const express = require("express");
const router = express.Router();
const ongService = require("../services/ong.service");

// GET todas las ONGs
router.get("/", async (req, res) => {
  try {
    const ongs = await ongService.getAllONG();
    res.json(ongs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/test", (req, res) => {
  res.send("Ruta de prueba funcionando correctamente");
});

// GET ONG por ID
router.get("/:id", async (req, res) => {
  try {
    const ong = await ongService.getONGById(req.params.id);
    if (!ong) return res.status(404).json({ message: "ONG no encontrada" });
    res.json(ong);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear nueva ONG
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre)
      return res.status(400).json({ message: "El nombre es requerido" });

    const nuevaONG = await ongService.createONG(nombre, descripcion);
    res.status(201).json(nuevaONG);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar ONG
router.put("/:id", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const updatedONG = await ongService.updateONG(
      req.params.id,
      nombre,
      descripcion
    );
    res.json(updatedONG);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eliminar ONG
router.delete("/:id", async (req, res) => {
  try {
    await ongService.deleteONG(req.params.id);
    res.json({ message: "ONG eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
