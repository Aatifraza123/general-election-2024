export interface ConstituencyResult {
  constituency: string;
  constNo: string;
  leadingCandidate: string;
  leadingParty: string;
  trailingCandidate: string;
  trailingParty: string;
  margin: number;
  status: string;
}

export interface CandidateResult {
  sn: number;
  candidate: string;
  party: string;
  evmVotes: number;
  postalVotes: number;
  totalVotes: number;
  votePercentage: number;
  state: string;
  constituency: string;
}

export interface DetailedResult {
  state: string;
  pcNo: number;
  pcName: string;
  slNo: number;
  candidate: string;
  party: string;
  evmVotes: number;
  postalVotes: number;
  totalVotes: number;
  voteShare: number;
}

export interface PartyStats {
  party: string;
  seats: number;
  votes: number;
  percentage: number;
  color: string;
}

export interface StateStats {
  state: string;
  totalSeats: number;
  parties: { [party: string]: number };
  totalVotes: number;
}

export interface InsightData {
  type: 'highlight' | 'warning' | 'trend' | 'comparison';
  title: string;
  description: string;
  value?: string | number;
  change?: number;
}
