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
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

// Componente wrapper para items del grid
interface GridItemProps {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  children: React.ReactNode;
  'data-chartname': string;
}

const GridItem = ({ x, y, w, h, children, 'data-chartname': chartname }: GridItemProps) => {
  return (
    <div
      className="grid-stack-item"
      gs-x={x}
      gs-y={y}
      gs-w={w}
      gs-h={h}
      data-chartname={chartname}
    >
      <div className="grid-stack-item-content h-full">
        {children}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [selectedNGO, setSelectedNGO] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [gridInitialized, setGridInitialized] = useState(false);

  const ngos = [
    "BAQ",
    "BAA Cuenca",
    "BA Esmeraldas",
    "Fund Amiga",
    "BA Quevedo",
  ];

  const projects = selectedNGO
    ? ["Community Garden Initiative", "Youth Education Program", "Water Access Project"]
    : [];

  // Posiciones por defecto para los componentes
  const defaultPositions = {
    "total-projects": { x: 0, y: 0, w: 3, h: 2 },
    "active-beneficiaries": { x: 3, y: 0, w: 3, h: 2 },
    "impact-score": { x: 6, y: 0, w: 3, h: 2 },
    "goals-achieved": { x: 9, y: 0, w: 3, h: 2 },
    "recent-activity": { x: 0, y: 2, w: 6, h: 4 },
    "axis-distribution": { x: 6, y: 2, w: 6, h: 4 },
  };

  // Inicializar GridStack
  useEffect(() => {
    if (!selectedNGO || gridInitialized) return;

    const timer = setTimeout(() => {
      const gridElement = document.querySelector('.grid-stack');
      if (!gridElement) return;

      const grid = GridStack.init({
        float: false,
        column: 12,
        cellHeight: 80,
        margin: 5,
        resizable: { handles: 'se' },
        disableOneColumnMode: true,
        minRow: 6,
      }, '.grid-stack');

      if (grid) {
        setGridInitialized(true);
        console.log('✅ GridStack inicializado');

        // Listener para cambios
        grid.on('change', function (event, items) {
          if (items && items.length > 0) {
            console.log('📊 Posiciones actualizadas:', items);
          }
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      setGridInitialized(false);
    };
  }, [selectedNGO, gridInitialized]);

  return (
    <PageLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitoree y analice el desempeño de las ONGs y las métricas de los proyectos
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
                  <SelectItem key={ngo} value={ngo}>
                    {ngo}
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
              disabled={!selectedNGO}
            >
              <SelectTrigger id="project-select">
                <SelectValue placeholder="Elija un proyecto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedNGO && (
          <div className="grid-stack" style={{ minHeight: '600px' }}>
            <GridItem
              x={defaultPositions["total-projects"].x}
              y={defaultPositions["total-projects"].y}
              w={defaultPositions["total-projects"].w}
              h={defaultPositions["total-projects"].h}
              data-chartname="total-projects"
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Proyectos</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["active-beneficiaries"].x}
              y={defaultPositions["active-beneficiaries"].y}
              w={defaultPositions["active-beneficiaries"].w}
              h={defaultPositions["active-beneficiaries"].h}
              data-chartname="active-beneficiaries"
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Beneficiarios Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+18% desde el mes pasado</p>
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["impact-score"].x}
              y={defaultPositions["impact-score"].y}
              w={defaultPositions["impact-score"].w}
              h={defaultPositions["impact-score"].h}
              data-chartname="impact-score"
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Puntuación de Impacto</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">+5% desde el mes pasado</p>
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["goals-achieved"].x}
              y={defaultPositions["goals-achieved"].y}
              w={defaultPositions["goals-achieved"].w}
              h={defaultPositions["goals-achieved"].h}
              data-chartname="goals-achieved"
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Metas Logradas</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">9/12</div>
                  <p className="text-xs text-muted-foreground">75% tasa de finalización</p>
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["recent-activity"].x}
              y={defaultPositions["recent-activity"].y}
              w={defaultPositions["recent-activity"].w}
              h={defaultPositions["recent-activity"].h}
              data-chartname="recent-activity"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nuevo proyecto creado</p>
                        <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Informe enviado</p>
                        <p className="text-xs text-muted-foreground">Hace 5 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Gerente actualizado</p>
                        <p className="text-xs text-muted-foreground">Hace 1 día</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["axis-distribution"].x}
              y={defaultPositions["axis-distribution"].y}
              w={defaultPositions["axis-distribution"].w}
              h={defaultPositions["axis-distribution"].h}
              data-chartname="axis-distribution"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Distribución de Ejes</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div className="space-y-3">
                    {[
                      { eje: "Educación", percentage: 35 },
                      { eje: "Medio Ambiente", percentage: 25 },
                      { eje: "Nutrición", percentage: 20 },
                      { eje: "Emprendimiento", percentage: 15 },
                      { eje: "Equidad de Género", percentage: 5 },
                    ].map((item) => (
                      <div key={item.eje} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.eje}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </div>
        )}

        {!selectedNGO && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                Seleccione una ONG para ver las métricas del panel
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx global>{`
        .grid-stack-item-content {
          overflow: hidden;
        }

        .grid-stack-item-content .card {
          height: 100%;
        }

        /* Asegurar que el contenido se ajuste al tamaño */
        .grid-stack-item-content > * {
          height: 100%;
        }
      `}</style>
    </PageLayout>
  );
};

export default AdminDashboard;
