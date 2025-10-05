const express = require("express");
const router = express.Router();
const kpiObservableService = require("../services/kpiObservable.service");

// GET todos los KPI observables
router.get("/", async (req, res) => {
  try {
    const kpis = await kpiObservableService.getAllKpiObservables();
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET KPI observable por ID
router.get("/:id", async (req, res) => {
  try {
    const kpi = await kpiObservableService.getKpiObservableById(req.params.id);
    if (!kpi)
      return res.status(404).json({ message: "KPI observable no encontrado" });
    res.json(kpi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear KPI observable
router.post("/", async (req, res) => {
  try {
    const { nombre, idEje } = req.body;
    if (!nombre || !idEje) {
      return res.status(400).json({ message: "nombre e idEje son requeridos" });
    }

    const nuevoKpi = await kpiObservableService.createKpiObservable(
      nombre,
      idEje
    );
    res.status(201).json(nuevoKpi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar KPI observable
router.put("/:id", async (req, res) => {
  try {
    const kpiActualizado = await kpiObservableService.updateKpiObservable(
      req.params.id,
      req.body
    );
    res.json(kpiActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eliminar KPI observable
router.delete("/:id", async (req, res) => {
  try {
    await kpiObservableService.deleteKpiObservable(req.params.id);
    res.json({ message: "KPI observable eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
