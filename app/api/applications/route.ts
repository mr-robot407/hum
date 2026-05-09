import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabase.from('campaign_applications').insert([body]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // increment applications count
  await supabase.from('campaigns').update({ applications: supabase.rpc('increment') }).eq('id', body.campaign_id)
  return NextResponse.json({ application: data })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const campaign_id = searchParams.get('campaign_id')
  const query = supabase.from('campaign_applications').select('*').order('created_at', { ascending: false })
  if (campaign_id) query.eq('campaign_id', campaign_id)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ applications: data })
}
