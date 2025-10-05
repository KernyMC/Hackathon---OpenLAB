// routes/tipoDatoItem.routes.js
const express = require("express");
const router = express.Router();
const tipoDatoItemService = require("../services/tipoDatoItem.service");

// GET todos los tipos de dato
router.get("/", async (req, res) => {
  try {
    const tipos = await tipoDatoItemService.getAllTipoDatoItem();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET tipo de dato por ID
router.get("/:id", async (req, res) => {
  try {
    const tipo = await tipoDatoItemService.getTipoDatoItemById(req.params.id);
    if (!tipo)
      return res.status(404).json({ message: "TipoDatoItem no encontrado" });
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear tipo de dato
router.post("/", async (req, res) => {
  try {
    const { descripcion, unidad } = req.body;
    if (!descripcion || !unidad) {
      return res
        .status(400)
        .json({ message: "Se requiere descripcion y unidad" });
    }

    const nuevo = await tipoDatoItemService.createTipoDatoItem({
      descripcion,
      unidad,
    });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar tipo de dato
router.put("/:id", async (req, res) => {
  try {
    const { descripcion, unidad } = req.body;
    const actualizado = await tipoDatoItemService.updateTipoDatoItem(
      req.params.id,
      { descripcion, unidad }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE tipo de dato
router.delete("/:id", async (req, res) => {
  try {
    await tipoDatoItemService.deleteTipoDatoItem(req.params.id);
    res.json({ message: "TipoDatoItem eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
