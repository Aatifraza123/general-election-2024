import { useState } from 'react';
import { Header } from './dashboard/Header';
import { LoadingState } from './dashboard/LoadingState';
import { OverviewTab } from './tabs/OverviewTab';
import { PartyTab } from './tabs/PartyTab';
import { StateTab } from './tabs/StateTab';
import { ConstituencyTab } from './tabs/ConstituencyTab';
import { useElectionData } from '@/hooks/useElectionData';
import { AlertCircle } from 'lucide-react';

type Tab = 'overview' | 'parties' | 'states' | 'constituencies';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const {
    constituencyData,
    detailedData,
    partyStats,
    stateStats,
    voteShare,
    insights,
    states,
    parties,
    totalVotes,
    totalConstituencies,
    totalCandidates,
    loading,
    error,
  } = useElectionData();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Error Loading Data</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <LoadingState />
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab
                partyStats={partyStats}
                insights={insights}
                totalVotes={totalVotes}
                totalConstituencies={totalConstituencies}
                totalCandidates={totalCandidates}
                totalParties={parties.length}
              />
            )}
            
            {activeTab === 'parties' && (
              <PartyTab
                partyStats={partyStats}
                voteShare={voteShare}
                constituencyData={constituencyData}
              />
            )}
            
            {activeTab === 'states' && (
              <StateTab
                stateStats={stateStats}
                detailedData={detailedData}
                states={states}
              />
            )}
            
            {activeTab === 'constituencies' && (
              <ConstituencyTab
                constituencyData={constituencyData}
                states={states}
                parties={parties}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Election Analytics Dashboard • Data from Election Commission of India 2024
          </p>
          <p className="mt-1">
            Built with React, Recharts & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
