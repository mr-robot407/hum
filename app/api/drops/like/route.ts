import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { drop_id, action } = await req.json()

  if (action === 'like') {
    await supabase.from('drops').update({ likes: supabase.rpc as any }).eq('id', drop_id)
    const { data: drop } = await supabase.from('drops').select('likes').eq('id', drop_id).single()
    const newLikes = (drop?.likes || 0) + 1
    const { error } = await supabase.from('drops').update({ likes: newLikes }).eq('id', drop_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ likes: newLikes })
  } else {
    const { data: drop } = await supabase.from('drops').select('likes').eq('id', drop_id).single()
    const newLikes = Math.max(0, (drop?.likes || 0) - 1)
    const { error } = await supabase.from('drops').update({ likes: newLikes }).eq('id', drop_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ likes: newLikes })
  }
}
