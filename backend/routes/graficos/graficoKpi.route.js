const express = require("express");
const router = express.Router();
const {
  generarGraficoKPI,
} = require("../../services/graficos/graficoKpi.service");

// GET /grafico/:kpiId
router.get("/:kpiId", async (req, res) => {
  const kpiId = req.params.kpiId;

  try {
    const buffer = await generarGraficoKPI(kpiId);
    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
