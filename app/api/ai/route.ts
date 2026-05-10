import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  const client = new Anthropic({ apiKey })
  try {
    const { task, data } = await req.json()
    const prompt = buildPrompt(task, data)
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
    const result = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'AI error' }, { status: 500 })
  }
}

function buildPrompt(task: string, data: any): string {
  switch (task) {

    case 'match_score': return `You are HUM's AI matching engine for Kashmir's creator economy platform.

BUSINESS:
- Name: ${data.business_name}
- Industry/Niche: ${data.business_niche}
- Campaign goal: ${data.campaign_goal || 'grow brand awareness'}
- Budget: ${data.budget || 'not specified'}

CREATOR:
- Name: ${data.creator_name}
- Handle: @${data.creator_handle}
- Type: ${data.creator_type}
- Niche vibes: ${(data.vibes || []).join(', ')}
- Influences: ${(data.influences || []).join(', ')}
- Instagram: @${data.ig_handle || 'not set'}
- Facebook: @${data.fb_handle || 'not set'}
- Followers: ${data.followers || 0}
- Monthly views: ${data.monthly_views || 0}
- Avg video views: ${data.avg_video_views || 0}
- Engagement rate: ${data.engagement_rate || 0}%

Score this creator for this business on three factors:
1. NICHE FIT (40% weight): How well does the creator's content type and influences match the business industry?
2. AUDIENCE SIZE (30% weight): Are the follower count and monthly views appropriate for this business size and goal?
3. ENGAGEMENT QUALITY (30% weight): Is the engagement rate strong relative to their audience size?

Respond ONLY with this exact JSON format, nothing else:
{
  "score": <integer 0-100>,
  "grade": "<A|B|C|D>",
  "grade_color": "<#22c55e for A | #c9a84c for B | #5c8de0 for C | #e05c5c for D>",
  "niche_score": <integer 0-100>,
  "audience_score": <integer 0-100>,
  "engagement_score": <integer 0-100>,
  "reason": "<one punchy sentence why this creator fits or doesn't fit>",
  "collab_angle": "<one specific content idea for this business + creator combo>",
  "outreach": "<personalized DM from the business to this creator, casual, under 40 words>"
}`

    case 'quick_match': return `You are HUM's AI matching engine. A business needs creator recommendations.

BUSINESS:
- Name: ${data.business_name}
- Industry: ${data.business_niche}
- Campaign goal: ${data.goal}
- Budget: ${data.budget}
- Creator vibe wanted: ${data.vibe || 'any'}

AVAILABLE CREATORS:
${(data.creators || []).map((c: any, i: number) => `${i+1}. ${c.name} (@${c.handle}) — ${c.type}, ${c.followers || 0} followers, ${c.engagement_rate || 0}% engagement, vibes: ${(c.vibes||[]).join(', ')}, IG: @${c.ig_handle||'none'}`).join('\n')}

Rank the TOP 3 best matches. Respond ONLY with this exact JSON array:
[
  {
    "handle": "<creator handle>",
    "score": <integer 0-100>,
    "grade": "<A|B|C|D>",
    "grade_color": "<#22c55e|#c9a84c|#5c8de0|#e05c5c>",
    "reason": "<one sentence why they fit>",
    "collab_angle": "<specific content idea>",
    "outreach": "<personalized opening DM, casual, under 40 words>"
  }
]
Return only 3 items maximum. If fewer creators exist, return all of them.`

    case 'profile': return `You are writing a creator profile for HUM — Kashmir's creator economy platform.
Creator: Name: ${data.name}, Handle: @${data.handle}, Type: ${data.creator_type || data.type}, Vibes: ${(data.vibes||[]).join(', ')}, Influences: ${(data.influences||[]).join(', ')}, IG: @${data.ig_handle||'none'}, Followers: ${data.followers||0}
Write with exactly this structure:
TAGLINE: [one punchy line under 12 words]
ABOUT: [2-3 sentences, first person, raw and human, Kashmir-grounded]
PILLARS: [3 content themes, one line each, starting with -]
LOOKING FOR: [one line — what collaborator they want]
Sound like a real young creator. No corporate speak.`

    case 'tags': return `Generate 4 short tags (no #, lowercase, max 12 chars each) for this creative drop:
Title: ${data.title}, Type: ${data.type}, Description: ${data.description}
Return ONLY a JSON array: ["tag1","tag2","tag3","tag4"] — nothing else.`

    case 'collab': return `You are the collab AI for HUM — Kashmir's creator-business platform.
Drop: Title: ${data.title}, Type: ${data.type}, Description: ${data.description}, Creator: ${data.creator_name}
Suggest 3 specific collab opportunities. For each: who to find, what to create together, an opening message (casual, under 25 words).
Sound like a creative director advising a friend.`

    case 'campaign_brief': return `You are a marketing strategist for HUM — Kashmir's creator economy platform.
Business: ${data.business_name}, Niche: ${data.niche}, Goal: ${data.goal}, Budget: ${data.budget}, Creator type: ${data.creator_type || 'any'}
Write a complete campaign brief:
CAMPAIGN TITLE: [punchy name]
OBJECTIVE: [one clear sentence]
TARGET AUDIENCE: [who this reaches]
CONTENT STRATEGY:
- [idea 1]
- [idea 2]
- [idea 3]
CREATOR REQUIREMENTS: [what creator fits]
DELIVERABLES: [exactly what business gets]
TIMELINE: [2-4 week breakdown]
SUCCESS METRICS: [3 KPIs]
WHY THIS WORKS FOR KASHMIR: [one paragraph]`

    case 'business_strategy': return `You are a growth strategist for HUM — Kashmir's creator economy platform.
Business: ${data.name}, Niche: ${data.niche}, Size: ${data.size || 'small'}, Description: ${data.description || 'Local Kashmir business'}
Write a future-proofing creator marketing strategy:
OPPORTUNITY SCORE: [X/10]
WHY CREATOR MARKETING: [2 sentences specific to their niche]
TOP 3 CREATOR TYPES TO WORK WITH: [specific]
FIRST CAMPAIGN IDEA: [specific 30-day campaign]
PROJECTED IMPACT: [realistic reach estimates for Kashmir market]
FUTURE-PROOFING MOVES: [3 specific actions for next 6 months]`

    default: return `Help this user: ${JSON.stringify(data)}`
  }
}
