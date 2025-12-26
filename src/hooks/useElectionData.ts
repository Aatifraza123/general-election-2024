import { useState, useEffect, useMemo } from 'react';
import { loadAllData } from '@/lib/dataLoader';
import { calculatePartyStats, calculateStateStats, calculateVoteShare, generateInsights } from '@/lib/analytics';
import type { ConstituencyResult, CandidateResult, DetailedResult, PartyStats, StateStats, InsightData } from '@/types/election';

export function useElectionData() {
  const [constituencyData, setConstituencyData] = useState<ConstituencyResult[]>([]);
  const [candidateData, setCandidateData] = useState<CandidateResult[]>([]);
  const [detailedData, setDetailedData] = useState<DetailedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllData()
      .then(({ constituencyData, candidateData, detailedData }) => {
        setConstituencyData(constituencyData);
        setCandidateData(candidateData);
        setDetailedData(detailedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const partyStats = useMemo(() => calculatePartyStats(constituencyData), [constituencyData]);
  const stateStats = useMemo(() => calculateStateStats(detailedData), [detailedData]);
  const voteShare = useMemo(() => calculateVoteShare(detailedData), [detailedData]);
  const insights = useMemo(() => generateInsights(constituencyData, detailedData), [constituencyData, detailedData]);

  const states = useMemo(() => {
    const stateSet = new Set(detailedData.map(d => d.state));
    return Array.from(stateSet).sort();
  }, [detailedData]);

  const parties = useMemo(() => {
    const partySet = new Set(constituencyData.map(d => d.leadingParty));
    return Array.from(partySet).sort();
  }, [constituencyData]);

  const totalVotes = useMemo(() => {
    return detailedData.reduce((sum, d) => sum + d.totalVotes, 0);
  }, [detailedData]);

  const totalConstituencies = constituencyData.length;
  const totalCandidates = useMemo(() => new Set(detailedData.map(d => d.candidate)).size, [detailedData]);

  return {
    constituencyData,
    candidateData,
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
  };
}
