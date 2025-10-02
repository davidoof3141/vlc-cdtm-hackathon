-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own tenders and shared tenders" ON public.tenders;
DROP POLICY IF EXISTS "Users can update their own tenders and shared tenders" ON public.tenders;

-- Create a security definer function to check tender access
CREATE OR REPLACE FUNCTION public.user_has_tender_access(_user_id uuid, _tender_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenders WHERE id = _tender_id AND user_id = _user_id
    UNION
    SELECT 1 FROM public.tender_collaborators WHERE tender_id = _tender_id AND user_id = _user_id
  )
$$;

-- Recreate policies using the security definer function
CREATE POLICY "Users can view their own tenders and shared tenders"
ON public.tenders
FOR SELECT
USING (public.user_has_tender_access(auth.uid(), id));

CREATE POLICY "Users can update their own tenders and shared tenders"
ON public.tenders
FOR UPDATE
USING (public.user_has_tender_access(auth.uid(), id));