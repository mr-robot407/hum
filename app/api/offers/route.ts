import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const creator_handle = searchParams.get('creator_handle')
  const business_id = searchParams.get('business_id')
  const business_name = searchParams.get('business_name')
  let q = sb.from('offers').select('*').order('created_at', { ascending: false })
  if (creator_handle) q = q.eq('creator_handle', creator_handle)
  if (business_id) q = q.eq('business_id', business_id)
  if (business_name) q = q.eq('business_name', business_name)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ offers: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await sb.from('offers').insert([body]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ offer: data })
}
