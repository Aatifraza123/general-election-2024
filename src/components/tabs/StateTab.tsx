import { useState, useMemo } from 'react';
import { StateBarChart } from '../dashboard/StateBarChart';
import { IndiaMap } from '../dashboard/IndiaMap';
import { PartyBadge } from '../dashboard/PartyBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPartyShortName, getPartyColor, formatNumber } from '@/lib/analytics';
import type { StateStats, DetailedResult } from '@/types/election';

interface StateTabProps {
  stateStats: StateStats[];
  detailedData: DetailedResult[];
  states: string[];
}

export function StateTab({ stateStats, detailedData, states }: StateTabProps) {
  const [selectedState, setSelectedState] = useState<string>('all');

  const selectedStateData = useMemo(() => {
    if (selectedState === 'all') return null;
    return stateStats.find(s => s.state === selectedState);
  }, [selectedState, stateStats]);

  const stateConstituencies = useMemo(() => {
    if (selectedState === 'all') return [];
    
    // Group by constituency and find winners
    const constituencyMap = new Map<string, DetailedResult>();
    detailedData
      .filter(d => d.state === selectedState)
      .forEach(d => {
        const existing = constituencyMap.get(d.pcName);
        if (!existing || d.totalVotes > existing.totalVotes) {
          constituencyMap.set(d.pcName, d);
        }
      });
    
    return Array.from(constituencyMap.values()).sort((a, b) => a.pcNo - b.pcNo);
  }, [selectedState, detailedData]);

  // Calculate party-wise seats for selected state
  const statePartyBreakdown = useMemo(() => {
    if (!selectedStateData) return [];
    return Object.entries(selectedStateData.parties)
      .map(([party, seats]) => ({ party, seats }))
      .sort((a, b) => b.seats - a.seats);
  }, [selectedStateData]);

  return (
    <div className="space-y-6">
      {/* State Selector */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Select State:</span>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Choose a state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States Overview</SelectItem>
              {states.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedState === 'all' ? (
        <>
          {/* India Map */}
          <IndiaMap 
            stateStats={stateStats} 
            onStateClick={(state) => setSelectedState(state)}
          />

          {/* States Overview */}
          <StateBarChart 
            data={stateStats} 
            title="Constituencies by State/UT" 
            maxItems={20}
          />

          {/* State Cards */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-4">State-wise Party Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto scrollbar-thin">
              {stateStats.slice(0, 15).map((state, index) => {
                const topParties = Object.entries(state.parties)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3);

                return (
                  <div 
                    key={state.state}
                    className="p-4 rounded-lg bg-muted/50 animate-slide-up cursor-pointer hover:bg-muted/80 transition-colors"
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => setSelectedState(state.state)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{state.state}</h4>
                      <span className="text-lg font-bold text-primary">{state.totalSeats}</span>
                    </div>
                    <div className="space-y-2">
                      {topParties.map(([party, seats]) => (
                        <div key={party} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getPartyColor(party) }}
                            />
                            <span className="text-sm text-muted-foreground">{getPartyShortName(party)}</span>
                          </div>
                          <span className="text-sm font-medium">{seats}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Selected State Details */}
          {selectedStateData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* State Summary */}
              <div className="stat-card">
                <h3 className="font-semibold text-lg mb-4">{selectedStateData.state}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Seats</span>
                    <span className="font-bold text-2xl text-primary">{selectedStateData.totalSeats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parties Won</span>
                    <span className="font-medium">{Object.keys(selectedStateData.parties).length}</span>
                  </div>
                </div>
              </div>

              {/* Party Breakdown */}
              <div className="lg:col-span-2 chart-container">
                <h3 className="text-lg font-semibold mb-4">Party-wise Seats</h3>
                <div className="space-y-3">
                  {statePartyBreakdown.map((item, index) => (
                    <div 
                      key={item.party}
                      className="flex items-center gap-4 animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <PartyBadge party={item.party} />
                          <span className="font-bold">{item.seats}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(item.seats / selectedStateData.totalSeats) * 100}%`,
                              backgroundColor: getPartyColor(item.party)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Constituencies Table */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-4">Constituency Results in {selectedState}</h3>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Constituency</th>
                    <th>Winner</th>
                    <th>Party</th>
                    <th className="text-right">Votes</th>
                    <th className="text-right">Vote Share</th>
                  </tr>
                </thead>
                <tbody>
                  {stateConstituencies.map((row, index) => (
                    <tr key={index} className="animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
                      <td className="text-muted-foreground">{row.pcNo}</td>
                      <td className="font-medium">{row.pcName}</td>
                      <td className="max-w-[150px] truncate" title={row.candidate}>{row.candidate}</td>
                      <td><PartyBadge party={row.party} /></td>
                      <td className="text-right font-mono">{formatNumber(row.totalVotes)}</td>
                      <td className="text-right font-mono font-medium">{row.voteShare.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
