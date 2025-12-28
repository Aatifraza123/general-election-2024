// 2019 Indian General Election Results - Complete Data
// Source: Election Commission of India
// Party names matched with 2024 CSV data (including exact spacing)

export interface Election2019Result {
  party: string;
  seats2019: number;
  voteShare2019: number;
}

export interface State2019Result {
  state: string;
  totalSeats: number;
  bjpSeats: number;
  incSeats: number;
  otherParties: { party: string; seats: number }[];
}

export const ELECTION_2019_DATA: Election2019Result[] = [
  // Major parties with exact names from 2024 CSV
  { party: 'Bharatiya Janata Party', seats2019: 303, voteShare2019: 37.36 },
  { party: 'Indian National Congress', seats2019: 52, voteShare2019: 19.49 },
  { party: 'Dravida Munnetra Kazhagam', seats2019: 23, voteShare2019: 2.26 },
  { party: 'All India Trinamool Congress', seats2019: 22, voteShare2019: 4.07 },
  { party: 'Yuvajana Sramika Rythu Congress Party', seats2019: 22, voteShare2019: 2.53 },
  { party: 'Shiv Sena', seats2019: 18, voteShare2019: 2.10 }, // Undivided Shiv Sena
  { party: 'Shiv Sena (Uddhav Balasaheb Thackrey)', seats2019: 0, voteShare2019: 0 }, // Didn't exist in 2019
  { party: 'Janata Dal  (United)', seats2019: 16, voteShare2019: 1.46 }, // Note: 2 spaces
  { party: 'Biju Janata Dal', seats2019: 12, voteShare2019: 1.66 },
  { party: 'Bahujan Samaj Party', seats2019: 10, voteShare2019: 3.63 },
  { party: 'Telugu Desam', seats2019: 3, voteShare2019: 2.34 },
  { party: 'Samajwadi Party', seats2019: 5, voteShare2019: 2.55 },
  { party: 'Nationalist Congress Party', seats2019: 5, voteShare2019: 1.39 },
  { party: 'Nationalist Congress Party – Sharadchandra Pawar', seats2019: 0, voteShare2019: 0 }, // Split from NCP
  { party: 'Communist Party of India  (Marxist)', seats2019: 3, voteShare2019: 1.75 }, // Note: 2 spaces
  { party: 'Communist Party of India', seats2019: 2, voteShare2019: 0.60 },
  { party: 'Aam Aadmi Party', seats2019: 1, voteShare2019: 0.44 },
  { party: 'Rashtriya Janata Dal', seats2019: 0, voteShare2019: 1.46 },
  { party: 'Jharkhand Mukti Morcha', seats2019: 1, voteShare2019: 0.38 },
  { party: 'Shiromani Akali Dal', seats2019: 2, voteShare2019: 0.80 },
  { party: 'Lok Janshakti Party(Ram Vilas)', seats2019: 6, voteShare2019: 0.52 }, // Note: no space before (
  { party: 'Janasena Party', seats2019: 0, voteShare2019: 0.69 },
  { party: 'Rashtriya Lok Dal', seats2019: 0, voteShare2019: 0.24 },
  { party: 'Asom Gana Parishad', seats2019: 0, voteShare2019: 0.28 },
  { party: 'Communist Party of India  (Marxist-Leninist)  (Liberation)', seats2019: 0, voteShare2019: 0.10 }, // Note: 2 spaces
  { party: 'Jammu & Kashmir National Conference', seats2019: 3, voteShare2019: 0.29 },
  { party: 'Indian Union Muslim League', seats2019: 3, voteShare2019: 0.26 },
  { party: 'Kerala Congress', seats2019: 1, voteShare2019: 0.12 },
  { party: 'All India Anna Dravida Munnetra Kazhagam', seats2019: 1, voteShare2019: 2.16 },
  { party: 'Bharat Adivasi Party', seats2019: 0, voteShare2019: 0 },
  { party: 'Viduthalai Chiruthaigal Katchi', seats2019: 0, voteShare2019: 0 },
  { party: 'Janata Dal  (Secular)', seats2019: 1, voteShare2019: 0.35 }, // Note: 2 spaces
  { party: 'Revolutionary Socialist Party', seats2019: 0, voteShare2019: 0 },
  { party: 'Sikkim Krantikari Morcha', seats2019: 1, voteShare2019: 0.15 },
  { party: 'AJSU Party', seats2019: 0, voteShare2019: 0 },
  { party: 'All India Majlis-E-Ittehadul Muslimeen', seats2019: 2, voteShare2019: 0.40 },
  { party: 'Rashtriya Loktantrik Party', seats2019: 0, voteShare2019: 0 },
  { party: 'Aazad Samaj Party (Kanshi Ram)', seats2019: 0, voteShare2019: 0 },
  { party: 'Apna Dal (Soneylal)', seats2019: 2, voteShare2019: 0.20 },
  { party: 'Hindustani Awam Morcha (Secular)', seats2019: 0, voteShare2019: 0 },
  { party: 'Marumalarchi Dravida Munnetra Kazhagam', seats2019: 0, voteShare2019: 0 },
  { party: 'Voice of the People Party', seats2019: 0, voteShare2019: 0 },
  { party: 'United People\'s Party, Liberal', seats2019: 0, voteShare2019: 0 },
  { party: 'Zoram People\'s Movement', seats2019: 0, voteShare2019: 0 },
  { party: 'Independent', seats2019: 4, voteShare2019: 2.97 },
];

// State-wise 2019 Results for detailed comparison
export const STATE_2019_RESULTS: State2019Result[] = [
  {
    state: 'Uttar Pradesh',
    totalSeats: 80,
    bjpSeats: 62,
    incSeats: 1,
    otherParties: [
      { party: 'SP', seats: 5 },
      { party: 'BSP', seats: 10 },
      { party: 'Apna Dal', seats: 2 }
    ]
  },
  {
    state: 'Maharashtra',
    totalSeats: 48,
    bjpSeats: 23,
    incSeats: 1,
    otherParties: [
      { party: 'Shiv Sena', seats: 18 },
      { party: 'NCP', seats: 4 },
      { party: 'Others', seats: 2 }
    ]
  },
  {
    state: 'West Bengal',
    totalSeats: 42,
    bjpSeats: 18,
    incSeats: 0,
    otherParties: [
      { party: 'TMC', seats: 22 },
      { party: 'Others', seats: 2 }
    ]
  },
  {
    state: 'Bihar',
    totalSeats: 40,
    bjpSeats: 17,
    incSeats: 1,
    otherParties: [
      { party: 'JDU', seats: 16 },
      { party: 'LJP', seats: 6 },
      { party: 'Others', seats: 0 }
    ]
  },
  {
    state: 'Tamil Nadu',
    totalSeats: 39,
    bjpSeats: 0,
    incSeats: 8,
    otherParties: [
      { party: 'DMK', seats: 23 },
      { party: 'AIADMK', seats: 1 },
      { party: 'Others', seats: 7 }
    ]
  },
  {
    state: 'Madhya Pradesh',
    totalSeats: 29,
    bjpSeats: 28,
    incSeats: 1,
    otherParties: []
  },
  {
    state: 'Karnataka',
    totalSeats: 28,
    bjpSeats: 25,
    incSeats: 1,
    otherParties: [
      { party: 'JDS', seats: 1 },
      { party: 'Independent', seats: 1 }
    ]
  },
  {
    state: 'Gujarat',
    totalSeats: 26,
    bjpSeats: 26,
    incSeats: 0,
    otherParties: []
  },
  {
    state: 'Rajasthan',
    totalSeats: 25,
    bjpSeats: 24,
    incSeats: 0,
    otherParties: [
      { party: 'Independent', seats: 1 }
    ]
  },
  {
    state: 'Andhra Pradesh',
    totalSeats: 25,
    bjpSeats: 0,
    incSeats: 0,
    otherParties: [
      { party: 'YSRCP', seats: 22 },
      { party: 'TDP', seats: 3 }
    ]
  },
  {
    state: 'Odisha',
    totalSeats: 21,
    bjpSeats: 8,
    incSeats: 0,
    otherParties: [
      { party: 'BJD', seats: 12 },
      { party: 'Independent', seats: 1 }
    ]
  },
  {
    state: 'Kerala',
    totalSeats: 20,
    bjpSeats: 0,
    incSeats: 15,
    otherParties: [
      { party: 'IUML', seats: 3 },
      { party: 'CPI(M)', seats: 1 },
      { party: 'Others', seats: 1 }
    ]
  },
  {
    state: 'Telangana',
    totalSeats: 17,
    bjpSeats: 4,
    incSeats: 3,
    otherParties: [
      { party: 'TRS', seats: 9 },
      { party: 'AIMIM', seats: 1 }
    ]
  },
  {
    state: 'Assam',
    totalSeats: 14,
    bjpSeats: 9,
    incSeats: 3,
    otherParties: [
      { party: 'AIUDF', seats: 1 },
      { party: 'Independent', seats: 1 }
    ]
  },
  {
    state: 'Jharkhand',
    totalSeats: 14,
    bjpSeats: 11,
    incSeats: 0,
    otherParties: [
      { party: 'JMM', seats: 1 },
      { party: 'Others', seats: 2 }
    ]
  },
  {
    state: 'Punjab',
    totalSeats: 13,
    bjpSeats: 2,
    incSeats: 8,
    otherParties: [
      { party: 'SAD', seats: 2 },
      { party: 'AAP', seats: 1 }
    ]
  },
  {
    state: 'Chhattisgarh',
    totalSeats: 11,
    bjpSeats: 9,
    incSeats: 2,
    otherParties: []
  },
  {
    state: 'Haryana',
    totalSeats: 10,
    bjpSeats: 10,
    incSeats: 0,
    otherParties: []
  },
  {
    state: 'Delhi',
    totalSeats: 7,
    bjpSeats: 7,
    incSeats: 0,
    otherParties: []
  }
];

// Alliance Performance 2019
export const ALLIANCE_2019 = {
  NDA: {
    totalSeats: 353,
    parties: [
      { party: 'BJP', seats: 303 },
      { party: 'JDU', seats: 16 },
      { party: 'Shiv Sena', seats: 18 },
      { party: 'LJP', seats: 6 },
      { party: 'SAD', seats: 2 },
      { party: 'Apna Dal', seats: 2 },
      { party: 'Others', seats: 6 }
    ]
  },
  UPA: {
    totalSeats: 91,
    parties: [
      { party: 'INC', seats: 52 },
      { party: 'DMK', seats: 23 },
      { party: 'NCP', seats: 5 },
      { party: 'IUML', seats: 3 },
      { party: 'JKNC', seats: 3 },
      { party: 'Others', seats: 5 }
    ]
  },
  Others: {
    totalSeats: 99,
    majorParties: [
      { party: 'TMC', seats: 22 },
      { party: 'YSRCP', seats: 22 },
      { party: 'BJD', seats: 12 },
      { party: 'BSP', seats: 10 },
      { party: 'TRS', seats: 9 },
      { party: 'SP', seats: 5 },
      { party: 'Others', seats: 19 }
    ]
  }
};

// Key 2019 Constituencies
export const KEY_2019_CONSTITUENCIES = [
  { constituency: 'Varanasi', state: 'UP', winner: 'Narendra Modi', party: 'BJP', votes: 674664, margin: 479505 },
  { constituency: 'Gandhinagar', state: 'Gujarat', winner: 'Amit Shah', party: 'BJP', votes: 908769, margin: 557589 },
  { constituency: 'Lucknow', state: 'UP', winner: 'Rajnath Singh', party: 'BJP', votes: 679272, margin: 347137 },
  { constituency: 'Amethi', state: 'UP', winner: 'Smriti Irani', party: 'BJP', votes: 468514, margin: 55120 },
  { constituency: 'Wayanad', state: 'Kerala', winner: 'Rahul Gandhi', party: 'INC', votes: 706367, margin: 431770 },
  { constituency: 'Rae Bareli', state: 'UP', winner: 'Sonia Gandhi', party: 'INC', votes: 674277, margin: 167178 },
  { constituency: 'Bhopal', state: 'MP', winner: 'Pragya Thakur', party: 'BJP', votes: 864218, margin: 364822 },
  { constituency: 'Indore', state: 'MP', winner: 'Shankar Lalwani', party: 'BJP', votes: 1066740, margin: 537715 }
];

export function get2019Seats(party: string): number {
  const match = ELECTION_2019_DATA.find(d => d.party === party);
  return match?.seats2019 || 0;
}

export function get2019VoteShare(party: string): number {
  const match = ELECTION_2019_DATA.find(d => d.party === party);
  return match?.voteShare2019 || 0;
}

export function getState2019Result(state: string): State2019Result | undefined {
  return STATE_2019_RESULTS.find(s => s.state === state);
}

export function get2019ConstituencyResult(constituency: string) {
  return KEY_2019_CONSTITUENCIES.find(c => c.constituency === constituency);
}
