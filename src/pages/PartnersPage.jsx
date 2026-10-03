import React from 'react';
import { motion } from 'framer-motion';

import srcasLogo from '../assets/logo/srcas-logo.png';
import programmingClubLogo from '../assets/logo/programming-club-2-logo.png';
import microsoftLogo from '../assets/logo/microsoft.png';
import igeniusLogo from '../assets/logo/igenius.png';

/* ─── Data ─── */
const hostedBy = [
  {
    logo: srcasLogo,
    name: 'Sri Ramakrishna College of Arts and Science',
    label: 'Hosted by',
    description:
      'Sri Ramakrishna College of Arts and Science (SRCAS), Coimbatore, ranked 76th in NIRF 2025, excels in teaching, research, and learning resources. Accredited with NAAC "A+" grade and affiliated to Bharathiar University, SRCAS offers diverse programs and empowers students through innovation and quality education.',
  },
  {
    logo: programmingClubLogo,
    name: 'Programming Club',
    label: 'Hosted by',
    description:
      'Programming club of SRCAS, dedicated to fostering innovation and technical excellence among students. We organize coding competitions, workshops, and hackathons to build a strong developer community.',
  },
];

const partners = [
  {
    logo: igeniusLogo,
    name: 'iGenius AI',
    role: 'Innovation Partner',
  },
  {
    logo: microsoftLogo,
    name: 'Microsoft',
    role: 'Authorized Partner',
  },
];



/* ─── Helpers ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const SectionLabel = ({ children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 32,
    }}
  >
    <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />

    <p
      style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: '#9ca3af',
        margin: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </p>

    <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
  </div>
);

/* ─── Page ─── */
export default function PartnersPage() {
  return (
    <div
      style={{
        background: '#fff',
        color: '#111',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* ── HERO HEADER ── */}
      <section
        style={{
          padding: 'clamp(60px, 10vw, 100px) clamp(20px, 6vw, 80px) 60px',
          position: 'relative',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            {/* Left */}
            <motion.div {...fadeUp(0)} style={{ flex: '1 1 340px' }}>

              <h1
                style={{
                  fontSize: 'clamp(3.4rem, 7vw, 5.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: '-0.045em',
                  margin: '0 0 20px',
                  color: '#111',
                }}
              >
                Our Partners
                <br />

                <span
                  style={{
                    WebkitTextStroke: '2.5px #111',
                    color: 'transparent',
                  }}
                >
                  who Supported
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  lineHeight: 1.7,
                  maxWidth: 420,
                  margin: 0,
                }}
              >
                We are proud to collaborate with visionary organizations that
                share our passion for innovation and technology.
              </p>
            </motion.div>

            {/* Right Badge */}
            
          </div>
        </div>
      </section>

      {/* ── HOSTED BY ── */}
      <section style={{ padding: '80px clamp(20px, 6vw, 80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)} style={{ marginBottom: 40 }}>
            <SectionLabel>Hosted by</SectionLabel>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 400px))',
              justifyContent: 'center',
              gap: 28,
            }}
          >
            {hostedBy.map((h, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                whileHover={{
                  y: -6,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
                }}
                style={{
                  background: '#fff',
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '1.5px solid #e5e7eb',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  cursor: 'default',
                  transition: 'all 0.25s ease',
                  minHeight: 520,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Logo */}
                <div
                  style={{
                    background: '#f9f9f9',
                    height: 220,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 32,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <img
                    src={h.logo}
                    alt={h.name}
                    style={{
                      maxHeight: 100,
                      maxWidth: '80%',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                {/* Content */}
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#9ca3af',
                      marginBottom: 12,
                    }}
                  >
                    {h.label}
                  </p>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#111',
                      margin: '0 0 16px',
                      lineHeight: 1.4,
                    }}
                  >
                    {h.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: '#6b7280',
                      lineHeight: 1.8,
                      margin: 0,
                    }}
                  >
                    {h.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR PARTNERS ── */}
      <section style={{ padding: '0 clamp(20px, 6vw, 80px) 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)} style={{ marginBottom: 40 }}>
            <SectionLabel>Our Partners</SectionLabel>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 530px))',
              justifyContent: 'center',
              gap: 28,
              
            }}
          >
            {partners.map((p, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                whileHover={{ y: -6 }}
                style={{
                  background: '#fff',
                  borderRadius: 22,
                  overflow: 'hidden',
                  border: '1.5px solid #e5e7eb',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  cursor: 'default',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Logo */}
                <div
                  style={{
                    background: '#f9f9f9',
                    height: 440,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 48,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  {p.logo ? (
                    <img
                      src={p.logo}
                      alt={p.name}
                      style={{
                        maxHeight: 180,
                        maxWidth: '80%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 84,
                        height: 84,
                        borderRadius: '50%',
                        background: '#111',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        fontWeight: 900,
                        color: '#fff',
                      }}
                    >
                      {p.initials}
                    </div>
                  )}
                </div>

                {/* Name + role */}
                <div
                  style={{
                    padding: '28px 24px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111', margin: '0 0 8px' }}>
                    {p.name}
                  </p>
                  <p style={{ fontSize: '1rem', color: '#9ca3af', margin: 0, fontWeight: 600 }}>
                    {p.role}
                  </p>
                </div>

              </motion.div>
            ))}
             </div>
            </div>
      </section>

    </div>
  );
}