-- handle_new_user_safe.sql
-- Safe trigger function for auth.users that attempts to insert a wallet row
-- only when the signup metadata contains public_key and private_key.
-- It swallows insert errors so auth.user creation isn't blocked by wallet insert
-- failures. Run this in Supabase SQL editor to replace any existing unsafe
-- trigger/function.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If no metadata present, do nothing
  IF NEW.raw_user_meta_data IS NULL THEN
    RETURN NEW;
  END IF;

  -- Only proceed if both keys are present
  IF (NEW.raw_user_meta_data ? 'public_key') AND (NEW.raw_user_meta_data ? 'private_key') THEN
    BEGIN
      INSERT INTO public.wallets (user_id, email, public_key, private_key)
      VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'public_key',
        (NEW.raw_user_meta_data->'private_key')::jsonb
      );
    EXCEPTION WHEN OTHERS THEN
      -- Log a notice in the database logs but do not fail the user creation
      RAISE NOTICE 'handle_new_user: wallet insert failed for user %: %', NEW.id, SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$;

-- Create or replace the trigger that calls the function after a new auth.users row
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- End of file
