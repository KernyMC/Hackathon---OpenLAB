const express = require("express");
const router = express.Router();
const proyectoService = require("../services/proyecto.service");

// GET todos los proyectos
router.get("/", async (req, res) => {
  try {
    const proyectos = await proyectoService.getAllProyectos();
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET proyecto por ID
router.get("/:id", async (req, res) => {
  try {
    const proyecto = await proyectoService.getProyectoById(req.params.id);
    if (!proyecto)
      return res.status(404).json({ message: "Proyecto no encontrado" });
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST nuevo proyecto
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, idOng } = req.body;
    if (!nombre || !idOng)
      return res.status(400).json({ message: "nombre e idOng son requeridos" });

    const nuevoProyecto = await proyectoService.createProyecto(
      nombre,
      descripcion,
      idOng
    );
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar proyecto
router.put("/:id", async (req, res) => {
  try {
    const proyecto = await proyectoService.updateProyecto(
      req.params.id,
      req.body
    );
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eliminar proyecto
router.delete("/:id", async (req, res) => {
  try {
    await proyectoService.deleteProyecto(req.params.id);
    res.json({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
