-- Add milestone tracking fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN first_product_posted_congratulated boolean DEFAULT false,
ADD COLUMN first_product_sold_congratulated boolean DEFAULT false,
ADD COLUMN first_product_bought_congratulated boolean DEFAULT false;