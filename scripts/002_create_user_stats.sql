-- Create user_stats table for the WealthForge app
-- This table stores user financial data with RLS

CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  income NUMERIC DEFAULT 2000,
  needs_pct NUMERIC DEFAULT 50,
  wants_pct NUMERIC DEFAULT 30,
  savings_goal NUMERIC DEFAULT 5000,
  current_saved NUMERIC DEFAULT 800,
  loan_principal NUMERIC DEFAULT 25000,
  loan_rate NUMERIC DEFAULT 5.5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "user_stats_select_own" ON public.user_stats
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "user_stats_insert_own" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "user_stats_update_own" ON public.user_stats
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "user_stats_delete_own" ON public.user_stats
  FOR DELETE USING (auth.uid() = id);

-- Auto-create user_stats row on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_stats (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_stats ON auth.users;

CREATE TRIGGER on_auth_user_created_stats
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_stats();
