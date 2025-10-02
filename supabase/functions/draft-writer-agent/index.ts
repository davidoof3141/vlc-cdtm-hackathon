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
    const { action, currentDraft, requirements, tenderInfo, targetRequirement } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Draft Writer Agent - Action: ${action}`);

    const systemPrompt = `You are a Draft Writer AI agent specialized in creating compelling RFP responses. Your role is to:
1. Generate high-quality, professional content that addresses requirements
2. Improve existing draft sections based on feedback
3. Maintain consistency in tone and style
4. Ensure all content is factual, relevant, and persuasive

Always write in a professional business tone, be specific, and focus on value proposition.`;

    let userPrompt = "";

    if (action === "generate_full") {
      userPrompt = `Generate a complete RFP draft that addresses all requirements.

TENDER INFO:
${JSON.stringify(tenderInfo, null, 2)}

REQUIREMENTS:
${requirements}

Create a comprehensive, well-structured draft that covers all aspects professionally.`;
    } else if (action === "improve_section") {
      userPrompt = `Improve the current draft to better address this specific requirement.

REQUIREMENT TO ADDRESS:
${targetRequirement}

CURRENT DRAFT:
${currentDraft}

TENDER INFO:
${JSON.stringify(tenderInfo, null, 2)}

Enhance the draft to better address this requirement while maintaining the existing structure and style.`;
    } else if (action === "add_section") {
      userPrompt = `Add a new section to the draft to address this missing requirement.

REQUIREMENT TO ADDRESS:
${targetRequirement}

CURRENT DRAFT:
${currentDraft}

TENDER INFO:
${JSON.stringify(tenderInfo, null, 2)}

Add a well-integrated section that addresses this requirement. Ensure it flows naturally with the existing content.`;
    }

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
    const content = data.choices?.[0]?.message?.content;

    console.log("Draft content generated/improved");

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in draft-writer-agent:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
