const express = require("express");
const router = express.Router();
const ejeObservableService = require("../services/ejeObservable.service");

// GET todos los ejes observables
router.get("/", async (req, res) => {
  try {
    const ejes = await ejeObservableService.getAllEjesObservables();
    res.json(ejes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET eje observable por ID
router.get("/:id", async (req, res) => {
  try {
    const eje = await ejeObservableService.getEjeObservableById(req.params.id);
    if (!eje)
      return res.status(404).json({ message: "Eje observable no encontrado" });
    res.json(eje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear eje observable
router.post("/", async (req, res) => {
  try {
    const { nombre, idProyecto } = req.body;
    if (!nombre || !idProyecto) {
      return res
        .status(400)
        .json({ message: "nombre e idProyecto son requeridos" });
    }

    const nuevoEje = await ejeObservableService.createEjeObservable(
      nombre,
      idProyecto
    );
    res.status(201).json(nuevoEje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar eje observable
router.put("/:id", async (req, res) => {
  try {
    const ejeActualizado = await ejeObservableService.updateEjeObservable(
      req.params.id,
      req.body
    );
    res.json(ejeActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eje observable
router.delete("/:id", async (req, res) => {
  try {
    await ejeObservableService.deleteEjeObservable(req.params.id);
    res.json({ message: "Eje observable eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
