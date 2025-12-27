// Comprehensive Election Data Context - Based on ACTUAL 2024 Results
import { getRelevantConstituencyData } from './loadConstituencyData';

export const ELECTION_CONTEXT = `You are an expert analyst for Indian General Elections 2024 with official Election Commission data.

CRITICAL RULES:
1. Use ONLY data provided - NEVER make up information
2. HIGHEST margin: Dhubri, Assam - Rakibul Hussain (INC) - 1,012,476 votes
3. PM: Narendra Modi (BJP), won Varanasi with 612,970 votes
4. Total seats: 543

=== PARTY RESULTS 2024 ===
BJP: 239 | INC: 99 | SP: 36 | TMC: 29 | DMK: 22 | TDP: 16 | JDU: 12 | SS-UBT: 9 | NCP-SP: 8 | Shiv Sena: 7 | IND: 7 | LJP: 5 | CPM: 4 | YSRCP: 4 | RJD: 3 | JMM: 3 | AAP: 3 | IUML: 3 | JKNC: 2 | JSP: 2 | CPI: 2 | VCK: 2 | RLD: 2 | JDS: 2

=== STATE RESULTS (TOP 10) ===
UP (79): SP 36, BJP 33, INC 6, RLD 2
Maharashtra (48): INC 13, BJP 9, SS-UBT 9, NCP-SP 8, Shiv Sena 7
West Bengal (42): TMC 29, BJP 12, INC 1
Tamil Nadu (39): DMK 22, INC 9, CPM 2, CPI 2, VCK 2
Bihar (38): JDU 12, BJP 11, LJP 5, INC 3, RJD 3
MP (29): BJP 29
Karnataka (28): BJP 17, INC 9, JDS 2
Gujarat (26): BJP 25, INC 1
AP (25): TDP 16, YSRCP 4, BJP 3, JSP 2
Rajasthan (25): BJP 14, INC 8

=== TOP 5 MARGINS ===
1. Dhubri, Assam - Rakibul Hussain (INC): 1,012,476
2. Indore, MP - Shankar Lalwani (BJP): 1,008,077
3. Vidisha, MP - Shivraj Singh Chouhan (BJP): 821,408
4. Navsari, Gujarat - C R Patil (BJP): 773,551
5. Gandhinagar, Gujarat - Amit Shah (BJP): 744,716

=== KEY WINNERS ===
Varanasi: Narendra Modi (BJP) - 612,970 votes, beat Ajay Rai (INC) - 460,457, margin 152,513
Rae Bareli: Rahul Gandhi (INC) - 687,649, beat Dinesh Pratap Singh (BJP) - 297,619, margin 390,030
Amethi: Kishori Lal (INC) - 539,228, beat Smriti Irani (BJP) - 372,032
Gandhinagar: Amit Shah (BJP) - 1,020,751, beat Sonal Patel (INC) - 276,035, margin 744,716
Siwan: Vijaylakshmi Devi (JDU) - 386,508, beat Awadesh Kumar Singh (RJD) - 367,076, margin 19,432

=== 2019 vs 2024 COMPARISON ===
BJP: 303 → 239 (-64 seats)
INC: 52 → 99 (+47 seats)
SP: 5 → 36 (+31 seats)
TMC: 22 → 29 (+7 seats)
DMK: 23 → 22 (-1 seat)
TDP: 0 → 16 (+16 seats)
JDU: 16 → 12 (-4 seats)

NDA 2024: ~292 seats (BJP + allies)
INDIA 2024: ~234 seats (INC + allies)

FORMATTING: Use **bold** for names, parties, places, numbers. Structure responses clearly.`;
   Margin: 167,196 votes

6. GANDHINAGAR, GUJARAT:
   Winner: Amit Shah (BJP) - 1,010,972 votes
   Runner-up: Sonal Ramanbhai Patel (INC) - 266,256 votes
   Margin: 744,716 votes

7. LUCKNOW, UTTAR PRADESH:
   Winner: Raj Nath Singh (BJP) - 612,709 votes
   Runner-up: Ravidas Mehrotra (SP) - 477,550 votes
   Margin: 135,159 votes

8. KANNAUJ, UTTAR PRADESH:
   Winner: Akhilesh Yadav (SP) - 642,292 votes
   Runner-up: Subrat Pathak (BJP) - 471,370 votes
   Margin: 170,922 votes

9. SIWAN, BIHAR:
   Winner: Vijaylakshmi Devi (JDU) - 386,508 votes
   Runner-up: Hena Shahab (Independent) - 293,651 votes
   Margin: 92,857 votes

10. SRIKAKULAM, ANDHRA PRADESH:
    Winner: Kinjarapu Rammohan Naidu (TDP) - 754,328 votes
    (Runner-up data available in full dataset)

=== 2019 vs 2024 COMPARISON ===

2019 RESULTS:
BJP: 303, INC: 52, DMK: 23, TMC: 22, YSRCP: 22, Shiv Sena: 18, JDU: 16, BJD: 12, BSP: 10, TDP: 3, SP: 5

2024 RESULTS:
BJP: 239, INC: 99, SP: 36, TMC: 29, DMK: 22, TDP: 16, JDU: 12, SS-UBT: 9, NCP-SP: 8, Shiv Sena: 7

BIGGEST GAINERS:
1. INC: +47 seats (52→99)
2. SP: +31 seats (5→36)
3. TDP: +13 seats (3→16)
4. TMC: +7 seats (22→29)

BIGGEST LOSERS:
1. BJP: -64 seats (303→239) - Lost majority
2. YSRCP: -18 seats (22→4)
3. BJD: -11 seats (12→1)
4. BSP: -10 seats (10→0) - Complete wipeout

=== ALLIANCE PERFORMANCE 2024 ===

NDA (National Democratic Alliance):
Total: ~292 seats
Main parties: BJP 239, JDU 12, TDP 16, Shiv Sena 7, LJP 5, JSP 2, Others ~11
Status: Coalition government (BJP lost single-party majority)

INDIA Alliance:
Total: ~234 seats
Main parties: INC 99, SP 36, TMC 29, DMK 22, SS-UBT 9, NCP-SP 8, JMM 3, AAP 3, CPM 4, RJD 3, Others ~18
Status: Strong opposition bloc

=== REGIONAL ANALYSIS ===

NORTH INDIA:
- BJP dominated: MP (29/29), Delhi (7/7), Rajasthan (14/25), Haryana (5/10)
- SP-INC strong in UP: Combined 42/79 seats
- INC gained in Punjab: 7/13 seats

SOUTH INDIA:
- DMK-INC alliance dominated TN: 31/39 combined
- TDP swept AP: 16/25 seats
- INC strong in Kerala: 14/20 seats
- BJP-INC split Telangana: 8-8
- BJP dominated Karnataka: 17/28 seats

EAST INDIA:
- TMC dominated WB: 29/42 seats
- BJP swept Odisha: 20/21 seats
- BJP strong in Assam: 9/14 seats

WEST INDIA:
- BJP dominated Gujarat: 25/26 seats
- Maharashtra split between alliances

CRITICAL REMINDERS:
- HIGHEST margin: Dhubri, Assam - 1,012,476 votes (NOT Sikkim)
- BJP: 239 seats (NOT 240)
- SP in UP: 36 seats (NOT 37)
- Bihar: JDU 12, BJP 11 (NOT BJP 12)
- Always cite exact numbers from above data`;

// Call Groq API for AI responses
export const getAIAnswer = async (question: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> => {
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Load only relevant constituency data based on question
  const constituencyData = await getRelevantConstituencyData(question);
  
  // Combine base context with relevant constituency data
  const fullContext = ELECTION_CONTEXT + constituencyData;
  
  // Try Gemini first if key is available (for latest info)
  if (geminiKey) {
    try {
      return await getGeminiAnswer(question, geminiKey, conversationHistory, fullContext);
    } catch (error) {
      console.warn('Gemini API failed, falling back to Groq:', error);
    }
  }
  
  // Fallback to Groq
  if (!groqKey) {
    throw new Error('No AI API key configured');
  }

  try {
    const messages = [
      { 
        role: 'system', 
        content: `${fullContext}\n\nYou are an expert election analyst. Provide accurate, data-driven answers using ONLY the information provided above. Never make up data. If information is not available, clearly state that. IMPORTANT: Track conversation context - if user asks "he", "she", "his", "her", refer to the last person mentioned in the conversation.` 
      },
      ...conversationHistory,
      { role: 'user', content: question }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.2,
        max_tokens: 2048,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'I could not generate a response. Please try again.';
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
};

// Gemini AI for latest information (PRIMARY AI) - Using Gemini 2.0 Flash
const getGeminiAnswer = async (question: string, apiKey: string, conversationHistory: Array<{role: string, content: string}> = [], fullContext: string): Promise<string> => {
  try {
    // Build conversation context string
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n\nCONVERSATION HISTORY:\n';
      conversationHistory.forEach((msg) => {
        conversationContext += `${msg.role === 'user' ? 'USER' : 'AI'}: ${msg.content}\n`;
      });
      conversationContext += '\nTrack pronouns (he/she/his/her) to previous entities mentioned above.\n';
    }

    const systemPrompt = `${fullContext}${conversationContext}

INSTRUCTIONS:
- Use **bold** for names, parties, places, numbers
- Track conversation context for pronouns
- Answer directly and concisely
- Use data provided above only`;

    // Try Gemini 2.0 Flash first (latest model)
    let response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nQUESTION: ${question}\n\nANSWER:` }]
        }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    // Fallback to Gemini 1.5 Flash if 2.0 fails
    if (!response.ok) {
      console.log('Gemini 2.0 failed, trying 1.5 Flash...');
      response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\nQUESTION: ${question}\n\nANSWER:` }]
          }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        }),
      });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error response:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!answer) {
      throw new Error('No response from Gemini');
    }
    
    return answer;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

export const getElectionAnswer = (question: string): string | null => {
  // This function is no longer used but kept for compatibility
  return null;
};
