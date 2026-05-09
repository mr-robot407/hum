import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { drop_id, handle, action } = await req.json()

  if (action === 'like') {
    await supabase.from('likes').insert([{ drop_id, creator_handle: handle }])
    await supabase.rpc('increment_likes', { drop_id })
  } else {
    await supabase.from('likes').delete().match({ drop_id, creator_handle: handle })
    await supabase.rpc('decrement_likes', { drop_id })
  }
  return NextResponse.json({ ok: true })
}
