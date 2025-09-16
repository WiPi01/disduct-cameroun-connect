-- Add payment_method column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN payment_method TEXT;

-- Update RLS policies to include the new column
-- (The existing policies already cover this column)