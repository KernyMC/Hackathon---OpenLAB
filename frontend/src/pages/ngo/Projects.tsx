import { useState, useMemo, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Pencil, Trash2, Search, Upload, X, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Project, Report, Eje, Indicator } from "@/types/project";
import { projectStore } from "@/lib/projectStore";

const NGOProjects = () => {
  const { toast } = useToast();

  // Datos simulados de la ONG actual (en producción vendría de autenticación)
  const currentNGO = {
    name: "BAA Cuenca",
    responsable: "Juan Pérez",
  };

  // Obtener solo los proyectos de esta ONG
  const [projects, setProjects] = useState<Project[]>(
    projectStore.getProjectsByOng(currentNGO.name)
  );

  // Sincronizar cuando se actualicen los proyectos
  useEffect(() => {
    const syncProjects = () => {
      setProjects(projectStore.getProjectsByOng(currentNGO.name));
    };
    window.addEventListener('projectsUpdated', syncProjects);
    return () => window.removeEventListener('projectsUpdated', syncProjects);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEje, setSelectedEje] = useState<string>("");
  const [selectedEjeData, setSelectedEjeData] = useState<Eje | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Estado para reportes históricos
  const [reports, setReports] = useState<Report[]>(
    projectStore.getReportsByOng(currentNGO.name)
  );
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Modal de confirmación antes de enviar
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Meses del año
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Estado para valores de indicadores (ya no se seleccionan, se cargan del proyecto)
  const [indicatorValues, setIndicatorValues] = useState<Record<string, string>>({});

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.manager && project.manager.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Funciones helper para reportes
  const currentYear = new Date().getFullYear();

  const hasReportForMonth = (projectId: string, month: string): boolean => {
    return projectStore.hasReportForMonth(projectId, month, currentYear);
  };

  const findReport = (projectId: string, month: string): Report | undefined => {
    return projectStore.findReport(projectId, month, currentYear);
  };

  // Validar antes de mostrar el modal de confirmación
  const handlePreSubmit = () => {
    if (!selectedProject || !selectedEjeData) {
      toast({
        title: "Error",
        description: "Datos del proyecto incompletos.",
        variant: "destructive",
      });
      return;
    }

    // Validar que todos los indicadores tengan valores
    const missingValues = selectedEjeData.indicators.filter(
      ind => !indicatorValues[ind.name] || indicatorValues[ind.name].trim() === ""
    );

    if (missingValues.length > 0) {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete todos los indicadores antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    // Mostrar modal de confirmación
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    if (!selectedProject || !selectedEjeData) return;

    // Crear reporte con los indicadores del proyecto
    const reportIndicators = selectedEjeData.indicators.map(indicator => ({
      name: indicator.name,
      value: indicatorValues[indicator.name] || "0",
      isCustom: indicator.isCustom || false,
    }));

    const calculatedFields: any[] = [];
    if (selectedEje === "Nutrición" && foodRecoveryPercentage) {
      calculatedFields.push({
        name: "Recuperación de alimentos (%)",
        value: foodRecoveryPercentage,
      });
    }

    const newReport: Report = {
      id: Date.now().toString(),
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      month: selectedMonth,
      year: currentYear,
      eje: selectedEje,
      indicators: reportIndicators,
      calculatedFields: calculatedFields.length > 0 ? calculatedFields : undefined,
      createdAt: new Date().toISOString(),
      createdBy: currentNGO.responsable,
      ongName: currentNGO.name,
      isLocked: true, // El reporte queda bloqueado después de enviarse
    };

    projectStore.addReport(newReport);
    setReports(projectStore.getReportsByOng(currentNGO.name));

    setShowConfirmDialog(false);
    setIsCreateOpen(false);
    setSelectedProject(null);
    setSelectedMonth("");
    setSelectedEje("");
    setSelectedEjeData(null);
    setIndicatorValues({});
    setIsViewMode(false);

    toast({
      title: "Reporte enviado",
      description: `El reporte de ${selectedMonth} ha sido guardado exitosamente y no puede ser editado.`,
    });
  };

  const handleViewReport = (report: Report) => {
    const project = projects.find(p => p.id === report.projectId);
    if (!project) return;

    setSelectedProject(project);
    setSelectedMonth(report.month);
    setSelectedEje(report.eje);
    setSelectedReport(report);
    setIsViewMode(true);

    // Cargar valores del reporte
    const values: Record<string, string> = {};
    report.indicators.forEach(i => {
      values[i.name] = i.value;
    });
    setIndicatorValues(values);

    // Encontrar el eje correspondiente
    const ejeData = project.ejes.find(e => e.name === report.eje);
    setSelectedEjeData(ejeData || null);

    setIsCreateOpen(true);
  };

  const handleMonthBadgeClick = (project: Project, month: string) => {
    const report = findReport(project.id, month);

    if (report) {
      // Ya existe reporte - abrir en modo vista
      handleViewReport(report);
    } else {
      // No existe reporte - seleccionar primer eje para crear
      if (project.ejes.length === 0) {
        toast({
          title: "Sin ejes configurados",
          description: "Este proyecto no tiene ejes configurados por el administrador.",
          variant: "destructive",
        });
        return;
      }

      // Usar el primer eje del proyecto
      const firstEje = project.ejes[0];
      setSelectedProject(project);
      setSelectedMonth(month);
      setSelectedEje(firstEje.name);
      setSelectedEjeData(firstEje);
      setIndicatorValues({});
      setIsViewMode(false);
      setIsCreateOpen(true);
    }
  };

  // Función para actualizar valor de indicador
  const updateIndicatorValue = (indicator: string, value: string) => {
    setIndicatorValues(prev => ({ ...prev, [indicator]: value }));
  };

  // Cálculo automático de recuperación de alimentos (solo para Nutrición)
  const foodRecoveryPercentage = useMemo(() => {
    if (selectedEje !== "Nutrición") return null;

    const a = parseFloat(indicatorValues["Alimentos aptos para consumo (Kg)"] || "0");
    const b = parseFloat(indicatorValues["Alimentos de consumo inmediato (Kg)"] || "0");
    const c = parseFloat(indicatorValues["Producción (Kg)"] || "0");
    const d = parseFloat(indicatorValues["Total de kilos recibidos en el mes"] || "0");

    if (d === 0) return "0.00";

    const percentage = ((a + b + c) / d) * 100;
    return percentage.toFixed(2);
  }, [selectedEje, indicatorValues]);

  const renderIndicators = () => {
    if (!selectedEjeData) return null;

    return (
      <div className="space-y-6">
        {/* Indicadores del proyecto (definidos por el Admin) */}
        <div className="border rounded-lg p-4">
          <Label className="text-base font-semibold mb-3 block">
            Indicadores del Proyecto
            <span className="text-xs text-muted-foreground ml-2">(Configurados por el Administrador)</span>
          </Label>
          <div className="grid grid-cols-2 gap-4">
            {selectedEjeData.indicators.map((indicator) => (
              <div key={indicator.id}>
                <Label htmlFor={`value-${indicator.id}`} className="text-sm flex items-center gap-2">
                  {indicator.name}
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {indicator.dataType}
                  </Badge>
                  {indicator.isCustom && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">
                      Personalizado
                    </Badge>
                  )}
                </Label>
                <Input
                  id={`value-${indicator.id}`}
                  type="number"
                  placeholder="0"
                  value={indicatorValues[indicator.name] || ""}
                  onChange={(e) => updateIndicatorValue(indicator.name, e.target.value)}
                  disabled={isViewMode}
                  className={isViewMode ? "bg-muted" : ""}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Campo calculado automático para Nutrición */}
        {selectedEje === "Nutrición" && foodRecoveryPercentage !== null && (
          <div className="border rounded-lg p-4 bg-primary/5">
            <Label className="text-base font-semibold mb-2 block">
              Cálculo Automático
            </Label>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <span className="font-medium">Recuperación de alimentos (%)</span>
                <span className="text-lg font-bold text-primary">{foodRecoveryPercentage}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Fórmula: (A + B + C) / D × 100
                <br />
                A: Alimentos aptos para consumo | B: Alimentos de consumo inmediato | C: Producción | D: Total de kilos recibidos
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageLayout role="ngo">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proyectos</h1>
          <p className="text-muted-foreground mt-1">
            Seleccione el mes haciendo click en los badges para reportar o ver reportes existentes
          </p>
        </div>

        <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isViewMode ? "Ver Reporte" : "Reporte de Indicadores"}
                </DialogTitle>
                {isViewMode && (
                  <p className="text-sm text-muted-foreground pt-2">
                    Este reporte ya fue enviado y no puede ser editado
                  </p>
                )}
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Información de la ONG y Proyecto (solo lectura) */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Organización</Label>
                      <p className="font-semibold">{currentNGO.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Responsable</Label>
                      <p className="font-semibold">{currentNGO.responsable}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Proyecto</Label>
                      <p className="font-semibold">{selectedProject?.name || "—"}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Mes de Reporte</Label>
                      <p className="font-semibold">{selectedMonth || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Eje del Proyecto (solo lectura) */}
                <div>
                  <Label htmlFor="eje">Eje del Proyecto</Label>
                  <Input
                    value={selectedEje || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>

                {renderIndicators()}

                {!isViewMode && (
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="gap-2 w-full">
                      <Upload className="w-4 h-4" />
                      Subir Archivos
                    </Button>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {!isViewMode ? (
                    <>
                      <Button onClick={handlePreSubmit} className="flex-1">
                        Enviar Reporte
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreateOpen(false);
                          setSelectedEje("");
                          setSelectedEjeData(null);
                          setIndicatorValues({});
                          setIsViewMode(false);
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateOpen(false);
                        setSelectedEje("");
                        setSelectedEjeData(null);
                        setIndicatorValues({});
                        setIsViewMode(false);
                        setSelectedReport(null);
                      }}
                      className="w-full"
                    >
                      Cerrar
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
        </Dialog>

            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Nombre del Proyecto</TableHead>
                    <TableHead className="w-[120px]">Eje</TableHead>
                    <TableHead className="w-[140px]">Gerente</TableHead>
                    <TableHead className="min-w-[420px]">Meses (Click para reportar/ver)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {project.ejes.map((eje) => (
                            <Badge key={eje.name} variant="outline">{eje.name}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{project.manager || "—"}</TableCell>
                      <TableCell>
                        <div className="grid grid-cols-6 gap-1">
                          {months.map((month) => {
                            const hasReport = hasReportForMonth(project.id, month);
                            return (
                              <button
                                key={month}
                                className={cn(
                                  "h-8 px-2 text-[11px] font-medium rounded border transition-all",
                                  hasReport
                                    ? "bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-primary hover:bg-primary/5"
                                )}
                                onClick={() => handleMonthBadgeClick(project, month)}
                                title={hasReport ? `${month} - Reportado` : `${month} - Click para reportar`}
                              >
                                {month.substring(0, 3)}
                                {hasReport && (
                                  <span className="ml-0.5 text-green-600">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </div>
      </div>

      {/* Modal de Confirmación antes de Enviar */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de enviar este reporte?</AlertDialogTitle>
            <AlertDialogDescription>
              Una vez enviado el reporte, <strong>no podrá editarlo ni modificarlo</strong>.
              Por favor, verifique que todos los datos sean correctos antes de continuar.
              <br /><br />
              <strong>Proyecto:</strong> {selectedProject?.name}
              <br />
              <strong>Mes:</strong> {selectedMonth} {currentYear}
              <br />
              <strong>Eje:</strong> {selectedEje}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Revisar nuevamente</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Sí, enviar reporte
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default NGOProjects;