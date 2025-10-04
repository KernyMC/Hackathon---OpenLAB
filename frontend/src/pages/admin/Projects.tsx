import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  duration: string;
  subscriptionDate: string;
  reportingPeriod: string;
  manager: string;
  email: string;
}

const AdminProjects = () => {
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
    },
    {
      id: "2",
      name: "Programa de Educación Juvenil",
      duration: "18 meses",
      subscriptionDate: "2024-02-20",
      reportingPeriod: "Trimestral",
      manager: "Juan Pérez",
      email: "juan@example.com",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    focusAreas: [] as string[],
    indicators: [] as string[],
    otherFocusArea: "",
    otherIndicator: "",
  });

  const focusAreaOptions = [
    "Medio Ambiente",
    "Nutrición",
    "Educación",
    "Emprendimiento",
    "Equidad de Género",
  ];

  const indicatorOptions = [
    "Número de beneficiarios",
    "Recursos distribuidos",
    "Sesiones de capacitación",
    "Tasa de participación comunitaria",
  ];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    setDeleteId(null);
    toast({
      title: "Proyecto eliminado",
      description: "El proyecto ha sido eliminado exitosamente.",
    });
  };

  const toggleFocusArea = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }));
  };

  const toggleIndicator = (indicator: string) => {
    setFormData((prev) => ({
      ...prev,
      indicators: prev.indicators.includes(indicator)
        ? prev.indicators.filter((i) => i !== indicator)
        : [...prev.indicators, indicator],
    }));
  };

  const handleCreate = () => {
    if (!formData.name || !formData.duration) {
      toast({
        title: "Campos faltantes",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name,
      duration: formData.duration,
      subscriptionDate: new Date().toISOString().split("T")[0],
      reportingPeriod: "Mensual",
      manager: "Admin",
      email: "admin@example.com",
    };

    setProjects([...projects, newProject]);
    setIsCreateOpen(false);
    setFormData({
      name: "",
      duration: "",
      focusAreas: [],
      indicators: [],
      otherFocusArea: "",
      otherIndicator: "",
    });
    
    toast({
      title: "Proyecto creado",
      description: "El proyecto ha sido agregado exitosamente.",
    });
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
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
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
                  <Label htmlFor="duration">
                    Duración del Proyecto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="ej., 12 meses"
                  />
                </div>

                <div>
                  <Label>Áreas de Enfoque Cubiertas</Label>
                  <div className="space-y-3 mt-2">
                    {focusAreaOptions.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={`focus-${area}`}
                          checked={formData.focusAreas.includes(area)}
                          onCheckedChange={() => toggleFocusArea(area)}
                        />
                        <Label htmlFor={`focus-${area}`} className="font-normal cursor-pointer">
                          {area}
                        </Label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="focus-other"
                        checked={!!formData.otherFocusArea}
                        onCheckedChange={(checked) => {
                          if (!checked) setFormData({ ...formData, otherFocusArea: "" });
                        }}
                      />
                      <Label htmlFor="focus-other" className="font-normal">
                        Otro
                      </Label>
                      {formData.otherFocusArea !== undefined && (
                        <Input
                          placeholder="Especifique otra área de enfoque"
                          value={formData.otherFocusArea}
                          onChange={(e) =>
                            setFormData({ ...formData, otherFocusArea: e.target.value })
                          }
                          className="ml-2"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Indicadores</Label>
                  <div className="space-y-3 mt-2">
                    {indicatorOptions.map((indicator) => (
                      <div key={indicator} className="flex items-center space-x-2">
                        <Checkbox
                          id={`indicator-${indicator}`}
                          checked={formData.indicators.includes(indicator)}
                          onCheckedChange={() => toggleIndicator(indicator)}
                        />
                        <Label
                          htmlFor={`indicator-${indicator}`}
                          className="font-normal cursor-pointer"
                        >
                          {indicator}
                        </Label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="indicator-other"
                        checked={!!formData.otherIndicator}
                        onCheckedChange={(checked) => {
                          if (!checked) setFormData({ ...formData, otherIndicator: "" });
                        }}
                      />
                      <Label htmlFor="indicator-other" className="font-normal">
                        Otro
                      </Label>
                      {formData.otherIndicator !== undefined && (
                        <Input
                          placeholder="Especifique otro indicador"
                          value={formData.otherIndicator}
                          onChange={(e) =>
                            setFormData({ ...formData, otherIndicator: e.target.value })
                          }
                          className="ml-2"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreate} className="flex-1">
                    Guardar Proyecto
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setFormData({
                        name: "",
                        duration: "",
                        focusAreas: [],
                        indicators: [],
                        otherFocusArea: "",
                        otherIndicator: "",
                      });
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Proyecto</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Fecha de Suscripción</TableHead>
                <TableHead>Período de Reporte</TableHead>
                <TableHead>Gerente del Proyecto</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.duration}</TableCell>
                  <TableCell>{project.subscriptionDate}</TableCell>
                  <TableCell>{project.reportingPeriod}</TableCell>
                  <TableCell>{project.manager}</TableCell>
                  <TableCell>{project.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
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

export default AdminProjects;
