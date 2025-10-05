// routes/itemObservable.routes.js
const express = require("express");
const router = express.Router();
const itemObservableService = require("../services/itemObservable.service");

// GET todos los items observables
router.get("/", async (req, res) => {
  try {
    const items = await itemObservableService.getAllItemsObservables();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET item observable por ID
router.get("/:id", async (req, res) => {
  try {
    const item = await itemObservableService.getItemObservableById(
      req.params.id
    );
    if (!item)
      return res.status(404).json({ message: "ItemObservable no encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear item observable
router.post("/", async (req, res) => {
  try {
    const { idKpi, idProyecto, descripcion, idMes, year } = req.body;
    if (!idKpi || !idProyecto || !idMes || !year) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const nuevoItem = await itemObservableService.createItemObservable({
      idKpi,
      idProyecto,
      descripcion,
      idMes,
      year,
    });
    res.status(201).json(nuevoItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar item observable
router.put("/:id", async (req, res) => {
  try {
    const itemActualizado = await itemObservableService.updateItemObservable(
      req.params.id,
      req.body
    );
    res.json(itemActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE item observable
router.delete("/:id", async (req, res) => {
  try {
    await itemObservableService.deleteItemObservable(req.params.id);
    res.json({ message: "ItemObservable eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
