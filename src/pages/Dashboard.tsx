import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TenderCard from "@/components/dashboard/TenderCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Tender {
  id: string;
  title: string;
  client: string;
  deadline: string;
  status: "open" | "running" | "closed";
  progress?: number;
  description: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [tenders] = useState<Tender[]>([
    {
      id: "1",
      title: "Digital Transformation Initiative",
      client: "Global Finance Corp",
      deadline: "2025-11-15",
      status: "open",
      description: "Comprehensive digital transformation project for enterprise banking systems"
    },
    {
      id: "2",
      title: "Cloud Migration Strategy",
      client: "Retail Solutions Ltd",
      deadline: "2025-10-30",
      status: "running",
      progress: 65,
      description: "Migration of on-premise infrastructure to cloud-native architecture"
    },
    {
      id: "3",
      title: "AI-Powered Customer Service",
      client: "TechStart Industries",
      deadline: "2025-10-20",
      status: "running",
      progress: 45,
      description: "Implementation of AI chatbot and automated customer support system"
    },
    {
      id: "4",
      title: "Cybersecurity Assessment",
      client: "Healthcare Alliance",
      deadline: "2025-09-25",
      status: "closed",
      description: "Enterprise-wide security audit and vulnerability assessment"
    },
    {
      id: "5",
      title: "ERP System Modernization",
      client: "Manufacturing Group",
      deadline: "2025-11-05",
      status: "open",
      description: "Upgrade and modernization of legacy ERP systems"
    }
  ]);

  const openTenders = tenders.filter(t => t.status === "open");
  const runningTenders = tenders.filter(t => t.status === "running");
  const closedTenders = tenders.filter(t => t.status === "closed");

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Tender Management
            </h1>
            <p className="text-muted-foreground">
              Manage and track your RFP responses
            </p>
          </div>
          <Button 
            onClick={() => navigate("/tenders/new")}
            size="lg"
            className="shadow-elegant"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Tender
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="gap-2">
              <FileText className="h-4 w-4" />
              All Tenders
              <span className="ml-1 px-2 py-0.5 rounded-full bg-muted text-xs">
                {tenders.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="open" className="gap-2">
              <Clock className="h-4 w-4" />
              Open
              <span className="ml-1 px-2 py-0.5 rounded-full bg-muted text-xs">
                {openTenders.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="running" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Running
              <span className="ml-1 px-2 py-0.5 rounded-full bg-muted text-xs">
                {runningTenders.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="closed" className="gap-2">
              <XCircle className="h-4 w-4" />
              Closed
              <span className="ml-1 px-2 py-0.5 rounded-full bg-muted text-xs">
                {closedTenders.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="open" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {openTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="running" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {runningTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="closed" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {closedTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
