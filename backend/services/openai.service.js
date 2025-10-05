const OpenAI = require("openai");

const resolvedApiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
let openai = null;
if (resolvedApiKey) {
  openai = new OpenAI({ apiKey: resolvedApiKey });
} else {
  console.warn(
    "OPENAI_API_KEY no definido. Define OPENAI_API_KEY en backend/.env (o VITE_OPENAI_API_KEY) para habilitar OpenAI."
  );
}

class OpenAIService {
  async generateReportDescription(reportData) {
    try {
      const {
        ngoName,
        projectName,
        totalItems,
        totalKpis,
        totalEjes,
        chartData,
      } = reportData;

      const prompt = `
Genera un resumen profesional y conciso del siguiente dashboard de proyecto de ONG:

- ONG: ${ngoName}
- Proyecto: ${projectName}
- Total de Items registrados: ${totalItems}
- Total de KPIs: ${totalKpis}
- Total de Ejes estratégicos: ${totalEjes}

Datos adicionales:
- Tendencia de items: ${chartData?.lineChart?.length || 0} periodos registrados
- Años comparados: ${chartData?.multiLineChart?.length || 0} meses
- KPIs activos: ${chartData?.barChart?.length || 0}
- Distribución por ejes: ${chartData?.pieChart?.length || 0} ejes

Genera un análisis profesional en español que incluya:
1. Resumen ejecutivo del estado del proyecto (1 párrafo)
2. Análisis de tendencias y patrones observados (1-2 párrafos)
3. Recomendaciones clave basadas en los datos (1 párrafo)

El tono debe ser profesional, objetivo y orientado a la toma de decisiones.
      `;

      if (!openai) throw new Error("OpenAI no configurado");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Eres un analista de datos experto especializado en proyectos de ONGs y organizaciones sin fines de lucro. Generas reportes claros, profesionales y accionables basados en métricas de impacto social con descripciones ",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      return {
        success: true,
        description: completion.choices[0].message.content,
        tokensUsed: completion.usage.total_tokens,
      };
    } catch (error) {
      console.error("Error generando descripción con OpenAI:", error);

      // Retornar descripción por defecto en caso de error
      return {
        success: false,
        description: this.generateFallbackDescription(reportData),
        error: error.message,
      };
    }
  }

  // Descripción de respaldo si OpenAI falla
  generateFallbackDescription(reportData) {
    const { ngoName, projectName, totalItems, totalKpis, totalEjes } =
      reportData;

    return `
RESUMEN EJECUTIVO DEL PROYECTO

Este reporte presenta un análisis del proyecto "${projectName}" de la organización ${ngoName}.

MÉTRICAS PRINCIPALES:
- Se han registrado ${totalItems} items en total
- El proyecto cuenta con ${totalKpis} indicadores clave de desempeño (KPIs)
- La gestión se organiza en ${totalEjes} ejes estratégicos

ANÁLISIS:
El proyecto muestra actividad constante con registros distribuidos a lo largo del periodo analizado. 
Los datos recopilados permiten evaluar el progreso hacia los objetivos establecidos en cada eje estratégico.

RECOMENDACIONES:
- Continuar con el registro sistemático de datos
- Revisar periódicamente el cumplimiento de KPIs
- Identificar áreas de mejora basadas en las tendencias observadas
    `.trim();
  }

  // Validar disponibilidad de OpenAI
  async checkConnection() {
    try {
      if (!openai) throw new Error("OpenAI no configurado");
      await openai.models.list();
      return { available: true, message: "OpenAI API conectada correctamente" };
    } catch (error) {
      console.error("Error conectando con OpenAI:", error.message);
      return { available: false, message: error.message };
    }
  }
}

module.exports = new OpenAIService();
