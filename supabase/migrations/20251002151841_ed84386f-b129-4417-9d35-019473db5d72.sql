-- Create tenders table
CREATE TABLE public.tenders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  project_name TEXT,
  subtitle TEXT,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'running', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  -- Extracted RFP Data
  requirements TEXT,
  goals TEXT,
  scope TEXT,
  evaluation_criteria TEXT,
  client_summary TEXT,
  
  -- AI Analysis Data
  company_fit_score INTEGER,
  ai_confidence DECIMAL(3,2),
  capability TEXT,
  compliance TEXT,
  profitability TEXT,
  delivery_window TEXT,
  why_fits JSONB,
  risks JSONB,
  primary_dept TEXT,
  primary_dept_rationale TEXT,
  co_involve TEXT,
  
  -- Go/No-Go Details
  budget TEXT,
  budget_type TEXT,
  target_gm TEXT,
  strategic_context TEXT,
  past_win TEXT,
  owner TEXT,
  
  -- Executive Summary
  executive_summary_ask TEXT,
  priorities TEXT,
  deliverables JSONB,
  constraints JSONB,
  
  -- Client Snapshot
  agency TEXT,
  industry TEXT,
  company_size TEXT,
  procurement TEXT,
  mandate TEXT,
  contact TEXT,
  past_work JSONB,
  
  -- Requirements Matrix
  product_requirements JSONB,
  
  -- Eligibility
  eligibility_items JSONB,
  
  -- Evaluation
  evaluation_weights JSONB,
  win_themes JSONB,
  gaps JSONB,
  required_attachments JSONB,
  
  -- Metadata
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own tenders" 
ON public.tenders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tenders" 
ON public.tenders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tenders" 
ON public.tenders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tenders" 
ON public.tenders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_tenders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tenders_updated_at
BEFORE UPDATE ON public.tenders
FOR EACH ROW
EXECUTE FUNCTION public.update_tenders_updated_at();

-- Create index for faster queries
CREATE INDEX idx_tenders_user_id ON public.tenders(user_id);
CREATE INDEX idx_tenders_status ON public.tenders(status);
CREATE INDEX idx_tenders_deadline ON public.tenders(deadline);