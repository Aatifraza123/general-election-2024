import { useState, useMemo } from 'react';
import { ConstituencyTable } from '../dashboard/ConstituencyTable';
import { StatCard } from '../dashboard/StatCard';
import { Filters } from '../dashboard/Filters';
import { Award, TrendingDown, BarChart2, Search } from 'lucide-react';
import { formatNumber } from '@/lib/analytics';
import type { ConstituencyResult } from '@/types/election';

interface ConstituencyTabProps {
  constituencyData: ConstituencyResult[];
  states: string[];
  parties: string[];
  globalSearchQuery?: string;
}

export function ConstituencyTab({ constituencyData, states, parties, globalSearchQuery = '' }: ConstituencyTabProps) {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedParty, setSelectedParty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Use global search if provided, otherwise use local search
  const effectiveSearchQuery = globalSearchQuery || searchQuery;

  const filteredData = useMemo(() => {
    let data = constituencyData;
    
    // Filter by party
    if (selectedParty !== 'all') {
      data = data.filter(d => d.leadingParty === selectedParty);
    }
    
    // Filter by search query (use effective search query)
    if (effectiveSearchQuery.trim()) {
      const query = effectiveSearchQuery.toLowerCase();
      data = data.filter(d => 
        d.constituency.toLowerCase().includes(query) ||
        d.leadingCandidate.toLowerCase().includes(query) ||
        d.leadingParty.toLowerCase().includes(query)
      );
    }
    
    return data;
  }, [constituencyData, selectedParty, effectiveSearchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => a.margin - b.margin);
    const avgMargin = filteredData.reduce((sum, d) => sum + d.margin, 0) / filteredData.length;
    const closestMargins = sorted.slice(0, 10);
    const highestMargins = sorted.slice(-10).reverse();

    return {
      totalSeats: filteredData.length,
      avgMargin: Math.round(avgMargin),
      closestContest: sorted[0],
      biggestVictory: sorted[sorted.length - 1],
      closestMargins,
      highestMargins,
    };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by constituency, candidate, or party..."
            value={globalSearchQuery || searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!!globalSearchQuery}
            className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm disabled:opacity-60"
          />
        </div>
        {effectiveSearchQuery && (
          <p className="text-xs text-muted-foreground mt-2">
            Found {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
            {globalSearchQuery && ' (using global search)'}
          </p>
        )}
      </div>

      {/* Filters */}
      <Filters
        states={states}
        parties={parties}
        selectedState={selectedState}
        selectedParty={selectedParty}
        onStateChange={setSelectedState}
        onPartyChange={setSelectedParty}
        onClear={() => { 
          setSelectedState('all'); 
          setSelectedParty('all'); 
          setSearchQuery('');
        }}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Constituencies"
          value={stats.totalSeats}
          subtitle={selectedParty !== 'all' ? `Won by ${selectedParty}` : 'Total analyzed'}
          icon={BarChart2}
        />
        <StatCard
          title="Average Margin"
          value={formatNumber(stats.avgMargin)}
          subtitle="Across constituencies"
          icon={Award}
        />
        <StatCard
          title="Closest Contest"
          value={formatNumber(stats.closestContest?.margin || 0)}
          subtitle={stats.closestContest?.constituency || 'N/A'}
          icon={TrendingDown}
        />
      </div>

      {/* Margin Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Closest Contests */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-amber-500" />
            Closest Contests (Nail-biters)
          </h3>
          <div className="space-y-3">
            {stats.closestMargins.map((c, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{c.constituency}</p>
                  <p className="text-sm text-muted-foreground truncate">{c.leadingCandidate}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-mono font-bold text-amber-500">{formatNumber(c.margin)}</p>
                  <p className="text-xs text-muted-foreground">margin</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Biggest Victories */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-500" />
            Biggest Victories (Landslides)
          </h3>
          <div className="space-y-3">
            {stats.highestMargins.map((c, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{c.constituency}</p>
                  <p className="text-sm text-muted-foreground truncate">{c.leadingCandidate}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-mono font-bold text-emerald-500">{formatNumber(c.margin)}</p>
                  <p className="text-xs text-muted-foreground">margin</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Table */}
      <ConstituencyTable 
        data={filteredData} 
        title="All Constituency Results" 
      />
    </div>
  );
}
