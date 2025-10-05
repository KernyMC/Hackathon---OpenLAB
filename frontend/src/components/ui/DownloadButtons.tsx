import { Button } from "@/components/ui/button";
import { reportService } from "@/services/reportService";
import { Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";

interface DownloadButtonsProps {
  reportData: any;
  disabled?: boolean;
}

export const DownloadButtons = ({ reportData, disabled = false }: DownloadButtonsProps) => {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState(false);

  const handleDownloadCSV = async () => {
    try {
      setLoadingCSV(true);
      await reportService.generateCSV(reportData);
    } catch (error) {
      console.error('Error descargando CSV:', error);
      alert('Error al generar el archivo CSV');
    } finally {
      setLoadingCSV(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoadingPDF(true);
      await reportService.generatePDF(reportData);
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al generar el archivo PDF');
    } finally {
      setLoadingPDF(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleDownloadCSV}
        disabled={disabled || loadingCSV}
        variant="outline"
        className="gap-2"
      >
        {loadingCSV ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Descargar CSV
      </Button>

      <Button
        onClick={handleDownloadPDF}
        disabled={disabled || loadingPDF}
        variant="default"
        className="gap-2"
      >
        {loadingPDF ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        Descargar PDF
      </Button>
    </div>
  );
};