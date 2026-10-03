import * as React from "react";
import { useEffect, useRef } from "react";
import { useAuth } from "../../lib/useAuth";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import srcasLogo from "../../assets/logo/srcas-logo.png";
import pcLogo from "../../assets/logo/programming-club-2-logo.png";
import msLogo from "../../assets/logo/microsoft.png";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Styles ──────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cf-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  --pill-bg-1: rgba(0,0,0,0.04);
  --pill-bg-2: rgba(0,0,0,0.02);
  --pill-shadow: rgba(0,0,0,0.08);
  --pill-highlight: rgba(255,255,255,0.7);
  --pill-inset-shadow: rgba(255,255,255,0.5);
  --pill-border: rgba(0,0,0,0.09);
  --pill-bg-1-hover: rgba(0,0,0,0.09);
  --pill-bg-2-hover: rgba(0,0,0,0.03);
  --pill-border-hover: rgba(0,0,0,0.22);
  --pill-shadow-hover: rgba(0,0,0,0.14);
  --pill-highlight-hover: rgba(255,255,255,0.9);
}

/* Marquee item spacing */
.cf-marquee-item {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 0 48px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #9ca3af;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Desktop footer height */
.footer-curtain { height: 60vh; }
.footer-fixed   { height: 60vh; }
.footer-main-content { padding-top: 80px; padding-bottom: 8px; }

/* Mobile overrides */
@media (max-width: 640px) {
  .footer-curtain { height: auto; min-height: 320px; }
  .footer-fixed   { height: auto; min-height: 320px; position: relative !important; }
  .footer-main-content { padding-top: 100px !important; padding-bottom: 4px !important; }
  .footer-bottom-row {
    flex-direction: column !important;
    gap: 10px !important;
    padding-bottom: 24px !important;
  }
  .footer-divider { display: none !important; }
  .cf-giant-text  { font-size: 38vw !important; }
}

@keyframes cf-breathe {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.85; }
}
@keyframes cf-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes cf-heartbeat {
  0%,100% { transform: scale(1);   filter: drop-shadow(0 0 4px rgba(239,68,68,0.4)); }
  15%,45% { transform: scale(1.25); filter: drop-shadow(0 0 10px rgba(239,68,68,0.8)); }
  30%     { transform: scale(1); }
}

.cf-breathe  { animation: cf-breathe  8s ease-in-out infinite alternate; }
.cf-marquee  { animation: cf-marquee  38s linear infinite; }
.cf-heartbeat{ animation: cf-heartbeat 2s cubic-bezier(0.25,1,0.5,1) infinite; }

.cf-bg-grid {
  background-size: 56px 56px;
  background-image:
    linear-gradient(to right,  rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

.cf-aurora {
  background: radial-gradient(circle at 50% 50%,
    rgba(0,120,212,0.10) 0%,
    rgba(172,0,37,0.06) 40%,
    transparent 70%);
}

.cf-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 0 10px 24px -8px var(--pill-shadow),
              inset 0 1px 1px var(--pill-highlight),
              inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
}
.cf-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 0 16px 36px -8px var(--pill-shadow-hover),
              inset 0 1px 1px var(--pill-highlight-hover);
  color: #111;
}

.cf-giant-text {
  font-size: 22vw;
  line-height: 0.78;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(0,0,0,0.06);
  background: linear-gradient(180deg, rgba(0,0,0,0.09) 0%, transparent 65%);
  -webkit-background-clip: text;
  background-clip: text;
}

.cf-text-glow {
  background: linear-gradient(180deg, #111 0%, rgba(17,17,17,0.45) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 18px rgba(0,0,0,0.12));
}
`;

// ── Magnetic Button ──────────────────────────────────────────────────────────
const MagneticButton = React.forwardRef(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef(null);

    useEffect(() => {
      const el = localRef.current;
      if (!el) return;
      const ctx = gsap.context(() => {
        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          gsap.to(el, { x: x * 0.38, y: y * 0.38, rotationX: -y * 0.12, rotationY: x * 0.12, scale: 1.05, ease: "power2.out", duration: 0.35 });
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: "elastic.out(1,0.3)", duration: 1.1 });
        };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
      }, el);
      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// ── Marquee items ────────────────────────────────────────────────────────────
const MarqueeItem = () => (
  <div className="cf-marquee-item">
    <span>National Hackathon 2026</span>
    <span style={{ color: '#d1d5db' }}>✦</span>
    <span>Microsoft Partner</span>
    <span style={{ color: '#d1d5db' }}>✦</span>
    <span>17 UN SDGs</span>
    <span style={{ color: '#d1d5db' }}>✦</span>
    <span>₹1,80,000+ Prize Pool</span>
    <span style={{ color: '#d1d5db' }}>✦</span>
    <span>Singapore Trip</span>
    <span style={{ color: '#d1d5db' }}>✦</span>
    <span>Aug 14 · SRCAS</span>
    <span style={{ color: '#d1d5db' }}>✦</span>
    <span>Open Innovation</span>
    <span style={{ color: '#d1d5db' }}>✦</span>
  </div>
);

// ── Social icons ─────────────────────────────────────────────────────────────
const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// ── Main Footer ──────────────────────────────────────────────────────────────
export default function Footer() {
  const wrapperRef = useRef(null);
  const giantTextRef = useRef(null);
  const headingRef = useRef(null);
  const linksRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const user = useAuth();

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(giantTextRef.current,
        { y: "12vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh", scale: 1, opacity: 1, ease: "power1.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 85%", end: "bottom bottom", scrub: 1.2 }
        }
      );
      gsap.fromTo([headingRef.current, linksRef.current],
        { y: 55, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 45%", end: "bottom bottom", scrub: 1 }
        }
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Curtain-reveal wrapper */}
      <div
        ref={wrapperRef}
        className="relative w-full footer-curtain"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="cf-wrapper fixed bottom-0 left-0 flex w-full flex-col justify-between overflow-hidden bg-white text-neutral-900 footer-fixed">

          {/* Aurora glow */}
          <div className="cf-aurora cf-breathe absolute left-1/2 top-1/2 h-[55vh] w-[75vw] rounded-[50%] blur-[90px] pointer-events-none z-0" />

          {/* Grid */}
          <div className="cf-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="cf-giant-text absolute -bottom-[4vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            SRCAS
          </div>

          {/* ── 1. Marquee ── */}
          <div style={{
            position: 'absolute', top: '60px', left: 0, width: '100%',
            overflow: 'visible', zIndex: 20,
            transform: 'rotate(-4deg) scaleX(1.12)',
            transformOrigin: 'center center',
          }}>
            <div style={{
              borderTop: '1px solid rgba(0,0,0,0.09)',
              borderBottom: '1px solid rgba(0,0,0,0.09)',
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(12px)',
              padding: '11px 0',
            }}>
              <div className="cf-marquee flex w-max">
                <MarqueeItem /><MarqueeItem /><MarqueeItem />
              </div>
            </div>
          </div>

          {/* ── 2. Main centre content ── */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-6 w-full footer-main-content">
            <h2
              ref={headingRef}
              className="cf-text-glow font-black tracking-tighter mb-4"
              style={{ fontSize: 'clamp(2.2rem, 7vw, 5.5rem)', textAlign: 'center', width: '100%' }}
            >
              Code to Innovate.
            </h2>

            <div ref={linksRef} className="flex flex-col items-center gap-3 w-full">
              <MagneticButton
                as="a"
                href={user ? "/dashboard" : "/register"}
                className="cf-pill px-7 py-2.5 rounded-full text-neutral-900 font-black text-sm border-neutral-300 hover:border-neutral-900"
              >
                {user ? "🚀 Go to Dashboard →" : "🚀 Register Now →"}
              </MagneticButton>
            </div>
          </div>

          {/* ── 3. Bottom row ── */}
          <div className="footer-bottom-row" style={{
            position: 'relative', zIndex: 20,
            width: '100%',
            padding: '0 40px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}>
            {/* Social icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[
                { icon: LinkedinIcon, href: "https://www.linkedin.com/company/proclub-srcas", label: "LinkedIn" },
                { icon: InstagramIcon, href: "https://www.instagram.com/proclub_srcas", label: "Instagram" },
                // { icon: WhatsAppIcon, href: "https://chat.whatsapp.com/BXFPp6PTWk4I6wG7UMCbAP", label: "WhatsApp" },
              ].map(({ icon: Icon, href, label }) => (
                <MagneticButton
                  key={label}
                  as="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="cf-pill"
                  style={{
                    width: 42, height: 42, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#6b7280',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#111'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                >
                  <Icon size={20} />
                </MagneticButton>
              ))}
            </div>

            {/* Divider — desktop only */}
            <div className="footer-divider" style={{ width: 1, height: 24, background: '#e5e7eb', flexShrink: 0 }} />

            {/* Crafted with badge */}
            <div className="cf-pill" style={{
              padding: '8px 18px', borderRadius: 100,
              display: 'flex', alignItems: 'center', gap: 7,
              cursor: 'default', flexShrink: 0,
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af' }}>Crafted with</span>
              <span className="cf-heartbeat" style={{ fontSize: '15px', color: '#ef4444' }}>❤</span>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af' }}>by</span>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#111', marginLeft: 2 }}>SRCAS Prog. Club</span>
            </div>

            {/* Divider — desktop only */}
            <div className="footer-divider" style={{ width: 1, height: 24, background: '#e5e7eb', flexShrink: 0 }} />

            {/* Legal Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
              <Link to="/terms" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#111'} onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>Terms & Conditions</Link>
              <span style={{ color: '#d1d5db' }}>|</span>
              <Link to="/privacy" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#111'} onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>Privacy</Link>
            </div>
          </div>

        </footer>
      </div>
    </>
  );
}
