const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const prisma = require("../../lib/prisma");

const width = 800;
const height = 400;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function generarGraficoKPI(kpiId) {
  // 1️⃣ Traer los datos del KPI con sus items y mes
  const items = await prisma.item.findMany({
    where: { idKpi: Number(kpiId) },
    include: { mes: true },
  });

  if (items.length === 0) {
    throw new Error("No existen datos para este KPI");
  }

  // 2️⃣ Transformar datos para el gráfico
  const datos = items.map((i) => ({
    mes: i.mes.descripcion,
    valor: i.descripcion, // si tienes otro campo "valor", usa ese
  }));

  // 3️⃣ Configuración del gráfico
  const configuration = {
    type: "bar",
    data: {
      labels: datos.map((d) => d.mes),
      datasets: [
        {
          label: "Valor KPI",
          data: datos.map((d) => d.valor),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Evolución del KPI por Mes",
        },
      },
    },
  };

  // 4️⃣ Renderizar gráfico como imagen PNG
  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  return image;
}

module.exports = {
  generarGraficoKPI,
};
