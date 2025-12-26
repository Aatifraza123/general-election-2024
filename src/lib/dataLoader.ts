import Papa from 'papaparse';
import type { ConstituencyResult, CandidateResult, DetailedResult } from '@/types/election';

export async function loadCSV<T>(url: string, transform: (row: any) => T): Promise<T[]> {
  const response = await fetch(url);
  const text = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map(transform).filter((item): item is T => item !== null);
        resolve(data);
      },
      error: reject,
    });
  });
}

export function parseConstituencyResult(row: any): ConstituencyResult | null {
  if (!row.Constituency) return null;
  return {
    constituency: row.Constituency,
    constNo: row['Const. No.'],
    leadingCandidate: row['Leading Candidate'],
    leadingParty: row['Leading Party'],
    trailingCandidate: row['Trailing Candidate'],
    trailingParty: row['Trailing Party'],
    margin: parseInt(row.Margin) || 0,
    status: row.Status,
  };
}

export function parseCandidateResult(row: any): CandidateResult | null {
  if (!row.Candidate) return null;
  return {
    sn: parseInt(row['S.N']) || 0,
    candidate: row.Candidate,
    party: row.Party,
    evmVotes: parseInt(row['EVM Votes']?.replace(/,/g, '')) || 0,
    postalVotes: parseInt(row['Postal Votes']?.replace(/,/g, '')) || 0,
    totalVotes: parseInt(row['Total Votes']?.replace(/,/g, '')) || 0,
    votePercentage: parseFloat(row['% of Votes']) || 0,
    state: row.State,
    constituency: row.Constituency,
  };
}

export function parseDetailedResult(row: any): DetailedResult | null {
  if (!row.Candidate) return null;
  const postalVotes = row['Postal Votes'] === '-' ? 0 : parseInt(row['Postal Votes']?.replace(/,/g, '')) || 0;
  return {
    state: row.State,
    pcNo: parseInt(row['PC No']) || 0,
    pcName: row['PC Name'],
    slNo: parseInt(row['Sl no']) || 0,
    candidate: row.Candidate,
    party: row.Party,
    evmVotes: parseInt(row['EVM Votes']?.replace(/,/g, '')) || 0,
    postalVotes,
    totalVotes: parseInt(row['Total Votes']?.replace(/,/g, '')) || 0,
    voteShare: parseFloat(row['Vote Share']) || 0,
  };
}

export async function loadAllData() {
  const [constituencyData, candidateData, detailedData] = await Promise.all([
    loadCSV('/data/sample_data.csv', parseConstituencyResult),
    loadCSV('/data/eci_data_2024.csv', parseCandidateResult),
    loadCSV('/data/results_2024.csv', parseDetailedResult),
  ]);

  return { constituencyData, candidateData, detailedData };
}
