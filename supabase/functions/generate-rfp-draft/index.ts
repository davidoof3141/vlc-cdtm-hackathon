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
    const { tenderData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating RFP draft for tender:", tenderData?.title);

    // Build comprehensive context from tender data
    const context = `
Tender Title: ${tenderData.title || "N/A"}
Client: ${tenderData.client_name || "N/A"}
Project: ${tenderData.project_name || "N/A"}
Deadline: ${tenderData.deadline || "N/A"}

Requirements: ${tenderData.requirements || "N/A"}
Goals: ${tenderData.goals || "N/A"}
Scope: ${tenderData.scope || "N/A"}
Evaluation Criteria: ${tenderData.evaluation_criteria || "N/A"}

Deliverables: ${JSON.stringify(tenderData.deliverables || [])}
Constraints: ${JSON.stringify(tenderData.constraints || [])}
Eligibility Requirements: ${JSON.stringify(tenderData.eligibility_items || [])}
Win Themes: ${JSON.stringify(tenderData.win_themes || [])}
`.trim();

    const systemPrompt = `You are an expert RFP response writer. Generate a comprehensive, professional RFP draft response that:
1. Addresses ALL requirements and evaluation criteria
2. Demonstrates clear understanding of the project scope and goals
3. Highlights relevant experience and capabilities
4. Uses professional business language
5. Is well-structured with clear sections
6. Emphasizes win themes and competitive advantages
7. Addresses all constraints and deliverables
8. Ensures all eligibility requirements are covered

The response should be ready to use as a first draft, comprehensive and compelling.`;

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
          { role: "user", content: `Generate a comprehensive RFP response draft based on this information:\n\n${context}` }
        ],
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
    const generatedDraft = data.choices?.[0]?.message?.content;

    if (!generatedDraft) {
      throw new Error("No draft content generated");
    }

    console.log("Successfully generated draft");

    return new Response(
      JSON.stringify({ draft: generatedDraft }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-rfp-draft:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
