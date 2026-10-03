import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, Headphones, Minus, Plus, Send } from 'lucide-react';
import PPTSection from '../components/sections/PPTSection';

const faqs = [
  {
    question: "How do I register?",
    answer: (
      <>
        <strong>Note: Only the Team Leader should register!</strong> You can register through the official hackathon registration portal at{" "}
        <a
          href="https://www.hackathon2026.in/register"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          https://www.hackathon2026.in/register
        </a>
        . Once registered, the Team Leader can add their team members directly from their dashboard. Team members do not need separate accounts.
      </>
    ),
  },
  {
    question: "Who can participate in the SRCAS Hackathon 3.0?",
    answer:
      "The hackathon is open to all students, regardless of skill level. Whether you're a beginner exploring your first project or an experienced developer, you're welcome to participate.",
  },
  {
    question: "How many team members do I need?",
    answer:
      "Each team must have a minimum of 2 and a maximum of 4 members. Solo participation is not permitted.",
  },
  {
    question: "Can team members be from different colleges?",
    answer:
      "No. All team members must belong to the same college. However, students from different departments within the same college are allowed to form a team. Cross-college teams are not permitted for SRCAS Hackathon 3.0.",
  },
  {
    question: "Who is eligible to participate in the hackathon?",
    answer:
      "Any undergraduate or postgraduate student currently enrolled in a recognized institution is eligible to participate. No prior hackathon experience is required.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "No, participation is completely free. We believe innovation should be accessible to everyone.",
  },
  {
    question: "What should I bring to the SRCAS Hackathon 3.0?",
    answer:
      "Please bring your laptop, charger, any hardware required for your project, and lots of creativity. Food, refreshments, Wi-Fi, and a comfortable workspace will be provided by the organizers.",
  },
  {
    question: "Are we allowed to use AI tools or \"vibe code\" during the hackathon?",
    answer:
      "Yes! \"Vibe coding\" (using AI assistants to generate and shape your code) is officially allowed during the 24-hour hackathon. We encourage using modern tools to build faster, as long as the actual development and logic are implemented during the event.",
  },
  {
    question: "We are building an IoT/Hardware project. Do we have to build the hardware from scratch during the 24 hours?",
    answer:
      "No. Hardware teams may procure their required devices, sensors, and microcontrollers and test them before the hackathon begins. However, during the 24-hour hackathon window, you must develop the software application from scratch, integrate it with your hardware, and demonstrate the fully working IoT solution.",
  },
  {
    question: "Can I start working on my project before the event?",
    answer:
      "For software projects, no. All coding must start at the event. For hardware projects, you may procure and test devices beforehand, but software integration must happen during the 24 hours.",
  },
  {
    question: "How are the winners selected?",
    answer:
      "Projects will be evaluated by a panel of industry experts based on innovation, technical complexity, practical applicability, impact, and presentation quality.",
  },
  {
    question: "Will the hackathon be in person or online?",
    answer:
      "The Idea Nation round will be conducted online. Teams shortlisted for the final round must be present on campus to participate in the 24-hour hackathon and final project evaluation.",
  },
];

const FaqItem = ({ faq, isOpen, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-20px' }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    style={{
      borderBottom: index === faqs.length - 1 ? 'none' : '1px solid #f3f4f6',
      overflow: 'hidden',
    }}
  >
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 0',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        outline: 'none',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {isOpen && (
          <div style={{ width: '3px', height: '24px', background: '#111', borderRadius: '4px', marginTop: '2px' }} />
        )}
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          color: '#111',
          fontSize: '1.05rem',
          letterSpacing: '-0.01em',
          lineHeight: 1.4,
          paddingLeft: isOpen ? 0 : '19px'
        }}>
          {faq.question}
        </span>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          flexShrink: 0,
          width: 28, height: 28,
          borderRadius: '50%',
          border: isOpen ? 'none' : '1px solid #e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isOpen ? '#fff' : '#111',
          background: isOpen ? '#111' : '#fff',
        }}
      >
        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
      </motion.div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
        >
          <p style={{
            padding: '0 48px 24px 19px',
            color: '#6b7280',
            lineHeight: 1.7,
            fontSize: '0.95rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            margin: 0,
          }}>
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// CSS-based Laptop & Coffee illustration
const LaptopGraphic = () => (
  <div style={{ position: 'relative', marginTop: '40px', width: '100%', height: '220px', marginLeft: '-20px' }}>
    <motion.div 
      animate={{ y: [0, -6, 0] }} 
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      style={{ position: 'absolute', left: '10%', top: '20%' }}
    >
      <div style={{ width: '200px', height: '130px', background: '#fff', border: '8px solid #111', borderRadius: '12px 12px 0 0', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', height: '24px', background: '#f3f4f6', borderRadius: '6px' }} />
        <div style={{ position: 'absolute', top: '50px', left: '15px', right: '40px', height: '24px', background: '#f3f4f6', borderRadius: '6px' }} />
        <div style={{ position: 'absolute', top: '85px', left: '15px', right: '70px', height: '24px', background: '#f3f4f6', borderRadius: '6px' }} />
      </div>
      <div style={{ width: '240px', height: '18px', background: '#e5e7eb', marginLeft: '-20px', borderRadius: '0 0 12px 12px', position: 'relative', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
         <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '50px', height: '5px', background: '#9ca3af', borderRadius: '0 0 4px 4px' }} />
      </div>
    </motion.div>

    <motion.div style={{ position: 'absolute', bottom: '0%', left: '0%', zIndex: 2 }}>
      <div style={{ width: '45px', height: '50px', background: '#fff', borderRadius: '4px 4px 12px 12px', boxShadow: '0 8px 16px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '12px', right: '-12px', width: '16px', height: '24px', border: '5px solid #fff', borderRadius: '8px', zIndex: -1, boxShadow: 'inset 0 0 0 1px #f3f4f6, 0 8px 16px rgba(0,0,0,0.08)' }} />
        <div style={{ position: 'absolute', top: '5px', left: '5px', right: '5px', height: '8px', background: '#111', borderRadius: '50%' }} />
      </div>
    </motion.div>

    <motion.div 
      animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }} 
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      style={{ position: 'absolute', top: '35%', right: '5%', background: '#111', borderRadius: '16px 16px 16px 4px', padding: '14px', display: 'flex', gap: '5px', boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
    >
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
    </motion.div>
  </div>
);

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" style={{
      position: 'relative',
      backgroundColor: '#fdfdfd',
      overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* Subtle dot grid */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '100px 48px 0',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* ── TOP SECTION ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '64px',
          alignItems: 'center',
          marginBottom: '100px',
        }} className="faq-top-grid">
          
          {/* Top Left: Heading & Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '24px', height: '1px', background: '#d1d5db' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', color: '#4b5563' }}>SUPPORT HUB</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              fontWeight: 900,
              color: '#111',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              margin: '0 0 16px',
            }}>
              Everything you<br/>need, all in one<br/>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                place!
                <svg width="100%" height="20" viewBox="0 0 120 20" style={{ position: 'absolute', bottom: '-10px', left: 0, overflow: 'visible' }}>
                  <path d="M5 15 Q 40 5, 115 15" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                  <path d="M100 0 L 115 15" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                  <path d="M100 25 L 115 15" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p style={{
              fontSize: '1.05rem',
              color: '#6b7280',
              lineHeight: 1.6,
              maxWidth: 480,
              marginTop: '32px'
            }}>
              Empowering your hacker journey with the right tools, guidance, and community. Reach out anytime to learn, collaborate, and grow together.
            </p>
          </motion.div>

          {/* Top Right: Circular Graphic */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', height: '360px', alignItems: 'center' }}>
            <div style={{ position: 'absolute', right: '40px', top: '0px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
            </div>
            
            <div style={{ position: 'relative', width: 320, height: 320 }}>
              {/* Dashed rings */}
              <div style={{ position: 'absolute', inset: 0, border: '1px dashed #d1d5db', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', inset: 50, border: '1px dashed #e5e7eb', borderRadius: '50%' }} />
              
              {/* Small floating icon containers */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ position: 'absolute', top: 10, left: 30, background: '#fff', borderRadius: '50%', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                <Users size={24} color="#6b7280" strokeWidth={1.5} />
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }} style={{ position: 'absolute', top: 40, right: -10, background: '#fff', borderRadius: '50%', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                <FileText size={24} color="#6b7280" strokeWidth={1.5} />
              </motion.div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 2 }} style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: '50%', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                <Headphones size={24} color="#6b7280" strokeWidth={1.5} />
              </motion.div>

              {/* Center ? */}
              <div style={{ position: 'absolute', inset: 60, background: '#fff', borderRadius: '50%', boxShadow: '0 24px 48px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '6rem', fontWeight: 900, color: '#111' }}>?</span>
              </div>

              {/* Overlapping Chat bubble */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}
                style={{ position: 'absolute', bottom: 40, right: 20, background: '#111', borderRadius: '32px 32px 32px 8px', padding: '20px', display: 'flex', gap: '6px', boxShadow: '0 16px 32px rgba(0,0,0,0.2)' }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION: FAQ Accordion ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '64px',
          alignItems: 'start',
        }} className="faq-bottom-grid">

          {/* Left: FAQs label + CTA + Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 style={{
              fontSize: '3rem',
              fontWeight: 900,
              color: '#111',
              letterSpacing: '-0.04em',
              margin: '0 0 12px',
              lineHeight: 1,
            }}>FAQs</h3>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              lineHeight: 1.6,
              margin: '0 0 32px',
              maxWidth: 240,
            }}>
              Can't find what you're after?<br/>Chat with our stellar team!
            </p>
            <a
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 28px',
                background: '#111',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: 100,
                textDecoration: 'none',
                transition: 'transform 0.2s, background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Chat to our team <span style={{ fontSize: '1.2rem' }}>→</span>
            </a>

            <LaptopGraphic />
          </motion.div>

          {/* Right: FAQ Accordion Card */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ 
              background: '#fff', 
              borderRadius: '24px', 
              padding: '32px 40px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.02)'
            }}
          >
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── DARK WAVE BANNER ── */}
      <div style={{ position: 'relative', width: '100%', backgroundColor: '#111', marginTop: '120px', overflow: 'hidden' }}>
        {/* SVG Wave at the top */}
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ position: 'absolute', top: '-1px', left: 0, width: '100%', height: '80px', fill: '#fdfdfd' }}>
          <path d="M0,64L80,74.7C160,85,320,107,480,101.3C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" />
        </svg>

        {/* Topographic background lines (optional simple detail) */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'repeating-radial-gradient(circle at 100% 100%, transparent 0, transparent 40px, #fff 40px, #fff 41px)' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '140px 48px 100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }} className="banner-flex">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className="banner-left">
            {/* Headset Icon in dashed circles */}
            <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ position: 'absolute', inset: 0, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', inset: 15, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '50%' }} />
              <Headphones size={32} color="#fff" strokeWidth={1.5} />
            </div>

            <div>
              <h3 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Still have questions?</h3>
              <p style={{ color: '#9ca3af', fontSize: '1.05rem', margin: 0, lineHeight: 1.6 }}>We're here to help you 24/7.<br/>Let's connect!</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className="banner-right">
            <a href="/contact" style={{ background: '#fff', color: '#111', padding: '16px 32px', borderRadius: '100px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'transform 0.2s', flexShrink: 0 }}
               onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
               onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Chat with us <span style={{ fontSize: '1.4rem' }}>→</span>
            </a>
            
            {/* Paper Plane Graphic */}
            <div style={{ position: 'relative', width: '120px', height: '60px' }} className="hidden md:block">
              <svg width="150" height="60" style={{ position: 'absolute', right: '30px', top: '10px' }}>
                <path d="M150 10 Q 75 60 0 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
              <Send size={36} color="#fff" strokeWidth={1.5} style={{ transform: 'rotate(45deg)', position: 'absolute', right: -10, top: -10 }} />
            </div>
          </div>
        </div>
      </div>

      {/* <PPTSection /> */}

      <style>{`
        @media (max-width: 900px) {
          .faq-top-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .faq-bottom-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .banner-flex { flex-direction: column; align-items: flex-start !important; gap: 40px; }
        }
        @media (max-width: 640px) {
          #faq > div { padding-left: 24px !important; padding-right: 24px !important; }
          .banner-left { flex-direction: column; align-items: flex-start !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}
