// Comprehensive Election Data Context - Based on ACTUAL 2024 Results
import { loadConstituencyWinners } from './loadConstituencyData';

// Cache for constituency data
let constituencyDataCache: string | null = null;

export const ELECTION_CONTEXT = `You are an expert analyst for Indian General Elections 2024. You have COMPLETE and ACCURATE data from the official Election Commission results.

CRITICAL INSTRUCTIONS FOR AI:
1. ALWAYS use ONLY the exact data provided below - NEVER make up information
2. If asked about something not in this data, say "I don't have specific data for that"
3. NEVER mention "Sikkim" or "Indra Hang Subba" for highest margin
4. The HIGHEST victory margin was Dhubri, Assam - Rakibul Hussain (INC) - 1,012,476 votes
5. All numbers below are from official 2024 Election Commission data
6. When answering, cite exact numbers, names, and parties from below

=== PARTY-WISE RESULTS 2024 (543 Lok Sabha Seats) ===

GOVERNMENT FORMATION (2024):
- Prime Minister: Narendra Modi (Bharatiya Janata Party)
- Government: NDA Coalition (BJP + allies)
- Opposition Leader: Rahul Gandhi (Indian National Congress)
- Lok Sabha Speaker: Om Birla

COMPLETE PARTY LIST:
1. Bharatiya Janata Party (BJP): 239 seats
2. Indian National Congress (INC): 99 seats
3. Samajwadi Party (SP): 36 seats
4. All India Trinamool Congress (TMC): 29 seats
5. Dravida Munnetra Kazhagam (DMK): 22 seats
6. Telugu Desam (TDP): 16 seats
7. Janata Dal (United) (JDU): 12 seats
8. Shiv Sena (Uddhav Thackrey) (SS-UBT): 9 seats
9. Nationalist Congress Party – Sharadchandra Pawar (NCP-SP): 8 seats
10. Shiv Sena (Eknath Shinde): 7 seats
11. Independent: 7 seats
12. Lok Janshakti Party (Ram Vilas): 5 seats
13. Communist Party of India (Marxist) (CPM): 4 seats
14. Yuvajana Sramika Rythu Congress Party (YSRCP): 4 seats
15. Rashtriya Janata Dal (RJD): 3 seats
16. Jharkhand Mukti Morcha (JMM): 3 seats
17. Aam Aadmi Party (AAP): 3 seats
18. Indian Union Muslim League (IUML): 3 seats
19. Jammu & Kashmir National Conference: 2 seats
20. Janasena Party (JSP): 2 seats
21. Communist Party of India (CPI): 2 seats
22. Viduthalai Chiruthaigal Katchi (VCK): 2 seats
23. Rashtriya Lok Dal (RLD): 2 seats
24. Janata Dal (Secular) (JDS): 2 seats
25. Others: ~15 seats

=== STATE-WISE RESULTS 2024 ===

UTTAR PRADESH (79 seats):
- SP: 36, BJP: 33, INC: 6, RLD: 2, Others: 2

MAHARASHTRA (48 seats):
- INC: 13, BJP: 9, SS-UBT: 9, NCP-SP: 8, Shiv Sena: 7, Others: 2

WEST BENGAL (42 seats):
- TMC: 29, BJP: 12, INC: 1

TAMIL NADU (39 seats):
- DMK: 22, INC: 9, CPM: 2, CPI: 2, VCK: 2, Others: 2

BIHAR (38 seats):
- JDU: 12, BJP: 11, LJP: 5, INC: 3, RJD: 3, Others: 4

MADHYA PRADESH (29 seats):
- BJP: 29 (Clean sweep)

KARNATAKA (28 seats):
- BJP: 17, INC: 9, JDS: 2

GUJARAT (26 seats):
- BJP: 25, INC: 1

ANDHRA PRADESH (25 seats):
- TDP: 16, YSRCP: 4, BJP: 3, JSP: 2

RAJASTHAN (25 seats):
- BJP: 14, INC: 8, Others: 3

ODISHA (21 seats):
- BJP: 20, BJD: 1

KERALA (20 seats):
- INC: 14, IUML: 2, CPM: 1, BJP: 1, Others: 2

TELANGANA (17 seats):
- BJP: 8, INC: 8, AIMIM: 1

JHARKHAND (14 seats):
- BJP: 8, JMM: 3, INC: 2, Others: 1

ASSAM (14 seats):
- BJP: 9, INC: 3, Others: 2

PUNJAB (13 seats):
- INC: 7, AAP: 3, BJP: 2, SAD: 1

CHHATTISGARH (11 seats):
- BJP: 10, INC: 1

HARYANA (10 seats):
- BJP: 5, INC: 5

DELHI (7 seats):
- BJP: 7 (Clean sweep)

JAMMU & KASHMIR (5 seats):
- JKNC: 2, INC: 1, Independent: 1, BJP: 1

=== HIGHEST VICTORY MARGINS 2024 (TOP 10) ===

1. Rakibul Hussain (INC) - Dhubri, Assam: 1,012,476 votes (HIGHEST)
2. Shankar Lalwani (BJP) - Indore, MP: 1,008,077 votes
3. Shivraj Singh Chouhan (BJP) - Vidisha, MP: 821,408 votes
4. C R Patil (BJP) - Navsari, Gujarat: 773,551 votes
5. Amit Shah (BJP) - Gandhinagar, Gujarat: 744,716 votes
6. Abhishek Banerjee (TMC) - Diamond Harbour, WB: 710,930 votes
7. Biplab Kumar Deb (BJP) - Tripura West: 611,578 votes
8. Dr. Hemang Joshi (BJP) - Vadodara, Gujarat: 582,126 votes
9. Brijmohan Agrawal (BJP) - Raipur, Chhattisgarh: 575,285 votes
10. Sasikanth Senthil (INC) - Tiruvallur, TN: 572,155 votes

=== KEY CONSTITUENCY WINNERS 2024 (WITH DETAILED RESULTS) ===

PROMINENT CONSTITUENCIES WITH COMPLETE DATA:

1. DHUBRI, ASSAM (HIGHEST MARGIN):
   Winner: Rakibul Hussain (INC) - 1,471,885 votes
   Runner-up: Mohammed Badruddin Ajmal (AIUDF) - 459,409 votes
   Margin: 1,012,476 votes (HIGHEST IN 2024)

2. INDORE, MADHYA PRADESH (SECOND HIGHEST MARGIN):
   Winner: Shankar Lalwani (BJP) - 1,226,751 votes
   Runner-up: NOTA (None of the Above) - 218,674 votes
   Margin: 1,008,077 votes

3. VARANASI, UTTAR PRADESH:
   Winner: Narendra Modi (BJP) - 612,970 votes
   Runner-up: Ajay Rai (INC) - 460,457 votes
   Margin: 152,513 votes

4. RAE BARELI, UTTAR PRADESH:
   Winner: Rahul Gandhi (INC) - 687,649 votes
   Runner-up: Dinesh Pratap Singh (BJP) - 297,619 votes
   Margin: 390,030 votes

5. AMETHI, UTTAR PRADESH:
   Winner: Kishori Lal (INC) - 539,228 votes
   Runner-up: Smriti Irani (BJP) - 372,032 votes
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
  
  // Load constituency data if not cached
  if (!constituencyDataCache) {
    constituencyDataCache = await loadConstituencyWinners();
  }
  
  // Combine base context with constituency data
  const fullContext = ELECTION_CONTEXT + constituencyDataCache;
  
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
    const systemPrompt = `${fullContext}

CRITICAL INSTRUCTIONS FOR GEMINI AI:

1. CONTEXT AWARENESS:
   - ALWAYS remember the previous question in the conversation
   - If user asks "how many votes he got" after asking about PM, understand "he" = PM Modi
   - Track pronouns (he, she, they, his, her) to previous entities mentioned
   - Maintain conversation context across multiple questions
   - Review the conversation history below before answering

2. ACCURACY RULES:
   - Use ONLY the data provided above for election-specific questions
   - For general political knowledge (PM, President, etc.), use your training data
   - Never invent or guess election statistics
   - If election data is not available, clearly state "I don't have specific data for that"
   - Always cite exact numbers, names, and sources from the context for election queries

3. QUESTION TYPES:
   A. ELECTION DATA QUESTIONS (Use provided context):
      - Seat counts, vote shares, margins
      - Constituency results, state results
      - Party performance, comparisons
      - 2019 vs 2024 comparisons
   
   B. GENERAL POLITICAL QUESTIONS (Use your knowledge):
      - Who is the Prime Minister/President?
      - What is NDA/INDIA alliance?
      - General political information
      - Historical context
   
   C. COMBINED QUESTIONS (Use both):
      - "How did PM Modi perform in 2024?" → Use context for election data + knowledge for PM info

2. RESPONSE FORMAT:
   - Start with a direct answer to the question
   - Use **bold** for names (candidates, parties, places)
   - Use **bold** for important numbers and statistics
   - Structure responses with clear sections
   - Use bullet points for multiple items
   - Include comparisons when relevant (2019 vs 2024)
   - End with additional context if helpful
   - Use line breaks for better readability

3. FORMATTING EXAMPLES:
   - Candidate names: **Narendra Modi**, **Rahul Gandhi**
   - Party names: **Bharatiya Janata Party (BJP)**, **Indian National Congress (INC)**
   - Places: **Varanasi**, **Dhubri, Assam**
   - Numbers: **612,970 votes**, **1,012,476 vote margin**
   - Use "→" for comparisons: 303 → 239 seats

3. CRITICAL DATA POINTS TO REMEMBER:
   - HIGHEST margin: Dhubri, Assam - Rakibul Hussain (INC) - 1,012,476 votes
   - NEVER mention Sikkim or Indra Hang Subba for highest margin
   - BJP: 239 seats (NOT 240)
   - SP in UP: 36 seats (NOT 37)
   - Total seats: 543

4. FORMATTING RULES (MANDATORY):
   - ALWAYS use **bold** for: Names, Parties, Places, Key Numbers
   - Use bullet points (•) or dashes (-) for lists
   - Use line breaks between sections
   - Structure: Answer → Details → Context
   - Keep paragraphs short (2-3 lines max)

5. ANALYSIS GUIDELINES:
   - Provide context about political significance
   - Explain trends and patterns
   - Compare with 2019 when relevant
   - Mention alliance implications (NDA vs INDIA)
   - Highlight regional patterns

6. TONE:
   - Professional and informative
   - Neutral and unbiased
   - Clear and concise
   - Data-driven
   - Well-structured with proper formatting

7. EXAMPLES OF GOOD RESPONSES (WITH CONTEXT TRACKING):
   
   Q1: "Who is the Prime Minister of India?"
   A1: "**Narendra Modi** is the Prime Minister of India. He is from the **Bharatiya Janata Party (BJP)** and won the 2024 Lok Sabha elections, forming the government with the **NDA coalition**.
   
   In the 2024 elections, Modi personally won from **Varanasi, Uttar Pradesh** with **612,970 votes**, defeating **Ajay Rai** (INC) by a margin of **152,513 votes**."
   
   Q2: "How many votes did he get?" (Following Q1 - "he" refers to Modi)
   A2: "**Narendra Modi** received **612,970 votes** from **Varanasi, Uttar Pradesh** in the 2024 Lok Sabha elections.
   
   He defeated **Ajay Rai** of the **Indian National Congress** who received **460,457 votes**.
   
   **Victory Margin:** **152,513 votes**"
   
   Q3: "Who won from Dhubri?"
   A3: "**Rakibul Hussain** of the **Indian National Congress (INC)** won from **Dhubri, Assam** with **1,471,885 votes**.
   
   **Runner-up:** **Mohammed Badruddin Ajmal** (**AIUDF**) - **459,409 votes**
   
   **Margin:** **1,012,476 votes** (highest in 2024)"
   
   Q4: "What was his margin?" (Following Q3 - "his" refers to Rakibul Hussain)
   A4: "**Rakibul Hussain's** victory margin in **Dhubri, Assam** was **1,012,476 votes** - the **highest victory margin** in the entire 2024 Lok Sabha elections.
   
   He received **1,471,885 votes** while his nearest competitor **Mohammed Badruddin Ajmal** (AIUDF) got **459,409 votes**."
   
   Q: "Who is the Prime Minister of India?"
   A: "**Narendra Modi** is the Prime Minister of India. He is from the **Bharatiya Janata Party (BJP)** and won the 2024 Lok Sabha elections, forming the government with the **NDA coalition**.
   
   In the 2024 elections, Modi personally won from **Varanasi, Uttar Pradesh** with **612,970 votes**, defeating **Ajay Rai** (INC) by a margin of **152,513 votes**."
   
   Q: "Who won from Varanasi?"
   A: "**Narendra Modi** of the **Bharatiya Janata Party (BJP)** won from **Varanasi** with **612,970 votes**.
   
   **Runner-up:** **Ajay Rai** of the **Indian National Congress (INC)** received **460,457 votes**.
   
   **Victory Margin:** **152,513 votes**
   
   This was Modi's second consecutive victory from Varanasi, maintaining BJP's stronghold in this prestigious constituency."

   Q: "What was the highest victory margin?"
   A: "The **highest victory margin** in the 2024 Lok Sabha elections was recorded in **Dhubri, Assam**.
   
   **Winner:** **Rakibul Hussain** (**Indian National Congress**)
   - Votes: **1,471,885**
   
   **Runner-up:** **Mohammed Badruddin Ajmal** (**AIUDF**)
   - Votes: **459,409**
   
   **Margin:** **1,012,476 votes** (over 10 lakh votes)
   
   This was the largest victory margin in the entire 2024 election, showcasing INC's dominance in this Assam constituency."
   
   Q: "Who is the runner-up in Varanasi?"
   A: "The runner-up in **Varanasi, Uttar Pradesh** is:
   
   **Ajay Rai** from the **Indian National Congress (INC)**
   - Votes received: **460,457**
   
   **Winner:** **Narendra Modi** (**BJP**) - **612,970 votes**
   
   **Margin:** **152,513 votes**"
   
   Q: "What is NDA?"
   A: "**NDA (National Democratic Alliance)** is the ruling coalition in India led by the **Bharatiya Janata Party (BJP)**.
   
   **2024 Election Results:**
   - Total NDA Seats: **~292**
   - Key Members: BJP (239), JDU (12), TDP (16), Shiv Sena (7), LJP (5), JSP (2)
   - Prime Minister: **Narendra Modi** (BJP)
   
   The NDA lost its single-party majority in 2024 and now depends on allies like TDP and JDU to form the government."`;

    // Build conversation context string
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n\n===CONVERSATION HISTORY===\n';
      conversationHistory.forEach((msg, idx) => {
        conversationContext += `${msg.role === 'user' ? 'USER' : 'ASSISTANT'}: ${msg.content}\n`;
      });
      conversationContext += '\n===END CONVERSATION HISTORY===\n\nBased on the conversation above, answer the following question while maintaining context:\n';
    }

    // Try Gemini 2.0 Flash first (latest model)
    let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}${conversationContext}\n\n===USER QUESTION===\n${question}\n\n===YOUR RESPONSE===\nProvide a comprehensive, accurate answer based strictly on the data provided above:`
          }]
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
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}${conversationContext}\n\n===USER QUESTION===\n${question}\n\n===YOUR RESPONSE===\nProvide a comprehensive, accurate answer based strictly on the data provided above:`
            }]
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
