// Comprehensive Election Data Context - Based on ACTUAL 2024 Results
import { getRelevantConstituencyData } from './loadConstituencyData';

export const ELECTION_CONTEXT = `You are an expert analyst for Indian General Elections 2024 with official Election Commission data.

CRITICAL RULES:
1. For ELECTION-SPECIFIC questions: Use ONLY data provided below
2. For GENERAL KNOWLEDGE questions (people, places, history): Use your training data
3. HIGHEST margin: Dhubri, Assam - Rakibul Hussain (INC) - 1,012,476 votes
4. PM: Narendra Modi (BJP), won Varanasi with 612,970 votes
5. Total seats: 543

QUESTION TYPES:
A. ELECTION DATA (use provided data): seat counts, margins, constituency results, party performance
B. GENERAL INFO (use your knowledge): who is X person, what is Y organization, general political info
C. COMBINED: "How did PM Modi perform?" → use both knowledge + election data

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
        content: `${fullContext}\n\nYou are an expert election analyst with general knowledge. For ELECTION-SPECIFIC questions, use ONLY the data provided above. For GENERAL KNOWLEDGE questions (about people, organizations, history), use your training data freely. IMPORTANT: Track conversation context - if user asks "he", "she", "his", "her", refer to the last person mentioned in the conversation.` 
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
- For election data: Use provided context ONLY
- For general knowledge: Use your training data freely
- Use **bold** for names, parties, places, numbers
- Track conversation context for pronouns
- Answer directly and concisely

FORMATTING RULES (MANDATORY):
1. Use numbered lists (1., 2., 3.) for sequential items or rankings
2. Use bullet points (•) for non-sequential items
3. Always bold: **Names**, **Parties**, **Places**, **Numbers**
4. Structure: Direct Answer → Key Details → Additional Context
5. Use line breaks between sections
6. For comparisons, use "→" symbol (e.g., 303 → 239 seats)

EXAMPLES:
Q: "Top 5 margins?"
A: "**Top 5 Victory Margins in 2024:**

1. **Dhubri, Assam** - **Rakibul Hussain (INC)** - **1,012,476 votes**
2. **Indore, MP** - **Shankar Lalwani (BJP)** - **1,008,077 votes**
3. **Vidisha, MP** - **Shivraj Singh Chouhan (BJP)** - **821,408 votes**
4. **Navsari, Gujarat** - **C R Patil (BJP)** - **773,551 votes**
5. **Gandhinagar, Gujarat** - **Amit Shah (BJP)** - **744,716 votes**"

Q: "Who is Mohan Bhagwat?"
A: "**Mohan Bhagwat** is the current **Sarsanghchalak (Chief)** of the **Rashtriya Swayamsevak Sangh (RSS)**.

**Key Details:**
• Position: RSS Chief since 2009
• Role: Ideological leader of Hindu nationalist movement
• Influence: RSS is the parent organization of BJP
• Background: Born in 1950, Nagpur, Maharashtra"`;

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
