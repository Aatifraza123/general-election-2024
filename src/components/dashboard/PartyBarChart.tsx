import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getPartyShortName, getPartyColor } from '@/lib/analytics';
import type { PartyStats } from '@/types/election';

interface PartyBarChartProps {
  data: PartyStats[];
  title: string;
  dataKey?: 'seats' | 'votes' | 'percentage';
  maxItems?: number;
  layout?: 'horizontal' | 'vertical';
}

export function PartyBarChart({ 
  data, 
  title, 
  dataKey = 'seats', 
  maxItems = 10,
  layout = 'horizontal' 
}: PartyBarChartProps) {
  const chartData = data.slice(0, maxItems).map(item => ({
    name: getPartyShortName(item.party),
    fullName: item.party,
    value: dataKey === 'votes' ? item.votes / 100000 : item[dataKey],
    color: getPartyColor(item.party),
    originalValue: item[dataKey],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 text-sm">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-muted-foreground">
            {dataKey === 'seats' ? 'Seats' : dataKey === 'votes' ? 'Votes' : 'Share'}: 
            <span className="text-foreground font-medium ml-1">
              {dataKey === 'votes' 
                ? `${(data.originalValue / 100000).toFixed(2)} Lakhs`
                : dataKey === 'percentage'
                  ? `${data.originalValue.toFixed(1)}%`
                  : data.originalValue
              }
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout={layout === 'vertical' ? 'vertical' : 'horizontal'}
            margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            {layout === 'vertical' ? (
              <>
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  width={50}
                />
              </>
            ) : (
              <>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              </>
            )}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
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
