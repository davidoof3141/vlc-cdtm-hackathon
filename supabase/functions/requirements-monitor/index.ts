import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { draftContent, requirements, tenderInfo } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing draft against requirements...");

    const systemPrompt = `You are a Requirements Monitor AI agent. Your role is to:
1. Analyze the draft content against all mandatory requirements
2. Identify which requirements are fully met, partially met, or not addressed
3. Provide specific feedback on what's missing or needs improvement
4. Suggest concrete improvements for each requirement

Always be specific, actionable, and constructive in your feedback.`;

    const analysisPrompt = `Analyze this RFP draft against the requirements and provide a detailed assessment.

TENDER INFO:
${JSON.stringify(tenderInfo, null, 2)}

REQUIREMENTS:
${requirements}

CURRENT DRAFT:
${draftContent || "(No content yet)"}

Provide your analysis in the following JSON format:
{
  "overallScore": <0-100>,
  "summary": "Brief overall assessment",
  "requirements": [
    {
      "requirement": "requirement text",
      "status": "met|partial|missing",
      "coverage": <0-100>,
      "feedback": "specific feedback on this requirement",
      "suggestions": "concrete suggestions for improvement"
    }
  ],
  "nextSteps": ["prioritized list of what to address next"]
}`;

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
          { role: "user", content: analysisPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    console.log("Requirements analysis completed");

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in requirements-monitor:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
