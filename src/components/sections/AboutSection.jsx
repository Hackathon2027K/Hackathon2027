import { useEffect, useRef, useState } from 'react';
import { theme } from '../../theme';
import MagnetLines from '../ui/MagnetLines';
import { motion } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton';

const STATS = [
  { value: '24h', label: 'Intense Hacking' },
  { value: 'National', label: 'National Level' },
  { value: '17', label: 'UN SDGs' },
  { value: 'Open', label: 'Innovation' },
];

const PILLARS = [
  {
    id: 'open-innovation',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 2L18 6L14 10M14 26L10 22L14 18" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 14L6 10L10 14M26 14L22 18L18 14" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="14" r="4" stroke="#111" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Open Innovation',
    body: 'The floor is completely open to your original ideas. Build anything that creates real-world impact.',
  },
  {
    id: 'real-world-impact',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="11" stroke="#111" strokeWidth="1.5" />
        <path d="M14 3C14 3 20 10 14 14C8 18 14 25 14 25" stroke="#111" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <line x1="3" y1="14" x2="25" y2="14" stroke="#111" strokeWidth="1.2" />
      </svg>
    ),
    title: 'Real-world Impact',
    body: 'Build scalable, tech-driven solutions aligned with the 17 UN Sustainable Development Goals.',
  },
  {
    id: 'tech-leadership',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="6" y="6" width="16" height="16" rx="2" stroke="#111" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="3" fill="#111" />
        <path d="M14 1L14 4M14 24L14 27M1 14L4 14M24 14L27 14" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Tech Leadership',
    body: 'Defined not just by the code you write, but by the global problems you solve.',
  },
];

export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.about-animate');
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity ${theme.transitions.slow}, transform ${theme.transitions.slow}`;
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const styles = {
    section: {
      position: 'relative',
      padding: '80px 2.5rem 60px',
      backgroundColor: theme.colors.bg,
      maxWidth: '100%',
      margin: '0 auto',
      overflow: 'hidden',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      opacity: 0.4,
      pointerEvents: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3Cpath d='M3 3 L13 13' stroke='%23000' stroke-opacity='0.05' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: '80px 80px',
      zIndex: 0,
    },
    innerWrap: {
      maxWidth: '1440px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
    },
    intro: {
      marginBottom: '80px',
    },
    introInner: {
      width: '100%',
    },
    label: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.2em',
      color: theme.colors.textMuted,
      marginBottom: '1.5rem',
    },
    heading: {
      fontFamily: theme.fonts.heading,
      fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
      marginBottom: '3rem',
      color: theme.colors.textPrimary,
    },
    introCols: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr auto',
      gap: '2.5rem',
      alignItems: 'stretch',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0,0,0,0.05)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    bodyText: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
      color: theme.colors.textSecondary,
    },
    statsWrap: {
      margin: '60px 0 100px',
      padding: '40px 3rem',
      borderTop: `1px solid ${theme.colors.border}`,
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '2rem',
      flexWrap: 'wrap',
    },
    stat: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: 800,
      color: theme.colors.textPrimary,
      letterSpacing: '-0.02em',
    },
    statLabel: {
      fontSize: '0.875rem',
      color: theme.colors.textMuted,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    divider: {
      height: '1px',
      background: theme.colors.border,
      marginBottom: '80px',
    },
    pillarsWrap: {
      marginBottom: '80px',
    },
    pillarsLabel: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.2em',
      color: theme.colors.textMuted,
      marginBottom: '3rem',
    },
    pillars: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2.5rem',
    },
    pillar: {
      padding: '3rem',
      background: '#fcfcfc',
      border: '1px solid #f0f0f0',
      borderRadius: '12px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    pillarIcon: {
      marginBottom: '2rem',
      display: 'inline-flex',
      padding: '1rem',
      background: '#fff',
      borderRadius: '50%',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    pillarTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      marginBottom: '1rem',
      color: theme.colors.textPrimary,
    },
    pillarBody: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: theme.colors.textSecondary,
    },
    ctaRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      marginTop: '80px',
      flexWrap: 'wrap',
    },
    ctaLink: {
      fontSize: '1rem',
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: theme.colors.textPrimary,
      transition: 'gap 0.2s ease',
    },
    ctaBtn: {
      padding: '1.25rem 3rem',
      background: theme.colors.btnBg,
      color: theme.colors.btnText,
      fontWeight: 700,
      borderRadius: '8px',
      transition: 'background 0.2s ease, transform 0.2s ease',
    }
  };

  return (
    <section style={styles.section} id="about" ref={sectionRef} aria-labelledby="about-heading">
      <div style={styles.overlay} />
      <div style={styles.innerWrap}>
        <div style={styles.intro}>
          <div style={styles.introInner}>
            <p style={styles.label} className="about-animate">ABOUT THE HACKATHON</p>
            <h2 style={{ ...styles.heading, marginBottom: '5rem' }} className="about-animate" id="about-heading">
              What's Next <span style={{color: '#1264dfff'}}>Big Idea? </span> 
            </h2>
            <div style={styles.introCols} className="about-cols-mobile">
              <motion.div 
                className="about-animate"
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                transition={{ duration: 0.3 }}
                style={styles.card}
              >
                <p style={styles.label}>THE VISION</p>
                <h2 style={{ ...styles.heading, fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '2rem' }}>
                  Building the Future
                </h2>
                <p style={styles.bodyText}>
                  We believe that the next generation of tech leaders will be defined not just by the code they write, but by the global problems they solve. In collaboration with Microsoft and Igenius AI, SRCAS is hosting a premier national-level hackathon dedicated to open innovation and real-world impact.
                </p>
              </motion.div>
              <motion.div 
                className="about-animate" 
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                transition={{ duration: 0.3 }}
                style={{ ...styles.card, transitionDelay: '0.1s' }}
              >
                <p style={styles.label}>THE CHALLENGE</p>
                <h2 style={{ ...styles.heading, fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '2rem' }}>
                  Code for the SDGs
                </h2>
                <p style={styles.bodyText}>
                  Your mission is to build scalable, tech-driven solutions aligned with the 17 UN Sustainable Development Goals. While sample problem statements will be provided, the floor is completely open to your original ideas. If you have a vision to change the world, we want you to build it here.
                </p>
              </motion.div>
            <div
              className="about-animate about-magnet"
              style={{
                transitionDelay: '0.2s',
                background: '#f7f7f7',
                border: '1px solid #ebebeb',
                borderRadius: '16px',
                padding: '28px',
                overflow: 'hidden',
                display: 'inline-flex',
              }}
            >
              <MagnetLines
                rows={10}
                columns={5}
                containerSize="280px"
                lineColor="#222222"
                lineWidth="1.5px"
                lineHeight="41px"
                baseAngle={-10}
              />
            </div>
            </div>
          </div>
        </div>

        <div style={styles.statsWrap} className="about-animate">
          <div style={styles.stats}>
            {STATS.map((s) => (
              <div style={styles.stat} key={s.value}>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            flexWrap: 'wrap', marginTop: 16,
          }}
        >
          {/* <MagneticButton href="#problems" variant="dark" size="lg">
            Explore Problems
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </MagneticButton>
          <MagneticButton href="#prizes" variant="outline" size="lg">
            View Prizes
          </MagneticButton> */}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .about-cols-mobile { grid-template-columns: 1fr 1fr !important; }
          .about-magnet { display: none !important; }
        }
        @media (max-width: 1024px) {
          .about-cols-mobile { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
        @media (max-width: 768px) {
          .about-cta-mobile { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </section>
  );
}
