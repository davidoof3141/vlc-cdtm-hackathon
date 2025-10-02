import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TenderCard from "@/components/dashboard/TenderCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tenders:', error);
        toast.error("Failed to load tenders");
        return;
      }

      // Transform database format to component format
      const transformedTenders: Tender[] = (data || []).map(tender => ({
        id: tender.id,
        title: tender.title,
        client: tender.client_name,
        deadline: tender.deadline,
        status: tender.status as "open" | "running" | "closed",
        progress: tender.progress,
        description: tender.goals || tender.client_summary || "No description available"
      }));

      setTenders(transformedTenders);
    } catch (error) {
      console.error('Error in fetchTenders:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const openTenders = tenders.filter(t => t.status === "open");
  const runningTenders = tenders.filter(t => t.status === "running");
  const closedTenders = tenders.filter(t => t.status === "closed");

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading tenders...</p>
          </div>
        ) : (
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
        )}

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
            {tenders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No tenders yet. Upload your first RFP to get started!</p>
                <Button onClick={() => navigate("/tenders/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Tender
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tenders.map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="open" className="space-y-6">
            {openTenders.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No open tenders</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {openTenders.map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="running" className="space-y-6">
            {runningTenders.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No running tenders</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {runningTenders.map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-6">
            {closedTenders.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No closed tenders</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {closedTenders.map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
