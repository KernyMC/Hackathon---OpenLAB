import PageLayout from "@/components/layout/PageLayout";
import { BarChartComponent } from "@/components/ui/bar-chart-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadButtons } from "@/components/ui/DownloadButtons";
import { Label } from "@/components/ui/label";
import { LineChartComponent } from "@/components/ui/line-chart-component";
import { MultiLineChart } from "@/components/ui/multi-line-chart";
import { PieChartComponent } from "@/components/ui/pie-chart-component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeFilter } from "@/components/ui/time-filter";
import { apiService } from "@/services/api";
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import { FolderOpen, Target, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const MONTHS = [
  { id: "1", name: "Enero" },
  { id: "2", name: "Febrero" },
  { id: "3", name: "Marzo" },
  { id: "4", name: "Abril" },
  { id: "5", name: "Mayo" },
  { id: "6", name: "Junio" },
  { id: "7", name: "Julio" },
  { id: "8", name: "Agosto" },
  { id: "9", name: "Septiembre" },
  { id: "10", name: "Octubre" },
  { id: "11", name: "Noviembre" },
  { id: "12", name: "Diciembre" },
];

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
      <div className="grid-stack-item-content h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [selectedNGO, setSelectedNGO] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [ngos, setNgos] = useState([]);
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [ejes, setEjes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridInitialized, setGridInitialized] = useState(false);

  // Posiciones por defecto para los componentes
  const defaultPositions = {
    "total-projects": { x: 0, y: 0, w: 3, h: 2 },
    "total-kpis": { x: 3, y: 0, w: 3, h: 2 },
    "items-registered": { x: 6, y: 0, w: 3, h: 2 },
    "total-ejes": { x: 9, y: 0, w: 3, h: 2 },
    "line-chart": { x: 0, y: 2, w: 6, h: 5.5},
    "multi-line-chart": { x: 6, y: 2, w: 6, h: 5.5},
    "bar-chart": { x: 0, y: 6, w: 6, h: 5.5 },
    "pie-chart": { x: 6, y: 6, w: 6, h: 5.5 },
    "recent-activity": { x: 0, y: 10, w: 12, h: 3 },
  };

  // Fetch ONGs from backend
  useEffect(() => {
    const fetchONGs = async () => {
      try {
        const data = await apiService.getONGs();
        setNgos(data);
        console.log("ONGs:", data);
      } catch (error) {
        console.error("Error fetching ONGs:", error);
      }
    };

    fetchONGs();
  }, []);

  // Fetch projects when ONG is selected
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedNGO) {
        setProjects([]);
        return;
      }

      try {
        const data = await apiService.getProjectsByONG(selectedNGO);
        setProjects(data);
        console.log("Projects for ONG:", data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, [selectedNGO]);

  // Reset filters when ONG changes
  useEffect(() => {
    setSelectedProject("");
    setSelectedMonth("");
    setSelectedYear("");
    setProjects([]);
    setItems([]);
    setKpis([]);
    setEjes([]);
    setGridInitialized(false);
  }, [selectedNGO]);

  // Reset time filters when project changes
  useEffect(() => {
    setSelectedMonth("");
    setSelectedYear("");
    setGridInitialized(false);
  }, [selectedProject]);

  // Fetch data when filters change
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedNGO || !selectedProject) {
        return;
      }

      try {
        setLoading(true);

        // Fetch Items with filters
        const itemsData = await apiService.getItems({
          idProyecto: selectedProject,
          mes: selectedMonth,
          year: selectedYear,
        });
        setItems(itemsData);

        // Fetch KPIs
        const kpisData = await apiService.getKPIs(selectedProject);
        setKpis(kpisData);

        // Fetch Ejes
        const ejesData = await apiService.getEjesByProject(selectedProject);
        setEjes(ejesData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedNGO, selectedProject, selectedMonth, selectedYear]);

  // Inicializar GridStack cuando hay proyecto seleccionado
  useEffect(() => {
    if (!selectedProject || gridInitialized || loading) return;

    const timer = setTimeout(() => {
      const gridElement = document.querySelector('.grid-stack');
      if (!gridElement) return;

      // Destruir instancia previa si existe
      if (window._gridstackInstance) {
        window._gridstackInstance.destroy(false);
        window._gridstackInstance = null;
      }

      const grid = GridStack.init({
        float: false,
        column: 12,
        cellHeight: 80,
        margin: 5,
        resizable: { handles: 'se' },
        disableOneColumnMode: true,
        minRow: 13,
      }, '.grid-stack');

      if (grid) {
        window._gridstackInstance = grid;
        setGridInitialized(true);
        console.log('✅ GridStack inicializado en Dashboard');

        // Listener para cambios
        grid.on('change', function (event, items) {
          if (items && items.length > 0) {
            console.log('📊 Posiciones actualizadas en Dashboard');
          }
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedProject, gridInitialized, loading]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (window._gridstackInstance) {
        window._gridstackInstance.destroy(false);
        window._gridstackInstance = null;
      }
    };
  }, []);

  // Función auxiliar para extraer valores numéricos de la descripción
  const extractValueFromDescription = (descripcion: string | null | undefined): number => {
    if (!descripcion) return 0;

    // Intentar extraer números de la descripción
    const match = descripcion.match(/\d+\.?\d*/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Process data for line chart - Items over time
  const processLineChartData = () => {
    if (!items || items.length === 0) return [];

    const grouped = items.reduce((acc, item) => {
      const monthName = MONTHS[item.idMes - 1]?.name || `Mes ${item.idMes}`;
      const key = `${monthName} ${item.year}`;

      if (!acc[key]) {
        acc[key] = {
          month: key,
          cantidad: 0,
          valorTotal: 0,
          year: item.year,
          monthNum: item.idMes
        };
      }
      acc[key].cantidad += 1;

      // Extraer valor de la descripción
      const valor = extractValueFromDescription(item.descripcion);
      acc[key].valorTotal += valor;

      return acc;
    }, {});

    return Object.values(grouped).sort((a: any, b: any) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNum - b.monthNum;
    });
  };

  // Process data for multi-line chart - Compare years
  const processMultiLineData = () => {
    if (!items || items.length === 0) return [];

    const monthsData = {};

    items.forEach((item) => {
      const monthName = MONTHS[item.idMes - 1]?.name || `Mes ${item.idMes}`;
      if (!monthsData[monthName]) {
        monthsData[monthName] = { month: monthName, monthNum: item.idMes };
      }
      const yearKey = `year${item.year}`;

      if (!monthsData[monthName][yearKey]) {
        monthsData[monthName][yearKey] = 0;
      }

      // Extraer y acumular valores de la descripción
      const valor = extractValueFromDescription(item.descripcion);
      monthsData[monthName][yearKey] += valor;
    });

    return Object.values(monthsData).sort((a: any, b: any) => a.monthNum - b.monthNum);
  };

  // Process data for bar chart - Items by KPI con valores
  const processBarChartData = () => {
    if (!items || items.length === 0) return [];

    const grouped = items.reduce((acc, item) => {
      const kpi = kpis.find((k) => k.id === item.idKpi);
      const kpiName = kpi ? kpi.nombre : `KPI ${item.idKpi}`;

      if (!acc[kpiName]) {
        acc[kpiName] = {
          kpi: kpiName,
          cantidad: 0,
          valorTotal: 0,
          valorPromedio: 0
        };
      }
      acc[kpiName].cantidad += 1;

      // Extraer valor de la descripción
      const valor = extractValueFromDescription(item.descripcion);
      acc[kpiName].valorTotal += valor;

      return acc;
    }, {});

    // Calcular promedios
    Object.values(grouped).forEach((item: any) => {
      item.valorPromedio = item.cantidad > 0 ? item.valorTotal / item.cantidad : 0;
    });

    return Object.values(grouped);
  };

  // Process data for pie chart - Distribution by Eje con valores
  const processPieChartData = () => {
    if (!items || items.length === 0 || kpis.length === 0) return [];

    const ejeCount = {};

    items.forEach((item) => {
      const kpi = kpis.find((k) => k.id === item.idKpi);
      if (kpi) {
        const eje = ejes.find((e) => e.id === kpi.idEje);
        const ejeName = eje ? eje.nombre : `Eje ${kpi.idEje}`;

        if (!ejeCount[ejeName]) {
          ejeCount[ejeName] = {
            name: ejeName,
            value: 0,
            valorTotal: 0
          };
        }
        ejeCount[ejeName].value += 1;

        // Extraer y acumular valores de la descripción
        const valor = extractValueFromDescription(item.descripcion);
        ejeCount[ejeName].valorTotal += valor;
      }
    });

    return Object.values(ejeCount);
  };

  const lineChartData = processLineChartData();
  const multiLineData = processMultiLineData();
  const barChartData = processBarChartData();
  const pieChartData = processPieChartData();

  const years = [...new Set(items.map((item) => item.year))];
  const multiLineConfig = years.map((year, index) => ({
    dataKey: `year${year}`,
    name: year.toString(),
    color: ["#0088FE", "#00C49F", "#FFBB28"][index % 3],
  }));

  // Preparar datos para el reporte
  const reportData = useMemo(() => {
    if (!selectedNGO || !selectedProject) return null;

    const selectedNGOData = ngos.find(n => n.id.toString() === selectedNGO);
    const selectedProjectData = projects.find(p => p.id.toString() === selectedProject);

    return {
      ngoName: selectedNGOData?.nombre || '',
      projectName: selectedProjectData?.nombre || '',
      filters: {
        month: selectedMonth,
        year: selectedYear
      },
      kpis,
      items,
      ejes,
      chartData: {
        lineChart: processLineChartData(),
        multiLineChart: processMultiLineData(),
        barChart: processBarChartData(),
        pieChart: processPieChartData()
      }
    };
  }, [selectedNGO, selectedProject, selectedMonth, selectedYear, ngos, projects, kpis, items, ejes]);

  return (
    <PageLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitoree y analice el desempeño de las ONGs y las métricas de los
              proyectos
            </p>
          </div>

          {/* Botones de descarga */}
          {selectedNGO && selectedProject && reportData && (
            <DownloadButtons 
              reportData={reportData}
              disabled={loading}
            />
          )}
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <TimeFilter
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            disabled={!selectedProject}
          />
        </div>

        {/* GridStack Dashboard */}
        {selectedNGO && selectedProject ? (
          <div className="grid-stack" style={{ minHeight: '1100px' }}>
            {/* KPI Cards */}
            <GridItem
              x={defaultPositions["total-projects"].x}
              y={defaultPositions["total-projects"].y}
              w={defaultPositions["total-projects"].w}
              h={defaultPositions["total-projects"].h}
              data-chartname="total-projects"
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Proyectos
                  </CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">Para esta ONG</p>
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["total-kpis"].x}
              y={defaultPositions["total-kpis"].y}
              w={defaultPositions["total-kpis"].w}
              h={defaultPositions["total-kpis"].h}
              data-chartname="total-kpis"
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total KPIs
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.length}</div>
                  <p className="text-xs text-muted-foreground">
                    KPIs configurados
                  </p>
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["items-registered"].x}
              y={defaultPositions["items-registered"].y}
              w={defaultPositions["items-registered"].w}
              h={defaultPositions["items-registered"].h}
              data-chartname="items-registered"
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Items Registrados
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{items.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {selectedMonth && selectedYear
                      ? `${MONTHS[Number(selectedMonth) - 1]?.name} ${selectedYear}`
                      : selectedMonth
                      ? MONTHS[Number(selectedMonth) - 1]?.name
                      : selectedYear
                      ? selectedYear
                      : "Todos los periodos"}
                  </p>
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["total-ejes"].x}
              y={defaultPositions["total-ejes"].y}
              w={defaultPositions["total-ejes"].w}
              h={defaultPositions["total-ejes"].h}
              data-chartname="total-ejes"
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Ejes
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ejes.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Ejes del proyecto
                  </p>
                </CardContent>
              </Card>
            </GridItem>

            {/* Charts */}
            <GridItem
              x={defaultPositions["line-chart"].x}
              y={defaultPositions["line-chart"].y}
              w={defaultPositions["line-chart"].w}
              h={defaultPositions["line-chart"].h}
              data-chartname="line-chart"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Tendencia Temporal de Items</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Evolución de la cantidad de items registrados por mes
                  </p>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {lineChartData.length > 0 ? (
                    <LineChartComponent
                      data={lineChartData}
                      dataKey="cantidad"
                      xAxisKey="month"
                      title="Cantidad de Items"
                      color="#8884d8"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[250px]">
                      <p className="text-muted-foreground">
                        No hay datos disponibles
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["multi-line-chart"].x}
              y={defaultPositions["multi-line-chart"].y}
              w={defaultPositions["multi-line-chart"].w}
              h={defaultPositions["multi-line-chart"].h}
              data-chartname="multi-line-chart"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Comparación por Años</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Comparativa de items entre diferentes años
                  </p>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {multiLineData.length > 0 && years.length > 1 ? (
                    <MultiLineChart
                      data={multiLineData}
                      xAxisKey="month"
                      lines={multiLineConfig}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[250px]">
                      <p className="text-muted-foreground">
                        {years.length <= 1
                          ? "Necesita datos de múltiples años"
                          : "No hay datos disponibles"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["bar-chart"].x}
              y={defaultPositions["bar-chart"].y}
              w={defaultPositions["bar-chart"].w}
              h={defaultPositions["bar-chart"].h}
              data-chartname="bar-chart"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Items por KPI</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Distribución de items según cada KPI del proyecto
                  </p>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {barChartData.length > 0 ? (
                    <BarChartComponent
                      data={barChartData}
                      dataKey="cantidad"
                      xAxisKey="kpi"
                      title="Cantidad"
                      color="#82ca9d"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[250px]">
                      <p className="text-muted-foreground">
                        No hay datos disponibles
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </GridItem>

            <GridItem
              x={defaultPositions["pie-chart"].x}
              y={defaultPositions["pie-chart"].y}
              w={defaultPositions["pie-chart"].w}
              h={defaultPositions["pie-chart"].h}
              data-chartname="pie-chart"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Distribución por Eje</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Porcentaje de items por cada eje estratégico
                  </p>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {pieChartData.length > 0 ? (
                    <PieChartComponent
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[250px]">
                      <p className="text-muted-foreground">
                        No hay datos disponibles
                      </p>
                    </div>
                  )}
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
                  <p className="text-sm text-muted-foreground">
                    Últimos items registrados en el proyecto
                  </p>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div className="space-y-4">
                    {items.slice(0, 5).map((item, index) => {
                      const kpi = kpis.find((k) => k.id === item.idKpi);
                      const monthName =
                        MONTHS[item.idMes - 1]?.name || `Mes ${item.idMes}`;
                      const valor = extractValueFromDescription(item.descripcion);

                      return (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {kpi?.nombre || `KPI ${item.idKpi}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {monthName} {item.year}
                              {item.descripcion && ` - ${item.descripcion}`}
                              {valor > 0 && ` | Valor: ${valor}`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {items.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No hay actividad reciente
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                {!selectedNGO
                  ? "Seleccione una ONG para continuar"
                  : projects.length === 0
                  ? "Esta ONG no tiene proyectos disponibles"
                  : "Seleccione un proyecto para ver las métricas del panel"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx global>{`
        .grid-stack-item-content {
          overflow: hidden;
        }

        .grid-stack-item-content > * {
          height: 100%;
        }

        /* Asegurar que las Cards ocupen todo el espacio */
        .grid-stack-item-content .card {
          height: 100%;
        }
      `}</style>
    </PageLayout>
  );
};

export default AdminDashboard;
