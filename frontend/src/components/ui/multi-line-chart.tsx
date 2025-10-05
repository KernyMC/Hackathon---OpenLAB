import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface MultiLineChartProps {
  data: any[];
  xAxisKey: string;
  lines: {
    dataKey: string;
    name: string;
    color: string;
  }[];
}

export const MultiLineChart = ({ data, xAxisKey, lines }: MultiLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            name={line.name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};