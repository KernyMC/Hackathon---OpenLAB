import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Plus, Eye, Pencil, Trash2, Search, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  duration: string;
  subscriptionDate: string;
  reportingPeriod: string;
  manager: string;
  email: string;
  focusArea: string;
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
      focusArea: "Medio Ambiente",
    },
    {
      id: "2",
      name: "Programa de Educación Juvenil",
      duration: "18 meses",
      subscriptionDate: "2024-02-20",
      reportingPeriod: "Trimestral",
      manager: "Juan Pérez",
      email: "juan@example.com",
      focusArea: "Educación",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [focusArea, setFocusArea] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    focusArea: "",
  });

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

  const handleCreate = () => {
    if (!formData.name || !formData.manager || !formData.focusArea) {
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
      duration: "12 meses",
      subscriptionDate: new Date().toISOString().split("T")[0],
      reportingPeriod: "Mensual",
      manager: formData.manager,
      email: "email@example.com",
      focusArea: formData.focusArea,
    };

    setProjects([...projects, newProject]);
    setIsCreateOpen(false);
    setFormData({ name: "", manager: "", focusArea: "" });
    setFocusArea("");
    setSelectedMonth("");
    
    toast({
      title: "Proyecto creado",
      description: "El proyecto ha sido agregado exitosamente.",
    });
  };

  const renderIndicators = () => {
    if (!focusArea) return null;

    switch (focusArea) {
      case "nutrition":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="foodConsumption">Alimentos aptos para consumo (Kg)</Label>
                <Input id="foodConsumption" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="immediateFood">Alimentos para consumo inmediato (Kg)</Label>
                <Input id="immediateFood" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="production">Producción (Kg)</Label>
                <Input id="production" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="totalReceived">Total de kilos recibidos en el mes</Label>
                <Input id="totalReceived" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="beneficiaries">Instituciones beneficiarias (#)</Label>
                <Input id="beneficiaries" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="peopleFed">Personas alimentadas mensualmente (#)</Label>
                <Input id="peopleFed" type="number" placeholder="0" />
              </div>
            </div>
          </div>
        );
      case "education":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="students">Número de estudiantes</Label>
                <Input id="students" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="teachers">Número de profesores</Label>
                <Input id="teachers" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="classrooms">Número de aulas</Label>
                <Input id="classrooms" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="materials">Materiales educativos distribuidos</Label>
                <Input id="materials" type="number" placeholder="0" />
              </div>
            </div>
          </div>
        );
      case "entrepreneurship":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businesses">Negocios apoyados</Label>
                <Input id="businesses" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="jobs">Empleos creados</Label>
                <Input id="jobs" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="training">Sesiones de capacitación realizadas</Label>
                <Input id="training" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="revenue">Ingresos generados ($)</Label>
                <Input id="revenue" type="number" placeholder="0" />
              </div>
            </div>
          </div>
        );
      case "environment":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="treesPlanted">Árboles plantados</Label>
                <Input id="treesPlanted" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="wasteCollected">Residuos recolectados (Kg)</Label>
                <Input id="wasteCollected" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="areaRestored">Área restaurada (m²)</Label>
                <Input id="areaRestored" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="volunteers">Número de voluntarios</Label>
                <Input id="volunteers" type="number" placeholder="0" />
              </div>
            </div>
          </div>
        );
      case "gender":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="womenSupported">Mujeres apoyadas</Label>
                <Input id="womenSupported" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="workshops">Talleres realizados</Label>
                <Input id="workshops" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="awareness">Campañas de concientización</Label>
                <Input id="awareness" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="participants">Total de participantes</Label>
                <Input id="participants" type="number" placeholder="0" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout role="ngo">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Proyectos</h1>
            <p className="text-muted-foreground mt-1">
              Gestione los proyectos de su organización y realice seguimiento del progreso
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
                  <Label htmlFor="month">Seleccionar Mes</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Elegir mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((month, index) => (
                        <SelectItem key={month} value={month.toLowerCase()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="projectManager">
                    Gerente del Proyecto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="projectManager"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    placeholder="Ingrese el nombre del gerente"
                  />
                </div>

                <div>
                  <Label htmlFor="focusArea">
                    Área de Enfoque <span className="text-destructive">*</span>
                  </Label>
                  <Select value={focusArea} onValueChange={(value) => {
                    setFocusArea(value);
                    setFormData({ ...formData, focusArea: value });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el área de enfoque" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nutrition">Nutrición</SelectItem>
                      <SelectItem value="education">Educación</SelectItem>
                      <SelectItem value="entrepreneurship">Emprendimiento</SelectItem>
                      <SelectItem value="environment">Medio Ambiente</SelectItem>
                      <SelectItem value="gender">Equidad de Género</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {renderIndicators()}

                <div className="pt-4 border-t">
                  <Button variant="outline" className="gap-2 w-full">
                    <Upload className="w-4 h-4" />
                    Subir Archivos
                  </Button>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreate} className="flex-1">
                    Guardar Proyecto
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setFormData({ name: "", manager: "", focusArea: "" });
                      setFocusArea("");
                      setSelectedMonth("");
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
                <TableHead>Área de Enfoque</TableHead>
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
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {project.focusArea}
                    </span>
                  </TableCell>
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

export default NGOProjects;
