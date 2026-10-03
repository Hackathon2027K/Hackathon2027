import React, { useState, useRef } from 'react';
import { useAuth } from '../../lib/useAuth';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton';
import {
  Clock, UserPlus, FileText, Unlock, Badge,
  Users, Coffee, Building, MapPin, ShieldCheck
} from 'lucide-react';


const SDG_IMAGES = {
  1: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Sustainable_Development_Goal_01NoPoverty.svg/960px-Sustainable_Development_Goal_01NoPoverty.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093018%22,",
  2: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Sustainable_Development_Goal_02ZeroHunger.svg/960px-Sustainable_Development_Goal_02ZeroHunger.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093219",
  3: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sustainable_Development_Goal_03GoodHealth.svg/960px-Sustainable_Development_Goal_03GoodHealth.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093219",
  4: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sustainable_Development_Goal_04QualityEducation.svg/960px-Sustainable_Development_Goal_04QualityEducation.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093221",
  5: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sustainable_Development_Goal_05GenderEquality.svg/960px-Sustainable_Development_Goal_05GenderEquality.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093223",
  6: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Sustainable_Development_Goal_06CleanWater.svg/960px-Sustainable_Development_Goal_06CleanWater.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093224",
  15: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sustainable_Development_Goal_15LifeOnLand.svg/960px-Sustainable_Development_Goal_15LifeOnLand.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093233",
  16: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sustainable_Development_Goal_16Peace.svg/960px-Sustainable_Development_Goal_16Peace.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093234",
  17: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Sustainable_Development_Goals_-_logo.svg/250px-Sustainable_Development_Goals_-_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20220117130803"
};



const SDGCard = ({ imgSrc, alt, style }) => (
  <div style={{
    width: '140px',
    height: '140px',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    background: 'white',
    ...style
  }}>
    <img 
      src={imgSrc} 
      alt={alt} 
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  </div>
);

const ArcGroup = ({ children, containerRef, originX, originY, startAngle = 0, endAngle = 60, yStart = 0, yEnd = -100, style }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 10,
    damping: 0.9,
    mass: 0.3
  });

  const rotate = useTransform(smoothProgress, [0, 1], [startAngle, endAngle]);
  const y = useTransform(smoothProgress, [0, 1], [yStart, yEnd]);

  return (
    <motion.div style={{
      ...style,
      transformOrigin: `${originX} ${originY}`,
      rotate,
      y,
    }}>
      {children}
    </motion.div>
  );
};

const SpinElement = ({ children, containerRef, rotateRange = [0, 90], yRange = [0, -80], style }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 18,
    mass: 0.3
  });

  const rotate = useTransform(smoothProgress, [0, 1], rotateRange);
  const y = useTransform(smoothProgress, [0, 1], yRange);

  return <motion.div style={{ ...style, rotate, y }}>{children}</motion.div>;
};

const guidelinesPart1 = [
  {
    id: '01', title: '24-Hour Hackathon',
    description: 'A thrilling 24-hour coding marathon where teams collaborate, innovate, and build amazing solutions from scratch.',
    icon: Clock
  },
  {
    id: '02', title: 'Register with Ease',
    description: 'Registration is now open! Join us for an amazing hackathon experience.',
    icon: UserPlus
  },
  {
    id: '03', title: 'Use Official PPT Template',
    description: 'Download and use our official PPT template for submissions. Ensure uniformity and professionalism in your presentation.',
    icon: FileText
  },
  {
    id: '04', title: 'No Prerequisites',
    description: 'Any college student can join, no prerequisites—just bring your creativity!',
    icon: Unlock
  },
  {
    id: '05', title: 'ID Card Mandatory',
    description: 'All participants must carry their valid college ID cards throughout the event for identification and security purposes.',
    icon: Badge
  }
];

const guidelinesPart2 = [
  {
    id: '06', title: 'Form Team',
    description: 'Team up with 2-4 members from the same college; join our community to find teammates and get the latest updates!',
    icon: Users
  },
  {
    id: '07', title: 'Food and refreshments',
    description: 'Food and refreshments will be provided throughout the event.',
    icon: Coffee
  },
  {
    id: '08', title: 'In-person Event',
    description: 'SRCAS Hackathon 3.0 is an in-person (offline) hackathon event at SRCAS Coimbatore.',
    icon: Building
  },
  {
    id: '09', title: 'Venue',
    description: 'SRCAS Coimbatore awaits—explore our beautiful campus and bring innovative ideas to life.',
    icon: MapPin
  },
  {
    id: '10', title: 'Safe and Secure',
    description: 'Organized by Sri Ramakrishna College of Arts and Science for an inclusive and secure environment for everyone.',
    icon: ShieldCheck
  }
];

const GuidelineItem = ({ item, accentColor, glowColor, isLast }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        cursor: "default",
        paddingBottom: "36px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(!isHovered)}
    >
      {/* Timeline track for this item */}
      {!isLast && (
        <div style={{
          position: "absolute",
          top: 38,
          bottom: 0,
          left: 15,
          width: 2,
          background: "#e8e8e8",
          zIndex: 0,
        }} />
      )}

      {/* Timeline Dot */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: 32,
        flexShrink: 0,
        display: "flex",
        justifyContent: "center",
        paddingTop: 22,
      }}>
        <motion.div
          animate={{ scale: isHovered ? 1.3 : 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "white",
            border: `2px solid ${accentColor}`,
            position: "relative",
            boxShadow: isHovered ? `0 0 12px ${glowColor}` : "none",
          }}
        >
          <div style={{
            position: "absolute",
            inset: 2,
            borderRadius: "50%",
            backgroundColor: accentColor,
            opacity: isHovered ? 1 : 0.5,
            transition: "opacity 0.3s",
          }} />
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, flex: 1, paddingLeft: 20 }}>
        <div style={{
          transition: "all 0.3s ease",
          borderRadius: 16,
          padding: "14px 20px",
          backgroundColor: isHovered ? "white" : "transparent",
          boxShadow: isHovered ? "0 10px 40px -10px rgba(0,0,0,0.08)" : "none",
          border: isHovered ? "1px solid #f4f4f5" : "1px solid transparent",
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: accentColor,
              flexShrink: 0,
            }}>
              {item.id}
            </span>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#111",
              margin: 0,
              flex: 1,
            }}>
              {item.title}
            </h3>
            <div style={{
              opacity: isHovered ? 1 : 0.25,
              transition: "opacity 0.3s",
              flexShrink: 0,
            }}>
              <Icon size={20} style={{ color: accentColor }} />
            </div>
          </div>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p style={{
              fontSize: "0.95rem",
              lineHeight: 1.65,
              color: "#666",
              margin: "10px 0 0 0",
            }}>
              {item.description}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function GuidelinesSection() {
  const sectionRef = useRef(null);
  const user = useAuth();
  return (
    <section ref={sectionRef} id="finalists" style={{
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

      {/* Floating Parallax SDG Cards — Half-circle arcs that rotate as a group */}
      <div className="hidden lg:block" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        
        {/* ── LEFT ARC: Entire group rotates ~quarter turn clockwise ── */}
        <ArcGroup
          containerRef={sectionRef}
          originX="-200px"
          originY="50%"
          startAngle={-15}
          endAngle={75}
          yStart={40}
          yEnd={-60}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '300px',
            height: '100%',
            opacity: 0.35,
          }}
        >
          {/* Cards positioned along the arc relative to the group */}
          {[
            { goal: 1, angle: -70 },
            { goal: 2, angle: -40 },
            { goal: 3, angle: -10 },
            { goal: 4, angle:  20 },
            { goal: 5, angle:  50 },
            { goal: 6, angle:  80 },
          ].map(({ goal, angle }) => {
            const rad = (angle * Math.PI) / 180;
            const radius = 350; // increased radius for more gap
            const cx = -160;
            const cy = 50; // %
            const x = cx + radius * Math.cos(rad);
            const yPct = cy + (radius * Math.sin(rad)) / 10;
            return (
              <div
                key={goal}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${yPct}%`,
                  transform: `rotate(${angle + 90}deg)`,
                }}
              >
                <SDGCard imgSrc={SDG_IMAGES[goal]} alt={`Goal ${goal}`} />
              </div>
            );
          })}
        </ArcGroup>

        {/* ── RIGHT ARC: Entire group rotates ~quarter turn counter-clockwise ── */}
        <ArcGroup
          containerRef={sectionRef}
          originX="calc(100% + 200px)"
          originY="80%"
          startAngle={15}
          endAngle={-75}
          yStart={30}
          yEnd={-50}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '100%',
            opacity: 0.35,
          }}
        >
          {[
            { goal: 15, angle: 150 },
            { goal: 16, angle: 180 },
            { goal: 17, angle: 210 },
          ].map(({ goal, angle }) => {
            const rad = (angle * Math.PI) / 180;
            const radius = 280; // increased radius
            const cx = 350;
            const cy = 65;
            const x = cx + radius * Math.cos(rad);
            const yPct = cy + (radius * Math.sin(rad)) / 10;
            return (
              <div
                key={goal}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${yPct}%`,
                  transform: `rotate(${angle + 90}deg)`,
                }}
              >
                <SDGCard imgSrc={SDG_IMAGES[goal]} alt={`Goal ${goal}`} />
              </div>
            );
          })}
        </ArcGroup>

        {/* SDG Wheel — Top Right */}
        <SpinElement
          containerRef={sectionRef}
          rotateRange={[0, -90]}
          yRange={[0, 40]}
          style={{
            position: 'absolute',
            top: '8%',
            right: '8%',
            opacity: 0.15,
          }}
        >
          <img
            src={SDG_IMAGES[17]}
            alt="SDG Wheel Top"
            style={{ width: '120px', height: '120px', objectFit: 'contain' }}
          />
        </SpinElement>

        {/* SDG Wheel — spins independently at bottom-right */}
        <SpinElement
          containerRef={sectionRef}
          rotateRange={[0, 120]}
          yRange={[0, -60]}
          style={{
            position: 'absolute',
            bottom: '-4%',
            right: '-3%',
            opacity: 0.25,
          }}
        >
          <img
            src={SDG_IMAGES[17]}
            alt="SDG Wheel"
            style={{ width: '220px', height: '220px', objectFit: 'contain' }}
          />
        </SpinElement>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem", position: "relative", zIndex: 1 }}>
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 64, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 28, height: 1, background: "#111" }} />
            <p style={{
              fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em",
              color: "#111", textTransform: "uppercase", margin: 0,
            }}>Event Guidelines</p>
            <div style={{ width: 28, height: 1, background: "#111" }} />
          </div>
          
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 900,
            lineHeight: 1.05, letterSpacing: "-0.04em", color: "#111", margin: 0,
          }}>
            Before You Begin. <br className="hidden md:block" />
            <span style={{ color: "#777" }}>Everything you need to know.</span>
          </h2>
        </motion.div>

        {/* Two Columns */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "40px md:gap-[80px]", 
          marginTop: "60px" 
        }} className="md:grid-cols-2">
          
          {/* Column 1 - Part 1 (Black Accent) */}
          <div>
            <div style={{ marginBottom: "24px", paddingLeft: "16px" }}>
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em",
                color: "#888", textTransform: "uppercase", fontFamily: "monospace"
              }}>
                Part 1 // Essentials
              </span>
            </div>
            
            <div className="flex flex-col">
              {guidelinesPart1.map((item, index) => (
                <GuidelineItem 
                  key={item.id} 
                  item={item} 
                  accentColor="#000000"
                  glowColor="rgba(0, 0, 0, 0.2)"
                  isLast={index === guidelinesPart1.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Column 2 - Part 2 (Blue Accent) */}
          <div className="mt-8 md:mt-0">
            <div style={{ marginBottom: "24px", paddingLeft: "16px" }}>
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em",
                color: "#888", textTransform: "uppercase", fontFamily: "monospace"
              }}>
                Part 2 // Logistics
              </span>
            </div>
            
            <div className="flex flex-col">
              {guidelinesPart2.map((item, index) => (
                <GuidelineItem 
                  key={item.id} 
                  item={item} 
                  accentColor="#0078D4"
                  glowColor="rgba(0, 120, 212, 0.3)"
                  isLast={index === guidelinesPart2.length - 1}
                />
              ))}
            </div>
          </div>

        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: 60,
            padding: '32px 36px',
            background: '#0a0a0a',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div aria-hidden style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
          }} />
          <div>
            <p style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', margin: '0 0 8px',
            }}>Ready to compete?</p>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1rem,2vw,1.2rem)', fontWeight: 800,
              color: '#fff', margin: 0, lineHeight: 1.3,
            }}>
              Registration is free. No prerequisites.
            </p>
          </div>
          
          <a
            href={user ? "/dashboard" : "/register"}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "15px 30px",
              background: "#fff", color: "#111",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800, fontSize: "0.88rem",
              letterSpacing: "-0.01em", borderRadius: 13,
              textDecoration: "none", flexShrink: 0,
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.16)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {user ? "Dashboard" : "Register Now"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
