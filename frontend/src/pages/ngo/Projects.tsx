import { useState, useMemo } from "react";
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

interface Project {
  id: string;
  name: string;
  duration: string;
  subscriptionDate: string;
  reportingPeriod: string;
  manager: string;
  email: string;
  eje: string;
}

interface ReportIndicator {
  name: string;
  value: string;
  isCustom: boolean;
}

interface CalculatedField {
  name: string;
  value: string;
}

interface Report {
  id: string;
  projectId: string;
  projectName: string;
  month: string;
  year: number;
  eje: string;
  indicators: ReportIndicator[];
  calculatedFields?: CalculatedField[];
  createdAt: string;
  createdBy: string;
  ongName: string;
}

const NGOProjects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Iniciativa de Huertos Comunitarios",
      duration: "12 meses",
      subscriptionDate: "2024-01-15",
      reportingPeriod: "Mensual",
      manager: "María García",
      email: "maria@example.com",
      eje: "Medio Ambiente",
    },
    {
      id: "2",
      name: "Programa de Educación Juvenil",
      duration: "18 meses",
      subscriptionDate: "2024-02-20",
      reportingPeriod: "Trimestral",
      manager: "Juan Pérez",
      email: "juan@example.com",
      eje: "Educación",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEje, setSelectedEje] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Estado para reportes históricos
  const [reports, setReports] = useState<Report[]>([]);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<"projects" | "history">("projects");

  // Estado para almacenar el mes seleccionado por cada proyecto
  const [projectMonths, setProjectMonths] = useState<Record<string, string>>({});

  // Datos simulados de la ONG actual (vendrían de autenticación/base de datos)
  const currentNGO = {
    name: "BAQ",
    responsable: "Carlos Rodríguez",
  };

  // Meses del año
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Estado para indicadores seleccionados y sus valores
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [indicatorValues, setIndicatorValues] = useState<Record<string, string>>({});
  const [customIndicators, setCustomIndicators] = useState<string[]>([]);
  const [newIndicatorName, setNewIndicatorName] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funciones helper para reportes
  const currentYear = new Date().getFullYear();

  const hasReportForMonth = (projectId: string, month: string): boolean => {
    return reports.some(r =>
      r.projectId === projectId &&
      r.month === month &&
      r.year === currentYear
    );
  };

  const findReport = (projectId: string, month: string): Report | undefined => {
    return reports.find(r =>
      r.projectId === projectId &&
      r.month === month &&
      r.year === currentYear
    );
  };

  const getProjectReports = (projectId: string): Report[] => {
    return reports.filter(r => r.projectId === projectId);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    setDeleteId(null);
    toast({
      title: "Proyecto eliminado",
      description: "El proyecto ha sido eliminado exitosamente.",
    });
  };

  const handleOpenReportDialog = (project: Project) => {
    const month = projectMonths[project.id];

    if (!month) {
      toast({
        title: "Mes no seleccionado",
        description: "Por favor seleccione un mes antes de reportar.",
        variant: "destructive",
      });
      return;
    }

    setSelectedProject(project);
    setSelectedMonth(month);
    setSelectedEje(project.eje.toLowerCase());
    setIsCreateOpen(true);
  };

  const handleSubmitReport = () => {
    if (!selectedProject) {
      toast({
        title: "Proyecto no seleccionado",
        description: "Por favor seleccione un proyecto.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedEje) {
      toast({
        title: "Eje no seleccionado",
        description: "Por favor seleccione un eje.",
        variant: "destructive",
      });
      return;
    }

    if (selectedIndicators.length === 0) {
      toast({
        title: "Sin indicadores",
        description: "Por favor seleccione al menos un indicador.",
        variant: "destructive",
      });
      return;
    }

    // Crear reporte
    const reportIndicators: ReportIndicator[] = selectedIndicators.map(indicator => ({
      name: indicator,
      value: indicatorValues[indicator] || "0",
      isCustom: customIndicators.includes(indicator),
    }));

    const calculatedFields: CalculatedField[] = [];
    if (selectedEje === "nutrition" && foodRecoveryPercentage) {
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
    };

    setReports([...reports, newReport]);

    // Aquí se enviarían los datos al backend
    console.log("Reporte guardado:", newReport);

    setIsCreateOpen(false);
    setSelectedProject(null);
    setSelectedMonth("");
    setSelectedEje("");
    setSelectedIndicators([]);
    setIndicatorValues({});
    setCustomIndicators([]);
    setNewIndicatorName("");
    setIsViewMode(false);

    toast({
      title: "Reporte enviado",
      description: `El reporte de ${selectedMonth} ha sido guardado exitosamente.`,
    });
  };

  const handleMonthChange = (projectId: string, month: string) => {
    setProjectMonths(prev => ({ ...prev, [projectId]: month }));
  };

  const handleViewReport = (report: Report) => {
    const project = projects.find(p => p.id === report.projectId);
    if (!project) return;

    setSelectedProject(project);
    setSelectedMonth(report.month);
    setSelectedEje(report.eje);
    setSelectedReport(report);
    setIsViewMode(true);

    // Cargar indicadores del reporte
    setSelectedIndicators(report.indicators.map(i => i.name));
    const values: Record<string, string> = {};
    report.indicators.forEach(i => {
      values[i.name] = i.value;
    });
    setIndicatorValues(values);

    // Cargar indicadores custom
    const customInds = report.indicators.filter(i => i.isCustom).map(i => i.name);
    setCustomIndicators(customInds);

    setIsCreateOpen(true);
  };

  const handleMonthBadgeClick = (project: Project, month: string) => {
    const report = findReport(project.id, month);

    if (report) {
      // Ya existe reporte - abrir en modo vista
      handleViewReport(report);
    } else {
      // No existe reporte - abrir para crear
      setSelectedProject(project);
      setSelectedMonth(month);
      setSelectedEje(project.eje.toLowerCase());
      setIsViewMode(false);
      setIsCreateOpen(true);
    }
  };

  // Función para agregar indicadores personalizados
  const handleAddCustomIndicator = () => {
    if (newIndicatorName.trim()) {
      setCustomIndicators([...customIndicators, newIndicatorName.trim()]);
      setNewIndicatorName("");
      toast({
        title: "Indicador agregado",
        description: "El indicador personalizado ha sido agregado exitosamente.",
      });
    }
  };

  // Función para eliminar indicadores personalizados
  const handleRemoveCustomIndicator = (indicator: string) => {
    setCustomIndicators(customIndicators.filter(i => i !== indicator));
    setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
    const newValues = { ...indicatorValues };
    delete newValues[indicator];
    setIndicatorValues(newValues);
  };

  // Función para alternar selección de indicador
  const toggleIndicator = (indicator: string) => {
    setSelectedIndicators(prev =>
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  // Función para actualizar valor de indicador
  const updateIndicatorValue = (indicator: string, value: string) => {
    setIndicatorValues(prev => ({ ...prev, [indicator]: value }));
  };

  // Definir indicadores predeterminados por eje (en producción vendrían del admin/BD)
  const indicatorsByEje: Record<string, string[]> = {
    nutrition: [
      "Alimentos aptos para consumo (Kg)",
      "Alimentos de consumo inmediato (Kg)",
      "Producción (Kg)",
      "Total de kilos recibidos en el mes",
      "Instituciones beneficiadas (#)",
      "Personas alimentadas mensualmente (#)",
      "Personas que laboran en la fundación (#)",
    ],
    education: [
      "Número de estudiantes",
      "Número de profesores",
      "Número de aulas",
      "Materiales educativos distribuidos",
    ],
    entrepreneurship: [
      "Negocios apoyados",
      "Empleos creados",
      "Sesiones de capacitación realizadas",
      "Ingresos generados ($)",
    ],
    environment: [
      "Árboles plantados",
      "Residuos recolectados (Kg)",
      "Área restaurada (m²)",
      "Número de voluntarios",
    ],
    gender: [
      "Mujeres apoyadas",
      "Talleres realizados",
      "Campañas de concientización",
      "Total de participantes",
    ],
  };

  // Cálculo automático de recuperación de alimentos (solo para Nutrición)
  const foodRecoveryPercentage = useMemo(() => {
    if (selectedEje !== "nutrition") return null;

    const a = parseFloat(indicatorValues["Alimentos aptos para consumo (Kg)"] || "0");
    const b = parseFloat(indicatorValues["Alimentos de consumo inmediato (Kg)"] || "0");
    const c = parseFloat(indicatorValues["Producción (Kg)"] || "0");
    const d = parseFloat(indicatorValues["Total de kilos recibidos en el mes"] || "0");

    if (d === 0) return "0.00";

    const percentage = ((a + b + c) / d) * 100;
    return percentage.toFixed(2);
  }, [selectedEje, indicatorValues]);

  const renderIndicators = () => {
    if (!selectedEje) return null;

    const predefinedIndicators = indicatorsByEje[selectedEje] || [];
    const allIndicators = [...predefinedIndicators, ...customIndicators];

    return (
      <div className="space-y-6">
        {/* Sección de selección de indicadores */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <Label className="text-base font-semibold mb-3 block">
            Seleccionar Indicadores (puede seleccionar múltiples)
          </Label>
          <div className="space-y-3">
            {predefinedIndicators.map((indicator) => (
              <div key={indicator} className="flex items-center space-x-2">
                <Checkbox
                  id={`indicator-${indicator}`}
                  checked={selectedIndicators.includes(indicator)}
                  onCheckedChange={() => toggleIndicator(indicator)}
                  disabled={isViewMode}
                />
                <Label
                  htmlFor={`indicator-${indicator}`}
                  className="font-normal cursor-pointer flex-1"
                >
                  {indicator}
                </Label>
              </div>
            ))}

            {/* Indicadores personalizados */}
            {customIndicators.map((indicator) => (
              <div key={indicator} className="flex items-center space-x-2 bg-primary/5 p-2 rounded">
                <Checkbox
                  id={`indicator-${indicator}`}
                  checked={selectedIndicators.includes(indicator)}
                  onCheckedChange={() => toggleIndicator(indicator)}
                  disabled={isViewMode}
                />
                <Label
                  htmlFor={`indicator-${indicator}`}
                  className="font-normal cursor-pointer flex-1"
                >
                  {indicator} <span className="text-xs text-muted-foreground">(personalizado)</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveCustomIndicator(indicator)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Agregar indicador personalizado */}
            {!isViewMode && (
              <div className="flex gap-2 pt-2 border-t">
                <Input
                  placeholder="Agregar indicador personalizado..."
                  value={newIndicatorName}
                  onChange={(e) => setNewIndicatorName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomIndicator();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomIndicator}
                  disabled={!newIndicatorName.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Campos para ingresar valores de indicadores seleccionados */}
        {selectedIndicators.length > 0 && (
          <div className="border rounded-lg p-4">
            <Label className="text-base font-semibold mb-3 block">
              Valores de Indicadores
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {selectedIndicators.map((indicator) => (
                <div key={indicator}>
                  <Label htmlFor={`value-${indicator}`} className="text-sm">
                    {indicator}
                  </Label>
                  <Input
                    id={`value-${indicator}`}
                    type="number"
                    placeholder="0"
                    value={indicatorValues[indicator] || ""}
                    onChange={(e) => updateIndicatorValue(indicator, e.target.value)}
                    disabled={isViewMode}
                    className={isViewMode ? "bg-muted" : ""}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campo calculado automático para Nutrición */}
        {selectedEje === "nutrition" && foodRecoveryPercentage !== null && (
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

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "projects" | "history")}>
          <TabsList>
            <TabsTrigger value="projects" className="gap-2">
              <Calendar className="w-4 h-4" />
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <FileText className="w-4 h-4" />
              Histórico ({reports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
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
                    value={selectedProject?.eje || ""}
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
                      <Button onClick={handleSubmitReport} className="flex-1">
                        Enviar Reporte
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreateOpen(false);
                          setSelectedEje("");
                          setSelectedIndicators([]);
                          setIndicatorValues({});
                          setCustomIndicators([]);
                          setNewIndicatorName("");
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
                        setSelectedIndicators([]);
                        setIndicatorValues({});
                        setCustomIndicators([]);
                        setNewIndicatorName("");
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
                    <TableHead>Nombre del Proyecto</TableHead>
                    <TableHead>Eje</TableHead>
                    <TableHead>Gerente</TableHead>
                    <TableHead className="w-[500px]">Meses (Click para reportar/ver)</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.eje}</Badge>
                      </TableCell>
                      <TableCell>{project.manager}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {months.map((month) => {
                            const hasReport = hasReportForMonth(project.id, month);
                            return (
                              <Button
                                key={month}
                                size="sm"
                                variant={hasReport ? "default" : "outline"}
                                className={cn(
                                  "h-7 px-2 text-xs",
                                  hasReport && "bg-green-600 hover:bg-green-700 text-white"
                                )}
                                onClick={() => handleMonthBadgeClick(project, month)}
                              >
                                {month.substring(0, 3)}
                                {hasReport && " ✓"}
                              </Button>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(project.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {reports.length === 0 ? (
              <div className="border rounded-lg bg-card p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay reportes</h3>
                <p className="text-muted-foreground">
                  Los reportes que envíes aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="border rounded-lg bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proyecto</TableHead>
                      <TableHead>Mes/Año</TableHead>
                      <TableHead>Eje</TableHead>
                      <TableHead>Indicadores</TableHead>
                      <TableHead>Fecha de Envío</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.projectName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {report.month} {report.year}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.eje}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {report.indicators.length} indicador{report.indicators.length !== 1 && "es"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(report.createdAt).toLocaleDateString("es-EC", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(report)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de que desea eliminar este proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto
              y eliminará los datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default NGOProjects;