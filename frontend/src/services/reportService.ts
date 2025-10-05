import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Papa from "papaparse";

interface ReportData {
  ngoName: string;
  projectName: string;
  filters: {
    month?: string;
    year?: string;
  };
  kpis: any[];
  items: any[];
  ejes: any[];
  chartData: {
    lineChart: any[];
    multiLineChart: any[];
    barChart: any[];
    pieChart: any[];
  };
}

class ReportService {
  // Generar reporte CSV
  async generateCSV(data: ReportData): Promise<void> {
    const csvData = data.items.map((item) => {
      const kpi = data.kpis.find((k) => k.id === item.idKpi);
      const eje = data.ejes.find((e) => e.id === kpi?.idEje);

      return {
        ONG: data.ngoName,
        Proyecto: data.projectName,
        Año: item.year,
        Mes: item.idMes,
        KPI: kpi?.nombre || "",
        Eje: eje?.nombre || "",
        Descripción: item.descripcion || "",
        "Fecha Registro": new Date(item.createdAt).toLocaleDateString(),
      };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reporte_${data.projectName}_${Date.now()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Generar reporte PDF con gráficos
  async generatePDF(data: ReportData): Promise<void> {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Título
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("Reporte de Dashboard", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    // Información general
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`ONG: ${data.ngoName}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Proyecto: ${data.projectName}`, 20, yPosition);
    yPosition += 7;

    if (data.filters.month || data.filters.year) {
      const filterText = `Filtros: ${
        data.filters.month ? `Mes ${data.filters.month}` : ""
      } ${data.filters.year || ""}`;
      pdf.text(filterText, 20, yPosition);
      yPosition += 7;
    }

    pdf.text(
      `Fecha de generación: ${new Date().toLocaleDateString()}`,
      20,
      yPosition
    );
    yPosition += 15;

    // Resumen estadístico
    pdf.setFont("helvetica", "bold");
    pdf.text("Resumen Estadístico", 20, yPosition);
    yPosition += 7;
    pdf.setFont("helvetica", "normal");
    pdf.text(`Total de Items: ${data.items.length}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Total de KPIs: ${data.kpis.length}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Total de Ejes: ${data.ejes.length}`, 20, yPosition);
    yPosition += 15;

    // Capturar gráficos
    const charts = document.querySelectorAll("[data-chartname]");

    for (const chart of Array.from(charts)) {
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }

      const chartName = chart.getAttribute("data-chartname");
      const chartElement = chart.querySelector(".grid-stack-item-content");

      if (chartElement) {
        try {
          const canvas = await html2canvas(chartElement as HTMLElement, {
            scale: 2,
            logging: false,
            useCORS: true,
          });

          const imgData = canvas.toDataURL("image/png");
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Título del gráfico
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(14);
          pdf.text(this.getChartTitle(chartName || ""), 20, yPosition);
          yPosition += 10;

          // Imagen del gráfico
          pdf.addImage(
            imgData,
            "PNG",
            20,
            yPosition,
            imgWidth,
            Math.min(imgHeight, 100)
          );
          yPosition += Math.min(imgHeight, 100) + 15;
        } catch (error) {
          console.error(`Error capturando gráfico ${chartName}:`, error);
        }
      }
    }

    // Guardar PDF
    pdf.save(`reporte_dashboard_${data.projectName}_${Date.now()}.pdf`);
  }

  private getChartTitle(chartName: string): string {
    const titles: { [key: string]: string } = {
      "total-projects": "Total de Proyectos",
      "total-kpis": "Total de KPIs",
      "items-registered": "Items Registrados",
      "total-ejes": "Total de Ejes",
      "line-chart": "Tendencia Temporal de Items",
      "multi-line-chart": "Comparación por Años",
      "bar-chart": "Items por KPI",
      "pie-chart": "Distribución por Eje",
      "recent-activity": "Actividad Reciente",
    };
    return titles[chartName] || chartName;
  }

  // Generar descripción con OpenAI
  async generateDescription(data: ReportData): Promise<string> {
    try {
      const response = await fetch(
        "http://localhost:5000/api/openai/generate-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ngoName: data.ngoName,
            projectName: data.projectName,
            totalItems: data.items.length,
            totalKpis: data.kpis.length,
            totalEjes: data.ejes.length,
            chartData: data.chartData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al generar descripción");
      }

      const result = await response.json();
      return result.description;
    } catch (error) {
      console.error("Error generando descripción con OpenAI:", error);
      return "Descripción no disponible";
    }
  }
}

export const reportService = new ReportService();
