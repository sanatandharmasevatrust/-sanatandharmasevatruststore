-- SANATAN SEVA STORE AUTH SECURITY HARDENING
-- Run this after the main Store schema.

-- Only an existing admin can promote another profile.
-- Customers can never update their own role.
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can update own profile"
on public.profiles
for update
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = (
    select p.role
    from public.profiles p
    where p.id = auth.uid()
  )
);

-- Admins can manage profiles.
drop policy if exists "Admins can manage profiles" on public.profiles;

create policy "Admins can manage profiles"
on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

-- Products must remain admin-only for writes.
drop policy if exists "Admins manage products" on public.products;

create policy "Admins manage products"
on public.products
for all
using (public.is_admin())
with check (public.is_admin());

-- Optional: make email verification mandatory in Supabase Dashboard:
-- Authentication -> Providers -> Email -> Confirm email = ON
