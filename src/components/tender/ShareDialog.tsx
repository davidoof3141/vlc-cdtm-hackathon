import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenderId: string;
}

interface Collaborator {
  id: string;
  user_id: string;
  email: string;
  role: string;
}

const ShareDialog = ({ open, onOpenChange, tenderId }: ShareDialogProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const loadCollaborators = async () => {
    try {
      // Get collaborators with their email from auth.users
      const { data, error } = await supabase
        .from('tender_collaborators')
        .select('id, user_id, role')
        .eq('tender_id', tenderId);

      if (error) throw error;

      // For each collaborator, get their email
      const collaboratorsWithEmail = await Promise.all(
        (data || []).map(async (collab) => {
          const { data: userData } = await supabase.auth.admin.getUserById(collab.user_id);
          return {
            ...collab,
            email: userData?.user?.email || 'Unknown'
          };
        })
      );

      setCollaborators(collaboratorsWithEmail);
    } catch (error) {
      console.error('Error loading collaborators:', error);
    }
  };

  const handleShare = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Note: In a production app, you'd want to look up the user by email
      // For now, we'll show a message that the user needs to provide the user ID
      toast.error("Email-based sharing requires user profiles. Please use user ID instead or implement user profiles.");
      
      setEmail("");
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
      await loadCollaborators();
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast.error("Failed to remove collaborator");
    }
  };

  // Load collaborators when dialog opens
  useState(() => {
    if (open) {
      loadCollaborators();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Tender</DialogTitle>
          <DialogDescription>
            Invite team members to collaborate on this tender
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleShare()}
              type="email"
            />
            <Button onClick={handleShare} disabled={loading}>
              <UserPlus className="h-4 w-4 mr-2" />
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>

          {collaborators.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Collaborators</h4>
              <div className="space-y-2">
                {collaborators.map((collab) => (
                  <div key={collab.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{collab.email}</span>
                      <Badge variant="outline" className="text-xs">
                        {collab.role}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCollaborator(collab.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;