import { Vote, Users, MapPin, TrendingUp } from 'lucide-react';
import { StatCard } from '../dashboard/StatCard';
import { PartyPieChart } from '../dashboard/PartyPieChart';
import { PartyBarChart } from '../dashboard/PartyBarChart';
import { PartyLeaderboard } from '../dashboard/PartyLeaderboard';
import { InsightsList } from '../dashboard/InsightCard';
import { formatNumber } from '@/lib/analytics';
import type { PartyStats, InsightData } from '@/types/election';

interface OverviewTabProps {
  partyStats: PartyStats[];
  insights: InsightData[];
  totalVotes: number;
  totalConstituencies: number;
  totalCandidates: number;
  totalParties: number;
}

export function OverviewTab({ 
  partyStats, 
  insights, 
  totalVotes, 
  totalConstituencies, 
  totalCandidates,
  totalParties 
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="glass-card p-6 border-l-4 border-l-primary">
        <h2 className="text-xl font-bold mb-2">Executive Summary</h2>
        <p className="text-muted-foreground leading-relaxed">
          Analysis of the 2024 Indian General Elections covering <span className="text-foreground font-medium">{totalConstituencies} Lok Sabha constituencies</span> across 
          all states and union territories. The election saw participation from <span className="text-foreground font-medium">{formatNumber(totalCandidates)} candidates</span> representing 
          over <span className="text-foreground font-medium">{totalParties} political parties</span>, with a total of <span className="text-foreground font-medium">{formatNumber(totalVotes)} votes</span> cast.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Constituencies"
          value={totalConstituencies}
          subtitle="Lok Sabha seats"
          icon={MapPin}
          delay={0}
        />
        <StatCard
          title="Total Votes Cast"
          value={formatNumber(totalVotes)}
          subtitle="EVM + Postal"
          icon={Vote}
          delay={100}
        />
        <StatCard
          title="Total Candidates"
          value={formatNumber(totalCandidates)}
          subtitle="Across all constituencies"
          icon={Users}
          delay={200}
        />
        <StatCard
          title="Political Parties"
          value={totalParties}
          subtitle="Contested in elections"
          icon={TrendingUp}
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PartyPieChart 
          data={partyStats} 
          title="Seat Distribution by Party" 
        />
        <PartyLeaderboard 
          data={partyStats} 
          title="Party Leaderboard" 
        />
      </div>

      {/* Bar Chart and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PartyBarChart 
            data={partyStats} 
            title="Seats Won by Major Parties" 
            dataKey="seats"
          />
        </div>
        <InsightsList insights={insights} />
      </div>
    </div>
  );
}
