import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import meImg from '../assets/my image/me.png';
import handImg from '../assets/my image/hand.png';

// Human Images
import sumathiImg from '../assets/humans/sumathi.png';
import praneeshImg from '../assets/humans/praneesh.png';
import manojImg from '../assets/humans/manoj.png';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const SectionLabel = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
    <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
    <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9ca3af', margin: 0, whiteSpace: 'nowrap' }}>
      {children}
    </p>
    <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
  </div>
);

const studentOrganizers = [
  { name: 'Raghul', role: 'Chairman', org: '@ ProClub SRCAS' },
  { name: 'Dhananjay', role: 'Vice Chairman', org: '@ ProClub SRCAS' },
  { name: 'Nivethika B', role: 'Secretary', org: '@ ProClub SRCAS' },
  { name: 'Dhakshan', role: 'Joint Secretary', org: '@ ProClub SRCAS' },
];

const staffCoordinators = [
  { name: 'Dr.N.Sumathi', role: 'Programming Club Staff Coordinator', org: 'SRCAS', image: sumathiImg },
  { name: 'Dr. M. Praneesh', role: 'Programming Club Staff Coordinator', org: 'SRCAS', image: praneeshImg },
  { name: 'Mr.S.Manoj', role: 'Programming Club Staff Coordinator', org: 'SRCAS', image: manojImg },
];

export default function HumansPage() {
  return (
    <section style={{ paddingTop: '120px', minHeight: '100vh', background: '#fdfdfd' }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(20px, 6vw, 80px) 60px" }}>
        
        {/* Title Section */}
        <div style={{ textAlign: 'left', marginBottom: '80px' }}>
            
            <motion.h1 {...fadeUp(0.1)} style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 900, color: '#111', letterSpacing: '-0.045em', lineHeight: 1.0, margin: '0 0 20px' }}>
                Meet Our
                <br />
                <span style={{ WebkitTextStroke: '2.5px #111', color: 'transparent' }}>Humans</span>
            </motion.h1>
            <motion.p {...fadeUp(0.2)} style={{ fontSize: '1.1rem', color: '#6b7280', maxWidth: 600, margin: '0', lineHeight: 1.6 }}>
                The dedicated team working relentlessly behind the scenes to make SRCAS Hackathon 3.0 an unforgettable experience.
            </motion.p>
        </div>

        {/* 1. Developer Section */}
        <motion.div {...fadeUp(0.3)} style={{ marginBottom: 40 }}>
            <SectionLabel>Developer</SectionLabel>
        </motion.div> 
          
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 80 }}>
          <motion.div
            {...fadeUp(0.4)}
            className="group relative w-full max-w-2xl bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center transition-all duration-500 hover:shadow-[0_16px_48px_-10px_rgba(0,0,0,0.12)]"
            style={{ overflow: 'visible' }}
          >
            {/* Background Decorative Dots top-right */}
            <div className="absolute top-6 right-6 w-16 h-16 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#111 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }} />

            {/* Developer Text Top Left */}
            <div className="absolute top-8 left-8 lg:left-10 flex items-center gap-4 z-20">
              <div className="w-11 h-11 bg-[#111] rounded-[0.8rem] flex items-center justify-center text-white font-mono font-bold text-[1.1rem] shadow-sm">
                &lt;/&gt;
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-[#111] font-extrabold text-[0.85rem] tracking-[0.25em] uppercase">
                  Developer
                </span>
                <div className="w-7 h-[3px] bg-[#111] mt-1.5 rounded-full"></div>
              </div>
            </div>

            {/* Content Wrapper */}
            <div className="w-full flex flex-col items-center justify-center relative" style={{ minHeight: 300, padding: '30px 20px 10px' }}>
              <div className="relative w-full max-w-[480px] flex justify-center items-center mb-4 mt-8">
                {/* Sparkles */}
                <div className="absolute top-12 -right-8 pointer-events-none z-10"><svg viewBox="0 0 24 24" width="28" height="28" fill="#111"><path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" /></svg></div>
                <div className="absolute top-[45%] -left-10 pointer-events-none z-10"><svg viewBox="0 0 24 24" width="18" height="18" fill="#111"><path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" /></svg></div>
                <div className="absolute top-[75%] -right-10 pointer-events-none z-10"><svg viewBox="0 0 24 24" width="14" height="14" fill="#111"><path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" /></svg></div>

                {/* Blob Image */}
                <div className="w-full overflow-hidden bg-gray-900 shadow-xl z-10 transition-all duration-700 group-hover:scale-[1.05]" style={{ borderRadius: '90% 60% 70% 90% / 60% 30% 70% 100%', animation: 'blob 8s ease-in-out infinite' }}>
                  <img src={meImg} alt="Developer" className="w-full h-auto object-contain grayscale transition-all duration-700 group-hover:grayscale-0" />
                </div>

                {/* Say Hi */}
                <div className="absolute -right-32 top-[20%] hidden lg:flex flex-col items-center gap-1 z-20 pointer-events-none">
                  <p className="text-2xl font-bold text-[#0070f3] rotate-6 opacity-0 -translate-y-2 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0" style={{ fontFamily: "'Caveat', 'Dancing Script', cursive" }}>Say Hi!</p>
                  <svg width="40" height="48" viewBox="0 0 32 40" fill="none" className="opacity-0 transition-all duration-500 delay-150 group-hover:opacity-100" stroke="#555" strokeWidth="2" strokeLinecap="round"><path d="M20 2 C24 10 26 20 16 34" /><polyline points="10,30 16,34 18,26" /></svg>
                  <div className="w-40 h-40 flex items-center justify-center opacity-0 scale-50 transition-all duration-500 delay-200 group-hover:opacity-100 group-hover:scale-100 dev-wave-hand" style={{ border: '2px dashed #bbb', borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }}>
                    <img src={handImg} alt="Wave" className="w-24 h-24 drop-shadow-md rotate-[15deg]" />
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="relative z-30 flex items-center gap-1 bg-white rounded-[1.2rem] border border-gray-100" style={{ margin: '20px', padding: '6px', boxShadow: '0 12px 40px -8px rgba(0,0,0,0.14)' }}>
                <a href="https://udhayasankar.vercel.app" target="_blank" rel="noopener noreferrer" className="group/pt flex flex-col items-center justify-center w-20 h-16 rounded-xl hover:bg-gray-50 transition-colors relative overflow-hidden">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700 transition-all duration-300 transform group-hover/pt:-translate-y-2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[0.6rem] font-semibold text-gray-500 opacity-0 group-hover/pt:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/pt:translate-y-0 pointer-events-none">Portfolio</span>
                </a>
                <div className="w-px h-8 bg-gray-100" />
                <a href="https://www.linkedin.com/in/udhayasankaru" target="_blank" rel="noopener noreferrer" className="group/li flex flex-col items-center justify-center w-20 h-16 rounded-xl hover:bg-[#0a66c2]/5 transition-colors relative overflow-hidden">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700 group-hover/li:text-[#0a66c2] transition-all duration-300 transform group-hover/li:-translate-y-2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[0.6rem] font-semibold text-[#0a66c2] opacity-0 group-hover/li:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/li:translate-y-0 pointer-events-none">LinkedIn</span>
                </a>
                <div className="w-px h-8 bg-gray-100" />
                <a href="https://github.com/udhayasankar-UD" target="_blank" rel="noopener noreferrer" className="group/gh flex flex-col items-center justify-center w-20 h-16 rounded-xl hover:bg-gray-50 transition-colors relative overflow-hidden">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700 group-hover/gh:text-black transition-all duration-300 transform group-hover/gh:-translate-y-2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[0.6rem] font-semibold text-gray-700 opacity-0 group-hover/gh:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/gh:translate-y-0 pointer-events-none">GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2. Student Organizers */}
        <motion.div {...fadeUp(0.5)} style={{ marginBottom: 40 }}>
            <SectionLabel>Student Organizers</SectionLabel>
        </motion.div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', marginBottom: 80, padding: '0 10px' }}>
            {studentOrganizers.map((m, i) => (
                <motion.div
                    key={i}
                    {...fadeUp(0.5 + i * 0.1)}
                    whileHover={{ y: -6, boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}
                    style={{
                        position: 'relative',
                        flex: '1 1 240px',
                        maxWidth: '400px',
                        background: '#ffffff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '20px', padding: '20px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                        textAlign: 'center', transition: 'all 0.3s ease',
                        overflow: 'hidden'
                    }}
                >
                    {/* Light Dot Pattern Background */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px', opacity: 1, pointerEvents: 'none' }} />

                    {/* Image Container */}
                    <div style={{ position: 'relative', zIndex: 1, width: '100%', aspectRatio: '1/1', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '16px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 900, color: '#d1d5db', overflow: 'hidden' }}>
                        {m.image ? (
                            <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            m.name[0]
                        )}
                    </div>
                    
                    {/* Text Details */}
                    <h3 style={{ position: 'relative', zIndex: 1, fontSize: '1.25rem', fontWeight: 800, color: '#111', margin: '0 0 8px', letterSpacing: '0.02em' }}>{m.name}</h3>
                    <p style={{ position: 'relative', zIndex: 1, fontSize: '0.85rem', fontWeight: 600, color: '#0070f3', margin: '0 0 4px', lineHeight: 1.5, padding: '0 10px' }}>{m.role}</p>
                    <p style={{ position: 'relative', zIndex: 1, fontSize: '0.8rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>{m.org}</p>
                </motion.div>
            ))}
        </div>

        {/* 3. Staff Coordinators */}
        <motion.div {...fadeUp(0.6)} style={{ marginBottom: 40 }}>
            <SectionLabel>Staff Coordinators</SectionLabel>
        </motion.div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: 40, padding: '0 10px' }}>
            {staffCoordinators.map((m, i) => (
                <motion.div
                    key={i}
                    {...fadeUp(0.6 + i * 0.1)}
                    whileHover={{ y: -6, boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}
                    style={{
                        position: 'relative',
                        background: '#ffffff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '20px', padding: '20px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                        textAlign: 'center', transition: 'all 0.3s ease',
                        overflow: 'hidden'
                    }}
                >
                    {/* Light Dot Pattern Background */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px', opacity: 1, pointerEvents: 'none' }} />

                    {/* Image Container */}
                    <div style={{ position: 'relative', zIndex: 1, width: '100%', aspectRatio: '1/1', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '16px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 900, color: '#d1d5db', overflow: 'hidden' }}>
                        {m.image ? (
                            <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            m.name[0]
                        )}
                    </div>
                    
                    {/* Text Details */}
                    <h3 style={{ position: 'relative', zIndex: 1, fontSize: '1.25rem', fontWeight: 800, color: '#111', margin: '0 0 8px', letterSpacing: '0.02em' }}>{m.name}</h3>
                    <p style={{ position: 'relative', zIndex: 1, fontSize: '0.85rem', fontWeight: 600, color: '#0070f3', margin: '0 0 4px', lineHeight: 1.5, padding: '0 10px' }}>{m.role}</p>
                    <p style={{ position: 'relative', zIndex: 1, fontSize: '0.8rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>{m.org}</p>
                </motion.div>
            ))}
        </div>

      </div>

      <style>{`
        @keyframes blob {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        @keyframes wave {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(20deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(20deg); }
          80% { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }
        .group:hover .dev-wave-hand img {
          animation: wave 1.6s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}</style>
    </section>
  );
}
