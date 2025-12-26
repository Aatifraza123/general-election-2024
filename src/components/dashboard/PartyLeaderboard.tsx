import { getPartyShortName, getPartyColor } from '@/lib/analytics';
import type { PartyStats } from '@/types/election';

interface PartyLeaderboardProps {
  data: PartyStats[];
  title: string;
  maxItems?: number;
}

export function PartyLeaderboard({ data, title, maxItems = 10 }: PartyLeaderboardProps) {
  const topParties = data.slice(0, maxItems);
  const maxSeats = topParties[0]?.seats || 1;

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {topParties.map((party, index) => (
          <div 
            key={party.party} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: getPartyColor(party.party),
                    color: 'white'
                  }}
                >
                  {index + 1}
                </span>
                <span className="font-medium text-sm">{getPartyShortName(party.party)}</span>
              </div>
              <span className="font-mono font-bold">{party.seats}</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                style={{ 
                  width: `${(party.seats / maxSeats) * 100}%`,
                  backgroundColor: getPartyColor(party.party),
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {party.percentage.toFixed(1)}% of total seats
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
