const express = require("express");
const router = express.Router();
const ejeService = require("../services/eje.service");

// GET todos los ejes
router.get("/", async (req, res) => {
  try {
    const ejes = await ejeService.getAllEjes();
    res.json(ejes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET eje por ID
router.get("/:id", async (req, res) => {
  try {
    const eje = await ejeService.getEjeById(req.params.id);
    if (!eje) return res.status(404).json({ message: "Eje no encontrado" });
    res.json(eje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear eje
router.post("/", async (req, res) => {
  try {
    const { nombre, idProyecto } = req.body;
    if (!nombre || !idProyecto)
      return res
        .status(400)
        .json({ message: "nombre e idProyecto son requeridos" });

    const nuevoEje = await ejeService.createEje(nombre, idProyecto);
    res.status(201).json(nuevoEje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar eje
router.put("/:id", async (req, res) => {
  try {
    const ejeActualizado = await ejeService.updateEje(req.params.id, req.body);
    res.json(ejeActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eje
router.delete("/:id", async (req, res) => {
  try {
    await ejeService.deleteEje(req.params.id);
    res.json({ message: "Eje eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
