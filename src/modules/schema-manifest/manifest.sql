with meta as (
  select
    c.table_name  as view,
    c.column_name as name,
    c.data_type   as type,
    col_desc.description  as column_description,
    view_desc.description as view_description,
    c.ordinal_position
  from information_schema.columns c
  left join pg_class pc
         on pc.relname = c.table_name
        and pc.relkind in ('v','m')            -- views / matviews
  left join pg_description view_desc
         on view_desc.objoid    = pc.oid
        and view_desc.objsubid  = 0
  left join pg_description col_desc
         on col_desc.objoid     = pc.oid
        and col_desc.objsubid   = c.ordinal_position
  where c.table_schema = 'llm_views'
    and c.table_name   like 'v_%'
),
columns_by_view as (
  select
    view,
    jsonb_agg(
      jsonb_build_object(
        'name', name,
        'type', type,
        'description', column_description
      )
      order by ordinal_position
    ) as columns
  from meta
  group by view
),
manifest as (
  select
    m.view,
    max(view_description) as description,
    cbv.columns
  from meta m
  join columns_by_view cbv using (view)
  group by m.view, cbv.columns
)
select jsonb_agg(
  jsonb_build_object(
    'view',        view,
    'description', description,
    'columns',     columns
  )
) as manifest
from manifest;