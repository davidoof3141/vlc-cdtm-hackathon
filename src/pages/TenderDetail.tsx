import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileEdit, Download, Share2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AIAnalysisCard from "@/components/tender/AIAnalysisCard";
import GoNoGoDetails from "@/components/tender/GoNoGoDetails";
import RequirementsMatrix from "@/components/tender/RequirementsMatrix";
import EligibilityChecklist from "@/components/tender/EligibilityChecklist";
import EvaluationStrategy from "@/components/tender/EvaluationStrategy";

const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock comprehensive tender data
  const tender = {
    client: "Federal Digital Services Agency",
    projectName: "Citizen Services Portal",
    subtitle: "Secure, accessible web application for citizen engagement and real-time collaboration",
    
    // AI Analysis data
    aiAnalysis: {
      companyFitScore: 82,
      confidence: 0.86,
      capability: "High",
      compliance: "Medium",
      profitability: "Good",
      deliveryWindow: "Q2-Q3",
      whyFits: [
        "Strong track record in public sector digital transformation projects",
        "Existing SOC2 compliance and GDPR expertise",
        "Available team capacity matches required skillset",
        "Previous successful delivery with client in 2024"
      ],
      risks: [
        "Tight deadline may require resource reallocation",
        "SOC2 Type II certification renewal needed before project start",
        "Competing priority with internal Q2 initiatives"
      ],
      primaryDept: "Digital Platforms",
      primaryDeptRationale: "Best alignment with cloud-native architecture requirements and existing public sector frameworks",
      coInvolve: "Security Office"
    },

    // Go/No-Go Details
    goNoGo: {
      deadline: "Mar 15, 2025",
      priority: "High",
      budget: "€420,000",
      budgetType: "T&M w/ cap",
      targetGM: "≥32%",
      strategicContext: "Tier-A client; strategic expansion opportunity",
      pastWin: "Customer 360 (2024)",
      status: "Open",
      owner: "—"
    },

    // Executive Summary
    executiveSummary: {
      ask: "Build secure web application with real-time collaboration features, integrate with existing CRM infrastructure, provide comprehensive training and documentation, and deliver 6-month maintenance package.",
      priorities: "Accessibility compliance, SOC2/GDPR adherence, Q3 rollout timeline",
      deliverables: [
        "Cloud-native web application with role-based access control",
        "Real-time collaboration features (document sharing, chat, notifications)",
        "Salesforce CRM integration via REST APIs",
        "Comprehensive user training program and documentation",
        "6-month post-launch maintenance and support"
      ],
      constraints: [
        "Must comply with government accessibility standards (WCAG 2.1 AA)",
        "SOC2 Type II and GDPR compliance required",
        "Integration with existing authentication infrastructure",
        "Deployment to government-approved cloud infrastructure"
      ]
    },

    // Client Snapshot
    clientSnapshot: {
      agency: "Federal Digital Services Agency",
      industry: "Public Sector (IT)",
      size: "~2,300 FTE",
      procurement: "Framework agreements, competitive tender",
      mandate: "Digital transformation for citizen-facing services; focus on accessibility and security",
      contact: "Sarah Mitchell (Director of Digital Innovation)",
      pastWork: [
        "Customer 360 Platform (2024) - €380K, successful delivery",
        "Identity Management System (2023) - €290K, on-time completion",
        "Citizen Portal MVP (2022) - €150K, exceeded expectations"
      ]
    },

    // Key Requirements
    requirements: [
      {
        type: "MUST" as const,
        description: "Real-time collaboration features",
        status: "Met" as const,
        action: "Attach case study from Healthcare Collab project"
      },
      {
        type: "MUST" as const,
        description: "SOC2 Type II + GDPR compliance",
        status: "Gap" as const,
        action: "Create remediation task - cert renewal by Feb 2025"
      },
      {
        type: "MUST" as const,
        description: "Salesforce CRM integration",
        status: "Open" as const,
        action: "Assign integration specialist owner"
      },
      {
        type: "SHOULD" as const,
        description: "WCAG 2.1 AA accessibility",
        status: "Met" as const,
        action: "Reference Public Sector Portal case study"
      },
      {
        type: "SHOULD" as const,
        description: "Multi-language support (EN, FR, DE)",
        status: "Open" as const,
        action: "Assess localization framework options"
      },
      {
        type: "NICE" as const,
        description: "Mobile-responsive design",
        status: "Met" as const
      }
    ],

    // Eligibility
    eligibility: [
      { name: "ISO 27001", status: "met" as const },
      { name: "SOC2 Type II", status: "expiring" as const, action: "Schedule renewal" },
      { name: "GDPR DPA", status: "met" as const },
      { name: "Size ≥100", status: "met" as const }
    ],

    // Evaluation Criteria
    evaluation: {
      criteria: [
        { name: "Technical Approach", weight: 35 },
        { name: "Cost & Value", weight: 25 },
        { name: "Delivery Timeline", weight: 20 },
        { name: "Security & Compliance", weight: 20 }
      ],
      winThemes: [
        "Proven public sector expertise",
        "Agile delivery methodology",
        "Security-first architecture",
        "Client relationship strength"
      ],
      gaps: [
        "SOC2 certification renewal",
        "Detailed Salesforce integration plan",
        "Resource allocation conflicts"
      ],
      attachments: [
        "Company profile and certifications",
        "Team CVs and case studies",
        "Technical architecture proposal",
        "Security compliance documentation"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {tender.client} — {tender.projectName}
              </h1>
              <p className="text-muted-foreground text-lg">
                Project: {tender.projectName} — {tender.subtitle}
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate(`/tenders/${id}/draft`)}>
                <FileEdit className="mr-2 h-4 w-4" />
                Draft Proposal
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Analysis Section */}
          <AIAnalysisCard {...tender.aiAnalysis} />

          {/* Go/No-Go Details */}
          <GoNoGoDetails {...tender.goNoGo} />

          {/* Executive Summary */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Executive Summary (RFP Ask)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{tender.executiveSummary.ask}</p>
              <div>
                <h3 className="font-semibold text-sm mb-2">Priorities</h3>
                <p className="text-sm text-muted-foreground">{tender.executiveSummary.priorities}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Deliverables</h3>
                  <ul className="space-y-1">
                    {tender.executiveSummary.deliverables.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2">Constraints</h3>
                  <ul className="space-y-1">
                    {tender.executiveSummary.constraints.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two-Column: Client Snapshot & Requirements */}
          <RequirementsMatrix 
            clientSnapshot={tender.clientSnapshot}
            requirements={tender.requirements}
          />

          {/* Eligibility Checklist */}
          <EligibilityChecklist items={tender.eligibility} />

          {/* Evaluation Criteria & Strategy */}
          <EvaluationStrategy {...tender.evaluation} />
        </div>
      </main>
    </div>
  );
};

export default TenderDetail;
