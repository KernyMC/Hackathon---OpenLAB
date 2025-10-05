import PageLayout from "@/components/layout/PageLayout";
import { BarChartComponent } from "@/components/ui/bar-chart-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { FolderOpen, Target, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

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
  }, [selectedNGO]);

  // Reset time filters when project changes
  useEffect(() => {
    setSelectedMonth("");
    setSelectedYear("");
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
      // Si los items tienen un campo 'valor' o 'cantidad', sumarlos
      if (item.valor) acc[key].valorTotal += parseFloat(item.valor);
      if (item.cantidad) acc[key].valorTotal += parseFloat(item.cantidad);
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
      
      // Acumular tanto cantidad como valor
      if (!monthsData[monthName][yearKey]) {
        monthsData[monthName][yearKey] = 0;
      }
      monthsData[monthName][yearKey] += 1;
      
      // Si quieres mostrar el valor en lugar de la cantidad:
      // monthsData[monthName][yearKey] += parseFloat(item.valor || item.cantidad || 0);
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
      
      // Sumar valores si existen
      const valor = parseFloat(item.valor || item.cantidad || 0);
      acc[kpiName].valorTotal += valor;
      
      return acc;
    }, {});

    // Calcular promedios
    Object.values(grouped).forEach((item: any) => {
      item.valorPromedio = item.valorTotal / item.cantidad;
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
        
        // Acumular valores
        const valor = parseFloat(item.valor || item.cantidad || 0);
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

  return (
    <PageLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Panel de Control
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitoree y analice el desempeño de las ONGs y las métricas de los
            proyectos
          </p>
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

        {/* Show data only when BOTH ONG and Project are selected */}
        {selectedNGO && selectedProject ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
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

              <Card>
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

              <Card>
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

              <Card>
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
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart - Temporal Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia Temporal de Items</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Evolución de la cantidad de items registrados por mes
                  </p>
                </CardHeader>
                <CardContent>
                  {lineChartData.length > 0 ? (
                    <LineChartComponent
                      data={lineChartData}
                      dataKey="cantidad"
                      xAxisKey="month"
                      title="Cantidad de Items"
                      color="#8884d8"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-muted-foreground">
                        No hay datos disponibles
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Multi-Line Chart - Compare Years */}
              <Card>
                <CardHeader>
                  <CardTitle>Comparación por Años</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Comparativa de items entre diferentes años
                  </p>
                </CardHeader>
                <CardContent>
                  {multiLineData.length > 0 && years.length > 1 ? (
                    <MultiLineChart
                      data={multiLineData}
                      xAxisKey="month"
                      lines={multiLineConfig}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-muted-foreground">
                        {years.length <= 1
                          ? "Necesita datos de múltiples años"
                          : "No hay datos disponibles"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bar Chart - Items by KPI */}
              <Card>
                <CardHeader>
                  <CardTitle>Items por KPI</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Distribución de items según cada KPI del proyecto
                  </p>
                </CardHeader>
                <CardContent>
                  {barChartData.length > 0 ? (
                    <BarChartComponent
                      data={barChartData}
                      dataKey="cantidad"
                      xAxisKey="kpi"
                      title="Cantidad"
                      color="#82ca9d"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-muted-foreground">
                        No hay datos disponibles
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pie Chart - Distribution by Eje */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Eje</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Porcentaje de items por cada eje estratégico
                  </p>
                </CardHeader>
                <CardContent>
                  {pieChartData.length > 0 ? (
                    <PieChartComponent
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-muted-foreground">
                        No hay datos disponibles
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Activity Section */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Últimos items registrados en el proyecto
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.slice(0, 5).map((item, index) => {
                    const kpi = kpis.find((k) => k.id === item.idKpi);
                    const monthName =
                      MONTHS[item.idMes - 1]?.name || `Mes ${item.idMes}`;

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
                            {(item.valor || item.cantidad) && ` | Valor: ${item.valor || item.cantidad}`}
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
    </PageLayout>
  );
};

export default AdminDashboard;
