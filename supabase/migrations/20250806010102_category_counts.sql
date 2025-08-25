
create or replace function get_category_counts()
returns json as $$
declare
  counts json;
begin
  select json_object_agg(category, count)
  from (
    select category, count(*) as count
    from products
    where status = 'approved'
    group by category
  ) as category_counts
  into counts;
  
  return counts;
end;
$$ language plpgsql;
