import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, X, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Collaborator {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}

interface ShareTenderDialogProps {
  tenderId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const ShareTenderDialog = ({ tenderId, variant = "outline", size = "default" }: ShareTenderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);

  const fetchCollaborators = async () => {
    setLoadingCollaborators(true);
    try {
      const { data, error } = await supabase
        .from('tender_collaborators')
        .select(`
          id,
          user_id,
          role,
          created_at
        `)
        .eq('tender_id', tenderId);

      if (error) throw error;

      // Fetch user emails from auth.users (we'll need to create a helper function or use profiles)
      setCollaborators(data || []);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast.error("Failed to load collaborators");
    } finally {
      setLoadingCollaborators(false);
    }
  };

  const handleShare = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // First, check if user exists with this email
      const { data: userData, error: userError } = await supabase.rpc('get_user_id_by_email', {
        email_address: email.toLowerCase().trim()
      });

      if (userError) {
        // User doesn't exist - we could send an invitation email here
        toast.error("User with this email doesn't exist. They need to sign up first.");
        return;
      }

      // Add collaborator
      const { error: insertError } = await supabase
        .from('tender_collaborators')
        .insert({
          tender_id: tenderId,
          user_id: userData,
          invited_by: (await supabase.auth.getUser()).data.user?.id,
          role: 'editor'
        });

      if (insertError) {
        if (insertError.code === '23505') {
          toast.error("This user is already a collaborator");
        } else {
          throw insertError;
        }
        return;
      }

      toast.success(`Shared with ${email}`);
      setEmail("");
      fetchCollaborators();
    } catch (error) {
      console.error('Error sharing tender:', error);
      toast.error("Failed to share tender");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('tender_collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;

      toast.success("Collaborator removed");
      fetchCollaborators();
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast.error("Failed to remove collaborator");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) fetchCollaborators();
    }}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Tender</DialogTitle>
          <DialogDescription>
            Invite collaborators to work on this tender together
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleShare()}
              />
              <Button onClick={handleShare} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {loadingCollaborators ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : collaborators.length > 0 ? (
            <div className="space-y-2">
              <Label>Current Collaborators</Label>
              <div className="space-y-2">
                {collaborators.map((collab) => (
                  <div key={collab.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {collab.user_id.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{collab.user_id}</p>
                        <Badge variant="outline" className="text-xs">{collab.role}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCollaborator(collab.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No collaborators yet. Invite someone to get started!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTenderDialog;
