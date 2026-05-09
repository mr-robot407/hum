'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Users, Loader2, TrendingUp, Eye, Play, Target, DollarSign, Send, Zap, Search } from 'lucide-react';
const Instagram = ({size=14,color='currentColor'}:{size?:number,color?:string}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill={color}/></svg>
const Facebook = ({size=14,color='currentColor'}:{size?:number,color?:string}) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>

const CTS = [
  { id:'music',  label:'Musician',      color:'#c9a84c', bg:'#c9a84c15' },
  { id:'visual', label:'Visual Artist', color:'#e05c5c', bg:'#e05c5c15' },
  { id:'film',   label:'Filmmaker',     color:'#5c8de0', bg:'#5c8de015' },
  { id:'poetry', label:'Poet / Writer', color:'#8e5ce0', bg:'#8e5ce015' },
  { id:'photo',  label:'Photographer',  color:'#5ce0b8', bg:'#5ce0b815' },
  { id:'comedy', label:'Comedian',      color:'#e0a85c', bg:'#e0a85c15' },
];

const GRADE_COLORS: Record<string,string> = { A:'#22c55e', B:'#c9a84c', C:'#5c8de0', D:'#e05c5c' };
const BUDGETS = ['₹5,000 - ₹15,000','₹15,000 - ₹50,000','₹50,000 - ₹1,50,000','₹1,50,000+'];

const fmt = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : n.toString();

// Grade badge
function GradeBadge({ grade, score }: { grade: string; score: number }) {
  const color = GRADE_COLORS[grade] || '#5c8de0';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${color}15`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: color, letterSpacing: '0.02em' }}>{grade}</span>
        {/* Score arc hint */}
        <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `1px solid ${color}20` }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{score}pts</span>
    </div>
  );
}

// Creator match card
function MatchCard({ match, creator, onSendOffer, sending }: { match: any; creator: any; onSendOffer: () => void; sending: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const ct = CTS.find(t => t.id === creator?.type);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${GRADE_COLORS[match.grade] || '#5c8de0'}30`, borderRadius: 16, overflow: 'hidden' }}>
      {/* Top bar — grade accent */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${GRADE_COLORS[match.grade] || '#5c8de0'}, transparent)` }} />

      <div style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          {/* Creator info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: ct?.bg || 'rgba(255,255,255,0.06)', border: `1px solid ${ct?.color || 'rgba(255,255,255,0.1)'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={22} color={ct?.color || 'rgba(255,255,255,0.4)'} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#f5f0e8', fontFamily: 'Manrope, sans-serif', marginBottom: 2 }}>{creator?.name || match.handle}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>@{match.handle}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {creator?.ig_handle && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}><Instagram size={9} color="#e05c5c"/> @{creator.ig_handle}</span>}
                {creator?.fb_handle && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}><Facebook size={9} color="#5c8de0"/> @{creator.fb_handle}</span>}
              </div>
            </div>
          </div>
          {/* Grade */}
          <GradeBadge grade={match.grade} score={match.score} />
        </div>

        {/* Stats row */}
        {creator && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
            {[
              [Users, fmt(creator.followers || 0), 'Followers', '#c9a84c'],
              [Eye, fmt(creator.monthly_views || 0), 'Mo. Views', '#5c8de0'],
              [Play, fmt(creator.avg_video_views || 0), 'Avg Views', '#8e5ce0'],
              [TrendingUp, `${creator.engagement_rate || 0}%`, 'Eng. Rate', '#5ce0b8'],
            ].map(([Icon, val, label, color]: any) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                <Icon size={12} color={color} style={{ margin: '0 auto 5px' }} />
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, color: '#f5f0e8', letterSpacing: '0.04em' }}>{val}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Match reason */}
        <div style={{ background: `${GRADE_COLORS[match.grade] || '#5c8de0'}08`, border: `1px solid ${GRADE_COLORS[match.grade] || '#5c8de0'}20`, borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: GRADE_COLORS[match.grade] || '#5c8de0', letterSpacing: '0.1em', marginBottom: 6 }}>✦ AI MATCH REASON</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, fontFamily: 'Manrope, sans-serif', margin: 0 }}>{match.reason}</p>
        </div>

        {/* Collab angle */}
        {match.collab_angle && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontFamily: 'Manrope, sans-serif', marginBottom: 14, fontStyle: 'italic' }}>
            💡 {match.collab_angle}
          </div>
        )}

        {/* Outreach preview (expandable) */}
        {match.outreach && (
          <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', marginBottom: expanded ? 10 : 14, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
            {expanded ? '▼' : '▶'} {expanded ? 'Hide' : 'Preview'} outreach message
          </button>
        )}
        <AnimatePresence>
          {expanded && match.outreach && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 14, overflow: 'hidden' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, fontFamily: 'Manrope, sans-serif', margin: 0, fontStyle: 'italic' }}>"{match.outreach}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <button onClick={onSendOffer} disabled={sending}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: GRADE_COLORS[match.grade] || '#c9a84c', color: match.grade === 'A' ? '#000' : '#000', border: 'none', borderRadius: 9999, padding: '12px', fontSize: 13, fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1, fontFamily: 'Manrope, sans-serif', transition: 'all 0.2s' }}>
          {sending ? <><Loader2 size={13} className="spin" />Sending offer...</> : <><Send size={13} />Send offer to {creator?.name || match.handle}</>}
        </button>
      </div>
    </motion.div>
  );
}

interface MatchEngineProps {
  business: any;
  creators: any[];
  campaigns: any[];
  onSendOffer: (creatorHandle: string, matchData: any, campaignId?: string) => Promise<void>;
  onBack: () => void;
}

export default function MatchEngine({ business, creators, campaigns, onSendOffer, onBack }: MatchEngineProps) {
  const [mode, setMode] = useState<'select' | 'quick' | 'browse'>('select');
  const [quickForm, setQuickForm] = useState({ goal: '', budget: '', vibe: '' });
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState('');
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const [browseMatches, setBrowseMatches] = useState<Record<string,any>>({});
  const [scoringId, setScoringId] = useState('');

  const runQuickMatch = async () => {
    setLoading(true); setMatches([]);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'quick_match', data: { ...quickForm, business_name: business.name, business_niche: business.niche, creators } })
      });
      const d = await res.json();
      const parsed = JSON.parse(d.result.replace(/```json|```/g, '').trim());
      setMatches(parsed);
    } catch { setMatches([]); }
    setLoading(false);
  };

  const scoreCreator = async (creator: any) => {
    setScoringId(creator.handle);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'match_score', data: { ...creator, business_name: business.name, business_niche: business.niche, campaign_goal: campaigns[0]?.goal || 'grow brand awareness', budget: campaigns[0]?.budget || 'not specified' } })
      });
      const d = await res.json();
      const parsed = JSON.parse(d.result.replace(/```json|```/g, '').trim());
      setBrowseMatches(p => ({ ...p, [creator.handle]: { ...parsed, handle: creator.handle } }));
    } catch {}
    setScoringId('');
  };

  const handleSendOffer = async (creator: any, matchData: any) => {
    setSendingId(creator.handle);
    await onSendOffer(creator.handle, matchData, campaigns[0]?.id);
    setSentIds(p => [...p, creator.handle]);
    setSendingId('');
  };

  const filtered = filter ? creators.filter(c => c.type === filter) : creators;

  return (
    <div style={{ minHeight: '100vh', background: '#000', paddingBottom: 80 }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 50% 30% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <nav style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: '0.08em', color: '#f5f0e8' }}>HUM</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={13} color="#c9a84c" />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace' }}>AI Match Engine</span>
        </div>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', borderRadius: 9999, padding: '7px 16px', fontSize: 12, cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>← Dashboard</button>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 1 }}>

        {/* Mode select */}
        {mode === 'select' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em', marginBottom: 12 }}>FIND CREATORS</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, letterSpacing: '0.03em', color: '#f5f0e8', marginBottom: 8, lineHeight: 0.92 }}>How do you want to find creators?</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 40, lineHeight: 1.65, fontFamily: 'Manrope, sans-serif', fontWeight: 300 }}>AI scores every creator on niche fit, audience size and engagement rate.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <button onClick={() => setMode('quick')}
                style={{ padding: '32px 24px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c9a84c'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <Sparkles size={28} color="#c9a84c" style={{ marginBottom: 16 }} />
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: '0.03em', color: '#f5f0e8', marginBottom: 8 }}>Quick Match</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, fontFamily: 'Manrope, sans-serif', fontWeight: 300, margin: 0 }}>Describe your campaign. AI instantly finds your top 3 creator matches with scores and reasons.</p>
              </button>
              <button onClick={() => setMode('browse')}
                style={{ padding: '32px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <Search size={28} color="rgba(255,255,255,0.4)" style={{ marginBottom: 16 }} />
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: '0.03em', color: '#f5f0e8', marginBottom: 8 }}>Browse All</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, fontFamily: 'Manrope, sans-serif', fontWeight: 300, margin: 0 }}>See all creators. Filter by type. Click any creator to get their AI match score for your campaign.</p>
              </button>
            </div>
            <div style={{ marginTop: 24, padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={14} color="rgba(255,255,255,0.3)" />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{creators.length} verified creators on HUM · Scored on niche fit + audience + engagement</span>
            </div>
          </motion.div>
        )}

        {/* Quick Match */}
        {mode === 'quick' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => { setMode('select'); setMatches([]); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', marginBottom: 24, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>← Back</button>
            <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em', marginBottom: 12 }}>QUICK MATCH</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 44, letterSpacing: '0.03em', color: '#f5f0e8', marginBottom: 8, lineHeight: 0.92 }}>Describe your campaign</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32, fontFamily: 'Manrope, sans-serif', fontWeight: 300, lineHeight: 1.65 }}>3 quick questions. AI does the rest.</p>

            {matches.length === 0 && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>CAMPAIGN GOAL</label>
                  <input className="input" placeholder="e.g. Launch our new saffron collection to young urban buyers" value={quickForm.goal} onChange={e => setQuickForm(p => ({ ...p, goal: e.target.value }))} autoFocus />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>BUDGET</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {BUDGETS.map(b => <button key={b} onClick={() => setQuickForm(p => ({ ...p, budget: b }))} style={{ background: quickForm.budget === b ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${quickForm.budget === b ? '#c9a84c' : 'rgba(255,255,255,0.08)'}`, borderRadius: 9999, padding: '7px 14px', cursor: 'pointer', color: quickForm.budget === b ? '#c9a84c' : 'rgba(255,255,255,0.5)', fontSize: 12, transition: 'all 0.15s', fontFamily: 'Manrope, sans-serif' }}>{b}</button>)}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>CREATOR VIBE WANTED (OPTIONAL)</label>
                  <input className="input" placeholder="e.g. authentic, cinematic, funny, educational..." value={quickForm.vibe} onChange={e => setQuickForm(p => ({ ...p, vibe: e.target.value }))} />
                </div>
                <button onClick={runQuickMatch} disabled={!quickForm.goal || !quickForm.budget || loading}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: (!quickForm.goal || !quickForm.budget) ? 'rgba(255,255,255,0.05)' : '#c9a84c', color: (!quickForm.goal || !quickForm.budget) ? 'rgba(255,255,255,0.25)' : '#000', border: 'none', borderRadius: 9999, padding: '14px', fontSize: 14, fontWeight: 700, cursor: (!quickForm.goal || !quickForm.budget) ? 'not-allowed' : 'pointer', fontFamily: 'Manrope, sans-serif', transition: 'all 0.2s' }}>
                  <Sparkles size={15} /> Find My Top Creators
                </button>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Loader2 size={28} color="#c9a84c" className="spin" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace', fontSize: 12, letterSpacing: '0.1em' }}>AI is scoring all creators...</p>
              </div>
            )}

            {matches.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>TOP {matches.length} MATCHES FOR YOUR CAMPAIGN</div>
                  <button onClick={() => setMatches([])} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>← Refine search</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {matches.map((match, i) => {
                    const creator = creators.find(c => c.handle === match.handle);
                    return (
                      <MatchCard key={match.handle} match={match} creator={creator}
                        onSendOffer={() => handleSendOffer(creator || { handle: match.handle }, match)}
                        sending={sendingId === match.handle}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Browse mode */}
        {mode === 'browse' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => setMode('select')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', marginBottom: 24, padding: 0 }}>← Back</button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em', marginBottom: 8 }}>BROWSE CREATORS</div>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, letterSpacing: '0.03em', color: '#f5f0e8', lineHeight: 0.92 }}>{filtered.length} Creators</h2>
              </div>
            </div>
            {/* Filter pills */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              <button onClick={() => setFilter('')} style={{ background: filter === '' ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${filter === '' ? '#c9a84c' : 'rgba(255,255,255,0.08)'}`, borderRadius: 9999, padding: '6px 14px', cursor: 'pointer', color: filter === '' ? '#c9a84c' : 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'Manrope, sans-serif', transition: 'all 0.15s' }}>All Types</button>
              {CTS.map(t => <button key={t.id} onClick={() => setFilter(filter === t.id ? '' : t.id)} style={{ background: filter === t.id ? t.bg : 'rgba(255,255,255,0.04)', border: `1px solid ${filter === t.id ? t.color : 'rgba(255,255,255,0.08)'}`, borderRadius: 9999, padding: '6px 14px', cursor: 'pointer', color: filter === t.id ? t.color : 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'Manrope, sans-serif', transition: 'all 0.15s' }}>{t.label}</button>)}
            </div>

            {creators.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Users size={36} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 14px' }} />
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Manrope, sans-serif' }}>No creators yet. Share HUM with Kashmir's creative community.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {filtered.map(creator => {
                  const ct = CTS.find(t => t.id === creator.type);
                  const bMatch = browseMatches[creator.handle];
                  const isScoring = scoringId === creator.handle;
                  const isSent = sentIds.includes(creator.handle);
                  return (
                    <div key={creator.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${bMatch ? `${GRADE_COLORS[bMatch.grade]}30` : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.3s' }}>
                      {bMatch && <div style={{ height: 2, background: `linear-gradient(90deg, ${GRADE_COLORS[bMatch.grade]}, transparent)` }} />}
                      <div style={{ padding: '18px 18px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: ct?.bg || 'rgba(255,255,255,0.06)', border: `1px solid ${ct?.color || 'rgba(255,255,255,0.1)'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Users size={18} color={ct?.color || 'rgba(255,255,255,0.3)'} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14, color: '#f5f0e8', fontFamily: 'Manrope, sans-serif' }}>{creator.name}</div>
                              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>@{creator.handle}</div>
                            </div>
                          </div>
                          {bMatch && <GradeBadge grade={bMatch.grade} score={bMatch.score} />}
                        </div>
                        {/* Mini stats */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                          <span style={{ fontSize: 11, color: '#c9a84c', fontFamily: 'DM Mono, monospace' }}>{fmt(creator.followers || 0)} followers</span>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>·</span>
                          <span style={{ fontSize: 11, color: '#5ce0b8', fontFamily: 'DM Mono, monospace' }}>{creator.engagement_rate || 0}% eng.</span>
                        </div>
                        {/* Social handles */}
                        {(creator.ig_handle || creator.fb_handle) && (
                          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                            {creator.ig_handle && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace' }}><Instagram size={9} color="#e05c5c" />@{creator.ig_handle}</span>}
                            {creator.fb_handle && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace' }}><Facebook size={9} color="#5c8de0" />@{creator.fb_handle}</span>}
                          </div>
                        )}
                        {bMatch?.reason && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, fontFamily: 'Manrope, sans-serif', marginBottom: 12 }}>{bMatch.reason}</p>}
                        <div style={{ display: 'flex', gap: 8 }}>
                          {!bMatch ? (
                            <button onClick={() => scoreCreator(creator)} disabled={isScoring}
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c', borderRadius: 9999, padding: '8px', fontSize: 11, fontWeight: 600, cursor: isScoring ? 'not-allowed' : 'pointer', fontFamily: 'Manrope, sans-serif', transition: 'all 0.2s' }}>
                              {isScoring ? <><Loader2 size={11} className="spin" />Scoring...</> : <><Sparkles size={11} />Get AI Score</>}
                            </button>
                          ) : (
                            <button onClick={() => handleSendOffer(creator, bMatch)} disabled={sendingId === creator.handle || isSent}
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: isSent ? 'rgba(34,197,94,0.1)' : GRADE_COLORS[bMatch.grade] || '#c9a84c', color: isSent ? '#22c55e' : '#000', border: isSent ? '1px solid rgba(34,197,94,0.3)' : 'none', borderRadius: 9999, padding: '8px', fontSize: 11, fontWeight: 700, cursor: (sendingId === creator.handle || isSent) ? 'not-allowed' : 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                              {isSent ? '✓ Offer Sent' : sendingId === creator.handle ? <><Loader2 size={11} className="spin" />Sending...</> : <><Send size={11} />Send Offer</>}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
