import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Election data context for the AI
const ELECTION_CONTEXT = `You are an expert analyst for Indian General Elections 2024. You have detailed knowledge of:

KEY RESULTS 2024:
- BJP won 240 seats (down from 303 in 2019)
- INC (Congress) won 99 seats (up from 52 in 2019)
- Samajwadi Party won 37 seats (up from 5 in 2019)
- TMC won 29 seats
- DMK won 22 seats
- TDP won 16 seats (up from 3 in 2019)
- JD(U) won 12 seats
- Shiv Sena won 9 seats
- NCP-SP won 8 seats
- AAP won 3 seats

REGIONAL BREAKDOWN:
South India (Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana):
- DMK dominated Tamil Nadu with 22 seats
- Congress strong in Karnataka with 9+ seats
- TDP-BJP alliance swept Andhra Pradesh
- BRS lost all seats in Telangana

North India (UP, Bihar, MP, Rajasthan):
- BJP strong but lost seats in UP
- SP gained significantly in UP with 37 seats
- BJP maintained hold in MP and Rajasthan

East India (West Bengal, Odisha):
- TMC won 29 seats in West Bengal
- BJP made gains in Odisha

West India (Maharashtra, Gujarat):
- BJP strong in Gujarat
- NCP-SP and Congress competitive in Maharashtra

KEY INSIGHTS:
- NDA (BJP-led alliance) got 292 seats total
- INDIA bloc (Opposition alliance) got 234 seats
- BJP lost majority on its own (needed 272)
- Regional parties remained crucial
- Anti-incumbency affected BJP in several states

Answer user questions about election results, party performance, regional analysis, comparisons between 2019 and 2024, vote shares, margins, and any other election-related queries. Be specific with numbers when possible.`;

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
        max_tokens: 1024,
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
