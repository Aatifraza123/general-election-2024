import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getPartyShortName, getPartyColor } from '@/lib/analytics';
import type { PartyStats } from '@/types/election';

interface PartyPieChartProps {
  data: PartyStats[];
  title: string;
  showLegend?: boolean;
  maxItems?: number;
}

export function PartyPieChart({ data, title, showLegend = true, maxItems = 8 }: PartyPieChartProps) {
  const chartData = data.slice(0, maxItems).map(item => ({
    name: getPartyShortName(item.party),
    fullName: item.party,
    value: item.seats,
    percentage: item.percentage,
    color: getPartyColor(item.party),
  }));

  // Add "Others" category if needed
  if (data.length > maxItems) {
    const othersSeats = data.slice(maxItems).reduce((sum, p) => sum + p.seats, 0);
    const othersPercentage = data.slice(maxItems).reduce((sum, p) => sum + p.percentage, 0);
    chartData.push({
      name: 'Others',
      fullName: 'Other Parties',
      value: othersSeats,
      percentage: othersPercentage,
      color: 'hsl(220, 10%, 50%)',
    });
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 text-sm">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-muted-foreground">Seats: <span className="text-foreground font-medium">{data.value}</span></p>
          <p className="text-muted-foreground">Share: <span className="text-foreground font-medium">{data.percentage.toFixed(1)}%</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
