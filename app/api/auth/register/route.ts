import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const USERNAME_RE = /^[a-z0-9_]{3,20}$/

export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return NextResponse.json({ error: 'Server misconfigured — SUPABASE_SERVICE_ROLE_KEY missing' }, { status: 500 })

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) }

  const { username, password } = body
  if (!username || !password) return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  if (!USERNAME_RE.test(username)) return NextResponse.json({ error: 'Username must be 3–20 characters: letters, numbers, underscore only' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  const email = `${username}@humkashmir.app`

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  })

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('already been registered') || msg.includes('already exists') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Username already taken — choose another.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true, userId: data.user?.id })
}
