'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Building2, Music2, ArrowRight, ArrowDown, TrendingUp, Users, Sparkles, BarChart3, Zap, Target, CheckCircle } from 'lucide-react';
import FlowArt, { FlowSection } from './story-scroll';
import { BusinessDigitizer } from './business-digitizer';
import { CircularTestimonials } from './circular-testimonials';

const TESTIMONIALS = [
  {
    quote: "We had zero digital presence. After our first HUM campaign with a local photographer, our hotel bookings went up 40% in one month. The AI matched us with exactly the right creator.",
    name: "Tariq Ahmed",
    designation: "Owner — Wular Lake Retreat",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
  {
    quote: "Finding authentic Kashmir creators used to take weeks of DMs and negotiations. HUM's AI brief generator wrote our campaign strategy better than our agency did. Launched in 48 hours.",
    name: "Sana Wani",
    designation: "Marketing Head — Kashmir Spice Co.",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  },
  {
    quote: "As a saffron farmer trying to sell directly, I had no idea how to reach customers online. HUM connected me with three creators who understood our story. Now we ship across India.",
    name: "Ghulam Nabi",
    designation: "Founder — Pure Kashmir Saffron",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
];

// Scroll indicator
function ScrollIndicator({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            left: 36,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            fontSize: 11,
            letterSpacing: '0.22em',
            color: '#c9a84c',
            fontFamily: 'DM Mono, monospace',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Scroll to explore
          </div>
          <div style={{ position: 'relative', width: 2, height: 96, background: 'rgba(201,168,76,0.25)', borderRadius: 2 }}>
            <motion.div
              animate={{ y: [0, 88, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9a84c', boxShadow: '0 0 12px #c9a84c', position: 'absolute', left: -3 }}
            />
          </div>
          <ArrowDown size={16} color="#c9a84c" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HUMLanding({
  onSelectBusiness,
  onSelectCreator,
}: {
  onSelectBusiness: () => void;
  onSelectCreator: () => void;
}) {
  const [showScroll, setShowScroll] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on('change', v => setShowScroll(v < window.innerHeight * 3));
    return unsub;
  }, [scrollY]);

  return (
    <div style={{ background: '#000', overflowX: 'hidden' }}>

      {/* ── FLOATING DOCK NAV ─────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
        background: 'rgba(18,18,14,0.88)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 18,
        boxShadow: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 10px',
        whiteSpace: 'nowrap',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', marginRight: 4 }}>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, letterSpacing: '0.12em', color: '#f5f0e8', lineHeight: 1 }}>HUM</span>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c9a84c', boxShadow: '0 0 6px #c9a84c' }} />
        </div>
        {/* Divider */}
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
        {/* Nav items */}
        <button onClick={onSelectCreator}
          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.01em', fontFamily: 'Manrope, sans-serif', transition: 'all 0.18s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.08)'; el.style.color = '#fff'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(255,255,255,0.6)'; }}>
          For Creators
        </button>
        <button onClick={onSelectBusiness}
          style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.01em', fontFamily: 'Manrope, sans-serif', transition: 'all 0.18s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.12)'; el.style.color = '#fff'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.06)'; el.style.color = 'rgba(255,255,255,0.7)'; }}>
          For Business
        </button>
        <button onClick={onSelectBusiness}
          style={{ background: '#c9a84c', border: 'none', color: '#000', borderRadius: 12, padding: '7px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', fontFamily: 'Manrope, sans-serif', transition: 'all 0.18s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#dabb5a'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#c9a84c'; }}>
          Get Started →
        </button>
      </nav>

      <ScrollIndicator visible={showScroll} />

      {/* ── HERO — MERGED DARK SECTION ────────────────────────────── */}
      <section ref={heroRef} style={{
        minHeight: '100vh', background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 48px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grain texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.035\'/%3E%3C/svg%3E")', pointerEvents: 'none', zIndex: 0 }} />
        {/* Radial ambient */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', maxWidth: 1000, position: 'relative', zIndex: 1 }}
        >
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'DM Mono, monospace', fontWeight: 500, marginBottom: 32 }}>
            Kashmir's Creator Economy Platform
          </motion.div>

          {/* Main headline — massive, weight 300 light like PlayStation SST */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(72px, 13vw, 148px)',
              fontWeight: 400,
              lineHeight: 0.88,
              letterSpacing: '0.02em',
              color: '#f5f0e8',
              marginBottom: 0,
            }}
          >
            Future-Proof<br />
            <span style={{ color: '#c9a84c' }}>Your Business</span><br />
            Through Creators
          </motion.h1>

          {/* Divider */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
            style={{ width: 48, height: 1, background: 'rgba(201,168,76,0.4)', margin: '40px auto' }} />

          {/* Sub — light weight, generous line height */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 56px', letterSpacing: '0.01em', fontFamily: 'Manrope, sans-serif' }}>
            Connect Kashmir businesses with verified local creators. AI-matched campaigns. Real ROI. Launch in 48 hours.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
            <button onClick={onSelectBusiness}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#c9a84c', color: '#000', border: 'none', borderRadius: 9999, padding: '16px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.03em', fontFamily: 'Manrope, sans-serif', transition: 'all 0.25s', boxShadow: '0 0 0 0 rgba(201,168,76,0)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#e8c96a'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 32px rgba(201,168,76,0.35)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#c9a84c'; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 0 0 0 rgba(201,168,76,0)'; }}>
              <Building2 size={17} />
              I'm a Business
              <ArrowRight size={15} />
            </button>
            <button onClick={onSelectCreator}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9999, padding: '16px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.03em', fontFamily: 'Manrope, sans-serif', transition: 'all 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.1)'; el.style.borderColor = 'rgba(255,255,255,0.3)'; el.style.color = '#fff'; el.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.06)'; el.style.borderColor = 'rgba(255,255,255,0.12)'; el.style.color = 'rgba(255,255,255,0.8)'; el.style.transform = 'translateY(0)'; }}>
              <Music2 size={17} />
              I'm a Creator
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: 'flex', gap: 0, justifyContent: 'center' }}>
            {[['340+','Verified Creators'],['89','Businesses'],['₹12L+','Paid to Creators'],['48hr','Avg Launch']].map(([n,l], i) => (
              <div key={l} style={{ textAlign: 'center', padding: '0 36px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 34, color: '#f5f0e8', letterSpacing: '0.04em', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 8, fontFamily: 'DM Mono, monospace' }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, #000)', pointerEvents: 'none', zIndex: 2 }} />
      </section>

      {/* ── STORY SCROLL CHAPTERS ─────────────────────────────────── */}
      <FlowArt aria-label="HUM story">

        {/* Ch 1 — Dark — The Problem */}
        <FlowSection aria-label="The problem" style={{ backgroundColor: '#080806', color: '#f5f0e8' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.55)', margin: 0 }}>01 — The Problem</p>

            <div>
              <div style={{ width: 48, height: 2, background: '#c9a84c', marginBottom: 32 }} />
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(52px,9vw,120px)', fontWeight: 400, lineHeight: 0.88, letterSpacing: '0.02em', margin: '0 0 40px' }}>
                Kashmir<br />Business<br />Is Stuck<br />
                <span style={{ color: '#c9a84c', opacity: 0.7 }}>Offline</span>
              </h2>
              <p style={{ fontSize: 'clamp(15px,1.6vw,18px)', fontWeight: 300, lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', maxWidth: '44ch', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
                The businesses that survive the next decade will be the ones that own their digital narrative today. Most Kashmir businesses have zero strategy.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '4vw', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '3vw' }}>
              {[['80%','of Kashmir businesses have zero digital marketing strategy'],['₹0','earned by most local creators from brands that need them'],['Weeks','wasted finding the right creator through WhatsApp']].map(([n,d]) => (
                <div key={n} style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px,3.5vw,52px)', color: '#c9a84c', letterSpacing: '0.04em', lineHeight: 1, marginBottom: 12 }}>{n}</div>
                  <p style={{ fontSize: 'clamp(13px,1.2vw,15px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif', fontWeight: 300, margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </FlowSection>

        {/* Ch 2 — Cream — How HUM Works (merged digitizer) */}
        <FlowSection aria-label="How HUM works" style={{ backgroundColor: '#f5f0e8', color: '#000' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace', color: 'rgba(0,0,0,0.5)', margin: 0 }}>02 — How HUM Works</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6vw', alignItems: 'center', flex: 1, padding: '4vw 0' }}>
              {/* Left — headline + steps */}
              <div>
                <div style={{ width: 40, height: 1, background: 'rgba(0,0,0,0.2)', marginBottom: 28 }} />
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', fontWeight: 400, lineHeight: 0.92, letterSpacing: '0.02em', marginBottom: 32, color: '#000' }}>
                  Your Business,<br />Digitized<br />& Connected
                </h2>
                <p style={{ fontSize: 'clamp(14px,1.4vw,16px)', fontWeight: 300, color: 'rgba(0,0,0,0.55)', lineHeight: 1.75, marginBottom: 40, fontFamily: 'Manrope, sans-serif' }}>
                  The moment you join HUM, Claude AI maps your business to Kashmir's creator network. Data flows in real time.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {[
                    [Building2,'01','Business joins HUM','Sign up in 2 minutes. Claude builds your creator marketing strategy instantly.'],
                    [Sparkles,'02','AI writes your campaign','Describe your goal in plain language. Claude generates a full campaign brief and KPIs.'],
                    [Users,'03','Creators apply','Verified Kashmir creators see your campaign. AI ranks them by fit and engagement.'],
                    [BarChart3,'04','Track real ROI','Monitor reach and conversions from your dashboard. Know exactly what your campaign is worth.'],
                  ].map(([Icon, step, title, desc]: any) => (
                    <div key={step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={16} color="#c9a84c" />
                      </div>
                      <div>
                        <div style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', marginBottom: 3 }}>{step}</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#000', marginBottom: 4, fontFamily: 'Manrope, sans-serif' }}>{title}</div>
                        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', lineHeight: 1.6, fontFamily: 'Manrope, sans-serif', fontWeight: 300 }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right — digitizer */}
              <div style={{ background: '#000', borderRadius: 20, padding: '8% 6%', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
                <BusinessDigitizer width="100%" height="100%" />
              </div>
            </div>
          </div>
        </FlowSection>

        {/* Ch 3 — Dark — The Vision */}
        <FlowSection aria-label="The vision" style={{ backgroundColor: '#080806', color: '#f5f0e8' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.55)', margin: 0 }}>03 — The Vision</p>

            <div>
              <div style={{ width: 40, height: 1, background: 'rgba(201,168,76,0.4)', marginBottom: 32 }} />
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(52px,9vw,120px)', fontWeight: 400, lineHeight: 0.88, letterSpacing: '0.02em', marginBottom: 32 }}>
                Kashmir's<br />Creator<br />
                <span style={{ color: '#c9a84c' }}>Economy</span>
              </h2>
              <p style={{ fontSize: 'clamp(15px,1.6vw,18px)', fontWeight: 300, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', maxWidth: '44ch', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
                The businesses that survive the next decade will own their creator marketing strategy today. HUM is the infrastructure that makes that happen — Kashmir-first, AI-powered, creator-led.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2vw', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '3vw' }}>
              {[
                [Zap,'Future-Proof','Creator marketing is how brands survive the next decade.'],
                [Target,'Local-First','Every creator is verified and Kashmir-based.'],
                [Sparkles,'AI-Powered','Claude handles strategy so you focus on your business.'],
              ].map(([Icon, title, desc]: any) => (
                <div key={title} style={{ padding: '24px 0' }}>
                  <Icon size={20} color="#c9a84c" style={{ marginBottom: 14 }} />
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#f5f0e8', marginBottom: 8, fontFamily: 'Manrope, sans-serif', letterSpacing: '0.02em' }}>{title}</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, fontFamily: 'Manrope, sans-serif', fontWeight: 300, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FlowSection>

        {/* Ch 4 — Cream — Testimonials */}
        <FlowSection aria-label="What businesses say" style={{ backgroundColor: '#f5f0e8', color: '#000' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace', color: 'rgba(0,0,0,0.5)', margin: 0 }}>04 — What Businesses Say</p>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4vw 0' }}>
              <div style={{ width: 40, height: 1, background: 'rgba(0,0,0,0.2)', marginBottom: 28 }} />
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,72px)', fontWeight: 400, lineHeight: 0.92, letterSpacing: '0.02em', marginBottom: 48, color: '#000' }}>
                Real Kashmir<br />Businesses,<br />Real Results
              </h2>
              <CircularTestimonials testimonials={TESTIMONIALS} autoplay dark={false} />
            </div>
          </div>
        </FlowSection>

        {/* Ch 5 — Gold — Final CTA */}
        <FlowSection aria-label="Join HUM" style={{ backgroundColor: '#c9a84c', color: '#000' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace', color: 'rgba(0,0,0,0.55)', margin: 0 }}>05 — Join HUM</p>

            <div>
              <div style={{ width: 40, height: 1, background: 'rgba(0,0,0,0.2)', marginBottom: 32 }} />
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(52px,9vw,120px)', fontWeight: 400, lineHeight: 0.88, letterSpacing: '0.02em', marginBottom: 28, color: '#000' }}>
                The Future<br />Belongs To<br />Those Who<br />Build Today
              </h2>
              <p style={{ fontSize: 'clamp(15px,1.6vw,18px)', fontWeight: 300, lineHeight: 1.75, color: 'rgba(0,0,0,0.6)', maxWidth: '44ch', marginBottom: 48, fontFamily: 'Manrope, sans-serif' }}>
                Join Kashmir's creator economy platform. Whether you're a business ready to grow or a creator ready to earn — HUM is where it starts.
              </p>
              {/* Dual CTA */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button onClick={onSelectBusiness}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#000', color: '#f5f0e8', border: 'none', borderRadius: 9999, padding: '18px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.03em', fontFamily: 'Manrope, sans-serif', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1a1a1a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#000'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                  <Building2 size={18} />
                  I'm a Business
                  <ArrowRight size={16} />
                </button>
                <button onClick={onSelectCreator}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', color: 'rgba(0,0,0,0.7)', border: '2px solid rgba(0,0,0,0.25)', borderRadius: 9999, padding: '18px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.03em', fontFamily: 'Manrope, sans-serif', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.5)'; (e.currentTarget as HTMLElement).style.color = '#000'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.25)'; (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.7)'; }}>
                  <Music2 size={18} />
                  I'm a Creator
                </button>
              </div>
            </div>

            {/* Footer strip */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: '2vw', borderTop: '1px solid rgba(0,0,0,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, letterSpacing: '0.1em', color: '#000' }}>HUM</span>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#000', opacity: 0.4 }} />
                <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', fontFamily: 'DM Mono, monospace' }}>Kashmir's Creator Economy Platform</span>
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                {['For Businesses','For Creators','Privacy'].map(l => (
                  <span key={l} style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', cursor: 'pointer', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em' }}>{l}</span>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', fontFamily: 'DM Mono, monospace' }}>© 2025 HUM. Built at Buildify Kashmir.</div>
            </div>
          </div>
        </FlowSection>
      </FlowArt>

      {/* Bottom marquee */}
      <div style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '13px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'marquee 28s linear infinite' }}>
          {Array(4).fill(['FUTURE-PROOF YOUR BRAND','AI-MATCHED CAMPAIGNS','VERIFIED KASHMIR CREATORS','LAUNCH IN 48 HOURS','REAL ROI TRACKING']).flat().map((t, i) => (
            <span key={i} style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.22em' }}>
              {t} <span style={{ color: '#c9a84c', margin: '0 14px' }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
