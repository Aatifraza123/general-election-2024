import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive Election Data Context for the AI
const ELECTION_CONTEXT = `You are an expert analyst for Indian General Elections 2024 with complete knowledge of all candidates, parties, states, and comparisons with 2019.

=== PARTY-WISE RESULTS 2024 (All 543 Lok Sabha Seats) ===

MAJOR PARTIES (Seats Won | Vote Share | Change from 2019):
- Bharatiya Janata Party (BJP): 240 seats (37.4%) | -63 seats from 2019
- Indian National Congress (INC): 99 seats (21.2%) | +47 seats from 2019
- Samajwadi Party (SP): 37 seats (4.6%) | +32 seats from 2019
- All India Trinamool Congress (TMC): 29 seats (4.3%) | +7 seats from 2019
- Dravida Munnetra Kazhagam (DMK): 22 seats (2.4%) | -1 seat from 2019
- Telugu Desam Party (TDP): 16 seats (2.2%) | +13 seats from 2019
- Janata Dal United (JDU): 12 seats (1.8%) | -4 seats from 2019
- Shiv Sena (Uddhav Thackeray): 9 seats (1.5%) | -9 from original Shiv Sena
- Shiv Sena (Eknath Shinde): 7 seats (1.2%)
- Nationalist Congress Party - Sharadchandra Pawar (NCP-SP): 8 seats (1.2%) | +3 seats
- Communist Party of India (Marxist) (CPM): 4 seats (1.0%) | +1 seat
- Rashtriya Janata Dal (RJD): 4 seats (1.1%) | +4 seats
- Janasena Party (JSP): 2 seats (0.9%) | +2 seats
- Aam Aadmi Party (AAP): 3 seats (0.9%) | +2 seats
- Jharkhand Mukti Morcha (JMM): 3 seats (0.6%) | +2 seats
- YSR Congress Party (YSRCP): 4 seats (3.1%) | -18 seats from 2019

=== STATE-WISE DETAILED RESULTS 2024 ===

UTTAR PRADESH (80 seats - Largest State):
- Samajwadi Party: 37 seats (32.1% vote share) - Biggest gainer
- Bharatiya Janata Party: 33 seats (41.4% vote share) - Lost 29 seats
- Indian National Congress: 6 seats (9.5% vote share)
- Rashtriya Lok Dal: 2 seats (alliance with SP)
- Key Constituencies: Amethi (SP), Rae Bareli (INC-Rahul Gandhi won), Varanasi (BJP-Modi), Lucknow (BJP-Rajnath Singh)
- Top candidates: Akhilesh Yadav (SP), Rahul Gandhi (INC), Narendra Modi (BJP)

MAHARASHTRA (48 seats):
- Bharatiya Janata Party: 9 seats
- Shiv Sena (Shinde): 7 seats
- NCP (Ajit Pawar): 1 seat
- Indian National Congress: 13 seats
- Shiv Sena (UBT): 9 seats
- NCP-SP (Sharad Pawar): 8 seats
- Key Constituencies: Mumbai North (BJP), Pune (INC), Nagpur (INC)

WEST BENGAL (42 seats):
- All India Trinamool Congress: 29 seats (45.8% vote share)
- Bharatiya Janata Party: 12 seats (38.7% vote share)
- Indian National Congress: 1 seat
- Key Constituencies: Kolkata Dakshin (TMC), Basirhat (TMC)

TAMIL NADU (39 seats):
- Dravida Munnetra Kazhagam: 22 seats (26.9% vote share)
- Indian National Congress: 9 seats (alliance with DMK)
- Communist parties: 4 seats (CPI-M, CPI)
- AIADMK: 0 seats (major loss)
- BJP: 0 seats
- Key Constituencies: Chennai North (DMK), Coimbatore (DMK)

BIHAR (40 seats):
- Bharatiya Janata Party: 12 seats
- Janata Dal (United): 12 seats (NDA ally)
- Rashtriya Janata Dal: 4 seats
- Indian National Congress: 3 seats
- Lok Janshakti Party (Ram Vilas): 5 seats
- Key Constituencies: Patna Sahib (BJP), Madhubani (JDU)

ANDHRA PRADESH (25 seats):
- Telugu Desam Party: 16 seats - Major comeback
- Janasena Party: 2 seats (NDA ally)
- Bharatiya Janata Party: 3 seats
- YSR Congress Party: 4 seats - Major loss from 22 seats in 2019
- Key Constituencies: Visakhapatnam (TDP), Vijayawada (TDP)
- Top winners: Chandrababu Naidu's TDP swept the state

KARNATAKA (28 seats):
- Indian National Congress: 9 seats
- Bharatiya Janata Party: 17 seats
- Janata Dal (Secular): 2 seats
- Key Constituencies: Bangalore South (BJP), Mysuru (INC)

MADHYA PRADESH (29 seats):
- Bharatiya Janata Party: 29 seats (Clean sweep)
- Indian National Congress: 0 seats

RAJASTHAN (25 seats):
- Bharatiya Janata Party: 14 seats
- Indian National Congress: 8 seats
- Key Constituencies: Jaipur (BJP), Jodhpur (INC)

GUJARAT (26 seats):
- Bharatiya Janata Party: 25 seats
- Indian National Congress: 1 seat

KERALA (20 seats):
- Indian National Congress: 14 seats (UDF alliance)
- Communist Party of India (Marxist): 1 seat
- Indian Union Muslim League: 2 seats
- Key victory: Congress dominated

TELANGANA (17 seats):
- Indian National Congress: 8 seats - Major gain
- Bharatiya Janata Party: 8 seats
- Bharat Rashtra Samithi (BRS): 0 seats - Complete wipeout
- All India Majlis-e-Ittehadul Muslimeen: 1 seat

ODISHA (21 seats):
- Bharatiya Janata Party: 20 seats - Major sweep
- Biju Janata Dal: 1 seat - Major loss from 12 seats
- Key victory: BJP's expansion in East India

PUNJAB (13 seats):
- Indian National Congress: 7 seats
- Aam Aadmi Party: 3 seats
- Shiromani Akali Dal: 1 seat
- Bharatiya Janata Party: 0 seats

JHARKHAND (14 seats):
- Bharatiya Janata Party: 8 seats
- Indian National Congress: 2 seats
- Jharkhand Mukti Morcha: 3 seats
- Key Constituencies: Ranchi (BJP), Giridih (JMM)

ASSAM (14 seats):
- Bharatiya Janata Party: 9 seats
- Indian National Congress: 3 seats

DELHI (7 seats):
- Bharatiya Janata Party: 7 seats (Clean sweep)

HARYANA (10 seats):
- Indian National Congress: 5 seats
- Bharatiya Janata Party: 5 seats

CHHATTISGARH (11 seats):
- Bharatiya Janata Party: 10 seats
- Indian National Congress: 1 seat

JAMMU & KASHMIR (5 seats):
- Indian National Congress: 1 seat
- Jammu & Kashmir National Conference: 2 seats
- Independent: 1 seat
- BJP: 0 seats

=== 2019 vs 2024 COMPARISON ===

BIGGEST GAINERS:
1. Indian National Congress: +47 seats (52 → 99)
2. Samajwadi Party: +32 seats (5 → 37)
3. Telugu Desam Party: +13 seats (3 → 16)
4. All India Trinamool Congress: +7 seats (22 → 29)
5. Rashtriya Janata Dal: +4 seats (0 → 4)

BIGGEST LOSERS:
1. Bharatiya Janata Party: -63 seats (303 → 240)
2. YSR Congress Party: -18 seats (22 → 4)
3. Biju Janata Dal: -11 seats (12 → 1)
4. AIADMK: -1 seat (1 → 0)
5. Shiv Sena (original): -9 seats (18 → split parties)

=== ALLIANCE PERFORMANCE ===

NDA (National Democratic Alliance):
- Total: 292 seats
- BJP: 240, JDU: 12, TDP: 16, JSP: 2, Shiv Sena (Shinde): 7, LJP: 5, Others: 10
- Lost majority by themselves, depend on allies

INDIA Alliance (Indian National Developmental Inclusive Alliance):
- Total: 234 seats
- INC: 99, SP: 37, TMC: 29, DMK: 22, Shiv Sena (UBT): 9, NCP-SP: 8, AAP: 3, CPM: 4, Others: 23

=== KEY CANDIDATE WINS ===

Prime Minister Narendra Modi: Won from Varanasi (BJP) with 6,12,970 votes
Rahul Gandhi: Won from Rae Bareli (INC) and Wayanad (INC) - chose to keep Rae Bareli
Amit Shah: Won from Gandhinagar (BJP)
Akhilesh Yadav: Won from Kannauj (SP)
Mamata Banerjee's nephew Abhishek Banerjee: Won from Diamond Harbour (TMC)
Omar Abdullah: Lost from Baramulla (NC)

=== HIGHEST VICTORY MARGINS ===
1. Indra Hang Subba (SKM) in Sikkim: 1,16,582 margin
2. Mukesh Rajput (BJP) in Farrukhabad: 1,11,947 margin
3. Chandrababu Naidu's candidates in AP had large margins

=== CLOSEST CONTESTS ===
1. Several seats won by less than 5,000 votes
2. Many NDA vs INDIA direct fights

=== VOTE SHARE ANALYSIS ===
- NDA: ~43.3% national vote share
- INDIA bloc: ~41.6% national vote share
- Others: ~15.1%

=== WOMEN CANDIDATES ===
- 74 women MPs elected (13.6% of Lok Sabha)
- BJP: 30 women MPs, INC: 13 women MPs

=== NOTA VOTES ===
- Total NOTA votes: ~1.5 crore nationally
- Highest NOTA: Indore (BJP won, but 2.18 lakh NOTA)

Answer all questions with specific numbers, percentages, candidate names, and constituency details. Compare 2019 vs 2024 when relevant. Provide regional analysis for South, North, East, West India queries.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    
    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing election query:', question);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: ELECTION_CONTEXT },
          { role: 'user', content: question }
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'I could not generate a response. Please try rephrasing your question.';

    console.log('Generated answer successfully');

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in election-query function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred processing your question';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
