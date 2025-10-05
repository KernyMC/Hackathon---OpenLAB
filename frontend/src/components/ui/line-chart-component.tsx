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

interface LineChartComponentProps {
data: any[];
dataKey: string;
xAxisKey: string;
title?: string;
color?: string;
}

export const LineChartComponent = ({
data,
dataKey,
xAxisKey,
title,
color = "#8884d8",
}: LineChartComponentProps) => {
return (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xAxisKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke={color}
        strokeWidth={2}
        name={title || dataKey}
      />
    </LineChart>
  </ResponsiveContainer>
);
};