-- =====================================================
-- FIX ONLINE ORDERS RLS POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own orders" ON online_orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON online_orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON online_orders;

-- Enable RLS
ALTER TABLE online_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to insert their own orders
CREATE POLICY "Users can insert their own orders"
ON online_orders
FOR INSERT
TO authenticated
WITH CHECK (
  customer_id IN (
    SELECT id FROM event_customers WHERE auth_id = auth.uid()
  )
);

-- Policy: Allow users to view their own orders
CREATE POLICY "Users can view their own orders"
ON online_orders
FOR SELECT
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM event_customers WHERE auth_id = auth.uid()
  )
);

-- Policy: Allow users to update their own orders (for cancellation)
CREATE POLICY "Users can update their own orders"
ON online_orders
FOR UPDATE
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM event_customers WHERE auth_id = auth.uid()
  )
)
WITH CHECK (
  customer_id IN (
    SELECT id FROM event_customers WHERE auth_id = auth.uid()
  )
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON online_orders TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
