-- ─── HUM Database Schema ───────────────────────────────────────────────────

-- Profiles
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  handle text unique not null,
  type text not null,
  bio text,
  vibes text[] default '{}',
  influences text[] default '{}',
  generated_bio text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Drops
create table if not exists drops (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references profiles(id) on delete cascade,
  creator_name text not null,
  creator_handle text not null,
  creator_type text not null,
  title text not null,
  description text not null,
  media_url text,
  media_type text,
  tags text[] default '{}',
  likes integer default 0,
  collab_count integer default 0,
  created_at timestamptz default now()
);

-- Likes
create table if not exists likes (
  id uuid default gen_random_uuid() primary key,
  drop_id uuid references drops(id) on delete cascade,
  creator_handle text not null,
  created_at timestamptz default now(),
  unique(drop_id, creator_handle)
);

-- Collab requests
create table if not exists collab_requests (
  id uuid default gen_random_uuid() primary key,
  drop_id uuid references drops(id) on delete cascade,
  from_name text not null,
  from_handle text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Storage bucket for media
insert into storage.buckets (id, name, public)
values ('hum-media', 'hum-media', true)
on conflict do nothing;

-- Storage policy — anyone can upload, anyone can read
create policy "Public read" on storage.objects
  for select using (bucket_id = 'hum-media');

create policy "Authenticated upload" on storage.objects
  for insert with check (bucket_id = 'hum-media');

-- RLS policies
alter table profiles enable row level security;
alter table drops enable row level security;
alter table likes enable row level security;
alter table collab_requests enable row level security;

create policy "Public read profiles" on profiles for select using (true);
create policy "Public insert profiles" on profiles for insert with check (true);

create policy "Public read drops" on drops for select using (true);
create policy "Public insert drops" on drops for insert with check (true);
create policy "Public update drops" on drops for update using (true);

create policy "Public read likes" on likes for select using (true);
create policy "Public insert likes" on likes for insert with check (true);
create policy "Public delete likes" on likes for delete using (true);

create policy "Public read collabs" on collab_requests for select using (true);
create policy "Public insert collabs" on collab_requests for insert with check (true);

-- ─── Business Tables ────────────────────────────────────────────────────────

create table if not exists businesses (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  handle text unique not null,
  niche text not null,
  location text default 'Kashmir',
  size text,
  description text,
  website text,
  ai_strategy text,
  created_at timestamptz default now()
);

create table if not exists campaigns (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade,
  business_name text not null,
  business_niche text not null,
  title text not null,
  goal text not null,
  budget text not null,
  creator_type text,
  ai_brief text,
  ai_matches text,
  status text default 'open',
  applications integer default 0,
  created_at timestamptz default now()
);

create table if not exists campaign_applications (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references campaigns(id) on delete cascade,
  creator_name text not null,
  creator_handle text not null,
  creator_type text not null,
  message text,
  created_at timestamptz default now()
);

-- RLS
alter table businesses enable row level security;
alter table campaigns enable row level security;
alter table campaign_applications enable row level security;

create policy "Public read businesses" on businesses for select using (true);
create policy "Public insert businesses" on businesses for insert with check (true);

create policy "Public read campaigns" on campaigns for select using (true);
create policy "Public insert campaigns" on campaigns for insert with check (true);
create policy "Public update campaigns" on campaigns for update using (true);

create policy "Public read applications" on campaign_applications for select using (true);
create policy "Public insert applications" on campaign_applications for insert with check (true);

-- ─── Auth: Add user_id to profiles and businesses ─────────────────────────
-- Run this in Supabase SQL editor to enable auth-linked profiles

alter table profiles add column if not exists user_id uuid references auth.users(id);
alter table businesses add column if not exists user_id uuid references auth.users(id);
alter table drops add column if not exists user_id uuid references auth.users(id);

-- Enable Supabase Auth (done automatically in dashboard)
-- Go to Authentication > Settings > Enable email auth

-- ─── Offers + Messages ─────────────────────────────────────────────────────

create table if not exists offers (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references campaigns(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  business_name text not null,
  business_niche text,
  creator_handle text not null,
  creator_name text not null,
  ai_match_score integer default 0,
  ai_match_grade text default 'C',
  ai_match_reason text,
  ai_collab_angle text,
  outreach_message text,
  status text default 'pending',
  creator_rate text,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  offer_id uuid references offers(id) on delete cascade,
  from_handle text not null,
  to_handle text not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Add social stats columns to profiles
alter table profiles add column if not exists ig_handle text;
alter table profiles add column if not exists fb_handle text;
alter table profiles add column if not exists followers integer default 0;
alter table profiles add column if not exists monthly_views integer default 0;
alter table profiles add column if not exists avg_video_views integer default 0;
alter table profiles add column if not exists engagement_rate numeric(5,2) default 0;

-- RLS
alter table offers enable row level security;
alter table messages enable row level security;

create policy "Public read offers" on offers for select using (true);
create policy "Public insert offers" on offers for insert with check (true);
create policy "Public update offers" on offers for update using (true);

create policy "Public read messages" on messages for select using (true);
create policy "Public insert messages" on messages for insert with check (true);
create policy "Public update messages" on messages for update using (true);
