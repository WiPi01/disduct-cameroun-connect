-- Add detailed product specifications columns to products table
ALTER TABLE public.products 
ADD COLUMN brand TEXT,
ADD COLUMN color TEXT,
ADD COLUMN material TEXT,
ADD COLUMN size_info TEXT,
ADD COLUMN weight TEXT,
ADD COLUMN dimensions TEXT;