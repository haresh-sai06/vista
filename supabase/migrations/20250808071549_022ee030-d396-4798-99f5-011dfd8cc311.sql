-- Fix function security issues by setting proper search path

-- Update the update_updated_at_column function with security definer and set search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the handle_new_user function with proper search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, company_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company'));
  RETURN NEW;
END;
$$;