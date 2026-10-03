import React, { useState, useEffect } from 'react';
import copyflagImg from '../../assets/skewcards/copyflag.png';
import revoraImg from '../../assets/skewcards/revorahealth.png';
import SpoilSafeImg from '../../assets/skewcards/SpoilSafe.png';

const cards = [
  {
    title: 'CopyFlag',
    desc: 'CopyFlag is addressing a growing challenge in the generative AI era, where original work can be copied, modified, and redistributed at scale. The startup has built a platform that uses multimodal vision models to detect both direct copies and AI-modified designs across the internet. Combined with vector search through Azure AI Search, it identifies infringements at scale and automatically initiates takedowns, making intellectual property protection accessible to the creators who need it most.',
    gradientFrom: '#ffbc00',
    gradientTo: '#ff0058',
    img: copyflagImg,
  },
  {
    title: 'Revora Health',
    desc: 'Revora Health is changing how recovery is experienced beyond the clinic. The startup has built a solution that combines computer vision with multimodal AI to deliver real-time movement analysis and personalized guidance. Built on Azure AI, it enables continuous feedback and support, helping patients recover with greater confidence while extending care beyond scheduled sessions.',
    gradientFrom: '#03a9f4',
    gradientTo: '#ff0058',
    img: revoraImg,
  },
  {
    title: 'SpoilSafe',
    desc: 'SpoilSafe brings real-time visibility to food freshness across the cold chain. The startup has built a system that uses low-cost sensors to detect gases like ethylene and ammonia, paired with machine learning models on Azure to predict spoilage in real time. This shift allows teams to move from reactive monitoring to proactive decision-making, with clear insight into what is at risk and what action to take.',
    gradientFrom: '#4dff03',
    gradientTo: '#00d0ff',
    img: SpoilSafeImg,
  },
];

function SkewCard({ title, desc, gradientFrom, gradientTo, img, forceActive }) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || forceActive;

  return (
    <div
      style={{ position: 'relative', width: '340px', height: '520px', transition: 'all 0.5s', display: 'flex', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Skewed gradient solid panel */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          height: '100%',
          borderRadius: '12px',
          background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
          transform: active ? 'skewX(0deg)' : 'skewX(15deg)',
          left: active ? '20px' : '50px',
          width: active ? 'calc(100% - 40px)' : '55%',
          transition: 'all 0.5s ease',
        }}
      />
      {/* Blurred glow panel */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          height: '100%',
          borderRadius: '12px',
          background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
          transform: active ? 'skewX(0deg)' : 'skewX(15deg)',
          left: active ? '20px' : '50px',
          width: active ? 'calc(100% - 40px)' : '55%',
          transition: 'all 0.5s ease',
          filter: 'blur(30px)',
          opacity: 0.8,
        }}
      />

      {/* Glass content card */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          left: active ? '-15px' : '0px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
          borderRadius: '16px',
          color: '#111',
          transition: 'left 0.5s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Image — grayscale → color on hover */}
        <div style={{ width: '100%', height: '160px', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={img}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: active ? 'grayscale(0%)' : 'grayscale(100%)',
              transition: 'filter 0.5s ease',
            }}
          />
        </div>

        {/* Text */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ marginBottom: '12px', fontSize: '22px', fontWeight: 800, letterSpacing: '0.01em' }}>{title}</h2>
          <p style={{ fontSize: '13px', lineHeight: 1.75, fontWeight: 500, color: '#374151' }}>{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function SkewCards() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-advance every 4 seconds on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % cards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div style={{ background: '#fff', padding: '96px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 64px auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#111', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '20px' }}>
            Three Startups Advance to the Imagine Cup World Championship
          </h2>
          <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.75, fontWeight: 400 }}>
            Meet the three World Finalists of the Microsoft Imagine Cup, student founders who have shown standout innovation, clarity of vision, and real momentum behind what they are building.
            <br /><br />
            Next stop: the World Championship, where their ideas take the global stage.
          </p>
        </div>

        {/* ── Desktop: all 3 side by side ── */}
        <div className="skewcards-desktop" style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap', gap: '80px' }}>
          {cards.map((card, idx) => (
            <SkewCard key={idx} {...card} />
          ))}
        </div>

        {/* ── Mobile: carousel one at a time ── */}
        <div className="skewcards-mobile" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          {/* Single card display */}
          <div style={{ width: '100%', maxWidth: '340px', overflow: 'hidden' }}>
            <div
              style={{
                display: 'flex',
                width: `${cards.length * 340}px`,
                transform: `translateX(-${activeIdx * 340}px)`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {cards.map((card, idx) => (
                <SkewCard key={idx} {...card} forceActive={idx === activeIdx} />
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                style={{
                  width: idx === activeIdx ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '100px',
                  background: idx === activeIdx ? '#111' : '#d1d5db',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <a
            href="https://aka.ms/2026ImagineCupWorldFinalists"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#111',
              color: '#fff',
              padding: '14px 36px',
              borderRadius: '100px',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.18)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; }}
          >
            Meet the World Finalists
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translate(-10px); }
        }
        .animate-blob { animation: blob 2s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: -1s; }

        /* Mobile: show carousel, hide desktop grid */
        @media (max-width: 768px) {
          .skewcards-desktop { display: none !important; }
          .skewcards-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
