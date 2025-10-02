import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('Processing PDF file:', file.name, 'Size:', file.size);

    // Read file as array buffer and convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to binary string for simple text extraction
    let textContent = '';
    try {
      const decoder = new TextDecoder('utf-8');
      textContent = decoder.decode(uint8Array);
      
      // Simple PDF text extraction - look for text between stream markers
      const textMatches = textContent.match(/BT\s*(.*?)\s*ET/gs) || [];
      textContent = textMatches.map(match => {
        // Extract text from PDF operators
        const textParts = match.match(/\((.*?)\)/g) || [];
        return textParts.map(p => p.slice(1, -1)).join(' ');
      }).join('\n');
      
      console.log('Extracted text length:', textContent.length);
    } catch (error) {
      console.error('Error extracting text:', error);
      textContent = 'Unable to extract text from PDF. Please ensure the PDF is not encrypted.';
    }

    // Use Lovable AI to extract key information
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert RFP (Request for Proposal) analyzer for NTT DATA. Extract key information from tender documents and structure it clearly.

Extract and return a JSON object with these fields:
- title: A clear, professional title for the tender
- client: The client/organization name
- deadline: Submission deadline in YYYY-MM-DD format
- requirements: Bullet-pointed list of key requirements
- goals: Main objectives and goals of the project
- scope: Detailed scope of work
- evaluation: Evaluation criteria with percentages if mentioned
- clientSummary: Brief 2-3 sentence summary about the client

Be thorough and professional. If information is missing, make reasonable professional inferences based on context.`;

    console.log('Sending request to Lovable AI...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Analyze this RFP document and extract key information:\n\n${textContent.slice(0, 15000)}` 
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');
    
    const extractedContent = aiData.choices[0].message.content;
    let extractedData;
    
    try {
      extractedData = JSON.parse(extractedContent);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Fallback to default structure
      extractedData = {
        title: "RFP Document",
        client: "Client Organization",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        requirements: "- Please review the uploaded document\n- Key requirements will be extracted from the PDF",
        goals: "Document analysis in progress",
        scope: "Full scope will be determined after document review",
        evaluation: "- Technical approach\n- Team experience\n- Cost effectiveness",
        clientSummary: "Client information will be extracted from the RFP document."
      };
    }

    console.log('Extraction complete');
    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in extract-rfp function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
