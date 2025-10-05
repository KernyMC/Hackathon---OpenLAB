const express = require("express");
const router = express.Router();
const kpiService = require("../services/kpi.service");

// GET todos los KPIs
router.get("/", async (req, res) => {
  try {
    const kpis = await kpiService.getAllKpis();
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET KPI por ID
router.get("/:id", async (req, res) => {
  try {
    const kpi = await kpiService.getKpiById(req.params.id);
    if (!kpi) return res.status(404).json({ message: "KPI no encontrado" });
    res.json(kpi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear KPI
router.post("/", async (req, res) => {
  try {
    const { nombre, idEje, idTipoDatoItem } = req.body;
    if (!nombre || !idEje || !idTipoDatoItem) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const nuevoKpi = await kpiService.createKpi(nombre, idEje, idTipoDatoItem);
    res.status(201).json(nuevoKpi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar KPI
router.put("/:id", async (req, res) => {
  try {
    const kpiActualizado = await kpiService.updateKpi(req.params.id, req.body);
    res.json(kpiActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eliminar KPI
router.delete("/:id", async (req, res) => {
  try {
    await kpiService.deleteKpi(req.params.id);
    res.json({ message: "KPI eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
