import { useState, useMemo } from 'react';
import { PartyPieChart } from '../dashboard/PartyPieChart';
import { PartyBarChart } from '../dashboard/PartyBarChart';
import { PartyLeaderboard } from '../dashboard/PartyLeaderboard';
import { PartyBadge } from '../dashboard/PartyBadge';
import { formatNumber, formatPercentage, getPartyShortName, getPartyColor } from '@/lib/analytics';
import type { PartyStats, ConstituencyResult } from '@/types/election';
import { Search } from 'lucide-react';

interface PartyTabProps {
  partyStats: PartyStats[];
  voteShare: PartyStats[];
  constituencyData: ConstituencyResult[];
  globalSearchQuery?: string;
}

export function PartyTab({ partyStats, voteShare, constituencyData, globalSearchQuery = '' }: PartyTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const effectiveSearchQuery = globalSearchQuery || searchQuery;
  
  const filteredPartyStats = useMemo(() => {
    if (!effectiveSearchQuery.trim()) return partyStats;
    const query = effectiveSearchQuery.toLowerCase();
    return partyStats.filter(p => 
      p.party.toLowerCase().includes(query) ||
      getPartyShortName(p.party).toLowerCase().includes(query)
    );
  }, [partyStats, effectiveSearchQuery]);

  const topParties = filteredPartyStats.slice(0, 6);
  
  // Calculate party-wise highest margins
  const partyHighestMargins = topParties.map(party => {
    const partyConstituencies = constituencyData.filter(c => c.leadingParty === party.party);
    const highestMargin = partyConstituencies.sort((a, b) => b.margin - a.margin)[0];
    return { party: party.party, constituency: highestMargin };
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search parties by name or abbreviation..."
            value={globalSearchQuery || searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!!globalSearchQuery}
            className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm disabled:opacity-60"
          />
        </div>
        {effectiveSearchQuery && (
          <p className="text-xs text-muted-foreground mt-2">
            Found {filteredPartyStats.length} part{filteredPartyStats.length !== 1 ? 'ies' : 'y'}
            {globalSearchQuery && ' (using global search)'}
          </p>
        )}
      </div>

      {/* Party Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topParties.map((party, index) => (
          <div 
            key={party.party} 
            className="stat-card animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: getPartyColor(party.party) }}
              >
                {getPartyShortName(party.party).slice(0, 2)}
              </div>
              <PartyBadge party={party.party} size="lg" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Seats Won</span>
                <span className="font-bold text-xl">{party.seats}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Seat Share</span>
                <span className="font-medium">{formatPercentage(party.percentage)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PartyPieChart 
          data={partyStats} 
          title="Seat Distribution" 
        />
        <PartyBarChart 
          data={voteShare} 
          title="Vote Share by Party" 
          dataKey="percentage"
          maxItems={10}
        />
      </div>

      {/* Top Victories per Party */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Highest Victory Margins by Party</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partyHighestMargins.map((item, index) => (
            item.constituency && (
              <div 
                key={item.party}
                className="p-4 rounded-lg bg-muted/50 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getPartyColor(item.party) }}
                  />
                  <span className="font-medium text-sm">{getPartyShortName(item.party)}</span>
                </div>
                <p className="font-semibold">{item.constituency.constituency}</p>
                <p className="text-sm text-muted-foreground truncate" title={item.constituency.leadingCandidate}>
                  {item.constituency.leadingCandidate}
                </p>
                <p className="text-sm font-mono mt-1">
                  Margin: <span className="text-primary font-bold">{formatNumber(item.constituency.margin)}</span>
                </p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Party Comparison */}
      <PartyLeaderboard 
        data={filteredPartyStats} 
        title="Complete Party Rankings" 
        maxItems={15}
      />
    </div>
  );
}
