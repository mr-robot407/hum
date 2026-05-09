-- Run this in your Supabase SQL editor

-- Profiles table
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  handle text unique not null,
  type text not null,
  bio text default '',
  vibes text[] default '{}',
  influences text[] default '{}',
  generated_bio text default '',
  avatar_url text,
  created_at timestamptz default now()
);

-- Drops table
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

-- Likes table
create table if not exists likes (
  id uuid default gen_random_uuid() primary key,
  drop_id uuid references drops(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(drop_id, profile_id)
);

-- Collab requests table
create table if not exists collab_requests (
  id uuid default gen_random_uuid() primary key,
  drop_id uuid references drops(id) on delete cascade,
  from_profile uuid references profiles(id) on delete cascade,
  message text not null,
  ai_suggestion text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Storage bucket for media
insert into storage.buckets (id, name, public) 
values ('hum-media', 'hum-media', true)
on conflict do nothing;

-- RLS Policies (open for hackathon demo)
alter table profiles enable row level security;
alter table drops enable row level security;
alter table likes enable row level security;
alter table collab_requests enable row level security;

create policy "Public read profiles" on profiles for select using (true);
create policy "Public insert profiles" on profiles for insert with check (true);
create policy "Public update profiles" on profiles for update using (true);

create policy "Public read drops" on drops for select using (true);
create policy "Public insert drops" on drops for insert with check (true);
create policy "Public update drops" on drops for update using (true);

create policy "Public read likes" on likes for select using (true);
create policy "Public insert likes" on likes for insert with check (true);
create policy "Public delete likes" on likes for delete using (true);

create policy "Public read collabs" on collab_requests for select using (true);
create policy "Public insert collabs" on collab_requests for insert with check (true);

-- Storage policy
create policy "Public media access" on storage.objects
  for all using (bucket_id = 'hum-media');
