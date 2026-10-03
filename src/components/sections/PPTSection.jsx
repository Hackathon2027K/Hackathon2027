import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   PPT Download Section
   Sits between two white sections; uses wavy SVG dividers to
   create smooth white → black → white transitions.
───────────────────────────────────────────────────────────── */
export default function PPTSection() {
  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
      lineHeight: 0,
    }}>

      {/* ── TOP WAVE ── */}
      <div style={{ background: "#ffffff", overflow: "hidden", lineHeight: 0, marginBottom: -2 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "60px", transform: "rotate(180deg)" }}
        >
          <path
            d="M1000 0H0v52C62.5 28 125 4 250 4c250 0 250 96 500 96 125 0 187.5-24 250-48V0Z"
            fill="#000"
          />
        </svg>
      </div>

      {/* ── MAIN DARK SECTION ── */}
      <section
        style={{
          position: "relative",
          background: "#000",
          overflow: "hidden",
          lineHeight: 1,
        }}
      >
        {/* Dot-grid texture */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div
          style={{
            position: "relative", zIndex: 2,
            maxWidth: "860px", margin: "0 auto",
            padding: "52px 40px 56px",
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center",
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}
          >
            <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.3)" }} />
            <p style={{
              fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.45)", textTransform: "uppercase", margin: 0,
            }}>
              Official Template
            </p>
            <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.3)" }} />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(1.8rem,3.5vw,3.2rem)", fontWeight: 900,
              lineHeight: 1.0, letterSpacing: "-0.045em",
              color: "#fff", margin: "0 0 24px",
            }}
          >
            Download Our{" "}
            <span style={{ WebkitTextStroke: "2.5px rgba(255,255,255,0.85)", color: "transparent" }}>
              Official PPT
            </span>{" "}
            Template
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(0.95rem,1.6vw,1.1rem)",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7, maxWidth: 560,
              margin: "0 0 32px",
            }}
          >
            All participants must use this official PPT template for their submissions.
            This ensures uniformity and fairness in presentation across all teams.
          </motion.p>

          {/* Download button */}
          <motion.a
            href="https://1drv.ms/p/c/ee26bfeaf9ec4963/ESZ_AjZI9t5HinELNXd6dpUBXVgB4lqo1Fi1_PylfmntbQ?e=GucJl1"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              padding: "16px 42px",
              background: "#fff", color: "#111",
              fontSize: "0.88rem", fontWeight: 800,
              letterSpacing: "0.06em", textTransform: "uppercase",
              borderRadius: 999, textDecoration: "none",
              transition: "box-shadow 0.3s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PPT
          </motion.a>

          {/* Fine print */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              marginTop: 28, lineHeight: 1,
              fontSize: "0.75rem", color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.04em",
            }}
          >
            PPTX format · Compatible with PowerPoint &amp; Google Slides
          </motion.p>
        </div>
      </section>

      {/* ── BOTTOM WAVE ── */}
      <div style={{ background: "#ffffff", overflow: "hidden", lineHeight: 0, marginTop: -2 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "60px" }}
        >
          <path
            d="M1000 0H0v52C62.5 28 125 4 250 4c250 0 250 96 500 96 125 0 187.5-24 250-48V0Z"
            fill="#000"
          />
        </svg>
      </div>

    </div>
  );
}
