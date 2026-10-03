import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PPTSection from '../components/sections/PPTSection';

import { ScratchCard } from '../components/ui/ScratchCard';
import { InternshipTicket } from '../components/ui/InternshipTicket';
import { useAuth } from '../lib/useAuth';

/* ─── Outcome card ─── */
const OutcomeCard = ({ icon, title, desc, index }) => {
  const colors = ['#eff6ff', '#fdf4ff', '#f0fdf4', '#fffbeb', '#f3e8ff'];
  const iconBg = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, rotate: index % 2 === 0 ? 2 : -2, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', borderColor: '#111' }}
      style={{
        background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 24,
        padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 20,
        cursor: 'default', transition: 'border-color 0.3s ease',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: 16, background: iconBg, border: '1px solid rgba(0,0,0,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
      }}>{icon}</div>
      <div>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{title}</h4>
        <p style={{ fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{desc}</p>
      </div>
    </motion.div>
  );
};

/* ─── Prize tier card ─── */
const PrizeTierCard = ({ rank, title, amount, desc, index, podiumLevel, mobileOrder }) => {
  const isCenter = podiumLevel === 1;
  const heights = { 1: 440, 2: 380, 3: 320 };
  const h = podiumLevel ? heights[podiumLevel] : 280;

  return (
    <motion.div
      className={`podium-item-${mobileOrder}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1, width: '100%',
        border: '2px solid #111', borderRadius: 24, padding: '40px 32px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: isCenter ? '#111' : '#fff', color: isCenter ? '#fff' : '#111',
        cursor: 'default', transition: 'transform 0.3s, box-shadow 0.3s',
        fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: h,
        position: 'relative',
        boxShadow: isCenter ? '0 24px 48px rgba(0,0,0,0.15)' : 'none',
      }}
      whileHover={{ transform: 'translateY(-12px)', boxShadow: isCenter ? '0 32px 64px rgba(0,0,0,0.2)' : '0 20px 40px rgba(0,0,0,0.08)' }}
    >
      {isCenter && (
        <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#111', padding: '6px 16px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 800, border: '2px solid #111', whiteSpace: 'nowrap' }}>
          WINNER
        </div>
      )}
      <div>
        <span style={{ fontSize: '3.5rem', fontWeight: 900, display: 'block', marginBottom: 16, lineHeight: 1, opacity: isCenter ? 1 : 0.8 }}>{rank}</span>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 10 }}>{title}</h3>
        <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: isCenter ? 0.8 : 0.6, marginBottom: 0 }}>{desc}</p>
      </div>
      <div style={{ marginTop: 32 }}>
        <span style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.03em' }}>{amount}</span>
      </div>
    </motion.div>
  );
};

/* ─── Scrolling ticker ─── */
const Ticker = ({ items }) => (
  <div style={{ overflow: 'hidden', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '14px 0', background: '#fff' }}>
    <motion.div
      animate={{ x: [0, -2000] }}
      transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', width: 'max-content' }}
    >
      {[...items, ...items, ...items, ...items].map((t, i) => (
        <span key={i} style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em',
          color: i % 2 === 0 ? '#111' : '#9ca3af', textTransform: 'uppercase',
        }}>
          {t} <span style={{ color: '#d1d5db', marginLeft: '1.5rem' }}>✦</span>
        </span>
      ))}
    </motion.div>
  </div>
);

/* ─── Main Page ─── */
const PrizesPage = () => {
  const user = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const outcomes = [
    { icon: '✈️', title: 'Singapore Science & Innovation Competition', desc: 'Top 3 teams represent India at an international competition in Singapore — all expenses fully covered.' },
    { icon: '💼', title: 'Global Internship', desc: 'Best performers get a fast-track interview for a Global summer internship with dedicated mentorship.' },
    { icon: '💰', title: 'Cash Prize Pool', desc: '₹1,80,000+ distributed across categories — Grand Prize, Runner-ups, and Track Awards.' },
    { icon: '🧠', title: '1:1 Mentorship', desc: 'Direct mentorship sessions with engineers from Microsoft and Igenius AI throughout the event.' },
    { icon: '🎁', title: 'Goodies & Certificates', desc: 'Swag kits, certificates of participation, and surprise perks for all registered teams.' },
  ];

  const tiers = [
    { rank: '01', title: 'Grand Prize', amount: '₹1,00,000', desc: 'The ultimate recognition for the most innovative and impactful solution. Includes Global internship fast-track.' },
    { rank: '02', title: 'First Runner Up', amount: '₹50,000', desc: 'For the team that demonstrated exceptional technical skill and a solid product-market fit.' },
    { rank: '03', title: 'Second Runner Up', amount: '₹30,000', desc: 'Awarded for creativity and a unique approach to solving the problem statement.' },
  ];

  const podiumTiers = [
    { ...tiers[1], podiumLevel: 2, mobileOrder: 2 },
    { ...tiers[0], podiumLevel: 1, mobileOrder: 1 },
    { ...tiers[2], podiumLevel: 3, mobileOrder: 3 },
  ];

  const trackAwards = [
    { icon: '💼', title: 'Trackwise best performers will get internships', amount: '' },
  ];

  const tickerItems = ['₹1.8L+ Prize Pool', 'Global Internship', 'Singapore Trip', '1:1 Mentorship', 'Open Innovation', '17 UN SDGs', 'SRCAS 2026', 'Aug 14'];

  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', background: '#111' }}>
        {/* Grid bg */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 24 }}
          >
            SRCAS HACKATHON 3.0 — 2026
          </motion.p>

          {/* Big heading */}
          <div style={{ overflow: 'hidden', marginBottom: 8 }}>
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(4rem,14vw,12rem)', fontWeight: 900,
                lineHeight: 0.9, letterSpacing: '-0.05em', color: '#fff', margin: 0,
              }}
            >WIN</motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 8 }}>
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(4rem,14vw,12rem)', fontWeight: 900,
                lineHeight: 0.9, letterSpacing: '-0.05em', margin: 0,
                color: 'transparent', WebkitTextStroke: '2px #fff',
              }}
            >MORE.</motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'rgba(255,255,255,0.55)', maxWidth: 520, margin: '32px auto 0', lineHeight: 1.6 }}
          >
            Cash prizes, international trips, internships, cloud credits — and a few surprises we can't spoil yet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ marginTop: 48, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <a href="#outcomes" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', background: '#fff', color: '#111',
              fontSize: '0.85rem', fontWeight: 700, borderRadius: 100,
              textDecoration: 'none', letterSpacing: '0.04em',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Explore Prizes ↓
            </a>
            <a href={user ? "/dashboard" : "/register"} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', background: 'transparent', color: '#fff',
              fontSize: '0.85rem', fontWeight: 700, borderRadius: 100,
              textDecoration: 'none', letterSpacing: '0.04em',
              border: '1.5px solid rgba(255,255,255,0.3)',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
            >
              {user ? "Dashboard" : "Register Now"}
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }}
          />
        </motion.div>
      </div>

      {/* ── TICKER ── */}
      <Ticker items={tickerItems} />

      {/* ── INTERNSHIP TICKET ── */}
      <section style={{ padding: '100px 40px', background: '#fff', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 48 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: '#111' }} />
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', color: '#111', textTransform: 'uppercase', margin: 0 }}>Grand Prize</p>
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.6rem,5vw,4.4rem)', fontWeight: 900,
            lineHeight: 1.0, letterSpacing: '-0.045em', color: '#111', margin: 0,
          }}>
            The ticket{' '}
            <span style={{ WebkitTextStroke: '2.5px #111', color: 'transparent' }}>everyone wants.</span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <InternshipTicket />
        </motion.div>
      </section>

      {/* ── OUTCOMES ── */}
      <section id="outcomes" style={{ padding: '100px 40px', background: '#f9f9f9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 64 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: '#111' }} />
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', color: '#111', textTransform: 'uppercase', margin: 0 }}>What you win</p>
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2.6rem,5vw,4.4rem)', fontWeight: 900,
              lineHeight: 1.0, letterSpacing: '-0.045em', color: '#111', margin: 0,
            }}>
              Beyond the{' '}
              <span style={{ WebkitTextStroke: '2.5px #111', color: 'transparent' }}>trophy.</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#6b7280', maxWidth: 520, marginTop: 14, lineHeight: 1.6 }}>
              Top 3 teams fly to Singapore. Best performers land Global internships. Everyone ships something real.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {outcomes.map((o, i) => <OutcomeCard key={i} {...o} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── PRIZE TIERS ── */}
      <section style={{ padding: '100px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 64 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: '#111' }} />
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', color: '#111', textTransform: 'uppercase', margin: 0 }}>Cash prizes</p>
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2.6rem,5vw,4.4rem)', fontWeight: 900,
              lineHeight: 1.0, letterSpacing: '-0.045em', color: '#111', margin: 0,
            }}>
              Win more than{' '}
              <span style={{ WebkitTextStroke: '2.5px #111', color: 'transparent' }}>bragging rights.</span>
            </h2>
          </motion.div>

          <div className="prize-podium" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '24px' }}>
            {podiumTiers.map((t, i) => (
              <PrizeTierCard key={i} {...t} index={i} />
            ))}
          </div>

          {/* Track awards */}
          {/* <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginTop: 48 }}
          >
            <div style={{ borderBottom: '3px solid #111', paddingBottom: 12, marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>Track Awards</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 16 }}>
              {trackAwards.map((a, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ scale: 1.02, background: '#111', color: '#fff' }}
                  style={{
                    background: '#f5f5f5', padding: '24px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderRadius: 12, cursor: 'default', transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: '1.4rem' }}>{a.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{a.title}</span>
                  </div>
                  <span style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em' }}>{a.amount}</span>
                </motion.div>
              ))}
            </div>
          </motion.div> */}
        </div>
      </section>

      {/* ── SCRATCH CARD ── */}
      <section style={{ padding: '100px 40px', background: '#111' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 48 }}
          >
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 16 }}>
              Mystery Benefit
            </p>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2.2rem,4vw,3.6rem)', fontWeight: 900,
              lineHeight: 1.05, letterSpacing: '-0.04em', color: '#fff', margin: 0,
            }}>
              Something's hiding{' '}
              <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.6)', color: 'transparent' }}>in here.</span>
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', marginTop: 14, lineHeight: 1.6 }}>
              Scratch to reveal a mystery benefit. Not all prizes are announced.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ScratchCard />
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="register" style={{ padding: '120px 40px', background: '#fff', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.24em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: 20 }}>
            Aug 14, 2026 · SRCAS, Coimbatore
          </p>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.6rem,6vw,5rem)', fontWeight: 900,
            lineHeight: 1.0, letterSpacing: '-0.045em', color: '#111',
            margin: '0 0 32px',
          }}>
            Ready to claim<br />
            <span style={{ WebkitTextStroke: '2.5px #111', color: 'transparent' }}>your reward?</span>
          </h2>
          <motion.a
            href={user ? "/dashboard" : "/register"}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 40px', background: '#111', color: '#fff',
              fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', borderRadius: 100, textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            {user ? "📊 My Dashboard" : "🚀 Register Now"}
          </motion.a>
        </motion.div>
      </section>

      {/* <PPTSection /> */}
      <style>{`
        @media (max-width: 768px) {
          .prize-podium { flex-direction: column !important; align-items: stretch !important; gap: 24px !important; }
          .podium-item-1 { order: 1; }
          .podium-item-2 { order: 2; }
          .podium-item-3 { order: 3; }
        }
        @media (max-width: 640px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default PrizesPage;
