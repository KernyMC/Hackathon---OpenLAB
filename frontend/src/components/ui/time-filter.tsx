import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeFilterProps {
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  disabled?: boolean;
}

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

export const TimeFilter = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  disabled = false,
}: TimeFilterProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <>
      <div>
        <Label htmlFor="month-select">Mes (Opcional)</Label>
        <Select
          value={selectedMonth || "all"}
          onValueChange={(value) => onMonthChange(value === "all" ? "" : value)}
          disabled={disabled}
        >
          <SelectTrigger id="month-select">
            <SelectValue placeholder="Todos los meses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los meses</SelectItem>
            {MONTHS.map((month) => (
              <SelectItem key={month.id} value={month.id}>
                {month.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="year-select">Año (Opcional)</Label>
        <Select
          value={selectedYear || "all"}
          onValueChange={(value) => onYearChange(value === "all" ? "" : value)}
          disabled={disabled}
        >
          <SelectTrigger id="year-select">
            <SelectValue placeholder="Todos los años" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los años</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};