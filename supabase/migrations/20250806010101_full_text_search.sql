
-- Enable the pg_trgm extension for better text search
create extension if not exists pg_trgm;

-- Create a function to perform the product search
create or replace function search_products(search_term text)
returns table (id uuid, title text, description text, price double precision, image_urls text[], location text, category text, seller_name text, rank real) as $$
begin
  return query
  select
    p.id,
    p.title,
    p.description,
    p.price,
    p.image_urls,
    p.location,
    p.category,
    prof.full_name as seller_name,
    ts_rank_cd(p.fts, websearch_to_tsquery('french', search_term)) as rank
  from
    products as p
  join
    profiles as prof on p.user_id = prof.id
  where
    p.status = 'approved' and
    p.fts @@ websearch_to_tsquery('french', search_term)
  order by
    rank desc;
end; 
$$ language plpgsql;

-- Add the fts column for full-text search
alter table products
add column fts tsvector generated always as (to_tsvector('french', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, ''))) stored;

-- Create an index on the fts column for performance
create index if not exists products_fts_idx on products using gin (fts);
