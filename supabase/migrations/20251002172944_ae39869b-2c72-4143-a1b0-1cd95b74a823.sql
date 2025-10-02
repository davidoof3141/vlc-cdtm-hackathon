-- Drop existing tables
DROP TABLE IF EXISTS public.tender_collaborators CASCADE;
DROP TABLE IF EXISTS public.tenders CASCADE;

-- Create tenders table with simplified structure
CREATE TABLE public.tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  
  -- RFP Content
  requirements TEXT,
  goals TEXT,
  scope TEXT,
  evaluation_criteria TEXT,
  client_summary TEXT,
  
  -- AI Analysis
  company_fit_score INTEGER,
  ai_confidence NUMERIC,
  capability TEXT,
  compliance TEXT,
  profitability TEXT,
  delivery_window TEXT,
  why_fits JSONB,
  risks JSONB,
  
  -- Department & Actions
  primary_dept TEXT,
  primary_dept_rationale TEXT,
  co_involve TEXT,
  
  -- Additional Data
  budget TEXT,
  budget_type TEXT,
  target_gm TEXT,
  deliverables JSONB,
  constraints JSONB,
  eligibility_items JSONB,
  evaluation_weights JSONB,
  
  -- Metadata
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own tenders"
  ON public.tenders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tenders"
  ON public.tenders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tenders"
  ON public.tenders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tenders"
  ON public.tenders FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_tenders_updated_at
  BEFORE UPDATE ON public.tenders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tenders_updated_at();

-- Create tender_collaborators table
CREATE TABLE public.tender_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tender_id, user_id)
);

-- Enable RLS on collaborators
ALTER TABLE public.tender_collaborators ENABLE ROW LEVEL SECURITY;

-- Collaborators RLS Policies
CREATE POLICY "Tender owners can manage collaborators"
  ON public.tender_collaborators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tenders 
      WHERE tenders.id = tender_collaborators.tender_id 
      AND tenders.user_id = auth.uid()
    )
  );