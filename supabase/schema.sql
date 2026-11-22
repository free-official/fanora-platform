-- FANORA initial schema for Supabase PostgreSQL
-- Run in Supabase SQL Editor only after creating a project.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_]{3,30}$'),
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text not null default '' check (char_length(bio) <= 500),
  avatar_url text,
  website_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  body text not null default '' check (char_length(body) <= 20000),
  visibility text not null default 'public' check (visibility in ('public','members')),
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_creator_created_idx on public.posts(creator_id, created_at desc);
create index if not exists posts_public_idx on public.posts(status, visibility, created_at desc);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;

drop policy if exists "Published profiles are public" on public.profiles;
create policy "Published profiles are public" on public.profiles
for select using (is_published = true or auth.uid() = id);

drop policy if exists "Creators manage their own profile" on public.profiles;
create policy "Creators manage their own profile" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Published public posts are readable" on public.posts;
create policy "Published public posts are readable" on public.posts
for select using (
  (status = 'published' and visibility = 'public')
  or auth.uid() = creator_id
);

drop policy if exists "Creators manage their own posts" on public.posts;
create policy "Creators manage their own posts" on public.posts
for all using (auth.uid() = creator_id) with check (auth.uid() = creator_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at before update on public.posts
for each row execute function public.set_updated_at();

-- Create a profile automatically when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  chosen_name text;
  chosen_username text;
begin
  chosen_name := coalesce(nullif(new.raw_user_meta_data ->> 'display_name',''), 'New Creator');
  chosen_username := lower(coalesce(nullif(new.raw_user_meta_data ->> 'username',''), 'creator_' || substr(new.id::text,1,8)));
  insert into public.profiles(id, username, display_name)
  values(new.id, chosen_username, chosen_name)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();
