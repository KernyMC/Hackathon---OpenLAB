import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarChartComponentProps {
data: any[];
dataKey: string;
xAxisKey: string;
title?: string;
color?: string;
}

export const BarChartComponent = ({
data,
dataKey,
xAxisKey,
title,
color = "#82ca9d",
}: BarChartComponentProps) => {
return (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xAxisKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={dataKey} fill={color} name={title || dataKey} />
    </BarChart>
  </ResponsiveContainer>
);
};