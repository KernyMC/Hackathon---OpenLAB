// Store simulado para compartir proyectos entre Admin y NGO
// En producción, esto vendría de una API/base de datos

import { Project, Report } from "@/types/project";

class ProjectStore {
  private projects: Project[] = [
    {
      id: "1",
      name: "Iniciativa de Huertos Comunitarios",
      description: "Proyecto enfocado en la creación de huertos urbanos comunitarios para mejorar la seguridad alimentaria.",
      duration: "12",
      reportingPeriod: "Mensual",
      ong: "BAQ",
      subscriptionDate: "2024-01-15",
      manager: "María García",
      email: "maria@example.com",
      ejes: [
        {
          name: "Nutrición",
          indicators: [
            { id: "1", name: "Alimentos aptos para consumo (Kg)", dataType: "Kg" },
            { id: "2", name: "Alimentos de consumo inmediato (Kg)", dataType: "Kg" },
            { id: "3", name: "Producción (Kg)", dataType: "Kg" },
            { id: "4", name: "Total de kilos recibidos en el mes", dataType: "Kg" },
            { id: "5", name: "Instituciones beneficiadas (#)", dataType: "#" },
            { id: "6", name: "Personas alimentadas mensualmente (#)", dataType: "#" },
          ]
        },
        {
          name: "Medio Ambiente",
          indicators: [
            { id: "7", name: "Área cultivada", dataType: "#" },
            { id: "8", name: "Reducción de CO2", dataType: "Kg" }
          ]
        }
      ],
      progress: 100
    },
    {
      id: "2",
      name: "Programa de Educación Juvenil",
      description: "Programa de apoyo educativo y capacitación para jóvenes en situación de vulnerabilidad.",
      duration: "18",
      reportingPeriod: "Trimestral",
      ong: "BAA Cuenca",
      subscriptionDate: "2024-02-20",
      manager: "Juan Pérez",
      email: "juan@example.com",
      ejes: [
        {
          name: "Educación",
          indicators: [
            { id: "9", name: "Estudiantes matriculados", dataType: "#" },
            { id: "10", name: "Tasa de graduación", dataType: "%" },
            { id: "11", name: "Número de profesores", dataType: "#" },
            { id: "12", name: "Materiales educativos distribuidos", dataType: "#" }
          ]
        }
      ],
      progress: 60
    },
  ];

  private reports: Report[] = [];

  // Proyectos
  getProjects(): Project[] {
    return [...this.projects];
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getProjectsByOng(ong: string): Project[] {
    return this.projects.filter(p => p.ong === ong);
  }

  addProject(project: Project): void {
    this.projects.push(project);
  }

  updateProject(id: string, updates: Partial<Project>): void {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
    }
  }

  deleteProject(id: string): void {
    this.projects = this.projects.filter(p => p.id !== id);
  }

  // Reportes
  getReports(): Report[] {
    return [...this.reports];
  }

  getReportsByProject(projectId: string): Report[] {
    return this.reports.filter(r => r.projectId === projectId);
  }

  getReportsByOng(ong: string): Report[] {
    return this.reports.filter(r => r.ongName === ong);
  }

  addReport(report: Report): void {
    this.reports.push(report);
  }

  hasReportForMonth(projectId: string, month: string, year: number): boolean {
    return this.reports.some(r =>
      r.projectId === projectId &&
      r.month === month &&
      r.year === year
    );
  }

  findReport(projectId: string, month: string, year: number): Report | undefined {
    return this.reports.find(r =>
      r.projectId === projectId &&
      r.month === month &&
      r.year === year
    );
  }
}

// Singleton instance
export const projectStore = new ProjectStore();
