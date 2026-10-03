import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { InternshipTicket } from "../ui/InternshipTicket";

/* ─── Wave mesh ─── */
const WaveMesh = () => {
  const lines = useMemo(() => {
    const result = [];
    for (let l = 0; l < 36; l++) {
      const baseY = (l / 36) * 400;
      const points = [];
      for (let s = 0; s <= 60; s++) {
        const x = (s / 60) * 500;
        const t = s / 60;
        const y = baseY
          + Math.sin(t * Math.PI * 3 + l * 0.3) * (20 + l * 0.8)
          + Math.sin(t * Math.PI * 5 + l * 0.15) * (8 + l * 0.3)
          + Math.cos(t * Math.PI * 2.5 + l * 0.5) * (12 + l * 0.5)
          - Math.exp(-Math.pow((t - 0.5) * 2.5, 2)) * 30;
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      result.push(
        <polyline key={l} points={points.join(" ")} fill="none"
          stroke="#fff" strokeWidth={0.7} opacity={0.12 + (l / 36) * 0.35} />
      );
    }
    return result;
  }, []);
  return (
    <svg viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice"
      style={{ width:"100%", height:"100%", display:"block" }} aria-hidden>
      <defs>
        <radialGradient id="wf2" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="wm2"><rect width="500" height="400" fill="url(#wf2)" /></mask>
      </defs>
      <g mask="url(#wm2)">{lines}</g>
    </svg>
  );
};

/* ─── Main Section ─── */
export const PrizesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="prizes" style={{
      position:"relative",
      padding:"100px 2.5rem 120px",
      backgroundColor:"#fff",
      overflow:"hidden",
      fontFamily:"'Plus Jakarta Sans', sans-serif",
    }}>
      {/* Grid background */}
      <svg aria-hidden style={{
        position:"absolute", inset:0, width:"100%", height:"100%",
        opacity:0.035, pointerEvents:"none",
      }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`v${i}`} x1={`${(i+1)*7.14}%`} y1="0" x2={`${(i+1)*7.14}%`} y2="100%" stroke="#000" strokeWidth="1"/>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={`${(i+1)*10}%`} x2="100%" y2={`${(i+1)*10}%`} stroke="#000" strokeWidth="1"/>
        ))}
      </svg>

      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:24 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:"-60px" }}
          transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
          style={{ marginBottom:64 }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <div style={{ width:28, height:1, background:"#111" }} />
            <p style={{
              fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.22em",
              color:"#111", textTransform:"uppercase", margin:0,
            }}>The Prizes</p>
          </div>
          <h2 style={{
            fontSize:"clamp(2.8rem,6vw,5rem)", fontWeight:800,
            lineHeight:1.05, letterSpacing:"-0.04em", color:"#111", margin:0,
          }}>
            Win more than<br />bragging rights.
          </h2>
          <p style={{ fontSize:"1.05rem", color:"#666", maxWidth:480, marginTop:14, lineHeight:1.6 }}>
            Exclusive prizes, life-changing opportunities and perks that set you ahead.
          </p>
        </motion.div>

        {/* 3D Ticket */}
        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:"-80px" }}
          transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
          style={{ marginBottom:40 }}
        >
          <InternshipTicket />
        </motion.div>

        {/* View more button */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.5, delay:0.2 }}
          style={{ display:"flex", justifyContent:"center" }}
        >
          <button className="reward-btn" onClick={() => { navigate("/prizes"); window.scrollTo({ top: 0, behavior: 'instant' }); }}>
            <span className="IconContainer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 60 20" className="box-top box">
                <path strokeLinecap="round" strokeWidth={4} stroke="#59c23a" d="M2 18L58 18" />
                <circle strokeWidth={5} stroke="#59c23a" fill="#101218" r={7} cy="9.5" cx="20.5" />
                <circle strokeWidth={5} stroke="#59c23a" fill="#101218" r={7} cy="9.5" cx="38.5" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 58 44" className="box-body box">
                <mask fill="white" id="path-1-inside-1_81_19">
                  <rect rx={3} height={44} width={58} />
                </mask>
                <rect mask="url(#path-1-inside-1_81_19)" strokeWidth={8} stroke="#59c23a" fill="#101218" rx={3} height={44} width={58} />
                <line strokeWidth={6} stroke="#59c23a" y2={29} x2={58} y1={29} x1="-3.61529e-09" />
                <path strokeLinecap="round" strokeWidth={5} stroke="#59c23a" d="M45.0005 20L36 3" />
                <path strokeLinecap="round" strokeWidth={5} stroke="#59c23a" d="M21 3L13.0002 19.9992" />
              </svg>
              <span className="coin" />
            </span>
            <span className="text">View More Prizes</span>
          </button>
        </motion.div>

      </div>

      <style>{`
        .reward-btn {
          width: max-content;
          padding-right: 24px;
          height: 60px;
          background-color: #101218;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }
        .IconContainer {
          width: 56px;
          height: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .IconContainer svg {
          width: 50%;
          z-index: 3;
        }
        .box-top {
          transition: all 0.3s;
        }
        .text {
          width: auto;
          white-space: nowrap;
          height: 100%;
          font-size: 18px;
          color: #59c23a;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-weight: 700;
          padding-left: 12px;
        }
        .reward-btn:hover .IconContainer .box-top {
          transform: translateY(-5px);
        }
        .reward-btn:hover {
          background-color: #202531;
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.18);
        }
        .reward-btn:hover .coin {
          transform: translateY(-5px);
          transition-delay: 0.2s;
        }
        .coin {
          width: 28%;
          height: 28%;
          background-color: #FCC30B;
          position: absolute;
          border-radius: 50%;
          transition: all 0.3s;
          z-index: 1;
          border: 2px solid #fff;
          margin-top: 6px;
        }
        @media (max-width: 768px) {
          #prizes { padding: 72px 1.25rem 80px !important; }
        }
      `}</style>
    </section>
  );
};
