import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users, FolderOpen, TrendingUp, Target } from "lucide-react";

const AdminDashboard = () => {
  const [selectedNGO, setSelectedNGO] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [ngos, setNgos] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ONGs from backend
  useEffect(() => {
    const fetchONGs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ong");
        const data = await response.json();
        setNgos(data);
        console.log("ONGs:", data);
      } catch (error) {
        console.error("Error fetching ONGs:", error);
      }
    };

    fetchONGs();
  }, []);

  // Fetch projects when ONG is selected - FILTERED BY ONG
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedNGO) {
        setProjects([]);
        return;
      }

      try {
        // Fetch only projects for the selected ONG
        const response = await fetch(
          `http://localhost:5000/api/proyecto/ong/${selectedNGO}`
        );
        const data = await response.json();
        setProjects(data);
        console.log("Projects for ONG:", data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, [selectedNGO]);

  // Reset project selection when ONG changes
  useEffect(() => {
    setSelectedProject("");
    setProjects([]); // Clear projects when ONG changes
  }, [selectedNGO]);

  // Fetch statistics when both ONG and Project are selected
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/usuario/estadisticas"
        );
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    if (selectedNGO && selectedProject) {
      fetchStats();
    }
  }, [selectedNGO, selectedProject]);

  return (
    <PageLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
          <p className="text-muted-foreground mt-1">
            Monitoree y analice el desempeño de las ONGs y las métricas de los
            proyectos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="ngo-select">Seleccionar ONG</Label>
            <Select value={selectedNGO} onValueChange={setSelectedNGO}>
              <SelectTrigger id="ngo-select">
                <SelectValue placeholder="Elija una ONG" />
              </SelectTrigger>
              <SelectContent>
                {ngos.map((ngo) => (
                  <SelectItem key={ngo.id} value={ngo.id.toString()}>
                    {ngo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="project-select">Seleccionar Proyecto</Label>
            <Select
              value={selectedProject}
              onValueChange={setSelectedProject}
              disabled={!selectedNGO || projects.length === 0}
            >
              <SelectTrigger id="project-select">
                <SelectValue 
                  placeholder={
                    !selectedNGO 
                      ? "Primero seleccione una ONG" 
                      : projects.length === 0 
                        ? "No hay proyectos disponibles"
                        : "Elija un proyecto"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Show data only when BOTH ONG and Project are selected */}
        {selectedNGO && selectedProject ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Proyectos
                  </CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projects.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Para esta ONG
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Beneficiarios Activos
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +18% desde el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Puntuación de Impacto
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">
                    +5% desde el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Metas Logradas</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">9/12</div>
                  <p className="text-xs text-muted-foreground">
                    75% tasa de finalización
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nuevo proyecto creado</p>
                        <p className="text-xs text-muted-foreground">
                          Hace 2 horas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Informe enviado</p>
                        <p className="text-xs text-muted-foreground">
                          Hace 5 horas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Gerente actualizado</p>
                        <p className="text-xs text-muted-foreground">
                          Hace 1 día
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Áreas de Enfoque</CardTitle>
                </CardHeader>
      
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                {!selectedNGO 
                  ? "Seleccione una ONG para continuar"
                  : projects.length === 0
                    ? "Esta ONG no tiene proyectos disponibles"
                    : "Seleccione un proyecto para ver las métricas del panel"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};


export default AdminDashboard;
