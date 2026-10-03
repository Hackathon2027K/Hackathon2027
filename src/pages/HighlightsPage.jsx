import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroParallaxDemo from "../components/hero-parallax-demo";
import PPTSection from "../components/sections/PPTSection";

import crewImage from "../assets/highlights/crew.png"
import SRCASHackVideo from "../assets/highlights/srcas-1.0.mp4"

/* ── Lightbox ── */
const Lightbox = ({ photo, onClose }) => (
  <AnimatePresence>
    {photo && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24, cursor: "zoom-out",
        }}
      >
        <motion.img
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          src={photo.src}
          alt={photo.alt}
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 16, objectFit: "contain", cursor: "default" }}
        />
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 24,
            background: "rgba(255,255,255,0.12)", border: "none",
            color: "#fff", fontSize: 24, width: 44, height: 44,
            borderRadius: "50%", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function HighlightsPage() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div style={{ background: "#fff", color: "#111", fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh" }}>

      {/* ── PARALLAX HERO ── */}
      <HeroParallaxDemo />

      {/* ── SRCAS HACKATHON ── */}
      <section style={{ padding: "80px clamp(16px, 5vw, 60px)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#111", margin: "0 0 12px" }}>
              SRCAS Hackathon
            </h2>
            <p style={{ fontSize: "1.05rem", color: "#6b7280", marginBottom: 36 }}>
              Relive the memories from our first hackathon
            </p>
          </motion.div>

          {/* Video embed */}
          <div
            style={{
              width: "100%",
              aspectRatio: "16/9",
              overflow: "hidden",
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              background: "#000",
            }}
          >
            <video
              controls
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            >
              <source src={SRCASHackVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* ── COMMITTEE CREW ── */}
      <section style={{ padding: "80px clamp(16px, 5vw, 60px) 120px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p style={{
              fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.28em",
              textTransform: "uppercase", color: "#9ca3af", marginBottom: 24,
            }}>
              Committee Crew
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={crewImage}
              alt="SRCAS Hackathon Committee Crew"
              style={{ width: "100%", display: "block", objectFit: "cover" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />

      {/* <PPTSection /> */}
      
      <style>{`
        @media (max-width: 600px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  );
}
