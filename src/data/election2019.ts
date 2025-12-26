// 2019 Indian General Election Results - Major Parties
// Source: Election Commission of India

export interface Election2019Result {
  party: string;
  seats2019: number;
  voteShare2019: number;
}

export const ELECTION_2019_DATA: Election2019Result[] = [
  { party: 'Bharatiya Janata Party', seats2019: 303, voteShare2019: 37.36 },
  { party: 'Indian National Congress', seats2019: 52, voteShare2019: 19.49 },
  { party: 'Dravida Munnetra Kazhagam', seats2019: 23, voteShare2019: 2.26 },
  { party: 'All India Trinamool Congress', seats2019: 22, voteShare2019: 4.07 },
  { party: 'Yuvajana Sramika Rythu Congress Party', seats2019: 22, voteShare2019: 2.53 },
  { party: 'Shiv Sena', seats2019: 18, voteShare2019: 2.10 },
  { party: 'Janata Dal (United)', seats2019: 16, voteShare2019: 1.46 },
  { party: 'Biju Janata Dal', seats2019: 12, voteShare2019: 1.66 },
  { party: 'Bahujan Samaj Party', seats2019: 10, voteShare2019: 3.63 },
  { party: 'Telugu Desam', seats2019: 3, voteShare2019: 2.34 },
  { party: 'Samajwadi Party', seats2019: 5, voteShare2019: 2.55 },
  { party: 'Nationalist Congress Party', seats2019: 5, voteShare2019: 1.39 },
  { party: 'Nationalist Congress Party – Sharadchandra Pawar', seats2019: 5, voteShare2019: 1.39 },
  { party: 'Communist Party of India (Marxist)', seats2019: 3, voteShare2019: 1.75 },
  { party: 'Aam Aadmi Party', seats2019: 1, voteShare2019: 0.44 },
  { party: 'Rashtriya Janata Dal', seats2019: 0, voteShare2019: 1.46 },
  { party: 'Jharkhand Mukti Morcha', seats2019: 1, voteShare2019: 0.38 },
  { party: 'Shiromani Akali Dal', seats2019: 2, voteShare2019: 0.80 },
  { party: 'Lok Janshakti Party', seats2019: 6, voteShare2019: 0.52 },
  { party: 'Janasena Party', seats2019: 0, voteShare2019: 0.69 },
  { party: 'Rashtriya Lok Dal', seats2019: 0, voteShare2019: 0.24 },
  { party: 'Asom Gana Parishad', seats2019: 0, voteShare2019: 0.28 },
  { party: 'Communist Party of India (Marxist-Leninist) (Liberation)', seats2019: 0, voteShare2019: 0.10 },
  { party: 'Jammu & Kashmir National Conference', seats2019: 3, voteShare2019: 0.29 },
  { party: 'Indian Union Muslim League', seats2019: 3, voteShare2019: 0.26 },
  { party: 'Kerala Congress (M)', seats2019: 1, voteShare2019: 0.12 },
  { party: 'All India Anna Dravida Munnetra Kazhagam', seats2019: 1, voteShare2019: 2.16 },
  { party: 'Bharat Adivasi Party', seats2019: 0, voteShare2019: 0 },
  { party: 'Independent', seats2019: 4, voteShare2019: 2.97 },
];

export function get2019Seats(party: string): number {
  const match = ELECTION_2019_DATA.find(d => d.party === party);
  return match?.seats2019 || 0;
}

export function get2019VoteShare(party: string): number {
  const match = ELECTION_2019_DATA.find(d => d.party === party);
  return match?.voteShare2019 || 0;
}
