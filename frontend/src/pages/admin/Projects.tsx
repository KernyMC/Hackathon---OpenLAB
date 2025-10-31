import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Label } from "@/components/ui/label";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  X,
  Calendar,
  Building2,
  Clock,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PpxButtonGlobalSimple from "@/components/payment/PpxButtonGlobalSimple";
import { data as pluxBaseData } from "@/configuration/ppx.global-simple";
import { Project, Indicator, Eje } from "@/types/project";
import { projectStore } from "@/lib/projectStore";
import ChatbotFloating from "@/components/ChatbotFloating";

interface FormData {
  name: string;
  description: string;
  duration: string;
  reportingPeriod: string;
  ong: string;
  selectedEjes: string[];
  ejesWithIndicators: Eje[];
}

const AdminProjects = () => {
  const { toast } = useToast();
  const createPluxData = (projectName: string, amountUsd: number) => {
    const copy = { ...(pluxBaseData as any) };
    copy.PayboxBase12 = amountUsd.toFixed(2);
    copy.PayboxDescription = `Aporte administrativo al proyecto: ${projectName}`;
    return copy;
  };
  const handlePaySuccess = (res: any) => {
    toast({ title: "Pago aprobado", description: `Transacción ${res?.id_transaccion || ""}` });
  };
  const handlePayError = (err: any) => {
    toast({ title: "Pago no completado", description: `${err?.message || "Inténtalo nuevamente"}` });
  };
  // Usar el store centralizado
  const [projects, setProjects] = useState<Project[]>(projectStore.getProjects());
  // Flujo: aprobación -> pago -> histórico
  const [pendingApprovals, setPendingApprovals] = useState<Project[]>(projectStore.getProjects());
  const [pendingPayments, setPendingPayments] = useState<Project[]>([]);

  // Sincronizar con el store cuando cambien los proyectos
  useEffect(() => {
    const syncProjects = () => {
      setProjects(projectStore.getProjects());
    };
    // En producción, esto sería un listener/subscription al store
    window.addEventListener('projectsUpdated', syncProjects);
    return () => window.removeEventListener('projectsUpdated', syncProjects);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "pending" | "history">("projects");
  const [historyProjects, setHistoryProjects] = useState<Project[]>([
    {
      id: "paid-100",
      name: "Programa de Salud Comunitaria",
      description: "Proyecto ya cancelado que fortaleció la atención primaria en barrios vulnerables.",
      duration: "12",
      reportingPeriod: "Mensual",
      ong: "Fund Amiga",
      subscriptionDate: "2024-03-10",
      ejes: [
        { name: "Salud", indicators: [ { id: "a1", name: "Consultas realizadas", dataType: "#" } ] },
        { name: "Educación", indicators: [ { id: "a2", name: "Charlas impartidas", dataType: "#" } ] },
      ],
    },
  ]);
  const [payProject, setPayProject] = useState<Project | null>(null);
  const [approvalCheck, setApprovalCheck] = useState<{[projectId: string]: boolean}>({});

  // Aprobar proyecto: pasa de aprobación a pendientes de pago
  const approveProject = (project: Project) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== project.id));
    setPendingPayments(prev => [...prev, project]);
    setViewProject(null);
    setApprovalCheck(prev => ({ ...prev, [project.id]: false }));
    toast({ title: "Proyecto aprobado", description: project.name });
  };

  // Pago desde Pendientes de pago -> pasa a Histórico
  const payPendingProject = (project: Project) => {
    setPayProject(project);
  };

  const finalizePayment = (project: Project) => {
    setPendingPayments(prev => prev.filter(p => p.id !== project.id));
    setHistoryProjects(prev => [...prev, project]);
    setPayProject(null);
    toast({ title: "Pago completado", description: project.name });
  };
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    ong: "",
    eje: "",
    duration: "",
    reportingPeriod: "",
  });

  // Form data
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    duration: "",
    reportingPeriod: "",
    ong: "",
    selectedEjes: [],
    ejesWithIndicators: [],
  });

  // Datos maestros
  const ongs = ["BAQ", "BAA Cuenca", "BA Esmeraldas", "Fund Amiga", "BA Quevedo"];
  const durations = ["6", "12", "18", "24", "36"];
  const reportingPeriods = ["Mensual", "Bimestral", "Trimestral", "Semestral", "Anual"];

  const ejeOptions = [
    { name: "Nutrición", color: "bg-orange-500" },
    { name: "Educación", color: "bg-red-900" },
    { name: "Emprendimiento", color: "bg-amber-500" },
    { name: "Medio Ambiente", color: "bg-green-600" },
    { name: "Equidad de Género", color: "bg-pink-500" },
  ];

  const baseIndicators = [
    "Número de beneficiarios",
    "Recursos distribuidos",
    "Sesiones de capacitación",
    "Tasa de participación comunitaria",
  ];

  const dataTypes = ["#", "%", "Kg", "$", "texto"];

  // Indicadores personalizados por eje
  const [customIndicators, setCustomIndicators] = useState<{[key: string]: {name: string, dataType: string}}>({});
  const [newIndicatorName, setNewIndicatorName] = useState<{[key: string]: string}>({});
  const [newIndicatorDataType, setNewIndicatorDataType] = useState<{[key: string]: string}>({});

  // Filtrado de proyectos
  const getFilteredProjects = () => {
    return pendingApprovals.filter((project) => {
      const matchesSearch =
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.ong.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOng = !filters.ong || project.ong === filters.ong;
      const matchesEje = !filters.eje || project.ejes.some(e => e.name === filters.eje);
      const matchesDuration = !filters.duration || project.duration === filters.duration;
      const matchesPeriod = !filters.reportingPeriod || project.reportingPeriod === filters.reportingPeriod;

      return matchesSearch && matchesOng && matchesEje && matchesDuration && matchesPeriod;
    });
  };

  const filteredProjects = getFilteredProjects();

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  // Limpiar filtro específico
  const clearFilter = (key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: "" });
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setFilters({
      ong: "",
      eje: "",
      duration: "",
      reportingPeriod: "",
    });
  };

  const handleDelete = (id: string) => {
    projectStore.deleteProject(id);
    setProjects(projectStore.getProjects());
    window.dispatchEvent(new Event('projectsUpdated'));
    setDeleteId(null);
    toast({
      title: "Proyecto eliminado",
      description: "El proyecto ha sido eliminado exitosamente.",
    });
  };

  const getEjeColor = (ejeName: string) => {
    const eje = ejeOptions.find(e => e.name === ejeName);
    return eje?.color || "bg-gray-500";
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.description || !formData.duration || !formData.reportingPeriod || !formData.ong) {
        toast({
          title: "Campos incompletos",
          description: "Por favor complete todos los campos del paso 1.",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 2) {
      if (formData.selectedEjes.length === 0) {
        toast({
          title: "Seleccione al menos un eje",
          description: "Debe seleccionar al menos un eje para continuar.",
          variant: "destructive",
        });
        return;
      }
      // Inicializar ejes con indicadores vacíos
      const ejesWithIndicators = formData.selectedEjes.map(ejeName => ({
        name: ejeName,
        indicators: []
      }));
      setFormData({ ...formData, ejesWithIndicators });
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const toggleEje = (ejeName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedEjes: prev.selectedEjes.includes(ejeName)
        ? prev.selectedEjes.filter(e => e !== ejeName)
        : [...prev.selectedEjes, ejeName]
    }));
  };

  const toggleIndicator = (ejeName: string, indicatorName: string) => {
    setFormData(prev => {
      const ejesWithIndicators = [...prev.ejesWithIndicators];
      const ejeIndex = ejesWithIndicators.findIndex(e => e.name === ejeName);

      if (ejeIndex !== -1) {
        const indicators = ejesWithIndicators[ejeIndex].indicators;
        const indicatorExists = indicators.some(i => i.name === indicatorName);

        if (indicatorExists) {
          ejesWithIndicators[ejeIndex].indicators = indicators.filter(i => i.name !== indicatorName);
        } else {
          ejesWithIndicators[ejeIndex].indicators.push({
            id: Date.now().toString(),
            name: indicatorName,
            dataType: "#"
          });
        }
      }

      return { ...prev, ejesWithIndicators };
    });
  };

  const addCustomIndicator = (ejeName: string) => {
    const indicatorName = newIndicatorName[ejeName];
    const dataType = newIndicatorDataType[ejeName];

    if (!indicatorName || !dataType) {
      toast({
        title: "Campos incompletos",
        description: "Complete el nombre y tipo de dato del indicador.",
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => {
      const ejesWithIndicators = [...prev.ejesWithIndicators];
      const ejeIndex = ejesWithIndicators.findIndex(e => e.name === ejeName);

      if (ejeIndex !== -1) {
        ejesWithIndicators[ejeIndex].indicators.push({
          id: Date.now().toString(),
          name: indicatorName,
          dataType: dataType,
          isCustom: true
        });
      }

      return { ...prev, ejesWithIndicators };
    });

    setNewIndicatorName(prev => ({ ...prev, [ejeName]: "" }));
    setNewIndicatorDataType(prev => ({ ...prev, [ejeName]: "" }));

    toast({
      title: "Indicador agregado",
      description: "El indicador personalizado ha sido agregado.",
    });
  };

  const removeIndicator = (ejeName: string, indicatorId: string) => {
    setFormData(prev => {
      const ejesWithIndicators = [...prev.ejesWithIndicators];
      const ejeIndex = ejesWithIndicators.findIndex(e => e.name === ejeName);

      if (ejeIndex !== -1) {
        ejesWithIndicators[ejeIndex].indicators = ejesWithIndicators[ejeIndex].indicators.filter(
          i => i.id !== indicatorId
        );
      }

      return { ...prev, ejesWithIndicators };
    });
  };

  const handleCreate = () => {
    // Validar que todos los ejes tengan al menos un indicador
    const ejesWithoutIndicators = formData.ejesWithIndicators.filter(e => e.indicators.length === 0);

    if (ejesWithoutIndicators.length > 0) {
      toast({
        title: "Faltan indicadores",
        description: `Los siguientes ejes no tienen indicadores: ${ejesWithoutIndicators.map(e => e.name).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      duration: formData.duration,
      reportingPeriod: formData.reportingPeriod,
      ong: formData.ong,
      subscriptionDate: new Date().toISOString().split("T")[0],
      ejes: formData.ejesWithIndicators,
      // El flujo de aprobación ya no depende del progreso
    };

    projectStore.addProject(newProject);
    setProjects(projectStore.getProjects());
    window.dispatchEvent(new Event('projectsUpdated'));
    setIsCreateOpen(false);
    resetForm();

    toast({
      title: "Proyecto creado",
      description: "El proyecto ha sido creado exitosamente.",
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: "",
      reportingPeriod: "",
      ong: "",
      selectedEjes: [],
      ejesWithIndicators: [],
    });
    setCurrentStep(1);
    setNewIndicatorName({});
    setNewIndicatorDataType({});
  };

  return (
    <PageLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Proyectos</h1>
            <p className="text-muted-foreground mt-1">
              Gestione todos los proyectos de las organizaciones ONGs
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Sticky Header */}
              <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
                <DialogTitle className="flex items-center justify-between">
                  <span>Crear Nuevo Proyecto</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Paso {currentStep} de 3</span>
                  </div>
                </DialogTitle>
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-2 flex-1 rounded-full ${
                        step <= currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </DialogHeader>

              <div className="py-6">
                {/* Paso 1: Datos Básicos */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="sticky top-20 bg-background z-10 pb-2 border-b mb-4">
                      <h3 className="text-lg font-semibold">Datos Básicos del Proyecto</h3>
                    </div>

                <div>
                  <Label htmlFor="projectName">
                    Nombre del Proyecto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ingrese el nombre del proyecto"
                  />
                </div>

                    <div>
                      <Label htmlFor="description">
                        Descripción <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describa el proyecto"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">
                          Duración (meses) <span className="text-destructive">*</span>
                  </Label>
                        <Select
                    value={formData.duration}
                          onValueChange={(value) => setFormData({ ...formData, duration: value })}
                        >
                          <SelectTrigger id="duration">
                            <SelectValue placeholder="Seleccione duración" />
                          </SelectTrigger>
                          <SelectContent>
                            {durations.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d} meses
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                </div>

                <div>
                        <Label htmlFor="reportingPeriod">
                          Período de Reporte <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.reportingPeriod}
                          onValueChange={(value) => setFormData({ ...formData, reportingPeriod: value })}
                        >
                          <SelectTrigger id="reportingPeriod">
                            <SelectValue placeholder="Seleccione período" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportingPeriods.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="ong">
                        ONG <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.ong}
                        onValueChange={(value) => setFormData({ ...formData, ong: value })}
                      >
                        <SelectTrigger id="ong">
                          <SelectValue placeholder="Seleccione ONG" />
                        </SelectTrigger>
                        <SelectContent>
                          {ongs.map((ong) => (
                            <SelectItem key={ong} value={ong}>
                              {ong}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Paso 2: Selección de Ejes */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="sticky top-20 bg-background z-10 pb-2 border-b mb-4">
                      <h3 className="text-lg font-semibold">Seleccione los Ejes del Proyecto</h3>
                      <p className="text-sm text-muted-foreground">Seleccione al menos un eje</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {ejeOptions.map((eje) => (
                        <div
                          key={eje.name}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            formData.selectedEjes.includes(eje.name)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => toggleEje(eje.name)}
                        >
                          <div className="flex items-center gap-3">
                      <Checkbox
                              checked={formData.selectedEjes.includes(eje.name)}
                              onCheckedChange={() => toggleEje(eje.name)}
                            />
                            <div className={`w-4 h-4 rounded-full ${eje.color}`} />
                            <span className="font-medium">{eje.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paso 3: Asignación de Indicadores */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="sticky top-20 bg-background z-10 pb-2 border-b mb-4">
                      <h3 className="text-lg font-semibold">Asigne Indicadores a cada Eje</h3>
                      <p className="text-sm text-muted-foreground">Cada eje debe tener al menos un indicador</p>
                    </div>

                    {formData.ejesWithIndicators.map((eje) => {
                      const ejeColor = getEjeColor(eje.name);

                      return (
                        <div key={eje.name} className="border rounded-lg p-4">
                          {/* Sticky header del eje */}
                          <div className="sticky top-32 bg-background z-10 pb-3 border-b mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full ${ejeColor}`} />
                              <h4 className="font-semibold">{eje.name}</h4>
                              <Badge variant="secondary">
                                {eje.indicators.length} indicadores
                              </Badge>
                  </div>
                </div>

                          {/* Indicadores base */}
                          <div className="space-y-3 mb-4">
                            <Label>Indicadores Base</Label>
                            {baseIndicators.map((indicator) => {
                              const isSelected = eje.indicators.some(i => i.name === indicator);
                              return (
                                <div key={indicator} className="flex items-center gap-2">
                        <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => toggleIndicator(eje.name, indicator)}
                        />
                                  <Label className="font-normal cursor-pointer">
                          {indicator}
                        </Label>
                      </div>
                              );
                            })}
                          </div>

                          {/* Indicadores personalizados agregados */}
                          {eje.indicators.filter(i => i.isCustom).length > 0 && (
                            <div className="space-y-3 mb-4">
                              <Label>Indicadores Personalizados</Label>
                              {eje.indicators.filter(i => i.isCustom).map((indicator) => (
                                <div key={indicator.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                                  <span className="flex-1">{indicator.name}</span>
                                  <Badge variant="outline">{indicator.dataType}</Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => removeIndicator(eje.name, indicator.id)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Agregar indicador personalizado */}
                          <div className="space-y-3 border-t pt-4">
                            <Label>Agregar Indicador Personalizado</Label>
                            <div className="flex gap-2">
                        <Input
                                placeholder="Nombre del indicador"
                                value={newIndicatorName[eje.name] || ""}
                          onChange={(e) =>
                                  setNewIndicatorName({ ...newIndicatorName, [eje.name]: e.target.value })
                                }
                              />
                              <Select
                                value={newIndicatorDataType[eje.name] || ""}
                                onValueChange={(value) =>
                                  setNewIndicatorDataType({ ...newIndicatorDataType, [eje.name]: value })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dataTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                onClick={() => addCustomIndicator(eje.name)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                    </div>
                  </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                </div>

              {/* Sticky Footer */}
              <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>

                  {currentStep < 3 ? (
                    <Button onClick={handleNextStep}>
                      Siguiente
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleCreate}>
                      Crear Proyecto
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="projects">Pendientes de aprobación</TabsTrigger>
            <TabsTrigger value="pending">Pendientes de pago</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
        {/* Búsqueda y Filtros */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
        </div>

          {/* Panel de Filtros */}
          {showFilters && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                    >
                      Limpiar todos
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>ONG</Label>
                    <Select value={filters.ong} onValueChange={(value) => setFilters({ ...filters, ong: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        {ongs.map((ong) => (
                          <SelectItem key={ong} value={ong}>
                            {ong}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Eje</Label>
                    <Select value={filters.eje} onValueChange={(value) => setFilters({ ...filters, eje: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        {ejeOptions.map((eje) => (
                          <SelectItem key={eje.name} value={eje.name}>
                            {eje.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Duración</Label>
                    <Select value={filters.duration} onValueChange={(value) => setFilters({ ...filters, duration: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d} meses
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Período de Reporte</Label>
                    <Select value={filters.reportingPeriod} onValueChange={(value) => setFilters({ ...filters, reportingPeriod: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportingPeriods.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags de Filtros Activos */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.ong && (
                <Badge variant="secondary" className="gap-1">
                  ONG: {filters.ong}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => clearFilter("ong")}
                  />
                </Badge>
              )}
              {filters.eje && (
                <Badge variant="secondary" className="gap-1">
                  Eje: {filters.eje}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => clearFilter("eje")}
                  />
                </Badge>
              )}
              {filters.duration && (
                <Badge variant="secondary" className="gap-1">
                  Duración: {filters.duration} meses
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => clearFilter("duration")}
                  />
                </Badge>
              )}
              {filters.reportingPeriod && (
                <Badge variant="secondary" className="gap-1">
                  Período: {filters.reportingPeriod}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => clearFilter("reportingPeriod")}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Contador de Resultados */}
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredProjects.length} de {projects.length} proyectos
          </div>
        </div>

        {/* Tabla de Proyectos */}
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Proyecto</TableHead>
                <TableHead>ONG</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Fecha de Suscripción</TableHead>
                <TableHead>Período de Reporte</TableHead>
                <TableHead>Ejes</TableHead>
                {/* Sin progreso */}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.ong}</TableCell>
                  <TableCell>{project.duration} meses</TableCell>
                  <TableCell>{project.subscriptionDate}</TableCell>
                  <TableCell>{project.reportingPeriod}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {project.ejes.map((eje) => {
                        const color = getEjeColor(eje.name);
                        const truncated = eje.name.length > 16 ? eje.name.slice(0, 13) + '…' : eje.name;
                        return (
                          <Tooltip key={eje.name}>
                            <TooltipTrigger asChild>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color} text-white max-w-[90px] truncate cursor-default`}
                                title={eje.name}
                              >
                                {truncated}
                              </span>
                            </TooltipTrigger>
                            {eje.name.length > 16 && (
                              <TooltipContent>{eje.name}</TooltipContent>
                            )}
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TableCell>
                  {/* Sin progreso */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100" onClick={() => setViewProject(project)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-red-100" onClick={() => setDeleteId(project.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                      {/* Aprobar (deshabilitado hasta confirmar en modal) */}
                      <Button className="border" disabled={!approvalCheck[project.id]} onClick={() => approveProject(project)}>Aprobar</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="border rounded-lg bg-card p-12 text-center" hidden={pendingApprovals.length !== 0}>
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay pendientes</h3>
              <p className="text-muted-foreground">Aquí aparecerán los proyectos enviados para aprobación.</p>
      </div>
            {pendingApprovals.length > 0 && (
              <div className="border rounded-lg bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proyecto</TableHead>
                      <TableHead>ONG</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.ong}</TableCell>
                        <TableCell>{p.subscriptionDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setViewProject(p)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button className="bg-red-900 hover:bg-red-950 text-white" onClick={() => payPendingProject(p)}>Pagar</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="border rounded-lg bg-card p-12 text-center" hidden={historyProjects.length !== 0}>
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin histórico</h3>
              <p className="text-muted-foreground">Aquí verás proyectos finalizados o archivados.</p>
            </div>
            {historyProjects.length > 0 && (
              <div className="border rounded-lg bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proyecto</TableHead>
                      <TableHead>ONG</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyProjects.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.ong}</TableCell>
                        <TableCell>{p.duration} meses</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Pagado</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setViewProject(p)}>
                            <Eye className="w-4 h-4" />
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

      {/* Modal Ver/Aprobar Proyecto */}
      <Dialog open={!!viewProject} onOpenChange={() => setViewProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {viewProject && (
            <>
              {/* Sticky Header */}
              <DialogHeader className="sticky top-0 z-10 p-0">
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-5 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-2xl text-white">{viewProject.name}</DialogTitle>
                      <p className="text-white/80 text-sm max-w-2xl mt-1">{viewProject.description}</p>
                    </div>
                    <Badge className={activeTab === "projects" ? "bg-amber-500" : activeTab === "pending" ? "bg-cyan-600" : "bg-emerald-600"}>
                      {activeTab === "projects" ? "Pendiente de aprobación" : activeTab === "pending" ? "Pendiente de pago" : "Pagado"}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-6">
                {/* Tarjetas de Información */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <CardTitle className="text-sm">ONG</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold tracking-tight">{viewProject.ong}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <CardTitle className="text-sm">Duración</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{viewProject.duration} meses</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <CardTitle className="text-sm">Período de Reporte</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{viewProject.reportingPeriod}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <CardTitle className="text-sm">Fecha de Suscripción</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{viewProject.subscriptionDate}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Ejes e Indicadores */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ejes e Indicadores</h3>
                  {viewProject.ejes.map((eje) => (
                    <Card key={eje.name}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getEjeColor(eje.name)}`} />
                          <CardTitle>{eje.name}</CardTitle>
                          <Badge variant="secondary">
                            {eje.indicators.length} indicadores
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {eje.indicators.map((indicator) => (
                            <div
                              key={indicator.id}
                              className="flex items-center justify-between p-2 rounded bg-muted"
                            >
                              <span>{indicator.name}</span>
                              <Badge variant="outline">{indicator.dataType}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Resumen Estadístico */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen Estadístico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-3xl font-bold">{viewProject.ejes.length}</p>
                        <p className="text-sm text-muted-foreground">Ejes</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold">
                          {viewProject.ejes.reduce((sum, eje) => sum + eje.indicators.length, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Indicadores</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{viewProject.duration}</p>
                        <p className="text-sm text-muted-foreground">Meses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Footer condicional: en aprobación muestra checkbox+aprobar; en pago solo cerrar */}
              {activeTab === "projects" ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <Checkbox
                      checked={!!approvalCheck[viewProject.id]}
                      onCheckedChange={(v) => setApprovalCheck(prev => ({ ...prev, [viewProject.id]: !!v }))}
                    />
                    <span className="text-sm text-muted-foreground">
                      Confirmo que toda la información es correcta
                    </span>
                  </div>
                  <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
                    <Button variant="outline" className="border-red-950 text-red-950 hover:bg-red-950/10" onClick={() => setViewProject(null)}>Cerrar</Button>
                    <Button onClick={() => approveProject(viewProject)} disabled={!approvalCheck[viewProject.id]} className="bg-red-950 hover:bg-red-900 text-white disabled:opacity-50">Aprobar</Button>
                  </DialogFooter>
                </>
              ) : (
                <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
                  <Button variant="outline" className="border-red-950 text-red-950 hover:bg-red-950/10" onClick={() => setViewProject(null)}>Cerrar</Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Pago desde Pendientes */}
      <Dialog open={!!payProject} onOpenChange={() => setPayProject(null)}>
        <DialogContent className="max-w-md md:max-w-lg h-[90vh] overflow-y-auto p-0">
          {payProject && (
            <div>
              <div className="bg-gradient-to-r from-red-900 to-red-950 text-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{payProject.name}</h3>
                    <p className="text-white/80 text-sm">ONG: {payProject.ong}</p>
                  </div>
                    <div className="text-right text-white/90">
                    <div className="text-sm">Duración: <span className="font-semibold">{payProject.duration} meses</span></div>
                    <div className="text-sm">Reporte: <span className="font-semibold">{payProject.reportingPeriod}</span></div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Monto (USD)</Label>
                  <Input defaultValue="5.00" type="number" min="1" step="0.01" className="focus-visible:ring-red-950/30" />
                </div>
                <div className="bg-white border rounded-lg p-4 text-center">
                  <div className="text-sm text-red-950 mb-2">Método: Plux Paybox (Sandbox)</div>
                  <PpxButtonGlobalSimple
                    data={createPluxData(payProject.name, 5)}
                    onSuccess={() => finalizePayment(payProject)}
                    onError={handlePayError}
                  />
                  <div className="text-[11px] text-muted-foreground mt-3">Tarjetas de prueba: VISA 4540639936908783 · CVV 123</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Dialog para Eliminar */}
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

      <ChatbotFloating />
    </PageLayout>
  );
};

export default AdminProjects;