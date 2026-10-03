import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OfficialPPT from '../../assets/PPT/SRCAS HACKATHON 3.0.pptx';
import ProblemStatementPDF from '../../assets/PS_example/Hackathon Problem Statement 2026.pdf';

const RESOURCES = [
  { icon: '📝', label: 'Official PPT Template', desc: 'Download the required presentation format', tag: 'PPTX', href: OfficialPPT, download: 'SRCAS_HACKATHON_3.0_Template.pptx', color: '#4C9F38' },
  { icon: '📄', label: 'Hackathon Rulebook', desc: 'Official rules and judging criteria', tag: 'PDF', href: '#', color: '#E5243B' },
  { icon: '🧩', label: 'Sample Problem Statements', desc: 'Download the sample problem statements for 2026', tag: 'PDF', href: ProblemStatementPDF, download: 'Hackathon-Problem-Statement-2026.pdf', color: '#8b5cf6' },
  { icon: '🎯', label: 'Problem Statements', desc: 'Explore all 17 SDG challenges', tag: 'Link', href: '/#problems', color: '#E5243B' },
  // { icon: '📱', label: 'Whatsapp Community', desc: 'Connect with organizers all detail share there', tag: 'Link', href: 'https://chat.whatsapp.com/BXFPp6PTWk4I6wG7UMCbAP', color: '#3b82f6' },
  { icon: '🏆', label: 'Prize Details', desc: 'Learn about the cash prizes & awards', tag: 'Link', href: '/#prizes', color: '#f59e0b' },
  // { icon:'📹', label:'Submission Guidelines',     desc:'Guidelines for submission',         tag:'Video',  href:'#', color:'#8b5cf6' },
];

const FAQS = [
  {
    q: "How do I register?",
    a: (
      <>
        You can register through the official hackathon registration portal at{" "}
        <a
          href="https://www.hackathon2026.in/register"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#2563eb', textDecoration: 'underline' }}
        >
          https://www.hackathon2026.in/register
        </a>
        .
      </>
    ),
  },
  {
    q: "Who can participate in the SRCAS Hackathon 3.0?",
    a: "The hackathon is open to all students, regardless of skill level. Whether you're a beginner exploring your first project or an experienced developer, you're welcome to participate.",
  },
  {
    q: "How many team members do I need?",
    a: "Each team must have a minimum of 2 and a maximum of 4 members. Solo participation is not permitted.",
  },
  {
    q: "Can team members be from different colleges?",
    a: "No. All team members must belong to the same college. However, students from different departments within the same college are allowed to form a team. Cross-college teams are not permitted for SRCAS Hackathon 3.0.",
  },
  {
    q: "Who is eligible to participate in the hackathon?",
    a: "Any undergraduate or postgraduate student currently enrolled in a recognized institution is eligible to participate. No prior hackathon experience is required.",
  },
  {
    q: "Is there a registration fee?",
    a: "No, participation is completely free. We believe innovation should be accessible to everyone.",
  },
  {
    q: "What should I bring to the SRCAS Hackathon 3.0?",
    a: "Please bring your laptop, charger, any hardware required for your project, and lots of creativity. Food, refreshments, Wi-Fi, and a comfortable workspace will be provided by the organizers.",
  },
  {
    q: "Are we allowed to use AI tools or \"vibe code\" during the hackathon?",
    a: "Yes! \"Vibe coding\" (using AI assistants to generate and shape your code) is officially allowed during the 24-hour hackathon. We encourage using modern tools to build faster, as long as the actual development and logic are implemented during the event.",
  },
  {
    q: "We are building an IoT/Hardware project. Do we have to build the hardware from scratch during the 24 hours?",
    a: "No. Hardware teams may procure their required devices, sensors, and microcontrollers and test them before the hackathon begins. However, during the 24-hour hackathon window, you must develop the software application from scratch, integrate it with your hardware, and demonstrate the fully working IoT solution.",
  },
  {
    q: "Can I start working on my project before the event?",
    a: "For software projects, no. All coding must start at the event. For hardware projects, you may procure and test devices beforehand, but software integration must happen during the 24 hours.",
  },
  {
    q: "How are the winners selected?",
    a: "Projects will be evaluated by a panel of industry experts based on innovation, technical complexity, practical applicability, impact, and presentation quality.",
  },
  {
    q: "Will the hackathon be in person or online?",
    a: "The Idea Nation round will be conducted online. Teams shortlisted for the final round must be present on campus to participate in the 24-hour hackathon and final project evaluation.",
  },
];



const STATUS_STYLE = {
  done: { dot: '#4C9F38', line: '#4C9F38', label: 'Completed', labelColor: '#4C9F38', labelBg: '#f0fdf4' },
  active: { dot: '#f59e0b', line: '#e5e7eb', label: 'In Progress', labelColor: '#92400e', labelBg: '#fffbeb' },
  upcoming: { dot: '#e5e7eb', line: '#e5e7eb', label: 'Upcoming', labelColor: '#6b7280', labelBg: '#f3f4f6' },
};

export default function ResourcesTab({ hasTeam, submissions }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [showRulebook, setShowRulebook] = useState(false);
  const hasSubmitted = submissions?.length > 0;

  useEffect(() => {
    if (showRulebook) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showRulebook]);

  const EVENTS = [
    { date: 'Jun 21', event: 'Registration', status: 'done', desc: 'Team registration and idea brief.', time: 'All day' },
    { date: 'Jul 25', event: 'Team Confirmation', status: hasTeam ? 'done' : 'active', desc: 'Form your team and confirm details.', time: '11:59 PM IST' },
    { date: 'Jul 25', event: 'Idea Submission', status: hasSubmitted ? 'done' : (hasTeam ? 'active' : 'upcoming'), desc: '500-word Project Description and Idea PPT of your solution.', time: '11:59 PM IST' },
    { date: 'Aug 7', event: 'Shortlist Announced', status: hasSubmitted ? 'active' : 'upcoming', desc: 'Top teams notified via email.', time: '12:00 PM IST' },
    { date: 'Aug 14', event: 'Grand Finale', status: 'upcoming', desc: 'Live presentations and prize ceremony.', time: '09:00 AM IST' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Resources grid */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111', marginBottom: 14 }}>📚 Resource Library</div>
        <div className="dash-grid-resources" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {RESOURCES.map((r, i) => (
            <a key={i} href={r.href} download={r.download}
              onClick={(e) => {
                if (r.label === 'Hackathon Rulebook') {
                  e.preventDefault();
                  setShowRulebook(true);
                }
              }}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ background: '#fff', borderRadius: 14, padding: '18px 18px', border: '1.5px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${r.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 26 }}>{r.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: r.color, background: `${r.color}15`, padding: '3px 8px', borderRadius: 20 }}>{r.tag}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{r.label}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111', marginBottom: 14 }}>📅 Full Event Timeline</div>
        <div className="dash-card" style={{ background: '#fff', borderRadius: 14, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0' }}>
          {EVENTS.map((ev, i) => {
            const s = STATUS_STYLE[ev.status];
            return (
              <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < EVENTS.length - 1 ? 24 : 0, position: 'relative' }}>
                {i < EVENTS.length - 1 && (
                  <div style={{ position: 'absolute', left: 9, top: 22, width: 2, bottom: 0, background: '#e5e7eb' }}>
                    <div style={{ width: '100%', height: EVENTS[i].status === 'done' ? '100%' : '0%', background: '#4C9F38', transition: 'height 0.4s ease' }} />
                  </div>
                )}
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: s.dot, flexShrink: 0, zIndex: 1, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: ev.status === 'active' ? '3px solid #fde68a' : 'none' }}>
                  {ev.status === 'done' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>{ev.event}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: s.labelColor, background: s.labelBg, padding: '2px 8px', borderRadius: 20 }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{ev.date} · {ev.time}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{ev.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111', marginBottom: 14 }}>❓ Frequently Asked Questions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{f.q}</span>
                <span style={{ fontSize: 18, color: '#9ca3af', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 18px 14px', fontSize: 13, color: '#6b7280', lineHeight: 1.6, borderTop: '1px solid #f3f4f6' }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Rulebook Modal */}
      <AnimatePresence>
        {showRulebook && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRulebook(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 9998,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                cursor: 'pointer'
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px', pointerEvents: 'none'
              }}
            >
              <div style={{
                pointerEvents: 'auto',
                width: '100%', maxWidth: 700, maxHeight: '85vh',
                background: '#fff', borderRadius: 24,
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E5243B15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📄</div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>Official Rulebook</h2>
                      <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>SRCAS Hackathon 3.0</p>
                    </div>
                  </div>
                  <button onClick={() => setShowRulebook(false)} style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>&times;</button>
                </div>

                {/* Body */}
                <div style={{ padding: '32px', overflowY: 'auto', fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.7 }}>

                  <h3 style={{ color: '#111', fontSize: '1.1rem', fontWeight: 800, marginTop: 0, letterSpacing: '-0.01em' }}>1. Eligibility & Team Formation</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                    <li style={{ marginBottom: 6 }}>All team members must be currently enrolled college students.</li>
                    <li style={{ marginBottom: 6 }}>Teams must consist of exactly 2 to 4 members. Solo participation is not permitted.</li>
                    <li style={{ marginBottom: 6 }}>All members must belong to the same institution.</li>
                    <li style={{ marginBottom: 6 }}><strong>Registration:</strong> Only the Team Leader needs to create an account on the hackathon platform. Team members should NOT register separately.</li>
                    <li>Valid college ID cards are mandatory for the offline finale.</li>
                  </ul>

                  <h3 style={{ color: '#111', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>2. Problem Statements & Tracks</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                    <li style={{ marginBottom: 6 }}>Projects must address one of the provided 17 UN Sustainable Development Goals (SDGs).</li>
                    <li>Teams may change their selected SDG until the Idea Submission deadline.</li>
                  </ul>

                  <h3 style={{ color: '#111', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>3. Submission & Development Rules</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                    <li style={{ marginBottom: 6 }}><strong>Round 1 (Idea Submission):</strong> Teams must submit a 500-word Project Description and the official PPT format.</li>
                    <li style={{ marginBottom: 6 }}><strong>Round 2 (Finale):</strong> Shortlisted teams will present their working prototypes offline at the SRCAS campus.</li>
                    <li style={{ marginBottom: 6 }}><strong>24-Hour Software Rule:</strong> All software coding and application development must take place exclusively during the 24-hour hackathon period. Bringing pre-written code, using proprietary existing projects, or plagiarism will lead to immediate disqualification.</li>
                    <li style={{ marginBottom: 6 }}><strong>Hardware & IoT Exception:</strong> If you are building a hardware-based project, you may procure the required devices, assemble, and test them before the Hackathon. However, during the 24-hour event, you are strictly expected to develop the software application, integrate it with your IoT devices, and demonstrate the final connected solution.</li>
                    <li><strong>Vibe Coding:</strong> "Vibe coding" (using AI-assisted coding tools and LLMs to help build your project) is completely allowed during the 24-hour hacking period.</li>
                  </ul>

                  <h3 style={{ color: '#111', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>4. Judging Criteria</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                    <li style={{ marginBottom: 6 }}><strong>Innovation & Creativity (25%):</strong> How unique is the approach?</li>
                    <li style={{ marginBottom: 6 }}><strong>Impact & SDG Alignment (25%):</strong> Does it effectively address the chosen goal?</li>
                    <li style={{ marginBottom: 6 }}><strong>Technical Complexity (25%):</strong> Quality of code and technology stack used.</li>
                    <li><strong>Feasibility & Presentation (25%):</strong> Can this be implemented in the real world? How well was it pitched?</li>
                  </ul>

                  <h3 style={{ color: '#111', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>5. Code of Conduct</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                    <li style={{ marginBottom: 6 }}>Maintain a respectful and collaborative environment. Harassment of any kind will not be tolerated.</li>
                    <li>The decisions made by the judges are final and binding.</li>
                  </ul>

                </div>

                {/* Footer */}
                <div style={{ padding: '20px 32px', borderTop: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowRulebook(false)} style={{ padding: '10px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#333'}
                    onMouseLeave={e => e.currentTarget.style.background = '#111'}>
                    I Understand
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
