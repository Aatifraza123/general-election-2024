import type { ConstituencyResult, DetailedResult, PartyStats, StateStats, InsightData } from '@/types/election';

// Major party short names for display
export const MAJOR_PARTIES = [
  'Bharatiya Janata Party',
  'Indian National Congress',
  'Samajwadi Party',
  'All India Trinamool Congress',
  'Dravida Munnetra Kazhagam',
  'Telugu Desam',
  'Janata Dal (United)',
  'Shiv Sena',
  'Nationalist Congress Party – Sharadchandra Pawar',
  'Aam Aadmi Party',
  'Communist Party of India (Marxist)',
  'Yuvajana Sramika Rythu Congress Party',
  'Rashtriya Janata Dal',
  'Biju Janata Dal',
];

export const PARTY_SHORT_NAMES: { [key: string]: string } = {
  'Bharatiya Janata Party': 'BJP',
  'Indian National Congress': 'INC',
  'Samajwadi Party': 'SP',
  'All India Trinamool Congress': 'TMC',
  'Dravida Munnetra Kazhagam': 'DMK',
  'Telugu Desam': 'TDP',
  'Janata Dal (United)': 'JD(U)',
  'Shiv Sena': 'SHS',
  'Nationalist Congress Party – Sharadchandra Pawar': 'NCP-SP',
  'Aam Aadmi Party': 'AAP',
  'Communist Party of India (Marxist)': 'CPI(M)',
  'Yuvajana Sramika Rythu Congress Party': 'YSRCP',
  'Rashtriya Janata Dal': 'RJD',
  'Biju Janata Dal': 'BJD',
  'Janasena Party': 'JSP',
  'Communist Party of India (Marxist-Leninist) (Liberation)': 'CPI(ML)',
  'Shiromani Akali Dal': 'SAD',
  'Jharkhand Mukti Morcha': 'JMM',
  'Rashtriya Lok Dal': 'RLD',
};

export const PARTY_COLORS: { [key: string]: string } = {
  'Bharatiya Janata Party': 'hsl(24, 95%, 53%)',
  'Indian National Congress': 'hsl(210, 70%, 45%)',
  'Samajwadi Party': 'hsl(0, 75%, 45%)',
  'All India Trinamool Congress': 'hsl(150, 60%, 40%)',
  'Dravida Munnetra Kazhagam': 'hsl(0, 75%, 50%)',
  'Telugu Desam': 'hsl(45, 100%, 50%)',
  'Janata Dal (United)': 'hsl(120, 50%, 45%)',
  'Aam Aadmi Party': 'hsl(45, 100%, 50%)',
  'Communist Party of India (Marxist)': 'hsl(0, 80%, 40%)',
  'Yuvajana Sramika Rythu Congress Party': 'hsl(200, 70%, 50%)',
  'default': 'hsl(220, 10%, 50%)',
};

export function getPartyColor(party: string): string {
  return PARTY_COLORS[party] || PARTY_COLORS['default'];
}

export function getPartyShortName(party: string): string {
  return PARTY_SHORT_NAMES[party] || party.split(' ').map(w => w[0]).join('').slice(0, 5);
}

export function calculatePartyStats(data: ConstituencyResult[]): PartyStats[] {
  const partyMap = new Map<string, { seats: number; votes: number }>();

  data.forEach((row) => {
    const party = row.leadingParty;
    const existing = partyMap.get(party) || { seats: 0, votes: 0 };
    partyMap.set(party, {
      seats: existing.seats + 1,
      votes: existing.votes + row.margin,
    });
  });

  const totalSeats = data.length;
  const stats: PartyStats[] = [];

  partyMap.forEach((value, party) => {
    stats.push({
      party,
      seats: value.seats,
      votes: value.votes,
      percentage: (value.seats / totalSeats) * 100,
      color: getPartyColor(party),
    });
  });

  return stats.sort((a, b) => b.seats - a.seats);
}

export function calculateStateStats(data: DetailedResult[]): StateStats[] {
  const stateMap = new Map<string, StateStats>();

  // Get winner per constituency
  const constituencyWinners = new Map<string, { party: string; votes: number }>();
  
  data.forEach((row) => {
    const key = `${row.state}-${row.pcName}`;
    const existing = constituencyWinners.get(key);
    
    if (!existing || row.totalVotes > existing.votes) {
      constituencyWinners.set(key, { party: row.party, votes: row.totalVotes });
    }
  });

  // Aggregate by state
  constituencyWinners.forEach((winner, key) => {
    const state = key.split('-')[0];
    const existing = stateMap.get(state) || { state, totalSeats: 0, parties: {}, totalVotes: 0 };
    
    existing.totalSeats += 1;
    existing.parties[winner.party] = (existing.parties[winner.party] || 0) + 1;
    existing.totalVotes += winner.votes;
    
    stateMap.set(state, existing);
  });

  return Array.from(stateMap.values()).sort((a, b) => b.totalSeats - a.totalSeats);
}

export function calculateVoteShare(data: DetailedResult[]): PartyStats[] {
  const partyVotes = new Map<string, number>();
  let totalVotes = 0;

  data.forEach((row) => {
    if (row.party !== 'None of the Above') {
      const existing = partyVotes.get(row.party) || 0;
      partyVotes.set(row.party, existing + row.totalVotes);
      totalVotes += row.totalVotes;
    }
  });

  const stats: PartyStats[] = [];
  partyVotes.forEach((votes, party) => {
    stats.push({
      party,
      seats: 0,
      votes,
      percentage: (votes / totalVotes) * 100,
      color: getPartyColor(party),
    });
  });

  return stats.sort((a, b) => b.votes - a.votes);
}

export function generateInsights(constituencyData: ConstituencyResult[], detailedData: DetailedResult[]): InsightData[] {
  const insights: InsightData[] = [];
  const partyStats = calculatePartyStats(constituencyData);
  
  // Biggest winner
  const topParty = partyStats[0];
  if (topParty) {
    insights.push({
      type: 'highlight',
      title: 'Leading Party',
      description: `${getPartyShortName(topParty.party)} leads with ${topParty.seats} seats (${topParty.percentage.toFixed(1)}% of total)`,
      value: topParty.seats,
    });
  }

  // Closest contest
  const closestContest = [...constituencyData].sort((a, b) => a.margin - b.margin)[0];
  if (closestContest) {
    insights.push({
      type: 'warning',
      title: 'Closest Contest',
      description: `${closestContest.constituency}: ${closestContest.leadingCandidate} won by just ${closestContest.margin.toLocaleString()} votes`,
      value: closestContest.margin,
    });
  }

  // Biggest margin
  const biggestMargin = [...constituencyData].sort((a, b) => b.margin - a.margin)[0];
  if (biggestMargin) {
    insights.push({
      type: 'highlight',
      title: 'Biggest Victory Margin',
      description: `${biggestMargin.constituency}: ${biggestMargin.leadingCandidate} won by ${biggestMargin.margin.toLocaleString()} votes`,
      value: biggestMargin.margin,
    });
  }

  // NDA vs INDIA comparison (simplified)
  const bjpSeats = partyStats.find(p => p.party === 'Bharatiya Janata Party')?.seats || 0;
  const incSeats = partyStats.find(p => p.party === 'Indian National Congress')?.seats || 0;
  
  insights.push({
    type: 'comparison',
    title: 'BJP vs INC',
    description: `BJP leads with ${bjpSeats} seats compared to INC's ${incSeats} seats`,
    value: bjpSeats - incSeats,
    change: ((bjpSeats - incSeats) / incSeats) * 100,
  });

  // Total candidates
  const uniqueCandidates = new Set(detailedData.map(d => d.candidate)).size;
  insights.push({
    type: 'trend',
    title: 'Total Candidates',
    description: `${uniqueCandidates.toLocaleString()} candidates contested across all constituencies`,
    value: uniqueCandidates,
  });

  return insights;
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
  if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function formatPercentage(num: number): string {
  return num.toFixed(1) + '%';
}
