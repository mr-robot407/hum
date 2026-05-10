import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const USERNAME_RE = /^[a-z0-9_]{3,20}$/

export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!serviceKey) return NextResponse.json({ error: 'Server misconfigured — SUPABASE_SERVICE_ROLE_KEY missing' }, { status: 500 })
  if (serviceKey.length < 100) return NextResponse.json({ error: `Key too short (${serviceKey.length} chars) — likely wrong key` }, { status: 500 })

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) }

  const { username, password, role } = body
  if (!username || !password) return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  if (!['creator', 'business'].includes(role)) return NextResponse.json({ error: 'Role must be creator or business' }, { status: 400 })
  if (!USERNAME_RE.test(username)) return NextResponse.json({ error: 'Username must be 3–20 characters: letters, numbers, underscore only' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  const email = `${username}@humkashmir.app`

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username, role },
  })

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('invalid api key') || msg.includes('unauthorized') || msg.includes('apikey')) {
      return NextResponse.json({ error: 'Server config error: service role key is invalid' }, { status: 500 })
    }
    if (msg.includes('already been registered') || msg.includes('already exists') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Username already taken — choose another.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const userId = data.user?.id
  if (!userId) return NextResponse.json({ error: 'User created but ID missing' }, { status: 500 })

  // For creators: no profile created yet — they complete setup after login
  // For businesses: auto-create minimal record so they go straight to dashboard
  if (role === 'creator') {
    // profile will be created during onboarding flow
  } else {
    const { error: bizError } = await admin.from('businesses').upsert({
      name: username,
      handle: username,
      user_id: userId,
      niche: 'General',
      description: '',
      ai_strategy: '',
    }, { onConflict: 'handle' })
    if (bizError) return NextResponse.json({ error: 'Account created but business setup failed: ' + bizError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, userId })
}
