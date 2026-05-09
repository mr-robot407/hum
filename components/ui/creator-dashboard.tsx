'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Send, Check, X, DollarSign, Building2, Loader2, Users, Flame, RefreshCw, Plus, TrendingUp, Eye, Play } from 'lucide-react';
// Instagram/Facebook as simple SVG components
const Instagram = ({size=14,color='currentColor'}:{size?:number,color?:string}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill={color}/></svg>
const Facebook = ({size=14,color='currentColor'}:{size?:number,color?:string}) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
const Sparkles = ({size=14,color='currentColor',style={}}:{size?:number,color?:string,style?:any}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={style}><path d="M12 3l1.5 5.5H19l-4.5 3 1.5 5.5-4.5-3-4.5 3 1.5-5.5L3 8.5h5.5z"/></svg>

const GRADE_COLORS: Record<string,string> = { A:'#22c55e', B:'#c9a84c', C:'#5c8de0', D:'#e05c5c' };
const fmt = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : n.toString();

interface CreatorDashboardProps {
  profile: any;
  drops: any[];
  offers: any[];
  onAcceptOffer: (offerId: string) => Promise<void>;
  onCounterOffer: (offerId: string, rate: string) => Promise<void>;
  onNewDrop: () => void;
  onRefresh: () => void;
  onSignOut: () => void;
}

export default function CreatorDashboard({ profile, drops, offers, onAcceptOffer, onCounterOffer, onNewDrop, onRefresh, onSignOut }: CreatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'offers' | 'drops'>('offers');
  const [counteringId, setCounteringId] = useState('');
  const [counterRate, setCounterRate] = useState('');
  const [processingId, setProcessingId] = useState('');
  const [collabResults, setCollabResults] = useState<Record<string,string>>({});

  const pendingOffers = offers.filter(o => o.status === 'pending');
  const activeOffers = offers.filter(o => o.status === 'accepted');

  const handleAccept = async (offerId: string) => {
    setProcessingId(offerId);
    await onAcceptOffer(offerId);
    setProcessingId('');
  };

  const handleCounter = async (offerId: string) => {
    if (!counterRate.trim()) return;
    setProcessingId(offerId);
    await onCounterOffer(offerId, counterRate);
    setCounteringId('');
    setCounterRate('');
    setProcessingId('');
  };

  const ct_color = '#c9a84c';

  return (
    <div style={{ minHeight: '100vh', background: '#000', paddingBottom: 100 }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 50% 25% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: '0.08em', color: '#f5f0e8' }}>HUM</div>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c', boxShadow: '0 0 6px #c9a84c' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Notification badge */}
          {pendingOffers.length > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'relative', display: 'flex' }}>
              <Bell size={18} color="#c9a84c" />
              <div style={{ position: 'absolute', top: -6, right: -6, background: '#e05c5c', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '2px solid #000' }}>
                {pendingOffers.length}
              </div>
            </motion.div>
          )}
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={15} color="#c9a84c" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f5f0e8', fontFamily: 'Manrope, sans-serif' }}>{profile.name || 'Creator'}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onRefresh} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', borderRadius: 9999, padding: '7px 12px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><RefreshCw size={12} /></button>
          <button onClick={onNewDrop} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#c9a84c', color: '#000', border: 'none', borderRadius: 9999, padding: '7px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}><Plus size={13} />Drop</button>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, letterSpacing: '0.03em', color: '#f5f0e8' }}>Yo, {(profile.name || 'Creator').split(' ')[0]}.</h2>
          <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{pendingOffers.length} pending offers</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{activeOffers.length} active</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{drops.length} drops</span>
          </div>
        </div>

        {/* Stats strip */}
        {(profile.followers > 0 || profile.ig_handle) && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  [Users, fmt(profile.followers || 0), 'Followers', '#c9a84c'],
                  [Eye, fmt(profile.monthly_views || 0), 'Mo. Views', '#5c8de0'],
                  [TrendingUp, `${profile.engagement_rate || 0}%`, 'Engagement', '#5ce0b8'],
                ].map(([Icon, val, label, color]: any) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: color, letterSpacing: '0.04em' }}>{val}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {profile.ig_handle && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}><Instagram size={10} color="#e05c5c" />@{profile.ig_handle}</div>}
                {profile.fb_handle && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}><Facebook size={10} color="#5c8de0" />@{profile.fb_handle}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 4 }}>
          {[['offers', `Offers${pendingOffers.length > 0 ? ` (${pendingOffers.length})` : ''}`, Bell], ['drops', 'My Drops', Flame]].map(([id, label, Icon]: any) => (
            <button key={id} onClick={() => setActiveTab(id as any)}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: activeTab === id ? 'rgba(255,255,255,0.07)' : 'transparent', border: 'none', borderRadius: 9, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: activeTab === id ? '#f5f0e8' : 'rgba(255,255,255,0.35)', fontFamily: 'Manrope, sans-serif', transition: 'all 0.15s' }}>
              <Icon size={14} color={activeTab === id ? (id === 'offers' && pendingOffers.length > 0 ? '#c9a84c' : 'currentColor') : 'currentColor'} />
              {label}
            </button>
          ))}
        </div>

        {/* Offers tab */}
        {activeTab === 'offers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {offers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Bell size={36} color="rgba(255,255,255,0.08)" style={{ margin: '0 auto 14px' }} />
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Manrope, sans-serif', marginBottom: 8 }}>No offers yet.</p>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>Businesses will find you through AI matching. Make sure your profile is complete.</p>
              </div>
            ) : (
              offers.map(offer => (
                <motion.div key={offer.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: offer.status === 'pending' ? 'rgba(201,168,76,0.04)' : 'rgba(255,255,255,0.03)', border: `1px solid ${offer.status === 'pending' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, overflow: 'hidden' }}>
                  {offer.status === 'pending' && <div style={{ height: 2, background: 'linear-gradient(90deg, #c9a84c, transparent)' }} />}
                  <div style={{ padding: '20px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Building2 size={18} color="#c9a84c" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#f5f0e8', fontFamily: 'Manrope, sans-serif' }}>{offer.business_name}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{offer.business_niche}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {offer.ai_match_grade && (
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${GRADE_COLORS[offer.ai_match_grade] || '#5c8de0'}15`, border: `1px solid ${GRADE_COLORS[offer.ai_match_grade] || '#5c8de0'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: GRADE_COLORS[offer.ai_match_grade] || '#5c8de0' }}>{offer.ai_match_grade}</span>
                          </div>
                        )}
                        <span style={{ fontSize: 10, color: offer.status === 'pending' ? '#c9a84c' : offer.status === 'accepted' ? '#22c55e' : 'rgba(255,255,255,0.3)', background: offer.status === 'pending' ? 'rgba(201,168,76,0.1)' : offer.status === 'accepted' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${offer.status === 'pending' ? 'rgba(201,168,76,0.25)' : offer.status === 'accepted' ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 6, padding: '3px 8px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          {offer.status}
                        </span>
                      </div>
                    </div>

                    {offer.ai_match_reason && (
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, fontFamily: 'Manrope, sans-serif', marginBottom: 12 }}>{offer.ai_match_reason}</p>
                    )}

                    {offer.outreach_message && (
                      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', marginBottom: 6 }}>MESSAGE FROM BUSINESS</div>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, fontFamily: 'Manrope, sans-serif', fontStyle: 'italic', margin: 0 }}>"{offer.outreach_message}"</p>
                      </div>
                    )}

                    {offer.creator_rate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, fontSize: 13, color: '#5ce0b8', fontFamily: 'DM Mono, monospace' }}>
                        <DollarSign size={13} />Your counter-offer: {offer.creator_rate}
                      </div>
                    )}

                    {/* Actions for pending offers */}
                    {offer.status === 'pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={() => handleAccept(offer.id)} disabled={processingId === offer.id}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#22c55e', color: '#000', border: 'none', borderRadius: 9999, padding: '11px', fontSize: 13, fontWeight: 700, cursor: processingId === offer.id ? 'not-allowed' : 'pointer', opacity: processingId === offer.id ? 0.7 : 1, fontFamily: 'Manrope, sans-serif' }}>
                            {processingId === offer.id ? <Loader2 size={13} className="spin" /> : <Check size={13} />} Accept
                          </button>
                          <button onClick={() => setCounteringId(counteringId === offer.id ? '' : offer.id)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 9999, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                            <DollarSign size={13} /> Counter-offer
                          </button>
                        </div>
                        <AnimatePresence>
                          {counteringId === offer.id && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                              <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
                                <input className="input" placeholder="Your rate e.g. ₹8,000 per reel" value={counterRate} onChange={e => setCounterRate(e.target.value)} style={{ flex: 1 }} />
                                <button onClick={() => handleCounter(offer.id)} disabled={!counterRate.trim() || processingId === offer.id}
                                  style={{ background: '#c9a84c', color: '#000', border: 'none', borderRadius: 10, padding: '0 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', flexShrink: 0 }}>
                                  Send
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Drops tab */}
        {activeTab === 'drops' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {drops.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Flame size={36} color="rgba(255,255,255,0.08)" style={{ margin: '0 auto 14px' }} />
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>No drops yet. Post your first work.</p>
                <button onClick={onNewDrop} style={{ background: '#c9a84c', color: '#000', border: 'none', borderRadius: 9999, padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>Drop something →</button>
              </div>
            ) : (
              drops.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
                  <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, fontStyle: 'italic', color: '#f5f0e8', marginBottom: 6, lineHeight: 1.3 }}>{d.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 10, fontFamily: 'Manrope, sans-serif' }}>{d.description}</p>
                  {d.tags?.length > 0 && <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>{d.tags.map((t: string) => <span key={t} style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>#{t}</span>)}</div>}
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace' }}>{d.likes} likes · {d.created_at ? new Date(d.created_at).toLocaleDateString() : ''}</div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
