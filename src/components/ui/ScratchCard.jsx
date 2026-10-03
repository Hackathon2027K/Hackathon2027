import { useEffect, useRef, useState } from "react";
import { Sparkles, Lock } from "lucide-react";

export const ScratchCard = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const setup = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;
      // Silver metallic B&W gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0,   "#c8c8c8");
      grad.addColorStop(0.2, "#e8e8e8");
      grad.addColorStop(0.45,"#b0b0b0");
      grad.addColorStop(0.6, "#d4d4d4");
      grad.addColorStop(0.8, "#a0a0a0");
      grad.addColorStop(1,   "#cccccc");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Metallic sheen streaks
      for (let i = 0; i < 18; i++) {
        const y0 = Math.random() * h;
        const streak = ctx.createLinearGradient(0, y0, w, y0);
        streak.addColorStop(0,   "rgba(255,255,255,0)");
        streak.addColorStop(0.4, `rgba(255,255,255,${Math.random() * 0.18})`);
        streak.addColorStop(1,   "rgba(255,255,255,0)");
        ctx.fillStyle = streak;
        ctx.fillRect(0, y0, w, Math.random() * 3 + 1);
      }
      // Fine noise
      for (let i = 0; i < 800; i++) {
        const v = Math.random() > 0.5 ? 255 : 0;
        ctx.fillStyle = `rgba(${v},${v},${v},${Math.random() * 0.06})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
      }
      // Hint text
      ctx.fillStyle = "rgba(60,60,60,0.7)";
      ctx.font = "700 12px monospace";
      ctx.textAlign = "center";
      ctx.letterSpacing = "0.2em";
      ctx.fillText("SCRATCH TO REVEAL", w / 2, h / 2 - 6);
      ctx.font = "500 10px monospace";
      ctx.fillStyle = "rgba(80,80,80,0.45)";
      ctx.fillText("mystery benefit inside", w / 2, h / 2 + 14);
    };
    setup();
    window.addEventListener("resize", setup);
    return () => window.removeEventListener("resize", setup);
  }, []);

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x - rect.left, y - rect.top, 60, 0, Math.PI * 2);
    ctx.fill();
    checkReveal();
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    const step = 80;
    let total = 0;
    for (let i = 3; i < data.length; i += step * 4) {
      total++;
      if (data[i] === 0) cleared++;
    }
    if (cleared / total > 0.55) setRevealed(true);
  };

  const onPointerDown = (e) => {
    drawing.current = true;
    e.target.setPointerCapture(e.pointerId);
    scratch(e.clientX, e.clientY);
  };
  const onPointerMove = (e) => {
    if (!drawing.current) return;
    scratch(e.clientX, e.clientY);
  };
  const onPointerUp = () => { drawing.current = false; };

  return (
    <div
      ref={containerRef}
      className="ticket-small-holes"
      style={{
        position: "relative",
        background: "#111",
        borderRadius: 20,
        overflow: "hidden",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 32px",
        touchAction: "none",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        flex: 1,
      }}
    >
      {/* Top edge highlight */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: "20%", right: "20%",
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        pointerEvents: "none",
      }} />

      {/* Reward layer */}
      <div style={{ position: "relative", zIndex: 0, userSelect: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 56, height: 56,
          borderRadius: 16,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
        }}>
          <Sparkles size={24} color="#fff" strokeWidth={1.5} />
        </div>

        <p style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Mystery Benefit
        </p>
        
        <h3 style={{
          fontSize: "1.8rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#fff",
          lineHeight: 1.1,
          marginBottom: 16,
        }}>
          Exclusive Mentorship<br />& Funding
        </h3>
        
        <p style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.5)",
          maxWidth: 320,
          marginBottom: 32,
        }}>
          Selected teams unlock pre-seed funding intros and a private mentor circle.
        </p>

        <button style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          padding: "10px 24px",
          borderRadius: 12,
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: "not-allowed",
          transition: "background 0.2s",
        }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          Stay tuned <Lock size={14} color="rgba(255,255,255,0.6)" />
        </button>
      </div>

      {/* Scratch overlay */}
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          transition: "opacity 0.8s ease",
          opacity: revealed ? 0 : 1,
          pointerEvents: revealed ? "none" : "auto",
          width: "100%",
          height: "100%",
          cursor: "crosshair",
        }}
      />

      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            zIndex: 20,
            fontSize: "0.6rem",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "7px 16px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.55)",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.18)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "rgba(255,255,255,0.55)";
          }}
        >
          Reveal
        </button>
      )}
    </div>
  );
};
