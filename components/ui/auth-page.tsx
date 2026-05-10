'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Building2, Music2, AtSign } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

interface AuthPageProps {
  mode: 'creator' | 'business';
  onSuccess: (userId: string) => void;
  onBack: () => void;
}

type Tab    = 'signin' | 'signup';
type Method = 'username' | 'email';

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

function friendlyError(msg: string, method: Method): string {
  const m = msg.toLowerCase();
  if (m.includes('already registered') || m.includes('already exists')) return 'Username already taken — try another.';
  if (m.includes('invalid login') || m.includes('invalid credentials')) return method === 'username' ? 'Incorrect username or password.' : 'Incorrect email or password.';
  if (m.includes('email not confirmed')) return 'Account pending confirmation — use username login or contact support.';
  return msg.replace(/_/g, ' ');
}

export default function AuthPage({ mode, onSuccess, onBack }: AuthPageProps) {
  const { signIn, signUp, signInWithUsername, signUpWithUsername } = useAuth();

  const [tab, setTab]       = useState<Tab>('signin');
  const [method, setMethod] = useState<Method>('username');

  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const isBusiness = mode === 'business';
  const accent = isBusiness ? '#c9a84c' : '#8e5ce0';
  const Icon   = isBusiness ? Building2 : Music2;

  const reset = () => { setError(''); setUsername(''); setEmail(''); setPassword(''); };
  const switchMethod = (m: Method) => { setMethod(m); reset(); };
  const switchTab    = (t: Tab)    => { setTab(t);    setError(''); };

  const validate = (): string | null => {
    if (method === 'username') {
      if (!username.trim()) return 'Enter a username.';
      if (tab === 'signup' && !USERNAME_RE.test(username.toLowerCase())) return 'Username: 3–20 chars, letters/numbers/underscore only.';
      if (!password) return 'Enter a password.';
      if (password.length < 6) return 'Password must be at least 6 characters.';
    } else {
      if (!email.trim()) return 'Enter an email address.';
      if (!password) return 'Enter a password.';
      if (password.length < 6) return 'Password must be at least 6 characters.';
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');

    if (method === 'username') {
      if (tab === 'signin') {
        const { error: e } = await signInWithUsername(username.trim(), password);
        if (e) { setError(friendlyError(e.message, 'username')); setLoading(false); }
      } else {
        const { error: e, needsConfirmation } = await signUpWithUsername(username.trim(), password);
        if (e) { setError(friendlyError(e.message, 'username')); setLoading(false); }
        else if (needsConfirmation) {
          // fake email — confirmation won't arrive; tell user to ask admin
          setLoading(false);
          setError('Account created but email confirmation is on. Ask admin to disable it in Supabase, or sign in now if already confirmed.');
        }
        // on success onAuthStateChange fires and routes the user
      }
    } else {
      if (tab === 'signin') {
        const { error: e } = await signIn(email.trim(), password);
        if (e) { setError(friendlyError(e.message, 'email')); setLoading(false); }
      } else {
        const { error: e, needsConfirmation } = await signUp(email.trim(), password);
        if (e) { setError(friendlyError(e.message, 'email')); setLoading(false); }
        else if (needsConfirmation) { setLoading(false); setEmailSent(true); }
      }
    }
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit(); };

  if (emailSent) return (
    <div style={{ minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,position:'relative' }}>
      <div style={{ position:'fixed',inset:0,background:`radial-gradient(ellipse 60% 40% at 50% 50%, ${accent}08 0%, transparent 70%)`,pointerEvents:'none' }} />
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{ width:'100%',maxWidth:420,textAlign:'center',position:'relative',zIndex:1 }}>
        <div style={{ width:56,height:56,borderRadius:16,background:`${accent}15`,border:`1px solid ${accent}40`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px' }}>
          <Mail size={24} color={accent} />
        </div>
        <h1 style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:36,letterSpacing:'0.04em',color:'#f5f0e8',marginBottom:12 }}>Check your email</h1>
        <p style={{ fontSize:14,color:'rgba(255,255,255,0.45)',lineHeight:1.7,marginBottom:32 }}>
          We sent a confirmation link to <span style={{ color:accent,fontWeight:700 }}>{email}</span>.<br />Click it then come back to sign in.
        </p>
        <button onClick={()=>{ setEmailSent(false); setTab('signin'); }}
          style={{ background:accent,color:'#000',border:'none',borderRadius:9999,padding:'13px 28px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Manrope, sans-serif' }}>
          Back to Sign In
        </button>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,position:'relative' }}>
      <div style={{ position:'fixed',inset:0,background:`radial-gradient(ellipse 60% 40% at 50% 50%, ${accent}08 0%, transparent 70%)`,pointerEvents:'none' }} />

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{ width:'100%',maxWidth:420,position:'relative',zIndex:1 }}>

        <button onClick={onBack} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:13,marginBottom:32,display:'flex',alignItems:'center',gap:6,fontFamily:'DM Mono, monospace',letterSpacing:'0.06em',padding:0 }}>
          ← Back
        </button>

        <div style={{ marginBottom:28 }}>
          <div style={{ width:52,height:52,borderRadius:16,background:`${accent}15`,border:`1px solid ${accent}40`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20 }}>
            <Icon size={24} color={accent} />
          </div>
          <h1 style={{ fontFamily:'Bebas Neue, sans-serif',fontSize:40,letterSpacing:'0.04em',color:'#f5f0e8',marginBottom:8 }}>
            {isBusiness ? 'Join as Business' : 'Join as Creator'}
          </h1>
          <p style={{ fontSize:14,color:'rgba(255,255,255,0.45)',lineHeight:1.6 }}>
            {isBusiness ? 'Future-proof your business through Kashmir creators.' : 'Get discovered by Kashmir businesses. Start earning.'}
          </p>
        </div>

        {/* Sign In / Create Account tabs */}
        <div style={{ display:'flex',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:3,marginBottom:24,gap:2 }}>
          {(['signin','signup'] as Tab[]).map(t=>(
            <button key={t} onClick={()=>switchTab(t)}
              style={{ flex:1,padding:'9px 6px',borderRadius:9,border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:'Manrope, sans-serif',transition:'all 0.15s',letterSpacing:'0.02em',
                background:tab===t?'rgba(255,255,255,0.1)':'transparent',
                color:tab===t?'#f5f0e8':'rgba(255,255,255,0.35)' }}>
              {t==='signin'?'Sign In':'Create Account'}
            </button>
          ))}
        </div>

        {/* Method switcher */}
        <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:22 }}>
          {(['username','email'] as Method[]).map(m=>(
            <button key={m} onClick={()=>switchMethod(m)}
              style={{ display:'flex',alignItems:'center',gap:5,padding:'6px 14px',borderRadius:9999,border:`1px solid ${method===m?accent:'rgba(255,255,255,0.08)'}`,background:method===m?`${accent}10`:'transparent',color:method===m?accent:'rgba(255,255,255,0.3)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'Manrope, sans-serif',transition:'all 0.15s' }}>
              {m==='username'?<AtSign size={11}/>:<Mail size={11}/>}
              {m==='username'?'Username':'Email'}
            </button>
          ))}
          {method==='email' && (
            <span style={{ fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'DM Mono, monospace',marginLeft:'auto' }}>optional</span>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={`${tab}-${method}`} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.12}}>
            <div style={{ display:'flex',flexDirection:'column',gap:14,marginBottom:24 }}>

              {method==='username' ? (
                <div style={{ position:'relative' }}>
                  <AtSign size={16} color="rgba(255,255,255,0.3)" style={{ position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',pointerEvents:'none' }} />
                  <input
                    type="text" placeholder={tab==='signup'?'Choose a username (e.g. amir_k)':'Your username'}
                    value={username} onChange={e=>{ setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'')); setError(''); }} onKeyDown={handleKey}
                    autoComplete="username" autoFocus
                    style={{ width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'14px 16px 14px 44px',color:'#f5f0e8',fontSize:14,fontFamily:'Manrope, sans-serif',outline:'none',transition:'border-color 0.2s',boxSizing:'border-box' }}
                    onFocus={e=>(e.target.style.borderColor=accent)} onBlur={e=>(e.target.style.borderColor='rgba(255,255,255,0.1)')} />
                  {tab==='signup' && username && (
                    <div style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',fontSize:11,fontFamily:'DM Mono, monospace',color:USERNAME_RE.test(username)?'#22c55e':'rgba(255,255,255,0.2)' }}>
                      {USERNAME_RE.test(username)?'✓':'3–20 chars'}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ position:'relative' }}>
                  <Mail size={16} color="rgba(255,255,255,0.3)" style={{ position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',pointerEvents:'none' }} />
                  <input
                    type="email" placeholder="Email address"
                    value={email} onChange={e=>{ setEmail(e.target.value); setError(''); }} onKeyDown={handleKey}
                    autoComplete="email" autoFocus
                    style={{ width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'14px 16px 14px 44px',color:'#f5f0e8',fontSize:14,fontFamily:'Manrope, sans-serif',outline:'none',transition:'border-color 0.2s',boxSizing:'border-box' }}
                    onFocus={e=>(e.target.style.borderColor=accent)} onBlur={e=>(e.target.style.borderColor='rgba(255,255,255,0.1)')} />
                </div>
              )}

              <div style={{ position:'relative' }}>
                <Lock size={16} color="rgba(255,255,255,0.3)" style={{ position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',pointerEvents:'none' }} />
                <input
                  type="password" placeholder="Password (min 6 characters)"
                  value={password} onChange={e=>{ setPassword(e.target.value); setError(''); }} onKeyDown={handleKey}
                  autoComplete={tab==='signup'?'new-password':'current-password'}
                  style={{ width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'14px 16px 14px 44px',color:'#f5f0e8',fontSize:14,fontFamily:'Manrope, sans-serif',outline:'none',transition:'border-color 0.2s',boxSizing:'border-box' }}
                  onFocus={e=>(e.target.style.borderColor=accent)} onBlur={e=>(e.target.style.borderColor='rgba(255,255,255,0.1)')} />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                    style={{ display:'flex',alignItems:'flex-start',gap:8,background:'rgba(192,57,43,0.15)',border:'1px solid rgba(192,57,43,0.3)',borderRadius:10,padding:'10px 14px' }}>
                    <AlertCircle size={14} color="#e05c5c" style={{ flexShrink:0,marginTop:1 }} />
                    <span style={{ fontSize:13,color:'#e05c5c',fontFamily:'Manrope, sans-serif',lineHeight:1.5 }}>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={handleSubmit} disabled={loading}
                style={{ background:accent,color:'#000',border:'none',borderRadius:9999,padding:'14px 24px',fontSize:15,fontWeight:700,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,letterSpacing:'0.04em',transition:'all 0.2s',fontFamily:'Manrope, sans-serif' }}
                onMouseEnter={e=>{ if(!loading)(e.currentTarget.style.opacity='0.9'); }}
                onMouseLeave={e=>{ e.currentTarget.style.opacity=loading?'0.7':'1'; }}>
                {loading?<><Loader2 size={16} className="spin"/>Processing...</>:<>{tab==='signin'?'Sign In':'Create Account'} <ArrowRight size={16}/></>}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {method==='username' && tab==='signup' && (
          <p style={{ fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'DM Mono, monospace',textAlign:'center',lineHeight:1.6 }}>
            Your username is your identity on HUM — you can't change it later.
          </p>
        )}
      </motion.div>
    </div>
  );
}
