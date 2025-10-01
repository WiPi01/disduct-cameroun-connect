-- Create buyer_preferences table
CREATE TABLE IF NOT EXISTS public.buyer_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_categories TEXT[] DEFAULT '{}',
  monthly_budget TEXT,
  acquisition_type TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.buyer_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for buyer_preferences
CREATE POLICY "Users can view their own buyer preferences"
ON public.buyer_preferences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own buyer preferences"
ON public.buyer_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buyer preferences"
ON public.buyer_preferences
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own buyer preferences"
ON public.buyer_preferences
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_buyer_preferences_updated_at
BEFORE UPDATE ON public.buyer_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();