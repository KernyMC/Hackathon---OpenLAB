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

    // PORTADA
    this.addCoverPage(pdf, data, pageWidth, pageHeight);

    // Nueva página para contenido
    pdf.addPage();
    let yPosition = 20;

    // Barras decorativas superiores
    this.addDecorativeBars(pdf, pageWidth);
    yPosition += 15;

    // Información general
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Información del Proyecto", 20, yPosition);
    yPosition += 10;

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
    pdf.setFontSize(14);
    pdf.text("Resumen Estadístico", 20, yPosition);
    yPosition += 7;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(`Total de Items: ${data.items.length}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Total de KPIs: ${data.kpis.length}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Total de Ejes: ${data.ejes.length}`, 20, yPosition);
    yPosition += 15;

    // Generar y agregar descripción con OpenAI
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Análisis Inteligente", 20, yPosition);
    yPosition += 7;

    try {
      const description = await this.generateDescription(data);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      // Dividir el texto en líneas que quepan en la página
      const splitDescription = pdf.splitTextToSize(description, pageWidth - 40);

      for (const line of splitDescription) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          this.addDecorativeBars(pdf, pageWidth);
          yPosition = 30;
        }
        pdf.text(line, 20, yPosition);
        yPosition += 6;
      }
      yPosition += 10;
    } catch (error) {
      console.error("Error al generar descripción:", error);
    }

    // Nueva página para gráficos
    pdf.addPage();
    this.addDecorativeBars(pdf, pageWidth);
    yPosition = 30;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Gráficos y Visualizaciones", 20, yPosition);
    yPosition += 15;

    // Capturar gráficos
    const charts = document.querySelectorAll("[data-chartname]");

    for (const chart of Array.from(charts)) {
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        this.addDecorativeBars(pdf, pageWidth);
        yPosition = 30;
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

  // Agregar portada
  private addCoverPage(
    pdf: jsPDF,
    data: ReportData,
    pageWidth: number,
    pageHeight: number
  ): void {
    // Fondo de color para la portada
    pdf.setFillColor(41, 128, 185); // Azul
    pdf.rect(0, 0, pageWidth, pageHeight / 3, "F");

    // Título principal
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont("helvetica", "bold");
    pdf.text("REPORTE DE DASHBOARD", pageWidth / 2, 50, { align: "center" });

    // Subtítulo
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text("Análisis de Indicadores y KPIs", pageWidth / 2, 65, {
      align: "center",
    });

    // Sección blanca
    pdf.setTextColor(0, 0, 0);

    // Información destacada
    const centerY = pageHeight / 2;
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(data.ngoName, pageWidth / 2, centerY - 20, { align: "center" });

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.projectName, pageWidth / 2, centerY - 5, { align: "center" });

    // Fecha
    pdf.setFontSize(12);
    pdf.text(
      new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      pageWidth / 2,
      centerY + 15,
      { align: "center" }
    );

    // Línea decorativa inferior
    pdf.setDrawColor(41, 128, 185);
    pdf.setLineWidth(0.5);
    pdf.line(40, pageHeight - 40, pageWidth - 40, pageHeight - 40);

    // Pie de página
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      "Generado automáticamente por el Sistema de Gestión",
      pageWidth / 2,
      pageHeight - 25,
      { align: "center" }
    );
  }

  // Agregar barras decorativas
  private addDecorativeBars(pdf: jsPDF, pageWidth: number): void {
    // Barra superior principal
    pdf.setFillColor(41, 128, 185); // Azul
    pdf.rect(0, 0, pageWidth, 8, "F");

    // Barra secundaria
    pdf.setFillColor(52, 152, 219); // Azul claro
    pdf.rect(0, 8, pageWidth, 3, "F");

    // Barra terciaria
    pdf.setFillColor(149, 165, 166); // Gris
    pdf.rect(0, 11, pageWidth, 1, "F");
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
      const response = await fetch("http://localhost:5000/api/openai/", {
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
      });

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
