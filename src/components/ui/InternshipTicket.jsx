import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import ticketBgDesktop from "../../assets/tickets/PC_BG_ticket_real.png";
import ticketBgMobile from "../../assets/tickets/mobile_BG_ticket_real.png";

/* ─── Barcode ─── */
const Barcode = () => {
  const pattern = useMemo(() => [
    2,1,1,2,1,4,1,2,1,1,3,2,2,2,1,1,3,1,1,3,1,2,1,2,
    3,1,1,2,2,1,1,2,2,3,1,1,2,1,3,1,1,2,1,1,1,3,2,2,
    2,3,1,1,1,2,1,2,1,2,3,1,3,1,2,1,1,2,1,2,3,1,2,1,
    2,3,3,1,1,1,2,
  ], []);
  return (
    <div style={{ display:"flex", flexDirection:"column", width:"100%" }}>
      {pattern.map((h, i) => (
        <div key={i} style={{
          height: h * 1.2,
          background: i % 2 === 0 ? "rgba(0,0,0,0.85)" : "transparent",
          width: "100%",
        }} />
      ))}
    </div>
  );
};

/* ─── Wave mesh ─── */
const WaveMesh = () => {
  const lines = useMemo(() => {
    const result = [];
    for (let l = 0; l < 36; l++) {
      const baseY = (l / 36) * 400;
      const pts = [];
      for (let s = 0; s <= 60; s++) {
        const x = (s / 60) * 500;
        const t = s / 60;
        const y = baseY
          + Math.sin(t * Math.PI * 3 + l * 0.3) * (20 + l * 0.8)
          + Math.sin(t * Math.PI * 5 + l * 0.15) * (8 + l * 0.3)
          + Math.cos(t * Math.PI * 2.5 + l * 0.5) * (12 + l * 0.5)
          - Math.exp(-Math.pow((t - 0.5) * 2.5, 2)) * 30;
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      result.push(
        <polyline key={l} points={pts.join(" ")} fill="none"
          stroke="#fff" strokeWidth={0.7} opacity={0.12 + (l / 36) * 0.35} />
      );
    }
    return result;
  }, []);
  return (
    <svg viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice"
      style={{ width:"100%", height:"100%", display:"block" }} aria-hidden>
      <defs>
        <radialGradient id="wfit" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="wmit"><rect width="500" height="400" fill="url(#wfit)" /></mask>
      </defs>
      <g mask="url(#wmit)">{lines}</g>
    </svg>
  );
};

/* ─── 3D Internship Ticket ─── */
export const InternshipTicket = () => {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - 0.5) * 22;
    const y = ((e.clientY - top)  / height - 0.5) * 14;
    setTilt({ x, y });
  }, []);

  // Responsive background
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const currentBg = isMobile ? ticketBgMobile : ticketBgDesktop;

  // translateZ values for 3D pop-out layers (desktop only)
  const z = {
    icon:    hovered ? 50  : 0,
    sub:     hovered ? 30  : 0,
    heading: hovered ? 70  : 0,
    desc:    hovered ? 25  : 0,
    cta:     hovered ? 90  : 0,
    stub:    hovered ? 40  : 0,
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
        style={{ perspective: "1000px", width: "100%", cursor: "default" }}
      >
        <motion.div
          animate={{ rotateY: tilt.x, rotateX: -tilt.y, scale: hovered ? 1.025 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.6 }}
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
            backgroundImage: `url("${currentBg}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#0e0e0e",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: hovered
              ? "0 48px 96px -24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)"
              : "0 20px 60px -15px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)",
            display: "flex",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            minHeight: 300,
            transition: "box-shadow 0.4s ease",
          }}
        >
          {/* Noise texture */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "screen",
            pointerEvents: "none", zIndex: 1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />

          {/* Cursor spotlight */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
            background: `radial-gradient(600px circle at ${50 + tilt.x * 2}% ${50 + tilt.y * 2}%, rgba(255,255,255,0.06), transparent 60%)`,
          }} />

          {/* Dashed divider — desktop only */}
          <div aria-hidden className="ticket-divider" style={{
            position: "absolute", left: "68%", top: 16, bottom: 16, width: 0,
            borderLeft: "1.5px dashed rgba(255,255,255,0.18)", zIndex: 5, pointerEvents: "none",
          }} />

          {/* ── LEFT 68% — main content ── */}
          <div style={{
            width: "68%", flexShrink: 0,
            padding: "clamp(24px,3vw,44px)",
            display: "flex", flexDirection: "column",
            position: "relative", zIndex: 3,
          }} className="ticket-left">

            {/* Vertical "GRAND PRIZE" label */}
            <div style={{
              position: "absolute", left: 16, top: "50%",
              transform: "translateY(-50%) rotate(180deg)",
              writingMode: "vertical-rl", fontSize: "0.6rem", fontWeight: 600,
              letterSpacing: "0.2em", color: "rgba(0,0,0,0.45)",
              textTransform: "uppercase", userSelect: "none",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span>✦</span> GRAND PRIZE <span>✦</span>
            </div>

            {/* Icon — pops out */}
            <motion.div
              className="ticket-icon"
              animate={{ translateZ: z.icon }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                marginLeft: "clamp(28px,3.5vw,52px)",
                width: 58, height: 58,
                background: "rgba(0,0,0,0.04)",
                borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24,
                border: "1px solid rgba(0,0,0,0.1)",
                transformStyle: "preserve-3d",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="rgba(0,0,0,0.85)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </motion.div>

            {/* Subtitle — pops out */}
            <motion.div
              className="ticket-sub"
              animate={{ translateZ: z.sub }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                marginLeft: "clamp(28px,3.5vw,52px)",
                fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em",
                color: "rgba(0,0,0,0.65)", textTransform: "uppercase",
                marginBottom: 14, transformStyle: "preserve-3d",
              }}
            >
              IGENIUS AI
            </motion.div>

            {/* Heading — pops out most */}
            <motion.h3
              className="ticket-heading"
              animate={{ translateZ: z.heading }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 900,
                color: "#111", lineHeight: 1.08, margin: "0 0 18px",
                marginLeft: "clamp(28px,3.5vw,52px)",
                letterSpacing: "-0.03em", transformStyle: "preserve-3d",
              }}
            >
              Win a Ticket<br />to <span style={{ color: "#59c23a" }}>Singapore!</span> 
            </motion.h3>

            {/* Description — pops out */}
            <motion.p
              className="ticket-desc"
              animate={{ translateZ: z.desc }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                fontSize: "0.83rem", lineHeight: 1.65,
                color: "rgba(0,0,0,0.65)", maxWidth: 380,
                margin: "0 0 28px", marginLeft: "clamp(28px,3.5vw,52px)",
                transformStyle: "preserve-3d",
              }}
            >
              Top three teams will qualify for the Science and Innovation Competition held in Singapore, with all expenses fully covered. Outstanding performers will also receive opportunities for Global internships.
            </motion.p>

            {/* CTA — pops out the most */}
            <motion.div
              className="ticket-cta"
              animate={{ translateZ: z.cta }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                marginLeft: "clamp(28px,3.5vw,52px)",
                display: "flex", alignItems: "center", gap: 18, marginTop: "auto",
                transformStyle: "preserve-3d",
              }}
            >
              <a href="/register" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", background: "#59c23a", color: "#000",
                fontSize: "0.83rem", fontWeight: 700, borderRadius: 9,
                textDecoration: "none",
                boxShadow: hovered ? "0 8px 28px rgba(89, 194, 58, 0.25)" : "0 2px 8px rgba(89, 194, 58, 0.1)",
                transition: "box-shadow 0.3s, transform 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Register to Compete →
              </a>
            </motion.div>

            {/* Wave mesh bg — removed, using BG_ticket.png instead */}
          </div>

          {/* ── RIGHT 32% — stub (QR + barcode) — desktop only ── */}
          <motion.div
            animate={{ translateZ: z.stub }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="ticket-stub"
            style={{
              width: "32%", flexShrink: 0,
              display: "flex", flexDirection: "column",
              justifyContent: "space-between",
              padding: "clamp(20px,2.5vw,32px) clamp(16px,2vw,24px)",
              position: "relative", zIndex: 3, gap: 20,
              transformStyle: "preserve-3d",
            }}
          >
            {/* QR + ticket number */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: 68, height: 68, background: "#fff", padding: 4, borderRadius: 6 }}>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://www.hackathon2026.in/"
                  alt="QR Code"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 38, height: 9, background: "#8cc63f" }} />
                  <div style={{ color: "#111", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em" }}>UD :)</div>
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: "0.72rem", color: "rgba(0,0,0,0.5)", letterSpacing: "0.05em" }}>
                  000000114351
                </div>
              </div>
            </div>

            {/* Rotated text */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", flex: 1 }}>
              <div style={{
                writingMode: "vertical-rl", transform: "rotate(180deg)",
                display: "flex", flexDirection: "column", gap: 7, alignItems: "center",
                background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(4px)",
                padding: "12px 6px", borderRadius: 6,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
              }}>
                <span style={{ fontSize: "0.88rem", color: "#111", fontWeight: 700, letterSpacing: "0.02em" }}>
                  <span style={{ color: "#4C9F38" }}>Internship</span> ticket
                </span>
                <span style={{ fontSize: "0.88rem", color: "#111", fontWeight: 700, letterSpacing: "0.02em" }}>30.06 to 21.06 Hs</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      <style>{`
        /* Mobile: hide stub, make left full width */
        @media (max-width: 768px) {
          .ticket-stub { display: none !important; }
          .ticket-left {
            width: 100% !important;
            min-height: 560px !important;
            justify-content: flex-end !important;
            align-items: center !important;
            padding-bottom: 40px !important;
          }
          .ticket-divider { display: none !important; }
          .ticket-desc { display: none !important; }
          .ticket-icon { display: none !important; }
          .ticket-sub { display: none !important; }
          .ticket-cta { margin-top: 0 !important; margin-left: 0 !important; justify-content: center !important; }
          .ticket-heading {
            background: rgba(255, 255, 255, 0.0000001) !important;
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
            padding: 16px 22px 20px !important;
            border-radius: 14px !important;
            display: inline-block !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.4) !important;
            border: 1px solid rgba(255,255,255,0.25) !important;
            margin-top: auto !important;
            margin-bottom: 8px !important;
          }
        }
      `}</style>
    </>
  );
};

export default InternshipTicket;
