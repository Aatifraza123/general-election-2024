// Load all 543 constituency winners from CSV
export async function loadConstituencyWinners(): Promise<string> {
  try {
    const response = await fetch('/data/results_2024.csv');
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    // Find column indices
    const stateIdx = headers.findIndex(h => h.includes('State'));
    const pcNameIdx = headers.findIndex(h => h.includes('PC Name'));
    const slNoIdx = headers.findIndex(h => h.includes('Sl no'));
    const candidateIdx = headers.findIndex(h => h.includes('Candidate'));
    const partyIdx = headers.findIndex(h => h.includes('Party'));
    const votesIdx = headers.findIndex(h => h.includes('Total Votes'));
    
    // Extract only winners (Sl no = 1) and runner-ups (Sl no = 2)
    const constituencies: { [key: string]: { winner: any, runnerUp: any } } = {};
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = line.split(',');
      const slNo = cols[slNoIdx]?.trim();
      const pcName = cols[pcNameIdx]?.trim();
      
      if (!pcName) continue;
      
      if (slNo === '1') {
        constituencies[pcName] = {
          winner: {
            state: cols[stateIdx]?.trim(),
            constituency: pcName,
            candidate: cols[candidateIdx]?.trim(),
            party: cols[partyIdx]?.trim(),
            votes: cols[votesIdx]?.trim()
          },
          runnerUp: null
        };
      } else if (slNo === '2' && constituencies[pcName]) {
        constituencies[pcName].runnerUp = {
          candidate: cols[candidateIdx]?.trim(),
          party: cols[partyIdx]?.trim(),
          votes: cols[votesIdx]?.trim()
        };
      }
    }
    
    // Format as text for AI context
    let contextText = '\n\n=== ALL 543 CONSTITUENCY RESULTS (COMPLETE DATA) ===\n\n';
    
    Object.values(constituencies).forEach(({ winner, runnerUp }) => {
      if (!winner) return;
      
      contextText += `${winner.constituency}, ${winner.state}:\n`;
      contextText += `  Winner: ${winner.candidate} (${winner.party}) - ${winner.votes} votes\n`;
      
      if (runnerUp) {
        const margin = parseInt(winner.votes) - parseInt(runnerUp.votes);
        contextText += `  Runner-up: ${runnerUp.candidate} (${runnerUp.party}) - ${runnerUp.votes} votes\n`;
        contextText += `  Margin: ${margin.toLocaleString()} votes\n`;
      }
      
      contextText += '\n';
    });
    
    return contextText;
  } catch (error) {
    console.error('Error loading constituency data:', error);
    return '';
  }
}
