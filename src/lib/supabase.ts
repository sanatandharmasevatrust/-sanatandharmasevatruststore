import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read environment variables for Supabase
const env = (import.meta as any).env || {};
const supabaseUrl: string = env.VITE_SUPABASE_URL || "";
const supabaseAnonKey: string = env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey.length > 10
  );
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (isSupabaseConfigured()) {
    if (!clientInstance) {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    }
    return clientInstance;
  }
  return null;
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * SQL Security & Database Schema definition for reference & provisioning
 */
export const SUPABASE_SQL_SCHEMA = `-- =========================================================
-- SANATAN DHARMA SEVA TRUST: SUPABASE SCHEMA & SECURITY RLS
-- =========================================================

-- 1. Devotees & Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  role text default 'customer' check (role in ('admin', 'customer')),
  phone text,
  address_street text,
  address_city text,
  address_state text,
  address_pincode text,
  darshan_status text default 'Devotee',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for Profiles:
-- A: Users can view their own profile
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

-- B: Users can update their own profile
create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- C: Admins can view and manage all profiles
create policy "Admins can view all profiles" 
  on public.profiles for all 
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 2. Store Orders Table
create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_address jsonb not null,
  items jsonb not null,
  pricing jsonb not null,
  payment_method text not null,
  promo_code text,
  status text default 'Processing' check (status in ('Processing', 'Sanctified & Dispatched', 'Delivered', 'Cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Orders
alter table public.orders enable row level security;

-- Policies for Orders:
-- A: Users can read their own orders
create policy "Users can view own orders" 
  on public.orders for select 
  using (auth.uid() = user_id);

-- B: Authenticated users can insert their own orders
create policy "Users can create orders" 
  on public.orders for insert 
  with check (auth.uid() = user_id or auth.uid() is null);

-- C: Admins can view and manage all orders
create policy "Admins can manage all orders" 
  on public.orders for all 
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
`;
