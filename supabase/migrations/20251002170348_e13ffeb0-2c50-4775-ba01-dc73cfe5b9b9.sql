-- Create tender_collaborators table to track who has access to each tender
CREATE TABLE public.tender_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tender_id UUID NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tender_id, user_id)
);

-- Enable RLS on tender_collaborators
ALTER TABLE public.tender_collaborators ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view collaborators for tenders they own or are collaborating on
CREATE POLICY "Users can view tender collaborators"
ON public.tender_collaborators
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.tenders WHERE id = tender_id
    UNION
    SELECT user_id FROM public.tender_collaborators WHERE tender_id = tender_collaborators.tender_id
  )
);

-- Policy: Tender owners can add collaborators
CREATE POLICY "Tender owners can add collaborators"
ON public.tender_collaborators
FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.tenders WHERE id = tender_id)
);

-- Policy: Tender owners and the collaborator themselves can remove collaborators
CREATE POLICY "Owners and collaborators can remove access"
ON public.tender_collaborators
FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM public.tenders WHERE id = tender_id
    UNION
    SELECT user_id WHERE user_id = auth.uid()
  )
);

-- Update tenders RLS policies to allow collaborators to view/edit
DROP POLICY IF EXISTS "Users can view their own tenders" ON public.tenders;
DROP POLICY IF EXISTS "Users can update their own tenders" ON public.tenders;

CREATE POLICY "Users can view their own tenders and shared tenders"
ON public.tenders
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  auth.uid() IN (SELECT user_id FROM public.tender_collaborators WHERE tender_id = id)
);

CREATE POLICY "Users can update their own tenders and shared tenders"
ON public.tenders
FOR UPDATE
USING (
  auth.uid() = user_id 
  OR 
  auth.uid() IN (SELECT user_id FROM public.tender_collaborators WHERE tender_id = id)
);