import { useState } from "react";
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

  return (
    <PageLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Proyectos</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Beneficiarios Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+18% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Puntuación de Impacto</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">+5% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Metas Logradas</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">9/12</div>
                  <p className="text-xs text-muted-foreground">75% tasa de finalización</p>
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
                        <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-success rounded-full" />
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

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Ejes</CardTitle>
                </CardHeader>
                <CardContent>
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
            </div>
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
    </PageLayout>
  );
};

export default AdminDashboard;