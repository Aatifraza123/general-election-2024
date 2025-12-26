import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { getPartyShortName, getPartyColor, formatNumber } from '@/lib/analytics';
import { get2019Seats } from '@/data/election2019';
import type { PartyStats } from '@/types/election';
import { cn } from '@/lib/utils';

interface ComparisonData {
  party: string;
  shortName: string;
  seats2019: number;
  seats2024: number;
  change: number;
  percentChange: number;
  color: string;
}

interface ElectionComparisonProps {
  partyStats: PartyStats[];
}

export function ElectionComparison({ partyStats }: ElectionComparisonProps) {
  const comparisonData = useMemo(() => {
    const data: ComparisonData[] = partyStats.slice(0, 15).map(party => {
      const seats2019 = get2019Seats(party.party);
      const seats2024 = party.seats;
      const change = seats2024 - seats2019;
      const percentChange = seats2019 > 0 ? ((change / seats2019) * 100) : (seats2024 > 0 ? 100 : 0);

      return {
        party: party.party,
        shortName: getPartyShortName(party.party),
        seats2019,
        seats2024,
        change,
        percentChange,
        color: getPartyColor(party.party),
      };
    });

    return data.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  }, [partyStats]);

  // Calculate totals
  const totals = useMemo(() => {
    const gainers = comparisonData.filter(d => d.change > 0);
    const losers = comparisonData.filter(d => d.change < 0);
    const totalGained = gainers.reduce((sum, d) => sum + d.change, 0);
    const totalLost = Math.abs(losers.reduce((sum, d) => sum + d.change, 0));
    
    const biggestGainer = gainers[0];
    const biggestLoser = losers.sort((a, b) => a.change - b.change)[0];

    return { gainers: gainers.length, losers: losers.length, totalGained, totalLost, biggestGainer, biggestLoser };
  }, [comparisonData]);

  // Chart data for seat changes
  const chartData = comparisonData.slice(0, 12).map(d => ({
    name: d.shortName,
    change: d.change,
    color: d.change >= 0 ? 'hsl(150, 60%, 45%)' : 'hsl(0, 70%, 50%)',
    fullName: d.party,
    seats2019: d.seats2019,
    seats2024: d.seats2024,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 text-sm">
          <p className="font-semibold">{data.fullName}</p>
          <div className="mt-2 space-y-1">
            <p className="text-muted-foreground">2019: <span className="text-foreground font-medium">{data.seats2019} seats</span></p>
            <p className="text-muted-foreground">2024: <span className="text-foreground font-medium">{data.seats2024} seats</span></p>
            <p className={cn(
              "font-medium",
              data.change > 0 ? "text-emerald-500" : data.change < 0 ? "text-red-500" : "text-muted-foreground"
            )}>
              Change: {data.change > 0 ? '+' : ''}{data.change} seats
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 border-l-4 border-l-primary">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          2019 vs 2024 Election Comparison
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Comparative analysis of seat gains and losses between the 2019 and 2024 Indian General Elections.
          The political landscape has seen significant shifts with <span className="text-emerald-500 font-medium">{totals.gainers} parties gaining seats</span> and{' '}
          <span className="text-red-500 font-medium">{totals.losers} parties losing seats</span>.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card animate-slide-up" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Biggest Gainer</span>
            <ArrowUpRight className="h-5 w-5 text-emerald-500" />
          </div>
          {totals.biggestGainer && (
            <>
              <p className="font-bold text-lg">{totals.biggestGainer.shortName}</p>
              <p className="text-emerald-500 font-mono font-bold text-2xl">+{totals.biggestGainer.change}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totals.biggestGainer.seats2019} → {totals.biggestGainer.seats2024} seats
              </p>
            </>
          )}
        </div>

        <div className="stat-card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Biggest Loser</span>
            <ArrowDownRight className="h-5 w-5 text-red-500" />
          </div>
          {totals.biggestLoser && (
            <>
              <p className="font-bold text-lg">{totals.biggestLoser.shortName}</p>
              <p className="text-red-500 font-mono font-bold text-2xl">{totals.biggestLoser.change}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totals.biggestLoser.seats2019} → {totals.biggestLoser.seats2024} seats
              </p>
            </>
          )}
        </div>

        <div className="stat-card animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Seats Gained</span>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-emerald-500 font-mono font-bold text-3xl">+{totals.totalGained}</p>
          <p className="text-xs text-muted-foreground mt-1">
            By {totals.gainers} parties
          </p>
        </div>

        <div className="stat-card animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Seats Lost</span>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-red-500 font-mono font-bold text-3xl">-{totals.totalLost}</p>
          <p className="text-xs text-muted-foreground mt-1">
            By {totals.losers} parties
          </p>
        </div>
      </div>

      {/* Seat Change Chart */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Seat Gains & Losses</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} horizontal={false} />
              <XAxis 
                type="number" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
              <ReferenceLine x={0} stroke="hsl(var(--border))" strokeWidth={2} />
              <Bar 
                dataKey="change" 
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

      {/* Detailed Comparison Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Detailed Party Comparison</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="data-table">
            <thead>
              <tr>
                <th>Party</th>
                <th className="text-right">2019</th>
                <th className="text-right">2024</th>
                <th className="text-right">Change</th>
                <th className="text-right">% Change</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={row.party} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="font-medium">{row.shortName}</span>
                    </div>
                  </td>
                  <td className="text-right font-mono">{row.seats2019}</td>
                  <td className="text-right font-mono font-bold">{row.seats2024}</td>
                  <td className={cn(
                    "text-right font-mono font-bold",
                    row.change > 0 ? "text-emerald-500" : row.change < 0 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {row.change > 0 ? '+' : ''}{row.change}
                  </td>
                  <td className={cn(
                    "text-right font-mono text-sm",
                    row.change > 0 ? "text-emerald-500" : row.change < 0 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {row.percentChange > 0 ? '+' : ''}{row.percentChange.toFixed(0)}%
                  </td>
                  <td>
                    {row.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : row.change < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="insight-card border-l-emerald-500">
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Major Gainers
          </h4>
          <ul className="space-y-2 text-sm">
            {comparisonData.filter(d => d.change > 0).slice(0, 5).map(d => (
              <li key={d.party} className="flex items-center justify-between">
                <span className="text-muted-foreground">{d.shortName}</span>
                <span className="text-emerald-500 font-mono font-medium">+{d.change}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="insight-card border-l-red-500">
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            Major Losers
          </h4>
          <ul className="space-y-2 text-sm">
            {comparisonData.filter(d => d.change < 0).sort((a, b) => a.change - b.change).slice(0, 5).map(d => (
              <li key={d.party} className="flex items-center justify-between">
                <span className="text-muted-foreground">{d.shortName}</span>
                <span className="text-red-500 font-mono font-medium">{d.change}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
