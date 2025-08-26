-- create_wallets_table.sql
-- Run this in the Supabase SQL editor (or psql) to create the `wallets` table,
-- enable row-level security, and add safe policies for client-side usage.
-- NOTE: Storing raw private keys in the DB is acceptable for development/devnet only.
-- For production consider encrypting private_key or using a secure vault/KMS.

-- 1) Create extension and table
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  public_key TEXT NOT NULL,
  private_key JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Enable Row Level Security
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- 3) Policies: allow authenticated users to manage only their own wallet

-- Allow authenticated users to SELECT only their own wallet
CREATE POLICY IF NOT EXISTS select_own_wallet ON public.wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to INSERT only when the row's user_id equals auth.uid()
CREATE POLICY IF NOT EXISTS insert_own_wallet ON public.wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to UPDATE/Delete only their rows
CREATE POLICY IF NOT EXISTS modify_own_wallet ON public.wallets
  FOR UPDATE, DELETE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Optional: Server-side trigger to auto-create wallet from auth.user metadata
-- Use this if you prefer not to rely on the client to write the wallets table.
-- Be cautious: this expects the client put public_key/private_key in the signUp metadata.
-- Uncomment and run if you want this behaviour.

-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   INSERT INTO public.wallets (user_id, public_key, private_key)
--   VALUES (
--     NEW.id,
--     NEW.raw_user_meta_data->>'public_key',
--     (NEW.raw_user_meta_data->'private_key')::jsonb
--   );
--   RETURN NEW;
-- END;
-- $$;
--
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- End of file
