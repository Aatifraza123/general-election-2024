import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Users, MapPin, Building2, Award } from 'lucide-react';
import { getPartyShortName, getPartyColor, formatNumber } from '@/lib/analytics';
import { get2019Seats } from '@/data/election2019';
import type { PartyStats, ConstituencyResult, DetailedResult, StateStats } from '@/types/election';
import { cn } from '@/lib/utils';

interface ComparisonTabProps {
  partyStats: PartyStats[];
  constituencyData: ConstituencyResult[];
  detailedData: DetailedResult[];
  stateStats: StateStats[];
  states: string[];
  parties: string[];
}

type ComparisonType = 'party' | 'state' | 'constituency' | 'candidate';

export function ComparisonTab({ 
  partyStats, 
  constituencyData, 
  detailedData, 
  stateStats,
  states,
  parties 
}: ComparisonTabProps) {
  const [comparisonType, setComparisonType] = useState<ComparisonType>('party');
  const [selectedParty1, setSelectedParty1] = useState<string>('');
  const [selectedParty2, setSelectedParty2] = useState<string>('');
  const [selectedState1, setSelectedState1] = useState<string>('');
  const [selectedState2, setSelectedState2] = useState<string>('');
  const [selectedCandidate1, setSelectedCandidate1] = useState<string>('');
  const [selectedCandidate2, setSelectedCandidate2] = useState<string>('');
  const [selectedConstituency1, setSelectedConstituency1] = useState<string>('');
  const [selectedConstituency2, setSelectedConstituency2] = useState<string>('');

  // All candidates list for selection
  const allCandidates = useMemo(() => {
    return constituencyData.map(c => ({
      name: c.leadingCandidate,
      constituency: c.constituency,
      party: c.leadingParty,
      margin: c.margin
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [constituencyData]);

  // All constituencies list
  const allConstituencies = useMemo(() => {
    return constituencyData.map(c => c.constituency).sort();
  }, [constituencyData]);

  // Party Comparison Data
  const partyComparisonData = useMemo(() => {
    if (!selectedParty1 || !selectedParty2) return null;

    const party1Data = partyStats.find(p => p.party === selectedParty1);
    const party2Data = partyStats.find(p => p.party === selectedParty2);

    if (!party1Data || !party2Data) return null;

    const party1Constituencies = constituencyData.filter(c => c.leadingParty === selectedParty1);
    const party2Constituencies = constituencyData.filter(c => c.leadingParty === selectedParty2);

    const party1AvgMargin = party1Constituencies.length > 0 
      ? party1Constituencies.reduce((sum, c) => sum + c.margin, 0) / party1Constituencies.length 
      : 0;
    const party2AvgMargin = party2Constituencies.length > 0 
      ? party2Constituencies.reduce((sum, c) => sum + c.margin, 0) / party2Constituencies.length 
      : 0;

    const party1MaxMargin = party1Constituencies.length > 0 
      ? Math.max(...party1Constituencies.map(c => c.margin)) 
      : 0;
    const party2MaxMargin = party2Constituencies.length > 0 
      ? Math.max(...party2Constituencies.map(c => c.margin)) 
      : 0;

    // Get 2019 data
    const party1Seats2019 = get2019Seats(selectedParty1);
    const party2Seats2019 = get2019Seats(selectedParty2);

    // Calculate vote share from detailed data
    const party1TotalVotes = detailedData
      .filter(d => d.party === selectedParty1)
      .reduce((sum, d) => sum + d.totalVotes, 0);
    const party2TotalVotes = detailedData
      .filter(d => d.party === selectedParty2)
      .reduce((sum, d) => sum + d.totalVotes, 0);
    
    const totalVotes = detailedData.reduce((sum, d) => sum + d.totalVotes, 0);
    const party1VoteShare = (party1TotalVotes / totalVotes) * 100;
    const party2VoteShare = (party2TotalVotes / totalVotes) * 100;

    return {
      party1: {
        name: selectedParty1,
        shortName: getPartyShortName(selectedParty1),
        seats: party1Data.seats,
        seats2019: party1Seats2019,
        seatChange: party1Data.seats - party1Seats2019,
        votes: party1Data.votes,
        totalVotes: party1TotalVotes,
        voteShare: party1VoteShare,
        percentage: party1Data.percentage,
        avgMargin: party1AvgMargin,
        maxMargin: party1MaxMargin,
        constituencies: party1Constituencies.length,
        color: getPartyColor(selectedParty1),
      },
      party2: {
        name: selectedParty2,
        shortName: getPartyShortName(selectedParty2),
        seats: party2Data.seats,
        seats2019: party2Seats2019,
        seatChange: party2Data.seats - party2Seats2019,
        votes: party2Data.votes,
        totalVotes: party2TotalVotes,
        voteShare: party2VoteShare,
        percentage: party2Data.percentage,
        avgMargin: party2AvgMargin,
        maxMargin: party2MaxMargin,
        constituencies: party2Constituencies.length,
        color: getPartyColor(selectedParty2),
      }
    };
  }, [selectedParty1, selectedParty2, partyStats, constituencyData, detailedData]);

  // State Comparison Data
  const stateComparisonData = useMemo(() => {
    if (!selectedState1 || !selectedState2) return null;

    const state1Data = stateStats.find(s => s.state === selectedState1);
    const state2Data = stateStats.find(s => s.state === selectedState2);

    if (!state1Data || !state2Data) return null;

    // Get detailed constituency data for each state
    const state1Constituencies = constituencyData.filter(c => 
      detailedData.some(d => d.state === selectedState1 && d.pcName === c.constituency)
    );
    const state2Constituencies = constituencyData.filter(c => 
      detailedData.some(d => d.state === selectedState2 && d.pcName === c.constituency)
    );

    // Calculate total votes for each state
    const state1TotalVotes = detailedData
      .filter(d => d.state === selectedState1)
      .reduce((sum, d) => sum + d.totalVotes, 0);
    const state2TotalVotes = detailedData
      .filter(d => d.state === selectedState2)
      .reduce((sum, d) => sum + d.totalVotes, 0);

    // Get dominant party (party with most seats)
    const state1DominantParty = Object.entries(state1Data.parties)
      .sort((a, b) => b[1] - a[1])[0];
    const state2DominantParty = Object.entries(state2Data.parties)
      .sort((a, b) => b[1])[0];

    // Calculate average margin
    const state1AvgMargin = state1Constituencies.length > 0
      ? state1Constituencies.reduce((sum, c) => sum + c.margin, 0) / state1Constituencies.length
      : 0;
    const state2AvgMargin = state2Constituencies.length > 0
      ? state2Constituencies.reduce((sum, c) => sum + c.margin, 0) / state2Constituencies.length
      : 0;

    // Get highest margin
    const state1MaxMargin = state1Constituencies.length > 0
      ? Math.max(...state1Constituencies.map(c => c.margin))
      : 0;
    const state2MaxMargin = state2Constituencies.length > 0
      ? Math.max(...state2Constituencies.map(c => c.margin))
      : 0;

    // Count unique parties
    const state1UniqueParties = Object.keys(state1Data.parties).length;
    const state2UniqueParties = Object.keys(state2Data.parties).length;

    return {
      state1: {
        ...state1Data,
        totalVotes: state1TotalVotes,
        dominantParty: state1DominantParty ? state1DominantParty[0] : 'N/A',
        dominantPartySeats: state1DominantParty ? state1DominantParty[1] : 0,
        avgMargin: state1AvgMargin,
        maxMargin: state1MaxMargin,
        uniqueParties: state1UniqueParties,
        constituencies: state1Constituencies,
      },
      state2: {
        ...state2Data,
        totalVotes: state2TotalVotes,
        dominantParty: state2DominantParty ? state2DominantParty[0] : 'N/A',
        dominantPartySeats: state2DominantParty ? state2DominantParty[1] : 0,
        avgMargin: state2AvgMargin,
        maxMargin: state2MaxMargin,
        uniqueParties: state2UniqueParties,
        constituencies: state2Constituencies,
      }
    };
  }, [selectedState1, selectedState2, stateStats, constituencyData, detailedData]);

  // Candidate Comparison Data
  const candidateComparisonData = useMemo(() => {
    if (!selectedCandidate1 || !selectedCandidate2) return null;

    const candidate1Data = constituencyData.find(c => c.leadingCandidate === selectedCandidate1);
    const candidate2Data = constituencyData.find(c => c.leadingCandidate === selectedCandidate2);

    if (!candidate1Data || !candidate2Data) return null;

    const candidate1Details = detailedData.find(d => 
      d.candidate === selectedCandidate1 && d.pcName === candidate1Data.constituency
    );
    const candidate2Details = detailedData.find(d => 
      d.candidate === selectedCandidate2 && d.pcName === candidate2Data.constituency
    );

    return {
      candidate1: {
        name: candidate1Data.leadingCandidate,
        party: candidate1Data.leadingParty,
        constituency: candidate1Data.constituency,
        state: 'India',
        margin: candidate1Data.margin,
        votes: candidate1Details?.totalVotes || 0,
        voteShare: candidate1Details?.voteShare || 0,
        color: getPartyColor(candidate1Data.leadingParty),
      },
      candidate2: {
        name: candidate2Data.leadingCandidate,
        party: candidate2Data.leadingParty,
        constituency: candidate2Data.constituency,
        state: 'India',
        margin: candidate2Data.margin,
        votes: candidate2Details?.totalVotes || 0,
        voteShare: candidate2Details?.voteShare || 0,
        color: getPartyColor(candidate2Data.leadingParty),
      }
    };
  }, [selectedCandidate1, selectedCandidate2, constituencyData, detailedData]);

  // Constituency Comparison Data
  const constituencyComparisonData = useMemo(() => {
    if (!selectedConstituency1 || !selectedConstituency2) return null;

    const const1Data = constituencyData.find(c => c.constituency === selectedConstituency1);
    const const2Data = constituencyData.find(c => c.constituency === selectedConstituency2);

    if (!const1Data || !const2Data) return null;

    const const1Detailed = detailedData.filter(d => d.pcName === selectedConstituency1);
    const const2Detailed = detailedData.filter(d => d.pcName === selectedConstituency2);

    const const1TotalVotes = const1Detailed.reduce((sum, d) => sum + d.totalVotes, 0);
    const const2TotalVotes = const2Detailed.reduce((sum, d) => sum + d.totalVotes, 0);

    const const1Candidates = const1Detailed.length;
    const const2Candidates = const2Detailed.length;

    const const1Parties = new Set(const1Detailed.map(d => d.party)).size;
    const const2Parties = new Set(const2Detailed.map(d => d.party)).size;

    return {
      constituency1: {
        name: selectedConstituency1,
        winner: const1Data.leadingCandidate,
        winnerParty: const1Data.leadingParty,
        margin: const1Data.margin,
        totalVotes: const1TotalVotes,
        candidates: const1Candidates,
        parties: const1Parties,
        color: getPartyColor(const1Data.leadingParty),
      },
      constituency2: {
        name: selectedConstituency2,
        winner: const2Data.leadingCandidate,
        winnerParty: const2Data.leadingParty,
        margin: const2Data.margin,
        totalVotes: const2TotalVotes,
        candidates: const2Candidates,
        parties: const2Parties,
        color: getPartyColor(const2Data.leadingParty),
      }
    };
  }, [selectedConstituency1, selectedConstituency2, constituencyData, detailedData]);

  // Top Candidates by Margin
  const topCandidates = useMemo(() => {
    return [...constituencyData]
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 10);
  }, [constituencyData]);

  // Closest Contests
  const closestContests = useMemo(() => {
    return [...constituencyData]
      .sort((a, b) => a.margin - b.margin)
      .slice(0, 10);
  }, [constituencyData]);

  return (
    <div className="space-y-6">
      {/* Comparison Type Selector */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Comparison Analysis</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setComparisonType('party')}
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              comparisonType === 'party' 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50"
            )}
          >
            <Building2 className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Party vs Party</p>
          </button>
          <button
            onClick={() => setComparisonType('state')}
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              comparisonType === 'state' 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50"
            )}
          >
            <MapPin className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">State vs State</p>
          </button>
          <button
            onClick={() => setComparisonType('constituency')}
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              comparisonType === 'constituency' 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50"
            )}
          >
            <Award className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Top Constituencies</p>
          </button>
          <button
            onClick={() => setComparisonType('candidate')}
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              comparisonType === 'candidate' 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50"
            )}
          >
            <Users className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Candidate vs Candidate</p>
          </button>
        </div>
      </div>

      {/* Party Comparison */}
      {comparisonType === 'party' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Select Parties to Compare</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Party 1</label>
                <Select value={selectedParty1} onValueChange={setSelectedParty1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first party" />
                  </SelectTrigger>
                  <SelectContent>
                    {parties.slice(0, 20).map(party => (
                      <SelectItem key={party} value={party}>
                        {getPartyShortName(party)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Party 2</label>
                <Select value={selectedParty2} onValueChange={setSelectedParty2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second party" />
                  </SelectTrigger>
                  <SelectContent>
                    {parties.slice(0, 20).map(party => (
                      <SelectItem key={party} value={party}>
                        {getPartyShortName(party)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {partyComparisonData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="stat-card" style={{ borderLeft: `4px solid ${partyComparisonData.party1.color}` }}>
                  <h4 className="text-lg font-bold mb-4">{partyComparisonData.party1.shortName}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Seats Won (2024)</span>
                      <span className="font-bold text-2xl">{partyComparisonData.party1.seats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seats (2019)</span>
                      <span className="font-medium">{partyComparisonData.party1.seats2019}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Change from 2019</span>
                      <span className={cn(
                        "font-bold flex items-center gap-1",
                        partyComparisonData.party1.seatChange > 0 ? "text-emerald-500" : 
                        partyComparisonData.party1.seatChange < 0 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {partyComparisonData.party1.seatChange > 0 ? <TrendingUp className="h-4 w-4" /> : 
                         partyComparisonData.party1.seatChange < 0 ? <TrendingDown className="h-4 w-4" /> : null}
                        {partyComparisonData.party1.seatChange > 0 ? '+' : ''}{partyComparisonData.party1.seatChange}
                      </span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seat Share</span>
                      <span className="font-medium">{partyComparisonData.party1.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vote Share</span>
                      <span className="font-medium">{partyComparisonData.party1.voteShare.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Votes</span>
                      <span className="font-medium">{formatNumber(partyComparisonData.party1.totalVotes)}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Victory Margin</span>
                      <span className="font-medium">{formatNumber(Math.round(partyComparisonData.party1.avgMargin))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Highest Margin</span>
                      <span className="font-medium">{formatNumber(partyComparisonData.party1.maxMargin)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card" style={{ borderLeft: `4px solid ${partyComparisonData.party2.color}` }}>
                  <h4 className="text-lg font-bold mb-4">{partyComparisonData.party2.shortName}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Seats Won (2024)</span>
                      <span className="font-bold text-2xl">{partyComparisonData.party2.seats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seats (2019)</span>
                      <span className="font-medium">{partyComparisonData.party2.seats2019}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Change from 2019</span>
                      <span className={cn(
                        "font-bold flex items-center gap-1",
                        partyComparisonData.party2.seatChange > 0 ? "text-emerald-500" : 
                        partyComparisonData.party2.seatChange < 0 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {partyComparisonData.party2.seatChange > 0 ? <TrendingUp className="h-4 w-4" /> : 
                         partyComparisonData.party2.seatChange < 0 ? <TrendingDown className="h-4 w-4" /> : null}
                        {partyComparisonData.party2.seatChange > 0 ? '+' : ''}{partyComparisonData.party2.seatChange}
                      </span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seat Share</span>
                      <span className="font-medium">{partyComparisonData.party2.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vote Share</span>
                      <span className="font-medium">{partyComparisonData.party2.voteShare.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Votes</span>
                      <span className="font-medium">{formatNumber(partyComparisonData.party2.totalVotes)}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Victory Margin</span>
                      <span className="font-medium">{formatNumber(Math.round(partyComparisonData.party2.avgMargin))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Highest Margin</span>
                      <span className="font-medium">{formatNumber(partyComparisonData.party2.maxMargin)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="chart-container">
                <h3 className="text-lg font-semibold mb-4">Performance Radar</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      {
                        metric: 'Seats',
                        [partyComparisonData.party1.shortName]: (partyComparisonData.party1.seats / 543) * 100,
                        [partyComparisonData.party2.shortName]: (partyComparisonData.party2.seats / 543) * 100,
                      },
                      {
                        metric: 'Seat %',
                        [partyComparisonData.party1.shortName]: partyComparisonData.party1.percentage,
                        [partyComparisonData.party2.shortName]: partyComparisonData.party2.percentage,
                      },
                    ]}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar 
                        name={partyComparisonData.party1.shortName} 
                        dataKey={partyComparisonData.party1.shortName} 
                        stroke={partyComparisonData.party1.color} 
                        fill={partyComparisonData.party1.color} 
                        fillOpacity={0.3}
                      />
                      <Radar 
                        name={partyComparisonData.party2.shortName} 
                        dataKey={partyComparisonData.party2.shortName} 
                        stroke={partyComparisonData.party2.color} 
                        fill={partyComparisonData.party2.color} 
                        fillOpacity={0.3}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* State Comparison - Detailed */}
      {comparisonType === 'state' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Select States to Compare</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedState1} onValueChange={setSelectedState1}>
                <SelectTrigger><SelectValue placeholder="Select first state" /></SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedState2} onValueChange={setSelectedState2}>
                <SelectTrigger><SelectValue placeholder="Select second state" /></SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {stateComparisonData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State 1 Stats */}
                <div className="stat-card border-l-4" style={{ borderLeftColor: getPartyColor(stateComparisonData.state1.dominantParty) }}>
                  <h4 className="text-lg font-bold mb-4">{stateComparisonData.state1.state}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Seats</span>
                      <span className="font-bold text-2xl">{stateComparisonData.state1.totalSeats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dominant Party</span>
                      <span className="font-medium">{getPartyShortName(stateComparisonData.state1.dominantParty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dominant Party Seats</span>
                      <span className="font-bold">{stateComparisonData.state1.dominantPartySeats}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Votes Cast</span>
                      <span className="font-medium">{formatNumber(stateComparisonData.state1.totalVotes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parties Won</span>
                      <span className="font-medium">{stateComparisonData.state1.uniqueParties}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Victory Margin</span>
                      <span className="font-medium">{formatNumber(Math.round(stateComparisonData.state1.avgMargin))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Highest Margin</span>
                      <span className="font-medium">{formatNumber(stateComparisonData.state1.maxMargin)}</span>
                    </div>
                  </div>
                </div>

                {/* State 2 Stats */}
                <div className="stat-card border-l-4" style={{ borderLeftColor: getPartyColor(stateComparisonData.state2.dominantParty) }}>
                  <h4 className="text-lg font-bold mb-4">{stateComparisonData.state2.state}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Seats</span>
                      <span className="font-bold text-2xl">{stateComparisonData.state2.totalSeats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dominant Party</span>
                      <span className="font-medium">{getPartyShortName(stateComparisonData.state2.dominantParty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dominant Party Seats</span>
                      <span className="font-bold">{stateComparisonData.state2.dominantPartySeats}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Votes Cast</span>
                      <span className="font-medium">{formatNumber(stateComparisonData.state2.totalVotes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parties Won</span>
                      <span className="font-medium">{stateComparisonData.state2.uniqueParties}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Victory Margin</span>
                      <span className="font-medium">{formatNumber(Math.round(stateComparisonData.state2.avgMargin))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Highest Margin</span>
                      <span className="font-medium">{formatNumber(stateComparisonData.state2.maxMargin)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Party Distribution Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="chart-container">
                  <h3 className="text-lg font-semibold mb-4">{stateComparisonData.state1.state} - Party Distribution</h3>
                  <div className="space-y-2">
                    {Object.entries(stateComparisonData.state1.parties)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([party, seats]) => (
                        <div key={party} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{getPartyShortName(party)}</span>
                              <span className="text-sm font-bold">{seats}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${(seats / stateComparisonData.state1.totalSeats) * 100}%`,
                                  backgroundColor: getPartyColor(party)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="chart-container">
                  <h3 className="text-lg font-semibold mb-4">{stateComparisonData.state2.state} - Party Distribution</h3>
                  <div className="space-y-2">
                    {Object.entries(stateComparisonData.state2.parties)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([party, seats]) => (
                        <div key={party} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{getPartyShortName(party)}</span>
                              <span className="text-sm font-bold">{seats}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${(seats / stateComparisonData.state2.totalSeats) * 100}%`,
                                  backgroundColor: getPartyColor(party)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Comparison Bar Chart */}
              <div className="chart-container">
                <h3 className="text-lg font-semibold mb-4">Side-by-Side Comparison</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          metric: 'Total Seats',
                          [stateComparisonData.state1.state]: stateComparisonData.state1.totalSeats,
                          [stateComparisonData.state2.state]: stateComparisonData.state2.totalSeats,
                        },
                        {
                          metric: 'Parties Won',
                          [stateComparisonData.state1.state]: stateComparisonData.state1.uniqueParties,
                          [stateComparisonData.state2.state]: stateComparisonData.state2.uniqueParties,
                        },
                        {
                          metric: 'Avg Margin (K)',
                          [stateComparisonData.state1.state]: Math.round(stateComparisonData.state1.avgMargin / 1000),
                          [stateComparisonData.state2.state]: Math.round(stateComparisonData.state2.avgMargin / 1000),
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey={stateComparisonData.state1.state} fill={getPartyColor(stateComparisonData.state1.dominantParty)} radius={[4, 4, 0, 0]} />
                      <Bar dataKey={stateComparisonData.state2.state} fill={getPartyColor(stateComparisonData.state2.dominantParty)} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Constituency Comparison */}
      {comparisonType === 'constituency' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Select Constituencies to Compare</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Constituency 1</label>
                <Select value={selectedConstituency1} onValueChange={setSelectedConstituency1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first constituency" />
                  </SelectTrigger>
                  <SelectContent>
                    {allConstituencies.map(constituency => (
                      <SelectItem key={constituency} value={constituency}>
                        {constituency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Constituency 2</label>
                <Select value={selectedConstituency2} onValueChange={setSelectedConstituency2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second constituency" />
                  </SelectTrigger>
                  <SelectContent>
                    {allConstituencies.map(constituency => (
                      <SelectItem key={constituency} value={constituency}>
                        {constituency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {constituencyComparisonData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Constituency 1 Stats */}
                <div className="stat-card" style={{ borderLeft: `4px solid ${constituencyComparisonData.constituency1.color}` }}>
                  <h4 className="text-lg font-bold mb-2">{constituencyComparisonData.constituency1.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Winner: {constituencyComparisonData.constituency1.winner}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Winning Party</span>
                      <span className="font-medium">{getPartyShortName(constituencyComparisonData.constituency1.winnerParty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Victory Margin</span>
                      <span className="font-bold text-emerald-500">{formatNumber(constituencyComparisonData.constituency1.margin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Votes</span>
                      <span className="font-bold">{formatNumber(constituencyComparisonData.constituency1.totalVotes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Candidates</span>
                      <span className="font-medium">{constituencyComparisonData.constituency1.candidates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parties</span>
                      <span className="font-medium">{constituencyComparisonData.constituency1.parties}</span>
                    </div>
                  </div>
                </div>

                {/* Constituency 2 Stats */}
                <div className="stat-card" style={{ borderLeft: `4px solid ${constituencyComparisonData.constituency2.color}` }}>
                  <h4 className="text-lg font-bold mb-2">{constituencyComparisonData.constituency2.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Winner: {constituencyComparisonData.constituency2.winner}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Winning Party</span>
                      <span className="font-medium">{getPartyShortName(constituencyComparisonData.constituency2.winnerParty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Victory Margin</span>
                      <span className="font-bold text-emerald-500">{formatNumber(constituencyComparisonData.constituency2.margin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Votes</span>
                      <span className="font-bold">{formatNumber(constituencyComparisonData.constituency2.totalVotes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Candidates</span>
                      <span className="font-medium">{constituencyComparisonData.constituency2.candidates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parties</span>
                      <span className="font-medium">{constituencyComparisonData.constituency2.parties}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="chart-container">
                  <h3 className="text-lg font-semibold mb-4">Metrics Comparison</h3>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { 
                            metric: 'Total Votes', 
                            [constituencyComparisonData.constituency1.name.substring(0, 15)]: constituencyComparisonData.constituency1.totalVotes, 
                            [constituencyComparisonData.constituency2.name.substring(0, 15)]: constituencyComparisonData.constituency2.totalVotes 
                          },
                          { 
                            metric: 'Victory Margin', 
                            [constituencyComparisonData.constituency1.name.substring(0, 15)]: constituencyComparisonData.constituency1.margin, 
                            [constituencyComparisonData.constituency2.name.substring(0, 15)]: constituencyComparisonData.constituency2.margin 
                          },
                          { 
                            metric: 'Candidates', 
                            [constituencyComparisonData.constituency1.name.substring(0, 15)]: constituencyComparisonData.constituency1.candidates, 
                            [constituencyComparisonData.constituency2.name.substring(0, 15)]: constituencyComparisonData.constituency2.candidates 
                          },
                          { 
                            metric: 'Parties', 
                            [constituencyComparisonData.constituency1.name.substring(0, 15)]: constituencyComparisonData.constituency1.parties, 
                            [constituencyComparisonData.constituency2.name.substring(0, 15)]: constituencyComparisonData.constituency2.parties 
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis type="category" dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={100} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => formatNumber(value)}
                        />
                        <Legend />
                        <Bar 
                          dataKey={constituencyComparisonData.constituency1.name.substring(0, 15)} 
                          fill={constituencyComparisonData.constituency1.color} 
                          radius={[0, 4, 4, 0]} 
                        />
                        <Bar 
                          dataKey={constituencyComparisonData.constituency2.name.substring(0, 15)} 
                          fill={constituencyComparisonData.constituency2.color} 
                          radius={[0, 4, 4, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Charts */}
                <div className="chart-container">
                  <h3 className="text-lg font-semibold mb-4">Participation Comparison</h3>
                  <div className="h-[350px] grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-center mb-2 font-medium">{constituencyComparisonData.constituency1.name.substring(0, 20)}</p>
                      <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Candidates', value: constituencyComparisonData.constituency1.candidates },
                              { name: 'Parties', value: constituencyComparisonData.constituency1.parties }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill={constituencyComparisonData.constituency1.color}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <p className="text-xs text-center mb-2 font-medium">{constituencyComparisonData.constituency2.name.substring(0, 20)}</p>
                      <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Candidates', value: constituencyComparisonData.constituency2.candidates },
                              { name: 'Parties', value: constituencyComparisonData.constituency2.parties }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill={constituencyComparisonData.constituency2.color}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Winner Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat-card">
                  <p className="text-sm text-muted-foreground mb-2">More Total Votes</p>
                  <p className="font-bold text-lg">
                    {constituencyComparisonData.constituency1.totalVotes > constituencyComparisonData.constituency2.totalVotes 
                      ? constituencyComparisonData.constituency1.name.substring(0, 20)
                      : constituencyComparisonData.constituency2.name.substring(0, 20)
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    by {formatNumber(Math.abs(constituencyComparisonData.constituency1.totalVotes - constituencyComparisonData.constituency2.totalVotes))} votes
                  </p>
                </div>
                <div className="stat-card">
                  <p className="text-sm text-muted-foreground mb-2">Bigger Victory Margin</p>
                  <p className="font-bold text-lg">
                    {constituencyComparisonData.constituency1.margin > constituencyComparisonData.constituency2.margin 
                      ? constituencyComparisonData.constituency1.name.substring(0, 20)
                      : constituencyComparisonData.constituency2.name.substring(0, 20)
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    by {formatNumber(Math.abs(constituencyComparisonData.constituency1.margin - constituencyComparisonData.constituency2.margin))}
                  </p>
                </div>
                <div className="stat-card">
                  <p className="text-sm text-muted-foreground mb-2">More Candidates</p>
                  <p className="font-bold text-lg">
                    {constituencyComparisonData.constituency1.candidates > constituencyComparisonData.constituency2.candidates 
                      ? constituencyComparisonData.constituency1.name.substring(0, 20)
                      : constituencyComparisonData.constituency2.name.substring(0, 20)
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.abs(constituencyComparisonData.constituency1.candidates - constituencyComparisonData.constituency2.candidates)} more candidates
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Top Constituencies Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-container">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Highest Victory Margins
              </h3>
              <div className="space-y-3">
                {topCandidates.map((c) => (
                  <div key={c.constituency} className="p-3 rounded-lg bg-muted/50">
                    <p className="font-semibold text-sm">{c.constituency}</p>
                    <p className="text-xs text-muted-foreground">{c.leadingCandidate}</p>
                    <p className="text-emerald-500 font-bold">{formatNumber(c.margin)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-container">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-amber-500" />
                Closest Contests
              </h3>
              <div className="space-y-3">
                {closestContests.map((c) => (
                  <div key={c.constituency} className="p-3 rounded-lg bg-muted/50">
                    <p className="font-semibold text-sm">{c.constituency}</p>
                    <p className="text-xs text-muted-foreground">{c.leadingCandidate}</p>
                    <p className="text-amber-500 font-bold">{formatNumber(c.margin)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Comparison */}
      {comparisonType === 'candidate' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Select Candidates to Compare</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Candidate 1</label>
                <Select value={selectedCandidate1} onValueChange={setSelectedCandidate1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCandidates.map(candidate => (
                      <SelectItem key={`${candidate.name}-${candidate.constituency}`} value={candidate.name}>
                        {candidate.name} ({candidate.constituency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Candidate 2</label>
                <Select value={selectedCandidate2} onValueChange={setSelectedCandidate2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCandidates.map(candidate => (
                      <SelectItem key={`${candidate.name}-${candidate.constituency}`} value={candidate.name}>
                        {candidate.name} ({candidate.constituency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {candidateComparisonData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="stat-card" style={{ borderLeft: `4px solid ${candidateComparisonData.candidate1.color}` }}>
                  <h4 className="text-lg font-bold mb-2">{candidateComparisonData.candidate1.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {getPartyShortName(candidateComparisonData.candidate1.party)}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Constituency</span>
                      <span className="font-medium text-right">{candidateComparisonData.candidate1.constituency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Votes</span>
                      <span className="font-bold text-xl">{formatNumber(candidateComparisonData.candidate1.votes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Victory Margin</span>
                      <span className="font-bold text-emerald-500">{formatNumber(candidateComparisonData.candidate1.margin)}</span>
                    </div>
                  </div>
                </div>
                <div className="stat-card" style={{ borderLeft: `4px solid ${candidateComparisonData.candidate2.color}` }}>
                  <h4 className="text-lg font-bold mb-2">{candidateComparisonData.candidate2.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {getPartyShortName(candidateComparisonData.candidate2.party)}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Constituency</span>
                      <span className="font-medium text-right">{candidateComparisonData.candidate2.constituency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Votes</span>
                      <span className="font-bold text-xl">{formatNumber(candidateComparisonData.candidate2.votes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Victory Margin</span>
                      <span className="font-bold text-emerald-500">{formatNumber(candidateComparisonData.candidate2.margin)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart for Candidates */}
              <div className="chart-container">
                <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      {
                        metric: 'Votes',
                        [candidateComparisonData.candidate1.name.split(' ')[0]]: (candidateComparisonData.candidate1.votes / 1000000) * 100,
                        [candidateComparisonData.candidate2.name.split(' ')[0]]: (candidateComparisonData.candidate2.votes / 1000000) * 100,
                      },
                      {
                        metric: 'Vote Share',
                        [candidateComparisonData.candidate1.name.split(' ')[0]]: candidateComparisonData.candidate1.voteShare,
                        [candidateComparisonData.candidate2.name.split(' ')[0]]: candidateComparisonData.candidate2.voteShare,
                      },
                      {
                        metric: 'Margin',
                        [candidateComparisonData.candidate1.name.split(' ')[0]]: (candidateComparisonData.candidate1.margin / 500000) * 100,
                        [candidateComparisonData.candidate2.name.split(' ')[0]]: (candidateComparisonData.candidate2.margin / 500000) * 100,
                      },
                    ]}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar 
                        name={candidateComparisonData.candidate1.name.split(' ')[0]} 
                        dataKey={candidateComparisonData.candidate1.name.split(' ')[0]} 
                        stroke={candidateComparisonData.candidate1.color} 
                        fill={candidateComparisonData.candidate1.color} 
                        fillOpacity={0.4}
                      />
                      <Radar 
                        name={candidateComparisonData.candidate2.name.split(' ')[0]} 
                        dataKey={candidateComparisonData.candidate2.name.split(' ')[0]} 
                        stroke={candidateComparisonData.candidate2.color} 
                        fill={candidateComparisonData.candidate2.color} 
                        fillOpacity={0.4}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="chart-container">
                <h3 className="text-lg font-semibold mb-4">Metrics Comparison</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { 
                          metric: 'Votes', 
                          [candidateComparisonData.candidate1.name.split(' ')[0]]: candidateComparisonData.candidate1.votes, 
                          [candidateComparisonData.candidate2.name.split(' ')[0]]: candidateComparisonData.candidate2.votes 
                        },
                        { 
                          metric: 'Margin', 
                          [candidateComparisonData.candidate1.name.split(' ')[0]]: candidateComparisonData.candidate1.margin, 
                          [candidateComparisonData.candidate2.name.split(' ')[0]]: candidateComparisonData.candidate2.margin 
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={candidateComparisonData.candidate1.name.split(' ')[0]} fill={candidateComparisonData.candidate1.color} radius={[4, 4, 0, 0]} />
                      <Bar dataKey={candidateComparisonData.candidate2.name.split(' ')[0]} fill={candidateComparisonData.candidate2.color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
