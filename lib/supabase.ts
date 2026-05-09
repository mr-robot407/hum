import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  name: string
  handle: string
  type: string
  bio: string
  vibes: string[]
  influences: string[]
  generated_bio: string
  avatar_url?: string
  created_at: string
}

export type Drop = {
  id: string
  creator_id: string
  creator_name: string
  creator_handle: string
  creator_type: string
  title: string
  description: string
  media_url?: string
  media_type?: string
  tags: string[]
  likes: number
  collab_count: number
  created_at: string
}

export type CollabRequest = {
  id: string
  drop_id: string
  from_name: string
  from_handle: string
  message: string
  created_at: string
}
