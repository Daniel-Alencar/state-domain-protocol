DROP POLICY IF EXISTS "subscriptions insert own" ON public.subscriptions;

CREATE POLICY "subscriptions insert own free"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND plan_tier = 'free'
  AND status = 'active'
  AND current_period_end IS NULL
);

-- Prevent self-upgrading via UPDATE: only admins can modify subscriptions.
-- (No user UPDATE policy exists, so no change needed.)
