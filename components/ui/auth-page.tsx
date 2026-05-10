'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Building2, Music2 } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

interface AuthPageProps {
  mode: 'creator' | 'business';
  onSuccess: (userId: string) => void;
  onBack: () => void;
}

type Tab = 'signin' | 'signup';

export default function AuthPage({ mode, onSuccess, onBack }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const isBusiness = mode === 'business';
  const accent = isBusiness ? '#c9a84c' : '#8e5ce0';
  const Icon = isBusiness ? Building2 : Music2;

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');

    if (tab === 'signin') {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        setError(authError.message.replace('_', ' '));
        setLoading(false);
      }
      // On success, onAuthStateChange fires → page.tsx useEffect routes the user
    } else {
      const { error: authError, needsConfirmation } = await signUp(email, password);
      if (authError) {
        setError(authError.message.replace('_', ' '));
        setLoading(false);
      } else if (needsConfirmation) {
        setLoading(false);
        setEmailSent(true);
      } else {
        setLoading(false);
        setTimeout(() => onSuccess('done'), 300);
      }
    }
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit(); };

  if (emailSent) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${accent}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `${accent}15`, border: `1px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Mail size={24} color={accent} />
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: '0.04em', color: '#f5f0e8', marginBottom: 12 }}>Check your email</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 32 }}>
          We sent a confirmation link to <span style={{ color: accent, fontWeight: 700 }}>{email}</span>.<br />Click it to activate your account, then sign in.
        </p>
        <button onClick={() => { setEmailSent(false); setTab('signin'); }} style={{ background: accent, color: '#000', border: 'none', borderRadius: 9999, padding: '13px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
          Back to Sign In
        </button>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${accent}08 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', padding: 0 }}>
          ← Back
        </button>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `${accent}15`, border: `1px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Icon size={24} color={accent} />
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, letterSpacing: '0.04em', color: '#f5f0e8', marginBottom: 8 }}>
            {isBusiness ? 'Join as Business' : 'Join as Creator'}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            {isBusiness ? 'Future-proof your business through Kashmir creators.' : 'Get discovered by Kashmir businesses. Start earning.'}
          </p>
        </div>

        {/* 2-tab picker */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 3, marginBottom: 28, gap: 2 }}>
          {(['signin', 'signup'] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              style={{ flex: 1, padding: '9px 6px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Manrope, sans-serif', transition: 'all 0.15s', letterSpacing: '0.02em',
                background: tab === t ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: tab === t ? '#f5f0e8' : 'rgba(255,255,255,0.35)',
              }}>
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="email" placeholder="Email address" value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }} onKeyDown={handleKey}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px 14px 44px', color: '#f5f0e8', fontSize: 14, fontFamily: 'Manrope, sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => (e.target.style.borderColor = accent)} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="password" placeholder="Password (min 6 characters)" value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }} onKeyDown={handleKey}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px 14px 44px', color: '#f5f0e8', fontSize: 14, fontFamily: 'Manrope, sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => (e.target.style.borderColor = accent)} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 10, padding: '10px 14px' }}>
                    <AlertCircle size={14} color="#e05c5c" />
                    <span style={{ fontSize: 13, color: '#e05c5c', fontFamily: 'Manrope, sans-serif' }}>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={handleSubmit} disabled={loading}
                style={{ background: accent, color: '#000', border: 'none', borderRadius: 9999, padding: '14px 24px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '0.04em', transition: 'all 0.2s', fontFamily: 'Manrope, sans-serif' }}
                onMouseEnter={e => { if (!loading) (e.currentTarget.style.opacity = '0.9'); }}
                onMouseLeave={e => { (e.currentTarget.style.opacity = loading ? '0.7' : '1'); }}>
                {loading ? <><Loader2 size={16} className="spin" />Processing...</> : <>{tab === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
