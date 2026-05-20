-- ============================================================
-- CONVIX — Migration 005: Conversations Trigger & Sync Fix
-- Keeps public.user_usage.conversations_total automatically
-- synchronized with the actual number of active conversations in
-- public.conversations. Resolves the decrement lockout bug.
-- ============================================================

-- Create trigger function to sync conversations_total
CREATE OR REPLACE FUNCTION public.sync_conversations_total()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id UUID;
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    target_user_id := NEW.user_id;
  ELSE
    target_user_id := OLD.user_id;
  END IF;

  UPDATE public.user_usage
  SET conversations_total = (
    SELECT count(*)
    FROM public.conversations
    WHERE user_id = target_user_id AND status = 'active'
  )
  WHERE user_id = target_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to conversations table
DROP TRIGGER IF EXISTS on_conversation_changed ON public.conversations;
CREATE TRIGGER on_conversation_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.sync_conversations_total();

-- Synchronize usage counts for all existing users to fix past discrepancies
UPDATE public.user_usage u
SET conversations_total = (
  SELECT count(*)
  FROM public.conversations c
  WHERE c.user_id = u.user_id AND c.status = 'active'
);
