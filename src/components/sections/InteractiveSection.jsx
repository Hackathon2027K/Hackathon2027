import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton';

const PILLS = [
  { text: 'AI & ML', color: '#FA72F8' },
  { text: 'Web3', color: '#4ADE80' },
  { text: 'IoT', color: '#FB923C' },
  { text: 'Cloud', color: '#FDE047' },
  { text: 'Security', color: '#F43F5E' },
  { text: 'FinTech', color: '#38BDF8' },
];

export default function InteractiveSection() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [bodies, setBodies] = useState([]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    
    // Set low gravity for a floaty feel
    engine.world.gravity.y = 0.5;

    const width = sceneRef.current.clientWidth;
    const height = 400; // Fixed height container

    // Create boundaries
    const wallOptions = { 
      isStatic: true, 
      render: { visible: false },
      friction: 0.1,
      restitution: 0.5
    };
    
    const ground = Bodies.rectangle(width / 2, height + 25, width * 2, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height * 2, wallOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height * 2, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -25, width * 2, 50, wallOptions);

    Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    // Create pill bodies
    const newBodies = PILLS.map((pill) => {
      // Responsive sizing
      const isMobile = window.innerWidth < 768;
      const baseWidthMultiplier = isMobile ? 12 : 16;
      const pillWidth = pill.text.length * baseWidthMultiplier + (isMobile ? 40 : 60); 
      const pillHeight = isMobile ? 48 : 64;
      
      // Random starting positions
      const x = Math.random() * (width - 150) + 75;
      const y = Math.random() * (height - 150) + 50;

      const body = Bodies.rectangle(x, y, pillWidth, pillHeight, {
        chamfer: { radius: pillHeight / 2 },
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.02,
        angle: (Math.random() - 0.5) * 1.5, // Random initial rotation
      });

      Composite.add(engine.world, body);

      return {
        id: body.id,
        body: body,
        text: pill.text,
        color: pill.color,
        width: pillWidth,
        height: pillHeight,
        fontSize: isMobile ? '1.1rem' : '1.4rem'
      };
    });

    setBodies(newBodies);

    // Add mouse control directly to the DOM element
    const mouse = Mouse.create(sceneRef.current);
    
    // For DOM based matter.js without a scaled canvas, we typically do NOT want to scale the pixel ratio
    // because touch events return CSS coordinates, which match our DOM perfectly.
    // Ensure mouse offset stays zeroed to our container
    Matter.Mouse.setOffset(mouse, { x: 0, y: 0 });

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    
    Composite.add(engine.world, mouseConstraint);

    // Run the engine
    const runner = Runner.create();
    Runner.run(runner, engine);

    // DOM sync loop
    let animationFrame;
    const update = () => {
      newBodies.forEach((b) => {
        const el = document.getElementById(`pill-${b.id}`);
        if (el) {
          const { x, y } = b.body.position;
          const angle = b.body.angle;
          el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}rad)`;
        }
      });
      animationFrame = requestAnimationFrame(update);
    };
    update();

    // Handle resize to move right wall
    const handleResize = () => {
      if (!sceneRef.current) return;
      const newWidth = sceneRef.current.clientWidth;
      Matter.Body.setPosition(rightWall, { x: newWidth + 25, y: height / 2 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  return (
    <section style={{
      position: "relative",
      padding: "100px 0 100px",
      backgroundColor: "#fff",
      overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* Fine grid (matches TimelineSection) */}
      <svg aria-hidden style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        opacity: 0.03, pointerEvents: "none",
      }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`v${i}`} x1={`${(i+1)*7.14}%`} y1="0" x2={`${(i+1)*7.14}%`} y2="100%" stroke="#000" strokeWidth="1"/>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={`${(i+1)*10}%`} x2="100%" y2={`${(i+1)*10}%`} stroke="#000" strokeWidth="1"/>
        ))}
      </svg>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem", position: "relative", zIndex: 1 }}>
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 64, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
        >
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(2.6rem,6vw,5rem)", fontWeight: 900,
            lineHeight: 1.0, letterSpacing: "-0.045em", color: "#111", margin: 0,
          }}>
            Experience{" "}
            <span style={{ WebkitTextStroke: "2.5px #111", color: "transparent" }}>
              Interactive
            </span>
            <span style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", fontFamily: "sans-serif" , color: "#777", fontWeight: 400, marginTop: "10px", display: "inline-block" }}>
              Experience the power of technology through interactive animations
            </span>
          </h2>
        </motion.div>

        {/* Physics Container */}
        <div className="flex justify-center w-full">
          <div
            ref={sceneRef}
            className="relative w-full max-w-4xl h-100 bg-[#0a0a0a] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl"
            style={{
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            {bodies.map((b) => (
              <div
                key={b.id}
                id={`pill-${b.id}`}
                className="absolute top-0 left-0 flex items-center justify-center font-bold text-zinc-900 pointer-events-none select-none shadow-lg"
                style={{
                  width: b.width,
                  height: b.height,
                  backgroundColor: b.color,
                  borderRadius: b.height / 2,
                  fontSize: b.fontSize,
                  willChange: 'transform',
                }}
              >
                {b.text}
              </div>
            ))}

            {/* Grab hint — fades out after first interaction */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
              style={{
                position: 'absolute', bottom: 18, left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 16px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                pointerEvents: 'none',
              }}
            >
              {/* animated hand icon */}
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '0.9rem', lineHeight: 1 }}
              >✦</motion.span>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>Grab & drag the pills</span>
            </motion.div>
          </div>
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 14, flexWrap: 'wrap',
          }}
        >
          <p style={{
            fontSize: '0.9rem', color: '#888',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            margin: 0,
          }}>
            Build the next breakthrough in any of these domains.
          </p>
          <MagneticButton href="#problems" variant="dark" size="md">
            View Problems
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  );
}
