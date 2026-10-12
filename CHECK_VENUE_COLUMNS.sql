-- Run this query to see what columns actually exist in event_venues table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'event_venues'
ORDER BY 
    ordinal_position;
