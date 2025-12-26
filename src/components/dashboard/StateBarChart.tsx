import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { StateStats } from '@/types/election';

interface StateBarChartProps {
  data: StateStats[];
  title: string;
  maxItems?: number;
}

const STATE_COLORS = [
  'hsl(220, 90%, 56%)',
  'hsl(24, 95%, 53%)',
  'hsl(150, 60%, 40%)',
  'hsl(280, 70%, 55%)',
  'hsl(45, 100%, 50%)',
  'hsl(0, 75%, 50%)',
  'hsl(180, 60%, 45%)',
  'hsl(320, 70%, 50%)',
  'hsl(100, 50%, 45%)',
  'hsl(200, 70%, 50%)',
];

export function StateBarChart({ data, title, maxItems = 15 }: StateBarChartProps) {
  const chartData = data.slice(0, maxItems).map((item, index) => ({
    name: item.state.length > 12 ? item.state.slice(0, 12) + '...' : item.state,
    fullName: item.state,
    seats: item.totalSeats,
    color: STATE_COLORS[index % STATE_COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 text-sm">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-muted-foreground">Total Seats: <span className="text-foreground font-medium">{data.seats}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} horizontal={false} />
            <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
            <Bar 
              dataKey="seats" 
              radius={[0, 4, 4, 0]}
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
