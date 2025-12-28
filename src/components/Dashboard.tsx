import { useState } from 'react';
import { Header } from './dashboard/Header';
import { LoadingState } from './dashboard/LoadingState';
import { OverviewTab } from './tabs/OverviewTab';
import { PartyTab } from './tabs/PartyTab';
import { StateTab } from './tabs/StateTab';
import { ConstituencyTab } from './tabs/ConstituencyTab';
import { ComparisonTab } from './tabs/ComparisonTab';
import { ElectionComparison } from './dashboard/ElectionComparison';
import { AIQueryPanel } from './dashboard/AIQueryPanel';
import { useElectionData } from '@/hooks/useElectionData';
import { AlertCircle } from 'lucide-react';

type Tab = 'overview' | 'parties' | 'states' | 'constituencies' | 'comparison' | 'comparison2019' | 'ai';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Clear search when changing tabs
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // Optionally clear search when changing tabs
    // setSearchQuery('');
  };

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
      <Header activeTab={activeTab} onTabChange={handleTabChange} onSearch={handleSearch} />
      
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

            {activeTab === 'ai' && (
              <AIQueryPanel />
            )}

            {activeTab === 'comparison2019' && (
              <ElectionComparison partyStats={partyStats} />
            )}

            {activeTab === 'comparison' && (
              <ComparisonTab
                partyStats={partyStats}
                constituencyData={constituencyData}
                detailedData={detailedData}
                stateStats={stateStats}
                states={states}
                parties={parties}
              />
            )}
            
            {activeTab === 'parties' && (
              <PartyTab
                partyStats={partyStats}
                voteShare={voteShare}
                constituencyData={constituencyData}
                globalSearchQuery={searchQuery}
              />
            )}
            
            {activeTab === 'states' && (
              <StateTab
                stateStats={stateStats}
                detailedData={detailedData}
                states={states}
                globalSearchQuery={searchQuery}
              />
            )}
            
            {activeTab === 'constituencies' && (
              <ConstituencyTab
                constituencyData={constituencyData}
                states={states}
                parties={parties}
                globalSearchQuery={searchQuery}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-orange-500 text-lg">🗳️</span>
            <span className="font-semibold text-foreground">Insight Navigator</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-medium">India General Elections 2024</span>
          </p>
          <p className="mt-2 flex items-center justify-center gap-2 flex-wrap">
            <span>📊 Data: Election Commission of India</span>
            <span className="hidden sm:inline">•</span>
            <span>🤖 AI: Gemini 2.0 & Groq</span>
          </p>
          <p className="mt-1 text-xs">
            Built with React, TypeScript, Recharts & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
