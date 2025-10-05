// routes/mes.routes.js
const express = require("express");
const router = express.Router();
const mesService = require("../services/mes.service");

// GET todos los meses
router.get("/", async (req, res) => {
  try {
    const meses = await mesService.getAllMes();
    res.json(meses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET mes por ID
router.get("/:id", async (req, res) => {
  try {
    const mes = await mesService.getMesById(req.params.id);
    if (!mes) return res.status(404).json({ message: "Mes no encontrado" });
    res.json(mes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear mes
router.post("/", async (req, res) => {
  try {
    const { id, descripcion } = req.body;
    if (id === undefined || descripcion === undefined) {
      return res.status(400).json({ message: "Se requiere id y descripcion" });
    }

    const nuevoMes = await mesService.createMes({ id, descripcion });
    res.status(201).json(nuevoMes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar mes
router.put("/:id", async (req, res) => {
  try {
    const { descripcion } = req.body;
    const mesActualizado = await mesService.updateMes(req.params.id, {
      descripcion,
    });
    res.json(mesActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE mes
router.delete("/:id", async (req, res) => {
  try {
    await mesService.deleteMes(req.params.id);
    res.json({ message: "Mes eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
