import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create client with anon key to verify user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Create admin client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const sampleTenders = [
      {
        user_id: user.id,
        title: "Cloud Migration Services RFP",
        client_name: "Global Tech Solutions Inc.",
        project_name: "Enterprise Cloud Transformation",
        subtitle: "Migrate legacy infrastructure to cloud-native architecture",
        contact: "procurement@globaltechsolutions.com",
        status: "open",
        priority: "high",
        deadline: "2025-11-15",
        company_fit_score: 85,
        ai_confidence: 0.92,
        requirements: "Must support AWS and Azure platforms\nMinimum 99.9% uptime SLA\n24/7 technical support\nComplete data migration within 6 months",
        goals: "Reduce infrastructure costs by 40%\nImprove system scalability\nEnhance disaster recovery capabilities",
        scope: "Migration of 200+ servers\nDatabase modernization\nApplication containerization\nStaff training and documentation",
        budget: "$2.5M - $3.5M",
        budget_type: "fixed",
        agency: "Federal",
        industry: "Technology",
        capability: "Cloud Infrastructure",
        executive_summary_ask: "Modernize IT infrastructure through comprehensive cloud migration",
        why_fits: ["Strong cloud migration track record", "Expertise in AWS and Azure", "Proven cost optimization strategies"],
        risks: ["Tight timeline may require additional resources", "Legacy system complexity", "Potential data migration issues"],
        deliverables: ["Migration strategy document", "Architecture diagrams", "Cost-benefit analysis", "Training materials"],
        progress: 15
      },
      {
        user_id: user.id,
        title: "Digital Marketing Campaign",
        client_name: "SmartRetail Corporation",
        project_name: "Q4 Holiday Campaign 2025",
        subtitle: "Multi-channel digital marketing initiative",
        contact: "marketing@smartretail.com",
        status: "running",
        priority: "medium",
        deadline: "2025-10-30",
        company_fit_score: 72,
        ai_confidence: 0.88,
        requirements: "Social media presence across 5 platforms\nEmail marketing to 500K subscribers\nSEO optimization\nAnalytics and reporting dashboard",
        goals: "Increase online sales by 35%\nGrow social media engagement by 50%\nImprove brand awareness",
        scope: "Campaign strategy development\nCreative content production\nPlatform management and optimization\nPerformance tracking and reporting",
        budget: "$500K - $750K",
        budget_type: "time_and_materials",
        agency: "Commercial",
        industry: "Retail",
        capability: "Digital Marketing",
        executive_summary_ask: "Drive holiday sales through integrated digital marketing strategy",
        why_fits: ["Experience with retail clients", "Strong social media expertise", "Data-driven approach"],
        risks: ["Seasonal competition", "Short timeline for content creation", "Budget constraints"],
        deliverables: ["Campaign strategy deck", "Content calendar", "Creative assets", "Monthly reports"],
        progress: 45
      },
      {
        user_id: user.id,
        title: "Cybersecurity Assessment",
        client_name: "FinanceSecure Bank",
        project_name: "Enterprise Security Audit 2025",
        subtitle: "Comprehensive security assessment and penetration testing",
        contact: "security@financesecure.com",
        status: "open",
        priority: "high",
        deadline: "2025-12-01",
        company_fit_score: 90,
        ai_confidence: 0.95,
        requirements: "Full network penetration testing\nApplication security assessment\nCompliance audit (SOC 2, ISO 27001)\nExecutive summary and remediation plan",
        goals: "Identify security vulnerabilities\nEnsure regulatory compliance\nStrengthen security posture",
        scope: "Network infrastructure testing\nWeb and mobile app assessment\nSocial engineering tests\nCompliance gap analysis\nRemediation roadmap",
        budget: "$300K - $450K",
        budget_type: "fixed",
        agency: "Financial",
        industry: "Banking",
        capability: "Cybersecurity",
        executive_summary_ask: "Conduct comprehensive security assessment to protect customer data",
        why_fits: ["Banking sector expertise", "Certified security professionals", "Proven penetration testing methodology"],
        risks: ["Strict compliance requirements", "Limited testing windows", "High security clearance needed"],
        deliverables: ["Security assessment report", "Penetration test results", "Compliance checklist", "Remediation plan"],
        progress: 5
      },
      {
        user_id: user.id,
        title: "Custom ERP Implementation",
        client_name: "Manufacturing Solutions Ltd",
        project_name: "SAP S/4HANA Migration",
        subtitle: "Replace legacy ERP with modern SAP solution",
        contact: "it.projects@manufacturingsolutions.com",
        status: "open",
        priority: "medium",
        deadline: "2026-02-28",
        company_fit_score: 78,
        ai_confidence: 0.85,
        requirements: "SAP S/4HANA implementation\nIntegration with existing MES systems\nCustom module development\nUser training for 500+ employees",
        goals: "Streamline manufacturing operations\nImprove inventory management\nReal-time production tracking",
        scope: "System analysis and design\nSAP installation and configuration\nData migration from legacy system\nCustom development and integration\nUser training and change management\nGo-live support",
        budget: "$1.8M - $2.2M",
        budget_type: "fixed",
        agency: "Commercial",
        industry: "Manufacturing",
        capability: "ERP Systems",
        executive_summary_ask: "Modernize enterprise resource planning to improve operational efficiency",
        why_fits: ["SAP certified consultants", "Manufacturing industry experience", "Strong change management"],
        risks: ["Complex legacy system integration", "User resistance to change", "Long implementation timeline"],
        deliverables: ["Requirements document", "System architecture", "Training materials", "Integration specifications"],
        progress: 10
      }
    ];

    const { data, error } = await supabaseAdmin
      .from("tenders")
      .insert(sampleTenders)
      .select();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true, tenders: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
