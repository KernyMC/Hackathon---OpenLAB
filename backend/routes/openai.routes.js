const express = require("express");
const router = express.Router();
const openAIService = require("../services/openai.service");

// Generar descripción de reporte
router.post("/generate-description", async (req, res) => {
  try {
    const reportData = req.body;

    // Validar datos requeridos
    if (!reportData.ngoName || !reportData.projectName) {
      return res.status(400).json({
        error: "Faltan datos requeridos",
        message: "Se requiere ngoName y projectName",
      });
    }

    console.log(
      `Generando descripción para proyecto: ${reportData.projectName}`
    );

    const result = await openAIService.generateReportDescription(reportData);

    res.json({
      description: result.description,
      success: result.success,
      tokensUsed: result.tokensUsed,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en /generate-description:", error);
    res.status(500).json({
      error: "Error generando descripción",
      message: error.message,
      description:
        "No se pudo generar la descripción automática. Por favor, intente nuevamente.",
    });
  }
});

// Verificar conexión con OpenAI
router.get("/check-connection", async (req, res) => {
  try {
    const result = await openAIService.checkConnection();
    res.json(result);
  } catch (error) {
    console.error("Error verificando conexión:", error);
    res.status(500).json({
      available: false,
      message: error.message,
    });
  }
});

// Endpoint de prueba
router.post("/test", async (req, res) => {
  try {
    const testData = {
      ngoName: "ONG de Prueba",
      projectName: "Proyecto Test",
      totalItems: 150,
      totalKpis: 8,
      totalEjes: 3,
      chartData: {
        lineChart: [],
        multiLineChart: [],
        barChart: [],
        pieChart: [],
      },
    };

    const result = await openAIService.generateReportDescription(testData);

    res.json({
      success: true,
      message: "Test completado",
      result,
    });
  } catch (error) {
    console.error("Error en test:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
