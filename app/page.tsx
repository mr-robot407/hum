'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2, Plus, Home, Target, Users, BarChart3, LogOut, Flame, Bell, Settings, Lock } from 'lucide-react'
import { useAuth } from '../lib/auth-context'
import HUMLanding from '../components/ui/hum-landing'
import AuthPage from '../components/ui/auth-page'
import StepperProfile from '../components/ui/stepper-profile'
import HUMDock from '../components/ui/hum-dock'
import FloatingActionMenu from '../components/ui/floating-action-menu'
import MatchEngine from '../components/ui/match-engine'
import CreatorDashboard from '../components/ui/creator-dashboard'

type AppMode = 'landing' | 'auth' | 'creator' | 'business'
type CreatorView = 'profile-setup' | 'drop' | 'dashboard'
type BusinessView = 'biz-setup' | 'dashboard' | 'match-engine' | 'campaign'

const INDUSTRIES = [
  { id:'food',        label:'Food & Dining',           icon:'🍽️', subs:['Restaurant','Cafe / Tea House','Bakery & Sweets','Street Food','Catering','Food Products & D2C'] },
  { id:'tourism',     label:'Tourism & Hospitality',   icon:'🏔️', subs:['Hotel / Resort','Houseboat','Guest House / B&B','Travel Agency','Adventure Tourism','Trekking & Camping'] },
  { id:'handicraft',  label:'Handicrafts & Artisan',   icon:'🧶', subs:['Carpet / Rug','Pashmina & Shawls','Wood Carving','Paper Maché','Willow Craft','Jewelry','Embroidery'] },
  { id:'retail',      label:'Retail & Products',       icon:'🛍️', subs:['Clothing & Apparel','Electronics','Grocery','Home Decor','Gifts & Souvenirs','Cosmetics & Beauty'] },
  { id:'agriculture', label:'Agriculture & Produce',   icon:'🌾', subs:['Saffron','Fruits & Vegetables','Dry Fruits & Nuts','Honey','Herbs & Spices','Organic Produce'] },
  { id:'services',    label:'Services',                icon:'💼', subs:['Education & Coaching','Healthcare','Beauty & Salon','Real Estate','IT & Technology','Events'] },
  { id:'other',       label:'Other',                   icon:'✦',  subs:[] },
]
const BUDGETS = ['₹5,000 - ₹15,000','₹15,000 - ₹50,000','₹50,000 - ₹1,50,000','₹1,50,000+']

export default function HUM() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [mode, setMode] = useState<AppMode>('landing')
  const [pendingMode, setPendingMode] = useState<'creator'|'business'|null>(null)
  const pendingModeRef = useRef<'creator'|'business'|null>(null)
  const [creatorView, setCreatorView] = useState<CreatorView>('profile-setup')
  const [businessView, setBusinessView] = useState<BusinessView>('biz-setup')

  const [profile, setProfile] = useState<Record<string,any>>({ name:'', handle:'', type:'', vibes:[], influences:[], ig_handle:'', fb_handle:'', followers:0, monthly_views:0, avg_video_views:0, engagement_rate:0 })
  const [business, setBusiness] = useState<Record<string,any>>({ name:'', handle:'', niche:'', industry_id:'', size:'', description:'' })
  const [drops, setDrops] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [creators, setCreators] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [generatedBio, setGeneratedBio] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [dropForm, setDropForm] = useState({ title:'', description:'', type:'music' })
  const [mediaFile, setMediaFile] = useState<File|null>(null)
  const [posting, setPosting] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)

  const toggleArr = (field:string, val:string) =>
    setProfile(p => ({ ...p, [field]: (p[field]||[]).includes(val) ? p[field].filter((x:string)=>x!==val) : [...(p[field]||[]),val] }))

  // Auth routing — only fires on initial load if already logged in
  useEffect(() => {
    if (!authLoading && user && mode === 'landing') {
      const saved = localStorage.getItem('hum_pending_mode') as 'creator'|'business'|null
      if (saved) {
        localStorage.removeItem('hum_pending_mode')
        checkAndRoute(saved, user.id)
      }
    }
  }, [user, authLoading])

  const checkAndRoute = async (m: 'creator'|'business', userId?: string) => {
    const uid = userId || user?.id
    if (!uid) return
    if (m === 'creator') {
      try {
        const res = await fetch('/api/profiles')
        const data = await res.json()
        const up = data.profiles?.find((p:any) => p.user_id === uid)
        if (up) { setProfile(up); setGeneratedBio(up.generated_bio||''); setMode('creator'); setCreatorView('dashboard'); fetchAll('creator') }
        else { setMode('creator'); setCreatorView('profile-setup') }
      } catch { setMode('creator'); setCreatorView('profile-setup') }
    } else {
      try {
        const res = await fetch('/api/businesses')
        const data = await res.json()
        const ub = data.businesses?.find((b:any) => b.user_id === uid)
        if (ub) { setBusiness(ub); setMode('business'); setBusinessView('dashboard'); fetchAll('business') }
        else { setMode('business'); setBusinessView('biz-setup') }
      } catch { setMode('business'); setBusinessView('biz-setup') }
    }
    setPendingMode(null)
  }

  const handleSelectMode = (m: 'creator'|'business') => {
    if (user) { checkAndRoute(m, user.id) }
    else {
      pendingModeRef.current = m
      setPendingMode(m)
      localStorage.setItem('hum_pending_mode', m)
      setMode('auth')
    }
  }

  const handleAuthSuccess = async () => {
    const saved = localStorage.getItem('hum_pending_mode') as 'creator'|'business'|null
    const target = saved || pendingModeRef.current
    if (target) {
      // Poll for user to be available (onAuthStateChange is async)
      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        const { createClient } = await import('@supabase/supabase-js')
        const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
        const { data: { user: u } } = await sb.auth.getUser()
        if (u) {
          clearInterval(poll)
          if (saved) localStorage.removeItem('hum_pending_mode')
          pendingModeRef.current = null
          setPendingMode(null)
          checkAndRoute(target, u.id)
        }
        if (attempts > 10) clearInterval(poll)
      }, 300)
    }
  }

  const handleSkipAuth = () => {
    const target = pendingMode
    if (!target) return
    localStorage.removeItem('hum_pending_mode')
    setPendingMode(null)
    setMode(target)
    if (target === 'creator') setCreatorView('profile-setup')
    else setBusinessView('biz-setup')
  }

  const fetchAll = async (m: string) => {
    if (m === 'creator' || m === 'both') {
      fetch('/api/drops').then(r=>r.json()).then(d=>{ if(d.drops) setDrops(d.drops) }).catch(()=>{})
      fetch('/api/campaigns').then(r=>r.json()).then(d=>{ if(d.campaigns) setCampaigns(d.campaigns) }).catch(()=>{})
    }
    if (m === 'business' || m === 'both') {
      fetch('/api/campaigns').then(r=>r.json()).then(d=>{ if(d.campaigns) setCampaigns(d.campaigns) }).catch(()=>{})
      fetch('/api/profiles').then(r=>r.json()).then(d=>{ if(d.profiles) setCreators(d.profiles) }).catch(()=>{})
    }
  }

  const fetchOffers = async (handle: string) => {
    fetch(`/api/offers?creator_handle=${handle}`).then(r=>r.json()).then(d=>{ if(d.offers) setOffers(d.offers) }).catch(()=>{})
  }

  const callAI = async (task:string, data:any) => {
    const res = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ task, data }) })
    const d = await res.json()
    return d.result || d.error || ''
  }

  const saveProfile = async (bio:string) => {
    setSavingProfile(true)
    try {
      const handle = (profile.handle||profile.name.toLowerCase().replace(/\s+/g,'')).replace('@','')
      await fetch('/api/profiles', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...profile, handle, generated_bio:bio, user_id:user?.id }) })
      setProfile(p=>({...p, handle, generated_bio:bio}))
      fetchOffers(handle)
    } catch {}
    setSavingProfile(false)
    setCreatorView('drop')
  }

  const saveBusiness = async (strategy:string) => {
    try {
      const handle = (business.handle||business.name.toLowerCase().replace(/\s+/g,'')).replace('@','')
      await fetch('/api/businesses', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({...business, handle, ai_strategy:strategy, user_id:user?.id}) })
      setBusiness(p=>({...p, handle, ai_strategy:strategy}))
    } catch {}
    setBusinessView('dashboard')
    fetchAll('business')
  }

  const postDrop = async () => {
    if (!dropForm.title||!dropForm.description) return
    setPosting(true)
    try {
      let mediaUrl='', mediaType=''
      if (mediaFile) {
        const fd = new FormData(); fd.append('file', mediaFile)
        const ur = await fetch('/api/upload',{method:'POST',body:fd}); const ud = await ur.json()
        if(ud.url){mediaUrl=ud.url;mediaType=mediaFile.type}
      }
      let tags:string[]=[]
      try { const tr = await callAI('tags',dropForm); tags = JSON.parse(tr.replace(/```json|```/g,'').trim()) } catch { tags=[dropForm.type] }
      await fetch('/api/drops',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({creator_name:profile.name||'Anonymous',creator_handle:profile.handle?`@${profile.handle}`:'@anon',creator_type:dropForm.type,title:dropForm.title,description:dropForm.description,media_url:mediaUrl,media_type:mediaType,tags,user_id:user?.id})})
      setPostSuccess(true)
      setTimeout(()=>{setPostSuccess(false);setDropForm({title:'',description:'',type:'music'});setMediaFile(null);fetchAll('creator');setCreatorView('dashboard')},1600)
    } catch {}
    setPosting(false)
  }

  const sendOffer = async (creatorHandle:string, matchData:any, campaignId?:string) => {
    await fetch('/api/offers', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
      campaign_id: campaignId || null,
      business_id: null,
      business_name: business.name,
      business_niche: business.niche,
      creator_handle: creatorHandle,
      creator_name: creators.find(c=>c.handle===creatorHandle)?.name || creatorHandle,
      ai_match_score: matchData.score || 0,
      ai_match_grade: matchData.grade || 'C',
      ai_match_reason: matchData.reason || '',
      ai_collab_angle: matchData.collab_angle || '',
      outreach_message: matchData.outreach || '',
      status: 'pending'
    })})
  }

  const acceptOffer = async (offerId:string) => {
    await fetch(`/api/offers/${offerId}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status:'accepted' }) })
    fetchOffers(profile.handle)
  }

  const counterOffer = async (offerId:string, rate:string) => {
    await fetch(`/api/offers/${offerId}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status:'countered', creator_rate:rate }) })
    fetchOffers(profile.handle)
  }

  const handleSignOut = async () => {
    await signOut()
    setMode('landing')
    setProfile({ name:'', handle:'', type:'', vibes:[], influences:[], ig_handle:'', fb_handle:'', followers:0, monthly_views:0, avg_video_views:0, engagement_rate:0 })
    setBusiness({ name:'', handle:'', niche:'', size:'', description:'' })
    setDrops([]); setCampaigns([]); setCreators([]); setOffers([])
  }

  if (authLoading) return (
    <div style={{ minHeight:'100vh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16 }}>
      <div style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:36,letterSpacing:'0.1em',color:'#f5f0e8' }}>HUM</div>
      <Loader2 size={20} color="#c9a84c" className="spin" />
    </div>
  )

  if (mode==='landing') return <HUMLanding onSelectBusiness={()=>handleSelectMode('business')} onSelectCreator={()=>handleSelectMode('creator')} />
  if (mode==='auth' && pendingMode) return <AuthPage mode={pendingMode} onSuccess={handleAuthSuccess} onSkip={handleSkipAuth} onBack={()=>setMode('landing')} />

  // Creator flows
  if (mode==='creator') {
    if (creatorView==='profile-setup') return (
      <StepperProfile profile={profile} setProfile={setProfile} generatedBio={generatedBio} setGeneratedBio={setGeneratedBio} savingProfile={savingProfile} toggleArr={toggleArr} callAI={callAI} onNext={saveProfile} />
    )
    if (creatorView==='drop') return (
      <DropPage form={dropForm} setForm={setDropForm} mediaFile={mediaFile} setMediaFile={setMediaFile} posting={posting} success={postSuccess} onPost={postDrop} onSkip={()=>{fetchAll('creator');fetchOffers(profile.handle);setCreatorView('dashboard')}} />
    )
    if (creatorView==='dashboard') {
      const pendingCount = offers.filter(o=>o.status==='pending').length
      const dockItems = [
        { id:'dashboard', label:'Dashboard', icon:<Home size={20}/>, onClick:()=>{fetchAll('creator');fetchOffers(profile.handle)}, active:true },
        { id:'drop', label:'Drop', icon:<Flame size={20}/>, onClick:()=>setCreatorView('drop'), active:false },
        { id:'offers', label:'Offers', icon:<Bell size={20}/>, onClick:()=>{}, active:false, badge:pendingCount },
        { id:'logout', label:'Sign Out', icon:<LogOut size={20}/>, onClick:handleSignOut, active:false },
      ]
      const famOptions = [
        { label:'New Drop', icon:<Flame size={14}/>, onClick:()=>setCreatorView('drop'), color:'#c9a84c' },
        { label:'Refresh Offers', icon:<Bell size={14}/>, onClick:()=>fetchOffers(profile.handle), color:'#5c8de0' },
      ]
      return (
        <div>
          <CreatorDashboard profile={profile} drops={drops} offers={offers} onAcceptOffer={acceptOffer} onCounterOffer={counterOffer} onNewDrop={()=>setCreatorView('drop')} onRefresh={()=>{fetchAll('creator');fetchOffers(profile.handle)}} onSignOut={handleSignOut} />
          <HUMDock items={dockItems} />
          <FloatingActionMenu options={famOptions} />
        </div>
      )
    }
  }

  // Business flows
  if (mode==='business') {
    if (businessView==='biz-setup') return <BusinessOnboard business={business} setBusiness={setBusiness} callAI={callAI} onNext={saveBusiness} />
    if (businessView==='match-engine') return (
      <MatchEngine business={business} creators={creators} campaigns={campaigns} onSendOffer={sendOffer} onBack={()=>setBusinessView('dashboard')} />
    )
    if (businessView==='campaign') return (
      <CampaignBuilder business={business} creators={creators} callAI={callAI} onDone={()=>{fetchAll('business');setBusinessView('dashboard')}} onBack={()=>setBusinessView('dashboard')} />
    )
    if (businessView==='dashboard') {
      const dockItems = [
        { id:'dashboard', label:'Dashboard', icon:<Home size={20}/>, onClick:()=>fetchAll('business'), active:true },
        { id:'match', label:'Find Creators', icon:<Sparkles size={20}/>, onClick:()=>{fetchAll('business');setBusinessView('match-engine')}, active:false },
        { id:'campaign', label:'Campaign', icon:<Target size={20}/>, onClick:()=>setBusinessView('campaign'), active:false },
        { id:'logout', label:'Sign Out', icon:<LogOut size={20}/>, onClick:handleSignOut, active:false },
      ]
      const famOptions = [
        { label:'Find Creators (AI)', icon:<Sparkles size={14}/>, onClick:()=>{fetchAll('business');setBusinessView('match-engine')}, color:'#c9a84c' },
        { label:'New Campaign', icon:<Target size={14}/>, onClick:()=>setBusinessView('campaign'), color:'#5c8de0' },
      ]
      return (
        <div>
          <BusinessDashboard business={business} campaigns={campaigns} creators={creators} onFindCreators={()=>{fetchAll('business');setBusinessView('match-engine')}} onNewCampaign={()=>setBusinessView('campaign')} onRefresh={()=>fetchAll('business')} onSignOut={handleSignOut} />
          <HUMDock items={dockItems} />
          <FloatingActionMenu options={famOptions} />
        </div>
      )
    }
  }
  return null
}

// ── Drop Page ──────────────────────────────────────────────────────────────
function DropPage({ form, setForm, mediaFile, setMediaFile, posting, success, onPost, onSkip }:any) {
  const set=(k:string,v:string)=>setForm((p:any)=>({...p,[k]:v}))
  const fileRef=useRef<HTMLInputElement>(null)
  const CTS=[{id:'music',label:'Music',color:'#c9a84c'},{id:'visual',label:'Visual',color:'#e05c5c'},{id:'film',label:'Film',color:'#5c8de0'},{id:'poetry',label:'Poetry',color:'#8e5ce0'},{id:'photo',label:'Photo',color:'#5ce0b8'},{id:'comedy',label:'Comedy',color:'#e0a85c'}]
  return (
    <div style={{ minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',position:'relative' }}>
      <div style={{ position:'fixed',inset:0,background:'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',pointerEvents:'none' }} />
      <div style={{ maxWidth:480,width:'100%',position:'relative',zIndex:1 }}>
        <div style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.18em',marginBottom:12 }}>DROP YOUR WORK</div>
        <h1 style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:48,letterSpacing:'0.03em',color:'#f5f0e8',marginBottom:8,lineHeight:0.92 }}>Drop something real</h1>
        <p style={{ fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:32,lineHeight:1.65,fontFamily:'Manrope, sans-serif',fontWeight:300 }}>No filters. No algorithm. Just your art.</p>
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="s" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} style={{ textAlign:'center',padding:'48px 0' }}>
              <Flame size={48} color="#c9a84c" style={{ margin:'0 auto 16px' }}/>
              <div style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:48,color:'#c9a84c',letterSpacing:'0.04em' }}>DROPPED.</div>
            </motion.div>
          ) : (
            <motion.div key="f" style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',display:'block',marginBottom:8 }}>TYPE</label>
                <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                  {CTS.map(t=>(<button key={t.id} onClick={()=>set('type',t.id)} style={{ background:form.type===t.id?`${t.color}15`:'rgba(255,255,255,0.04)',border:`1px solid ${form.type===t.id?t.color:'rgba(255,255,255,0.08)'}`,borderRadius:9999,padding:'7px 14px',cursor:'pointer',color:form.type===t.id?t.color:'rgba(255,255,255,0.5)',fontSize:12,fontWeight:500,transition:'all 0.15s',fontFamily:'Manrope, sans-serif' }}>{t.label}</button>))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',display:'block',marginBottom:8 }}>TITLE</label>
                <input className="input" placeholder="Give it a name..." value={form.title} onChange={e=>set('title',e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',display:'block',marginBottom:8 }}>STORY</label>
                <textarea className="input" rows={4} placeholder="What is this? What does it mean?" value={form.description} onChange={e=>set('description',e.target.value)} />
              </div>
              <div onClick={()=>fileRef.current?.click()} style={{ border:'1px dashed rgba(255,255,255,0.12)',borderRadius:12,padding:18,textAlign:'center',cursor:'pointer',background:'rgba(255,255,255,0.02)' }}>
                {mediaFile?(<div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10 }}><span style={{ fontSize:13,color:'#f5f0e8',fontWeight:600 }}>{mediaFile.name}</span><button onClick={e=>{e.stopPropagation();setMediaFile(null)}} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer' }}>✕</button></div>):(<div style={{ fontSize:12,color:'rgba(255,255,255,0.25)',fontFamily:'DM Mono, monospace' }}>Audio, image, or video (optional)</div>)}
              </div>
              <input ref={fileRef} type="file" accept="audio/*,image/*,video/*" style={{ display:'none' }} onChange={e=>setMediaFile(e.target.files?.[0]||null)}/>
              <div style={{ display:'flex',gap:12 }}>
                <button onClick={onPost} disabled={!form.title||!form.description||posting} style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:(!form.title||!form.description||posting)?'rgba(255,255,255,0.05)':'#c9a84c',color:(!form.title||!form.description||posting)?'rgba(255,255,255,0.25)':'#000',border:'none',borderRadius:9999,padding:'13px',fontSize:14,fontWeight:700,cursor:(!form.title||!form.description||posting)?'not-allowed':'pointer',fontFamily:'Manrope, sans-serif',transition:'all 0.2s' }}>
                  {posting?<><Loader2 size={14} className="spin"/>Dropping...</>:'Drop it 🔥'}
                </button>
                <button onClick={onSkip} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',borderRadius:9999,padding:'13px 20px',fontSize:14,cursor:'pointer',fontFamily:'Manrope, sans-serif' }}>Skip</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Business Onboard ──────────────────────────────────────────────────────
function BusinessOnboard({ business, setBusiness, callAI, onNext }:any) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [customSub, setCustomSub] = useState('')
  const set=(k:string,v:string)=>setBusiness((p:any)=>({...p,[k]:v}))

  const selectedInd = INDUSTRIES.find(i=>i.id===business.industry_id)
  const canStep2 = business.industry_id && (business.niche || customSub)

  const handleIndustryPick = (id:string) => {
    set('industry_id', id)
    set('niche', '')
    setCustomSub('')
  }
  const handleSubPick = (sub:string) => {
    set('niche', sub)
    setCustomSub('')
  }

  const generateAndSave = async () => {
    setLoading(true)
    const finalNiche = business.niche || customSub
    const fullBiz = { ...business, niche: finalNiche }
    setBusiness((p:any) => ({ ...p, niche: finalNiche }))
    const s = await callAI('business_strategy', fullBiz)
    await onNext(s)
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',position:'relative' }}>
      <div style={{ position:'fixed',inset:0,background:'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',pointerEvents:'none' }} />
      <div style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(0,0,0,0.92)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <motion.div animate={{ width:`${(step/3)*100}%` }} style={{ height:2,background:'#c9a84c' }} />
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 32px' }}>
          <div style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:22,letterSpacing:'0.08em',color:'#f5f0e8' }}>HUM</div>
          <div style={{ fontSize:11,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)' }}>Business Setup {step}/3</div>
        </div>
      </div>

      <div style={{ maxWidth:560,width:'100%',position:'relative',zIndex:1,paddingTop:80 }}>
        <AnimatePresence mode="wait">
          {step===1 && (
            <motion.div key="1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
              <div style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.18em',marginBottom:14 }}>01 — YOUR BUSINESS</div>
              <h2 style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:48,color:'#f5f0e8',letterSpacing:'0.03em',marginBottom:8,lineHeight:0.92 }}>Tell us about your business</h2>
              <p style={{ fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:32,lineHeight:1.65,fontFamily:'Manrope, sans-serif',fontWeight:300 }}>Creators will see this when you reach out to them.</p>
              <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                <div>
                  <label style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',textTransform:'uppercase',display:'block',marginBottom:8 }}>Business Name</label>
                  <input className="input" placeholder="e.g. Kashmir Spice Box" value={business.name||''} onChange={e=>set('name',e.target.value)} autoFocus />
                </div>
                <div>
                  <label style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',textTransform:'uppercase',display:'block',marginBottom:8 }}>What do you do?</label>
                  <textarea className="input" rows={3} placeholder="Brief description..." value={business.description||''} onChange={e=>set('description',e.target.value)} />
                </div>
              </div>
              <button onClick={()=>setStep(2)} disabled={!business.name} style={{ marginTop:24,display:'flex',alignItems:'center',gap:8,background:business.name?'#c9a84c':'rgba(255,255,255,0.05)',color:business.name?'#000':'rgba(255,255,255,0.25)',border:'none',borderRadius:9999,padding:'13px 28px',fontSize:14,fontWeight:700,cursor:business.name?'pointer':'not-allowed',fontFamily:'Manrope, sans-serif',transition:'all 0.2s' }}>
                Continue →
              </button>
            </motion.div>
          )}

          {step===2 && (
            <motion.div key="2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
              <div style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.18em',marginBottom:14 }}>02 — YOUR INDUSTRY</div>
              <h2 style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:48,color:'#f5f0e8',letterSpacing:'0.03em',marginBottom:8,lineHeight:0.92 }}>What's your industry?</h2>
              <p style={{ fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:24,lineHeight:1.65,fontFamily:'Manrope, sans-serif',fontWeight:300 }}>This determines which creators AI matches you with.</p>

              {/* Industry grid */}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20 }}>
                {INDUSTRIES.map(ind=>{const active=business.industry_id===ind.id;return(
                  <motion.button key={ind.id} onClick={()=>handleIndustryPick(ind.id)} whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                    style={{ padding:'14px 16px',borderRadius:14,border:`1px solid ${active?'#c9a84c':'rgba(255,255,255,0.07)'}`,background:active?'rgba(201,168,76,0.1)':'rgba(255,255,255,0.02)',cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:10,transition:'all 0.15s' }}>
                    <span style={{ fontSize:18,lineHeight:1 }}>{ind.icon}</span>
                    <span style={{ fontSize:13,fontWeight:700,color:active?'#c9a84c':'rgba(255,255,255,0.6)',fontFamily:'Manrope, sans-serif' }}>{ind.label}</span>
                    {active&&<span style={{ marginLeft:'auto',color:'#c9a84c' }}>✓</span>}
                  </motion.button>
                )})}
              </div>

              {/* Subsection picker */}
              {selectedInd && (
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
                  {selectedInd.subs.length > 0 && (
                    <div style={{ marginBottom:14 }}>
                      <label style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',textTransform:'uppercase',display:'block',marginBottom:10 }}>Specialization</label>
                      <div style={{ display:'flex',flexWrap:'wrap',gap:7 }}>
                        {selectedInd.subs.map(sub=>{const active=business.niche===sub;return(
                          <button key={sub} onClick={()=>handleSubPick(sub)}
                            style={{ background:active?'rgba(201,168,76,0.15)':'rgba(255,255,255,0.04)',border:`1px solid ${active?'#c9a84c':'rgba(255,255,255,0.08)'}`,borderRadius:9999,padding:'7px 14px',cursor:'pointer',color:active?'#c9a84c':'rgba(255,255,255,0.5)',fontSize:12,fontWeight:500,fontFamily:'Manrope, sans-serif',transition:'all 0.15s' }}>
                            {sub}
                          </button>
                        )})}
                      </div>
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',textTransform:'uppercase',display:'block',marginBottom:8 }}>
                      {selectedInd.subs.length>0?'Or describe specifically:':'Describe your business type:'}
                    </label>
                    <input className="input" placeholder={selectedInd.subs.length>0?'Not listed above? Type here...':'e.g. Traditional carpet weaving export'}
                      value={customSub} onChange={e=>{setCustomSub(e.target.value);if(e.target.value)set('niche','')}} />
                  </div>
                </motion.div>
              )}

              <div style={{ display:'flex',gap:12,marginTop:24 }}>
                <button onClick={()=>setStep(1)} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',borderRadius:9999,padding:'13px 22px',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Manrope, sans-serif' }}>← Back</button>
                <button onClick={()=>setStep(3)} disabled={!canStep2}
                  style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:canStep2?'#c9a84c':'rgba(255,255,255,0.05)',color:canStep2?'#000':'rgba(255,255,255,0.25)',border:'none',borderRadius:9999,padding:'13px',fontSize:14,fontWeight:700,cursor:canStep2?'pointer':'not-allowed',fontFamily:'Manrope, sans-serif',transition:'all 0.2s' }}>
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {step===3 && (
            <motion.div key="3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
              <div style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.18em',marginBottom:14 }}>03 — READY</div>
              <h2 style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:48,color:'#f5f0e8',letterSpacing:'0.03em',marginBottom:8,lineHeight:0.92 }}>All set.</h2>
              <p style={{ fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:32,lineHeight:1.65,fontFamily:'Manrope, sans-serif',fontWeight:300 }}>Claude will build your creator marketing strategy and take you to your dashboard.</p>
              <div style={{ background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.15)',borderRadius:14,padding:'20px 22px',marginBottom:24 }}>
                <div style={{ fontSize:14,color:'#f5f0e8',fontWeight:700,fontFamily:'Manrope, sans-serif',marginBottom:4 }}>{business.name}</div>
                <div style={{ display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginTop:6 }}>
                  <span style={{ fontSize:11,color:'rgba(255,255,255,0.45)',fontFamily:'DM Mono, monospace' }}>{selectedInd?.icon} {selectedInd?.label}</span>
                  {(business.niche||customSub) && <><span style={{ color:'rgba(255,255,255,0.2)' }}>·</span><span style={{ fontSize:11,color:'rgba(255,255,255,0.45)',fontFamily:'DM Mono, monospace' }}>{business.niche||customSub}</span></>}
                </div>
              </div>
              <div style={{ display:'flex',gap:12 }}>
                <button onClick={()=>setStep(2)} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',borderRadius:9999,padding:'13px 22px',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Manrope, sans-serif' }}>← Back</button>
                <button onClick={generateAndSave} disabled={loading} style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#c9a84c',color:'#000',border:'none',borderRadius:9999,padding:'13px',fontSize:14,fontWeight:700,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,fontFamily:'Manrope, sans-serif' }}>
                  {loading?<><Loader2 size={14} className="spin"/>Setting up...</>:'Launch my dashboard →'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Business Dashboard ─────────────────────────────────────────────────────
function BusinessDashboard({ business, campaigns, creators, onFindCreators, onNewCampaign, onRefresh, onSignOut }:any) {
  useEffect(()=>{ onRefresh() },[])
  const open = campaigns.filter((c:any)=>c.status==='open').length

  // Coming soon features
  const comingSoon = [
    { label:'HUM Verified', desc:'Auto-verify creator stats via Instagram API', icon:'✦' },
    { label:'In-app Analytics', desc:'Track campaign reach and conversions live', icon:'📊' },
    { label:'Rate Cards', desc:'Creators set prices, you browse by budget', icon:'💳' },
    { label:'HUM Score', desc:'AI reputation score for every creator', icon:'⭐' },
    { label:'Campaign Templates', desc:'One-click briefs for your business type', icon:'⚡' },
    { label:'Auto-payments', desc:'HUM handles contracts and payments', icon:'🔒' },
  ]

  return (
    <div style={{ minHeight:'100vh',background:'#000',paddingBottom:100 }}>
      <div style={{ position:'fixed',inset:0,background:'radial-gradient(ellipse 50% 25% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 60%)',pointerEvents:'none',zIndex:0 }} />
      <nav style={{ position:'sticky',top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 28px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(0,0,0,0.92)',backdropFilter:'blur(20px)' }}>
        <div style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:24,letterSpacing:'0.08em',color:'#f5f0e8' }}>HUM <div style={{ width:5,height:5,borderRadius:'50%',background:'#c9a84c',boxShadow:'0 0 6px #c9a84c',display:'inline-block',marginLeft:4,verticalAlign:'middle' }} /></div>
        <div style={{ fontSize:13,fontWeight:600,color:'#f5f0e8',fontFamily:'Manrope, sans-serif' }}>{business.name}</div>
        <div style={{ display:'flex',gap:8 }}>
          <button onClick={onFindCreators} style={{ display:'flex',alignItems:'center',gap:6,background:'#c9a84c',color:'#000',border:'none',borderRadius:9999,padding:'8px 18px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Manrope, sans-serif' }}>
            <Sparkles size={13}/> Find Creators
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:820,margin:'0 auto',padding:'28px 24px',position:'relative',zIndex:1 }}>
        <div style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:40,letterSpacing:'0.03em',color:'#f5f0e8' }}>Dashboard</h2>
          <p style={{ color:'rgba(255,255,255,0.35)',marginTop:4,fontSize:13,fontFamily:'DM Mono, monospace' }}>Your creator marketing command center</p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:28 }}>
          {[[Target,open.toString(),'Active Campaigns','#c9a84c'],[Users,creators.length.toString(),'Creators Available','#8e5ce0'],[BarChart3,'∞','Potential Reach','#5ce0b8']].map(([Icon,val,label,color]:any,i)=>(
            <div key={i} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'18px 16px',textAlign:'center' }}>
              <Icon size={18} color={color} style={{ margin:'0 auto 10px' }}/>
              <div style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:32,letterSpacing:'0.04em',color:'#f5f0e8' }}>{val}</div>
              <div style={{ fontSize:10,color:'rgba(255,255,255,0.3)',fontFamily:'DM Mono, monospace',letterSpacing:'0.08em',marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTA — Find Creators */}
        <div style={{ background:'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.03))',border:'1px solid rgba(201,168,76,0.2)',borderRadius:20,padding:'32px',marginBottom:28,display:'flex',alignItems:'center',justifyContent:'space-between',gap:24 }}>
          <div>
            <div style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:32,letterSpacing:'0.03em',color:'#f5f0e8',marginBottom:8 }}>Find Your Perfect Creator</div>
            <p style={{ fontSize:14,color:'rgba(255,255,255,0.5)',lineHeight:1.65,fontFamily:'Manrope, sans-serif',fontWeight:300,margin:0,maxWidth:'40ch' }}>AI scores every creator on niche fit, audience size and engagement. Get top 3 matches instantly.</p>
          </div>
          <button onClick={onFindCreators} style={{ display:'flex',alignItems:'center',gap:10,background:'#c9a84c',color:'#000',border:'none',borderRadius:9999,padding:'14px 28px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Manrope, sans-serif',flexShrink:0,transition:'all 0.2s',whiteSpace:'nowrap' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='#e8c96a'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='#c9a84c'}}>
            <Sparkles size={16}/> AI Match Engine →
          </button>
        </div>

        {/* Campaigns */}
        {campaigns.length > 0 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.18em',marginBottom:14,display:'flex',alignItems:'center',gap:6 }}><Target size={11}/>YOUR CAMPAIGNS</div>
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              {campaigns.map((c:any)=>(
                <div key={c.id} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:20 }}>
                  <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8 }}>
                    <div>
                      <h3 style={{ fontFamily:'Instrument Serif, serif',fontSize:17,fontStyle:'italic',color:'#f5f0e8',marginBottom:4 }}>{c.title}</h3>
                      <div style={{ fontSize:10,color:'#c9a84c',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:6,padding:'2px 8px',fontFamily:'DM Mono, monospace',display:'inline-block',letterSpacing:'0.06em' }}>{c.status}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:24,color:'#f5f0e8',letterSpacing:'0.04em' }}>{c.applications}</div>
                      <div style={{ fontSize:9,color:'rgba(255,255,255,0.3)',fontFamily:'DM Mono, monospace' }}>APPS</div>
                    </div>
                  </div>
                  <p style={{ fontSize:13,color:'rgba(255,255,255,0.4)',lineHeight:1.6,fontFamily:'Manrope, sans-serif',margin:0 }}>{c.goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        <div>
          <div style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.18em',marginBottom:14,display:'flex',alignItems:'center',gap:6 }}><Lock size={11}/>COMING SOON</div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10 }}>
            {comingSoon.map(f=>(
              <div key={f.label} style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:12,padding:'16px 14px',opacity:0.6,position:'relative',overflow:'hidden' }}>
                <div style={{ position:'absolute',top:8,right:10,fontSize:9,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.2)',letterSpacing:'0.1em',background:'rgba(255,255,255,0.05)',borderRadius:4,padding:'1px 6px' }}>SOON</div>
                <div style={{ fontSize:18,marginBottom:8 }}>{f.icon}</div>
                <div style={{ fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.5)',fontFamily:'Manrope, sans-serif',marginBottom:4 }}>{f.label}</div>
                <div style={{ fontSize:11,color:'rgba(255,255,255,0.25)',fontFamily:'Manrope, sans-serif',lineHeight:1.5,fontWeight:300 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Campaign Builder ──────────────────────────────────────────────────────
function CampaignBuilder({ business, creators, callAI, onDone, onBack }:any) {
  const [form, setForm] = useState({ title:'', goal:'', budget:'', creator_type:'' })
  const [brief, setBrief] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const set=(k:string,v:string)=>setForm(p=>({...p,[k]:v}))

  const generate = async () => {
    setLoading(true); setBrief('')
    const r = await callAI('campaign_brief', { ...form, business_name:business.name, niche:business.niche })
    setBrief(r); setLoading(false)
  }

  const save = async () => {
    setSaving(true)
    await fetch('/api/campaigns',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ business_name:business.name,business_niche:business.niche,title:form.title||'Campaign',goal:form.goal,budget:form.budget,creator_type:form.creator_type,ai_brief:brief,status:'open' })})
    setSaving(false); onDone()
  }

  return (
    <div style={{ minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,position:'relative' }}>
      <div style={{ position:'fixed',inset:0,background:'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',pointerEvents:'none' }} />
      <div style={{ maxWidth:520,width:'100%',position:'relative',zIndex:1 }}>
        <button onClick={onBack} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.35)',cursor:'pointer',fontSize:12,fontFamily:'DM Mono, monospace',letterSpacing:'0.08em',marginBottom:24,padding:0 }}>← Dashboard</button>
        <div style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.18em',marginBottom:12 }}>CAMPAIGN BRIEF</div>
        <h1 style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:48,color:'#f5f0e8',letterSpacing:'0.03em',marginBottom:32,lineHeight:0.92 }}>Launch a campaign</h1>
        <div style={{ display:'flex',flexDirection:'column',gap:16,marginBottom:24 }}>
          <div>
            <label style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',display:'block',marginBottom:8 }}>CAMPAIGN GOAL</label>
            <input className="input" placeholder="e.g. Launch our saffron product to young urban buyers" value={form.goal} onChange={e=>set('goal',e.target.value)} autoFocus />
          </div>
          <div>
            <label style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',display:'block',marginBottom:8 }}>TITLE (OPTIONAL)</label>
            <input className="input" placeholder="Campaign name..." value={form.title} onChange={e=>set('title',e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize:10,fontFamily:'DM Mono, monospace',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',display:'block',marginBottom:10 }}>BUDGET</label>
            <div style={{ display:'flex',flexWrap:'wrap',gap:8,marginBottom:10 }}>
              {BUDGETS.map(b=>(<button key={b} onClick={()=>set('budget',b)} style={{ background:form.budget===b?'rgba(201,168,76,0.15)':'rgba(255,255,255,0.04)',border:`1px solid ${form.budget===b?'#c9a84c':'rgba(255,255,255,0.08)'}`,borderRadius:9999,padding:'7px 14px',cursor:'pointer',color:form.budget===b?'#c9a84c':'rgba(255,255,255,0.5)',fontSize:12,transition:'all 0.15s',fontFamily:'Manrope, sans-serif' }}>{b}</button>))}
            </div>
            <input className="input" placeholder="Custom amount, e.g. ₹35,000 for 3 reels"
              value={BUDGETS.includes(form.budget)?'':form.budget}
              onChange={e=>set('budget',e.target.value)}
              style={{ fontSize:13 }} />
          </div>
          <button onClick={generate} disabled={!form.goal||!form.budget||loading} style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:(!form.goal||!form.budget||loading)?'rgba(255,255,255,0.05)':'#c9a84c',color:(!form.goal||!form.budget||loading)?'rgba(255,255,255,0.25)':'#000',border:'none',borderRadius:9999,padding:'14px',fontSize:14,fontWeight:700,cursor:(!form.goal||!form.budget||loading)?'not-allowed':'pointer',fontFamily:'Manrope, sans-serif',transition:'all 0.2s' }}>
            {loading?<><Loader2 size={14} className="spin"/>Building brief...</>:'Generate Campaign Brief'}
          </button>
        </div>
        {brief&&(
          <div style={{ marginBottom:16 }}>
            <div style={{ background:'rgba(201,168,76,0.05)',border:'1px solid rgba(201,168,76,0.15)',borderRadius:14,padding:20,marginBottom:12,maxHeight:280,overflowY:'auto' }}>
              <pre style={{ whiteSpace:'pre-wrap',fontFamily:'Manrope, sans-serif',fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.8 }}>{brief}</pre>
            </div>
            <div style={{ display:'flex',gap:12 }}>
              <button onClick={()=>setBrief('')} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',borderRadius:9999,padding:'13px 20px',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Manrope, sans-serif' }}>← Edit</button>
              <button onClick={save} disabled={saving} style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:'#c9a84c',color:'#000',border:'none',borderRadius:9999,padding:'13px',fontSize:14,fontWeight:700,cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1,fontFamily:'Manrope, sans-serif' }}>
                {saving?<><Loader2 size={14} className="spin"/>Launching...</>:'Launch Campaign'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Unused import cleanup ─────────────────────────────────────────────────
function Sparkles({ size, color, style }: any) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||'currentColor'} strokeWidth="2" style={style}><path d="M12 3L13.5 8.5H19L14.5 11.5L16 17L12 14L8 17L9.5 11.5L5 8.5H10.5Z"/></svg>
}
