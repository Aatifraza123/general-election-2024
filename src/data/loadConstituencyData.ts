// Load constituency data for specific query
export async function getRelevantConstituencyData(question: string): Promise<string> {
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
    
    // Extract search terms from question
    const questionLower = question.toLowerCase();
    const relevantData: string[] = [];
    
    // Track current constituency
    let currentConstituency = '';
    let constituencyData: any[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = line.split(',');
      const pcName = cols[pcNameIdx]?.trim();
      const slNo = cols[slNoIdx]?.trim();
      
      if (!pcName) continue;
      
      // Check if this constituency matches the question
      if (pcName !== currentConstituency) {
        // Process previous constituency if it matched
        if (constituencyData.length > 0 && 
            (questionLower.includes(currentConstituency.toLowerCase()) ||
             questionLower.includes('all') ||
             questionLower.includes('every'))) {
          relevantData.push(formatConstituencyData(constituencyData));
        }
        
        currentConstituency = pcName;
        constituencyData = [];
      }
      
      // Store top 3 candidates
      if (slNo && parseInt(slNo) <= 3) {
        constituencyData.push({
          state: cols[stateIdx]?.trim(),
          constituency: pcName,
          slNo: slNo,
          candidate: cols[candidateIdx]?.trim(),
          party: cols[partyIdx]?.trim(),
          votes: cols[votesIdx]?.trim()
        });
      }
    }
    
    // If no specific match, return summary
    if (relevantData.length === 0) {
      return '\n\n=== CONSTITUENCY DATA ===\nFor specific constituency results, please ask about a particular constituency by name.\n';
    }
    
    return '\n\n=== RELEVANT CONSTITUENCY RESULTS ===\n\n' + relevantData.join('\n');
  } catch (error) {
    console.error('Error loading constituency data:', error);
    return '';
  }
}

function formatConstituencyData(data: any[]): string {
  if (data.length === 0) return '';
  
  const winner = data[0];
  let result = `${winner.constituency}, ${winner.state}:\n`;
  result += `  Winner: ${winner.candidate} (${winner.party}) - ${winner.votes} votes\n`;
  
  if (data.length > 1) {
    const runnerUp = data[1];
    const margin = parseInt(winner.votes) - parseInt(runnerUp.votes);
    result += `  Runner-up: ${runnerUp.candidate} (${runnerUp.party}) - ${runnerUp.votes} votes\n`;
    result += `  Margin: ${margin.toLocaleString()} votes\n`;
  }
  
  if (data.length > 2) {
    const third = data[2];
    result += `  Third: ${third.candidate} (${third.party}) - ${third.votes} votes\n`;
  }
  
  return result;
}
