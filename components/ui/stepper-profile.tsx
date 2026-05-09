'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music2, Palette, Film, Camera, Laugh, Zap, Flame, Landmark, Clapperboard,
  Volume2, Leaf, Globe, Coffee, Layers, Radio, Heart, Sparkles, Loader2,
  ChevronRight, Check, User, Star, Users, Eye, Play, TrendingUp, MapPin,
} from 'lucide-react';
const Instagram = ({size=14,color='currentColor'}:{size?:number,color?:string}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill={color}/></svg>
const Facebook = ({size=14,color='currentColor'}:{size?:number,color?:string}) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>

const CREATOR_NICHES = [
  { id:'daily-vlogs',  label:'Daily Vlogs',         desc:'Everyday life & routines',       Icon:Clapperboard, color:'#c9a84c', bg:'#c9a84c15' },
  { id:'travel',       label:'Travel & Adventure',   desc:'Destinations & exploration',     Icon:Globe,        color:'#5ce0b8', bg:'#5ce0b815' },
  { id:'food',         label:'Food & Cuisine',        desc:'Cooking, recipes & reviews',    Icon:Coffee,       color:'#e0a85c', bg:'#e0a85c15' },
  { id:'fashion',      label:'Fashion & Style',       desc:'OOTD, trends & lifestyle',      Icon:Heart,        color:'#e05c5c', bg:'#e05c5c15' },
  { id:'tech',         label:'Tech & Gadgets',        desc:'Reviews, tutorials & tips',     Icon:Zap,          color:'#5c8de0', bg:'#5c8de015' },
  { id:'education',    label:'Education',             desc:'Teaching & knowledge sharing',  Icon:Landmark,     color:'#8e5ce0', bg:'#8e5ce015' },
  { id:'comedy',       label:'Comedy & Skits',        desc:'Humor & entertainment',         Icon:Laugh,        color:'#e08a5c', bg:'#e08a5c15' },
  { id:'fitness',      label:'Fitness & Health',      desc:'Workouts & wellness',           Icon:Flame,        color:'#5ce0b8', bg:'#5ce0b815' },
  { id:'art',          label:'Art & Photography',     desc:'Visual arts & photography',     Icon:Camera,       color:'#8e5ce0', bg:'#8e5ce015' },
  { id:'music',        label:'Music & Audio',         desc:'Songs, covers & performances', Icon:Music2,       color:'#c9a84c', bg:'#c9a84c15' },
  { id:'nature',       label:'Nature & Kashmir',      desc:'Landscapes & scenic beauty',    Icon:Leaf,         color:'#5ce0b8', bg:'#5ce0b815' },
  { id:'business',     label:'Business & Finance',    desc:'Entrepreneurship & career',     Icon:TrendingUp,   color:'#8e5ce0', bg:'#8e5ce015' },
];

const CONTENT_FORMATS = [
  { id:'reels',     label:'Short Reels',        Icon:Play },
  { id:'longform',  label:'Long Videos',         Icon:Film },
  { id:'photos',    label:'Photo Content',       Icon:Camera },
  { id:'podcast',   label:'Podcast',             Icon:Radio },
  { id:'live',      label:'Live Streams',        Icon:Volume2 },
  { id:'tutorials', label:'Tutorials',           Icon:Layers },
  { id:'reviews',   label:'Reviews',             Icon:Star },
  { id:'bts',       label:'Behind the Scenes',  Icon:Clapperboard },
  { id:'collabs',   label:'Collabs',             Icon:Users },
];

const STEPS = [
  { id:1, label:'Identity',  icon:User },
  { id:2, label:'Socials',   icon:Instagram },
  { id:3, label:'Stats',     icon:TrendingUp },
  { id:4, label:'Niche',     icon:Star },
  { id:5, label:'AI Bio',    icon:Sparkles },
];

function StatSlider({ label, icon: Icon, value, onChange, min, max, step, format, color }: any) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'18px 20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:`${color}15`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon size={15} color={color} />
          </div>
          <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)', fontFamily:'Manrope, sans-serif' }}>{label}</span>
        </div>
        <div style={{ fontSize:20, fontFamily:'Bebas Neue, sans-serif', letterSpacing:'0.04em', color }}>{format(value)}</div>
      </div>
      <div style={{ position:'relative', height:4, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
        <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width 0.1s' }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}
          style={{ position:'absolute', inset:0, width:'100%', opacity:0, cursor:'pointer', height:'100%', margin:0 }} />
        <div style={{ position:'absolute', top:'50%', left:`${pct}%`, transform:'translate(-50%,-50%)', width:14, height:14, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}`, border:'2px solid #000', transition:'left 0.1s', pointerEvents:'none' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
        <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)', fontFamily:'DM Mono, monospace' }}>{format(min)}</span>
        <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)', fontFamily:'DM Mono, monospace' }}>{format(max)}</span>
      </div>
    </div>
  );
}

function ProfilePreview({ profile, generatedBio }: { profile: any; generatedBio: string }) {
  const ct = CREATOR_NICHES.find(t => t.id === profile.type) || null;
  const Icon = ct?.Icon || User;
  const tagline = generatedBio.match(/TAGLINE:\s*(.+)/)?.[1] || '';
  const about = generatedBio.match(/ABOUT:\s*([\s\S]+?)(?=PILLARS:|$)/)?.[1]?.trim() || '';
  const fmt = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : n.toString();

  return (
    <div style={{ position:'sticky', top:88 }}>
      <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', fontFamily:'DM Mono, monospace', letterSpacing:'0.15em', marginBottom:12, textTransform:'uppercase' }}>Live Preview</div>
      <motion.div layout style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
        <div style={{ padding:'24px 22px 18px', background:ct?`linear-gradient(135deg, ${ct.bg}, transparent)`:'transparent', borderBottom:'1px solid rgba(255,255,255,0.06)', position:'relative' }}>
          <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:ct?.color||'#fff', opacity:0.04, filter:'blur(24px)' }} />
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ width:44, height:44, borderRadius:13, background:ct?.bg||'rgba(255,255,255,0.06)', border:`1px solid ${ct?.color||'rgba(255,255,255,0.1)'}50`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon size={20} color={ct?.color||'rgba(255,255,255,0.3)'} />
            </div>
            {ct && <span style={{ fontSize:9, fontFamily:'DM Mono, monospace', color:ct.color, background:ct.bg, border:`1px solid ${ct.color}40`, borderRadius:6, padding:'3px 8px', letterSpacing:'0.1em', textTransform:'uppercase' }}>{ct.label}</span>}
          </div>
          <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:28, letterSpacing:'0.03em', color:'#f5f0e8', lineHeight:0.95, marginBottom:4 }}>{profile.name||'Your Name'}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'DM Mono, monospace', marginBottom:tagline?10:0 }}>@{profile.handle||'handle'}</div>
          {tagline && <p style={{ fontSize:12, color:ct?.color||'#c9a84c', fontStyle:'italic', fontFamily:'Instrument Serif, serif', lineHeight:1.4, margin:0 }}>"{tagline}"</p>}
        </div>

        {(profile.ig_handle||profile.fb_handle) && (
          <div style={{ padding:'12px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:12 }}>
            {profile.ig_handle && <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(255,255,255,0.5)', fontFamily:'DM Mono, monospace' }}><Instagram size={12} color="#e05c5c"/>@{profile.ig_handle}</div>}
            {profile.fb_handle && <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(255,255,255,0.5)', fontFamily:'DM Mono, monospace' }}><Facebook size={12} color="#5c8de0"/>@{profile.fb_handle}</div>}
          </div>
        )}

        {(profile.followers > 0 || profile.monthly_views > 0) && (
          <div style={{ padding:'14px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {[[Users,'Followers',fmt(profile.followers||0),'#c9a84c'],[Eye,'Mo. Views',fmt(profile.monthly_views||0),'#5c8de0'],[Play,'Avg Views',fmt(profile.avg_video_views||0),'#8e5ce0'],[TrendingUp,'Eng. Rate',`${profile.engagement_rate||0}%`,'#5ce0b8']].map(([SIcon,label,val,color]:any)=>(
              <div key={label} style={{ textAlign:'center' }}>
                <SIcon size={12} color={color} style={{ margin:'0 auto 4px' }}/>
                <div style={{ fontSize:14, fontFamily:'Bebas Neue, sans-serif', color:'#f5f0e8', letterSpacing:'0.04em' }}>{val}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'DM Mono, monospace', letterSpacing:'0.08em' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {profile.vibes?.length > 0 && (
          <div style={{ padding:'12px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:'DM Mono, monospace', letterSpacing:'0.12em', marginBottom:7 }}>FORMAT</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {(profile.vibes||[]).slice(0,4).map((fid:string)=>{
                const f = CONTENT_FORMATS.find(x=>x.id===fid);
                const FIcon = f?.Icon||Play;
                return <motion.span key={fid} initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:100, padding:'2px 9px', fontSize:10, color:'rgba(255,255,255,0.5)' }}><FIcon size={8}/>{f?.label||fid}</motion.span>
              })}
            </div>
          </div>
        )}

        {about && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ padding:'14px 22px' }}>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.7, fontStyle:'italic', fontFamily:'Instrument Serif, serif', margin:0 }}>{about.slice(0,130)}{about.length>130?'...':''}</p>
          </motion.div>
        )}

        {!profile.name && !profile.type && (
          <div style={{ padding:24, textAlign:'center', color:'rgba(255,255,255,0.15)', fontSize:12, fontFamily:'DM Mono, monospace' }}>Fill in your details to preview your profile</div>
        )}
      </motion.div>
    </div>
  );
}

interface StepperProfileProps {
  profile: Record<string,any>;
  setProfile: (p:any)=>void;
  generatedBio: string;
  setGeneratedBio: (b:string)=>void;
  savingProfile: boolean;
  toggleArr: (field:string,val:string)=>void;
  callAI: (task:string,data:any)=>Promise<string>;
  onNext: (bio:string)=>void;
}

export default function StepperProfile({ profile, setProfile, generatedBio, setGeneratedBio, savingProfile, toggleArr, callAI, onNext }: StepperProfileProps) {
  const [step, setStep] = useState(1);
  const [aiLoading, setAiLoading] = useState(false);
  const set = (k:string,v:any) => setProfile((p:any)=>({...p,[k]:v}));

  const canAdvance = () => {
    if (step===1) return profile.name?.trim().length>0;
    if (step===2) return profile.ig_handle?.trim().length>0||profile.fb_handle?.trim().length>0;
    if (step===3) return profile.followers>0;
    if (step===4) return profile.type?.length>0;
    return true;
  };

  const generate = async () => {
    if (!profile.name||!profile.type) return;
    setAiLoading(true); setGeneratedBio('');
    const r = await callAI('profile', profile);
    setGeneratedBio(r);
    setAiLoading(false);
  };

  const ct = CREATOR_NICHES.find(t=>t.id===profile.type);
  const accent = ct?.color||'#c9a84c';
  const fmt = (n:number) => n>=1000000?`${(n/1000000).toFixed(1)}M`:n>=1000?`${(n/1000).toFixed(0)}K`:n.toString();

  return (
    <div style={{ minHeight:'100vh', background:'#000', display:'flex', flexDirection:'column', position:'relative' }}>
      <div style={{ position:'fixed', inset:0, background:`radial-gradient(ellipse 60% 40% at 30% 50%, ${accent}05 0%, transparent 70%)`, pointerEvents:'none', transition:'background 0.5s' }} />

      {/* Progress nav */}
      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(0,0,0,0.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <motion.div animate={{ width:`${(step/STEPS.length)*100}%` }} transition={{ type:'spring', stiffness:200, damping:30 }} style={{ height:2, background:accent, transition:'background 0.5s' }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 32px' }}>
          <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:22, letterSpacing:'0.08em', color:'#f5f0e8' }}>HUM</div>
          <div style={{ display:'flex', gap:4, alignItems:'center' }}>
            {STEPS.map((s,i) => {
              const SI = s.icon;
              const done = step>s.id, active = step===s.id;
              return (
                <div key={s.id} style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:done?accent:active?`${accent}20`:'rgba(255,255,255,0.04)', border:`1px solid ${done?accent:active?`${accent}60`:'rgba(255,255,255,0.08)'}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.3s' }}>
                    {done?<Check size={12} color="#000" strokeWidth={3}/>:<SI size={12} color={active?accent:'rgba(255,255,255,0.25)'}/>}
                  </div>
                  {i<STEPS.length-1&&<div style={{ width:20, height:1, background:done?accent:'rgba(255,255,255,0.08)', transition:'background 0.3s' }}/>}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize:11, fontFamily:'DM Mono, monospace', color:'rgba(255,255,255,0.25)' }}>{step}/{STEPS.length}</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:48, maxWidth:980, margin:'0 auto', padding:'108px 32px 100px', width:'100%', position:'relative', zIndex:1, alignItems:'start' }}>
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.22}}>

              {step===1 && (
                <div>
                  <div style={{ fontSize:10, fontFamily:'DM Mono, monospace', color:'rgba(255,255,255,0.25)', letterSpacing:'0.18em', marginBottom:14 }}>01 — IDENTITY</div>
                  <h2 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:52, letterSpacing:'0.03em', color:'#f5f0e8', marginBottom:8, lineHeight:0.92 }}>What's your name?</h2>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:36, lineHeight:1.65, fontFamily:'Manrope, sans-serif', fontWeight:300 }}>How businesses and creators will find you on HUM.</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    <div>
                      <label style={{ fontSize:10, fontFamily:'DM Mono, monospace', color:'rgba(255,255,255,0.25)', letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Full Name</label>
                      <input className="input" placeholder="e.g. Aasim Nabi" value={profile.name||''} onChange={e=>set('name',e.target.value)} autoFocus style={{ fontSize:16 }}/>
                    </div>
                    <div>
                      <label style={{ fontSize:10, fontFamily:'DM Mono, monospace', color:'rgba(255,255,255,0.25)', letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Handle</label>
                      <div style={{ position:'relative' }}>
                        <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.25)', fontSize:14, pointerEvents:'none' }}>@</span>
                        <input className="input" placeholder="yourhandle" value={profile.handle||''} onChange={e=>set('handle',e.target.value.replace('@','').replace(/\s/g,'').toLowerCase())} style={{ paddingLeft:36, fontSize:16 }}/>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step===2 && (
                <div>
                  <div style={{ fontSize:10, fontFamily:'DM Mono, monospace', color:'rgba(255,255,255,0.25)', letterSpacing:'0.18em', marginBottom:14 }}>02 — SOCIAL PRESENCE</div>
                  <h2 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:52, letterSpacing:'0.03em', color:'#f5f0e8', marginBottom:8, lineHeight:0.92 }}>Your social handles</h2>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:36, lineHeight:1.65, fontFamily:'Manrope, sans-serif', fontWeight:300 }}>Where businesses can find your content. At least one required.</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'20px 22px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                        <div style={{ width:40, height:40, borderRadius:12, background:'rgba(224,92,92,0.15)', border:'1px solid rgba(224,92,92,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}><Instagram size={20} color="#e05c5c"/></div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:14, color:'#f5f0e8', fontFamily:'Manrope, sans-serif' }}>Instagram</div>
                          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'DM Mono, monospace' }}>Primary platform for most creators</div>
                        </div>
                      </div>
                      <div style={{ position:'relative' }}>
                        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.25)', fontSize:14, pointerEvents:'none', fontFamily:'DM Mono, monospace' }}>@</span>
                        <input className="input" placeholder="your_ig_handle" value={profile.ig_handle||''} onChange={e=>set('ig_handle',e.target.value.replace('@','').replace(/\s/g,''))} style={{ paddingLeft:32 }}/>
                      </div>
                    </div>
                    <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'20px 22px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                        <div style={{ width:40, height:40, borderRadius:12, background:'rgba(92,141,224,0.15)', border:'1px solid rgba(92,141,224,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}><Facebook size={20} color="#5c8de0"/></div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:14, color:'#f5f0e8', fontFamily:'Manrope, sans-serif' }}>Facebook</div>
                          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'DM Mono, monospace' }}>Page or profile handle</div>
                        </div>
                      </div>
                      <div style={{ position:'relative' }}>
                        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.25)', fontSize:14, pointerEvents:'none', fontFamily:'DM Mono, monospace' }}>@</span>
                        <input className="input" placeholder="your_fb_handle" value={profile.fb_handle||''} onChange={e=>set('fb_handle',e.target.value.replace('@','').replace(/\s/g,''))} style={{ paddingLeft:32 }}/>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step===3 && (
                <div>
                  <div style={{ fontSize:10, fontFamily:'DM Mono, monospace', color:'rgba(255,255,255,0.25)', letterSpacing:'0.18em', marginBottom:14 }}>03 — YOUR STATS</div>
                  <h2 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:52, letterSpacing:'0.03em', color:'#f5f0e8', marginBottom:8, lineHeight:0.92 }}>How big is your audience?</h2>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:36, lineHeight:1.65, fontFamily:'Manrope, sans-serif', fontWeight:300 }}>Self-reported stats shown on your profile. Businesses use these to make decisions.</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    <StatSlider label="Followers" icon={Users} value={profile.followers||0} onChange={(v:number)=>set('followers',v)} min={0} max={500000} step={1000} color="#c9a84c" format={(v:number)=>fmt(v)}/>
                    <StatSlider label="Monthly Views" icon={Eye} value={profile.monthly_views||0} onChange={(v:number)=>set('monthly_views',v)} min={0} max={2000000} step={5000} color="#5c8de0" format={(v:number)=>fmt(v)}/>
                    <StatSlider label="Avg Video Views" icon={Play} value={profile.avg_video_views||0} onChange={(v:number)=>set('avg_video_views',v)} min={0} max={500000} step={1000} color="#8e5ce0" format={(v:number)=>fmt(v)}/>
                    <StatSlider label="Engagement Rate" icon={TrendingUp} value={profile.engagement_rate||0} onChange={(v:number)=>set('engagement_rate',v)} min={0} max={20} step={0.1} color="#5ce0b8" format={(v:number)=>`${v.toFixed(1)}%`}/>
                  </div>
                  <div style={{ marginTop:16, padding:'10px 14px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10 }}>
                    <span style={{ fontSize:10, color:'rgba(201,168,76,0.7)', fontFamily:'DM Mono, monospace', letterSpacing:'0.08em' }}>ⓘ SELF REPORTED — HUM Verified coming soon.</span>
                  </div>
                </div>
              )}

              {step===4 && (
                <div>
                  <div style={{ fontSize:10, fontFamily:'DM Mono, monospace', color:'rgba(255,255,255,0.25)', letterSpacing:'0.18em', marginBottom:14 }}>04 — CONTENT NICHE</div>
                  <h2 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:52, letterSpacing:'0.03em', color:'#f5f0e8', marginBottom:8, lineHeight:0.92 }}>What do you create?</h2>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:24, lineHeight:1.65, fontFamily:'Manrope, sans-serif', fontWeight:300 }}>Your niche determines which businesses you match with.</p>

                  {/* Primary niche — 3-col grid */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:28 }}>
                    {CREATOR_NICHES.map(t => {
                      const Icon = t.Icon;
                      const active = profile.type===t.id;
                      return (
                        <motion.button key={t.id} onClick={()=>set('type',t.id)} whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                          style={{ padding:'14px 12px', borderRadius:14, border:`1px solid ${active?t.color:'rgba(255,255,255,0.07)'}`, background:active?t.bg:'rgba(255,255,255,0.02)', cursor:'pointer', textAlign:'left', display:'flex', flexDirection:'column', gap:6, transition:'all 0.15s', position:'relative' }}>
                          <div style={{ width:32, height:32, borderRadius:9, background:active?t.bg:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Icon size={17} color={active?t.color:'rgba(255,255,255,0.3)'}/>
                          </div>
                          <div style={{ fontSize:12, fontWeight:700, color:active?t.color:'rgba(255,255,255,0.6)', fontFamily:'Manrope, sans-serif', lineHeight:1.2 }}>{t.label}</div>
                          <div style={{ fontSize:10, color:active?`${t.color}90`:'rgba(255,255,255,0.25)', fontFamily:'DM Mono, monospace', letterSpacing:'0.04em', lineHeight:1.3 }}>{t.desc}</div>
                          {active && <Check size={12} color={t.color} style={{ position:'absolute', top:10, right:10 }}/>}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Content format */}
                  <div>
                    <label style={{ fontSize:10, fontFamily:'DM Mono, monospace', color:'rgba(255,255,255,0.25)', letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:10 }}>Content Format (pick all that apply)</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                      {CONTENT_FORMATS.map(f => {
                        const FIcon = f.Icon;
                        const active = (profile.vibes||[]).includes(f.id);
                        return (
                          <motion.button key={f.id} onClick={()=>toggleArr('vibes',f.id)} whileHover={{scale:1.04}}
                            style={{ display:'flex', alignItems:'center', gap:6, background:active?`${accent}15`:'rgba(255,255,255,0.04)', border:`1px solid ${active?accent:'rgba(255,255,255,0.08)'}`, borderRadius:9999, padding:'7px 14px', cursor:'pointer', color:active?accent:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:500, fontFamily:'Manrope, sans-serif', transition:'all 0.15s' }}>
                            <FIcon size={11}/>{f.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step===5 && (
                <div>
                  <div style={{ fontSize:10, fontFamily:'DM Mono, monospace', color:'rgba(255,255,255,0.25)', letterSpacing:'0.18em', marginBottom:14 }}>05 — AI PROFILE</div>
                  <h2 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:52, letterSpacing:'0.03em', color:'#f5f0e8', marginBottom:8, lineHeight:0.92 }}>Generate your identity</h2>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:32, lineHeight:1.65, fontFamily:'Manrope, sans-serif', fontWeight:300 }}>Claude writes your creator bio using everything you've shared. Takes about 10 seconds.</p>
                  <button onClick={generate} disabled={aiLoading}
                    style={{ display:'flex', alignItems:'center', gap:10, background:accent, color:'#000', border:'none', borderRadius:9999, padding:'14px 28px', fontSize:14, fontWeight:700, cursor:aiLoading?'not-allowed':'pointer', opacity:aiLoading?0.7:1, marginBottom:24, fontFamily:'Manrope, sans-serif', transition:'all 0.2s' }}>
                    {aiLoading?<><Loader2 size={16} className="spin"/>Writing your identity...</>:<><Sparkles size={16}/>{generatedBio?'Regenerate':'Generate with Claude'}</>}
                  </button>
                  {generatedBio && (
                    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:20 }}>
                      <pre style={{ whiteSpace:'pre-wrap', fontFamily:'Manrope, sans-serif', fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.8 }}>{generatedBio}</pre>
                    </motion.div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          <div style={{ display:'flex', gap:12, marginTop:40 }}>
            {step>1 && (
              <button onClick={()=>setStep(s=>s-1)}
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', borderRadius:9999, padding:'12px 22px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Manrope, sans-serif' }}>
                ← Back
              </button>
            )}
            {step<5?(
              <button onClick={()=>setStep(s=>s+1)} disabled={!canAdvance()}
                style={{ display:'flex', alignItems:'center', gap:8, background:canAdvance()?accent:'rgba(255,255,255,0.05)', color:canAdvance()?'#000':'rgba(255,255,255,0.25)', border:'none', borderRadius:9999, padding:'12px 26px', fontSize:13, fontWeight:700, cursor:canAdvance()?'pointer':'not-allowed', fontFamily:'Manrope, sans-serif', transition:'all 0.2s' }}>
                Continue <ChevronRight size={15}/>
              </button>
            ):(
              <button onClick={()=>onNext(generatedBio)} disabled={savingProfile}
                style={{ display:'flex', alignItems:'center', gap:8, background:accent, color:'#000', border:'none', borderRadius:9999, padding:'12px 26px', fontSize:13, fontWeight:700, cursor:savingProfile?'not-allowed':'pointer', opacity:savingProfile?0.7:1, fontFamily:'Manrope, sans-serif' }}>
                {savingProfile?<><Loader2 size={14} className="spin"/>Saving...</>:<>Let's go <ChevronRight size={15}/></>}
              </button>
            )}
          </div>
        </div>

        <ProfilePreview profile={profile} generatedBio={generatedBio}/>
      </div>
    </div>
  );
}
