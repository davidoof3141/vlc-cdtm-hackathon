import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { draftContent, requirements } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing draft against requirements...");

    // Create a detailed prompt for the AI
    const systemPrompt = `You are an RFP compliance analyzer. Analyze the draft content against the provided requirements and evaluate which requirements are met.

For each requirement, determine:
1. Whether it is addressed in the draft (true/false)
2. A brief explanation of why it is or isn't met
3. Suggestions for improvement if not fully met

Return a JSON array with this structure:
[
  {
    "requirementId": "string",
    "isMet": boolean,
    "explanation": "string",
    "suggestion": "string"
  }
]`;

    const userPrompt = `Draft Content:
${draftContent || "No content yet"}

Requirements to check:
${requirements.map((r: any) => `- [${r.mandatory ? 'MANDATORY' : 'OPTIONAL'}] ${r.id}: ${r.title}`).join('\n')}

Analyze the draft and return your assessment as a JSON array.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "analyze_requirements",
            description: "Analyze draft content against requirements",
            parameters: {
              type: "object",
              properties: {
                analysis: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      requirementId: { type: "string" },
                      isMet: { type: "boolean" },
                      explanation: { type: "string" },
                      suggestion: { type: "string" }
                    },
                    required: ["requirementId", "isMet", "explanation"],
                    additionalProperties: false
                  }
                }
              },
              required: ["analysis"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "analyze_requirements" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-draft function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
