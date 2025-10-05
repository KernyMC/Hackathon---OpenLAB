import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface PieChartComponentProps {
data: any[];
dataKey: string;
nameKey: string;
colors?: string[];
}

const DEFAULT_COLORS = [
"#0088FE",
"#00C49F",
"#FFBB28",
"#FF8042",
"#8884D8",
"#82CA9D",
];

export const PieChartComponent = ({
data,
dataKey,
nameKey,
colors = DEFAULT_COLORS,
}: PieChartComponentProps) => {
return (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) =>
          `${name}: ${(percent * 100).toFixed(0)}%`
        }
        outerRadius={80}
        fill="#8884d8"
        dataKey={dataKey}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);
};