// Tipos compartidos para proyectos entre Admin y NGO

export interface Indicator {
  id: string;
  name: string;
  dataType: string;
  isCustom?: boolean;
}

export interface Eje {
  name: string;
  indicators: Indicator[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  duration: string;
  reportingPeriod: string;
  ong: string;
  subscriptionDate: string;
  ejes: Eje[];
  progress?: number; // 0-100
  manager?: string;
  email?: string;
}

export interface ReportIndicator {
  name: string;
  value: string;
  isCustom: boolean;
}

export interface CalculatedField {
  name: string;
  value: string;
}

export interface Report {
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
  isLocked: boolean; // Indica si el reporte ya está enviado y no se puede editar
}
