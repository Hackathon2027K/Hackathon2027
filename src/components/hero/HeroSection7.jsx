import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { theme } from '../../theme';
import { useAuth } from '../../lib/useAuth';
import srcasLogo from '../../assets/logo/srcas-logo.png';
import msLogo from '../../assets/logo/microsoft.png';
import igeniusLogo from '../../assets/logo/igenius.png';

// SDG Image URLs (Official UN Icons)
const SDG_IMAGES = {
  3: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sustainable_Development_Goal_03GoodHealth.svg/960px-Sustainable_Development_Goal_03GoodHealth.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093219",
  4: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sustainable_Development_Goal_04QualityEducation.svg/960px-Sustainable_Development_Goal_04QualityEducation.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093221",
  5: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sustainable_Development_Goal_05GenderEquality.svg/960px-Sustainable_Development_Goal_05GenderEquality.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093223",
  7: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Sustainable_Development_Goal_07CleanEnergy.svg/960px-Sustainable_Development_Goal_07CleanEnergy.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093224",
  10: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Sustainable_Development_Goal_10ReducedInequalities.svg/960px-Sustainable_Development_Goal_10ReducedInequalities.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093226",
  13: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sustainable_Development_Goal_13Climate.svg/960px-Sustainable_Development_Goal_13Climate.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093231",
};

const StarIcon = ({ size = 20, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const SDGWheel = ({ size = 40, blur = 0, style }) => (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Sustainable_Development_Goals_-_logo.svg/250px-Sustainable_Development_Goals_-_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20220117130803"
    alt="SDG Logo"
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      filter: blur ? `blur(${blur}px)` : 'none',
      objectFit: 'contain',
      ...style
    }}
  />
);

const Leaf = ({ size = 20, blur = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#84cc16" style={{ filter: blur ? `blur(${blur}px)` : 'none' }}>
    <path d="M12 22C12 22 4 16 4 10C4 6 7 2 12 2C17 2 20 6 20 10C20 16 12 22 12 22Z" opacity="0.8"/>
  </svg>
);

// const LightbulbIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
//     <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path>
//     <path d="M9 18h6"></path>
//     <path d="M10 22h4"></path>
//   </svg>
// );

// const GraduationCapIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
//     <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
//     <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
//   </svg>
// );

// const SproutIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
//     <path d="M7 20h10"></path>
//     <path d="M10 20c5.5-2.5.8-6.4 3-10"></path>
//     <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"></path>
//     <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"></path>
//   </svg>
// );

// const CpuIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
//     <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
//     <rect x="9" y="9" width="6" height="6"></rect>
//     <line x1="9" y1="1" x2="9" y2="4"></line>
//     <line x1="15" y1="1" x2="15" y2="4"></line>
//     <line x1="9" y1="20" x2="9" y2="23"></line>
//     <line x1="15" y1="20" x2="15" y2="23"></line>
//     <line x1="20" y1="9" x2="23" y2="9"></line>
//     <line x1="20" y1="14" x2="23" y2="14"></line>
//     <line x1="1" y1="9" x2="4" y2="9"></line>
//     <line x1="1" y1="14" x2="4" y2="14"></line>
//   </svg>
// );

// const HandshakeIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
//     <path d="m11 17 2 2a1 1 0 1 0 3-3"></path>
//     <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path>
//     <path d="m21 3-6 6"></path>
//     <path d="M8.4 10.4 5.3 7.3a2.8 2.8 0 0 0-3.9 3.9l5.6 5.6a2 2 0 0 0 2.8 0l2.1-2.1a2 2 0 0 0 0-2.8l-3.5-3.5"></path>
//   </svg>
// );

// const UsersIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
//     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
//     <circle cx="9" cy="7" r="4"></circle>
//     <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
//     <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
//   </svg>
// );

// const BookOpenIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
//     <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
//     <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
//   </svg>
// );

// const GenderEqualIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="10" r="5"></circle>
//     <path d="M12 15v7"></path>
//     <path d="M9 19h6"></path>
//     <path d="M10 10h4"></path>
//     <path d="M10 8h4"></path>
//   </svg>
// );

const FloatingIcon = ({ icon: Icon, color, size = 32, blur = 0, opacity = 0.8, style }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size * 1.8,
    height: size * 1.8,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${color}22, ${color}44)`,
    border: `1px solid ${color}44`,
    boxShadow: `0 8px 32px ${color}33`,
    backdropFilter: 'blur(8px)',
    filter: blur ? `blur(${blur}px)` : 'none',
    opacity,
    ...style
  }}>
    <Icon size={size} color={color} />
  </div>
);


const SDGCard = ({ imgSrc, alt, style }) => (
  <div className="hero-sdg-card" style={{
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
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

const ParallaxElement = ({ children, yOffset = 100, initialRotate = 0, initialScale = 1, rotationSpeed = 0, style, className }) => {
  const { scrollY } = useScroll();
  
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 50,
    damping: 15,
    mass: 0.2
  });

  const y = useTransform(smoothScrollY, [0, 1000], [0, yOffset]);
  const rotate = useTransform(smoothScrollY, [0, 1000], [initialRotate, initialRotate + rotationSpeed]);

  return <motion.div className={className} style={{ ...style, y, rotate, scale: initialScale }}>{children}</motion.div>;
};

export default function HeroSection7() {
  const user = useAuth();
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} id="hero" style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#ffffff', overflow: 'hidden', fontFamily: theme.fonts.body, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Background Dots */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '28%', width: '8px', height: '8px', borderRadius: '50%', background: '#bbf7d0' }} />
        <div style={{ position: 'absolute', top: '55%', left: '26%', width: '8px', height: '8px', borderRadius: '50%', background: '#fed7aa' }} />
        <div style={{ position: 'absolute', top: '25%', right: '28%', width: '6px', height: '6px', borderRadius: '50%', background: '#bfdbfe' }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '22%', width: '8px', height: '8px', borderRadius: '50%', background: '#e5e7eb' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '48%', width: '6px', height: '6px', borderRadius: '50%', background: '#fbcfe8' }} />
        <div style={{ position: 'absolute', top: '40%', right: '12%', width: '8px', height: '8px', borderRadius: '50%', background: '#bbf7d0' }} />
      </div>

      {/* Header */}
      <header className="hero-header" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end", /* Align to the right side */
        padding: "24px 40px",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50
      }}>
        

        

        {/* Logos */}
        <div className="h1-logos-mobile-hide" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 800, fontSize: "1.4rem", color: '#111', marginRight: '8px' }}>
            SDG
            <SDGWheel size={32} style={{ borderRadius: '50%' }} />
          </div>
          
          {/* Unified Logos Card */}
          <div className="hero-logos-card" style={{ 
            display: "flex", 
            alignItems: "center", 
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
          }}>
            <span className="h1-logo-text" style={{ fontSize: "1rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap" }}>
              Organized by
            </span>
            
            <div className="logo-wrap-srcas">
              <img src={srcasLogo} alt="SRCAS" className="hero-logo-img logo-srcas" style={{ objectFit: "contain" }} />
            </div>
            
            <div className="hero-logo-divider" style={{ width: '1px', background: '#e5e7eb' }}></div>
            
            <div className="logo-wrap-igenius">
              <img src={igeniusLogo} alt="igeniusAI" className="hero-logo-img logo-igenius" style={{ objectFit: "contain" }} />
            </div>
            
            <div className="hero-logo-divider" style={{ width: '1px', background: '#e5e7eb' }}></div>
            
            <div className="logo-wrap-ms">
              <img src={msLogo} alt="Microsoft" className="hero-logo-img logo-ms" style={{ objectFit: "contain" }} />
            </div>
          </div>
        </div>
      </header>

      {/* Floating Elements with Parallax Effect */}
      <div className="hero-floating-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
        
        {/* SDG Image Cards - Top */}
        <ParallaxElement className="hero-logo-top-left" yOffset={-240} initialRotate={-10} rotationSpeed={15} initialScale={0.9} style={{ position: 'absolute', top: '15%', left: '12%' }}>
          <SDGCard imgSrc={SDG_IMAGES[3]} alt="Goal 3" />
        </ParallaxElement>

        <ParallaxElement className="hero-logo-top-right" yOffset={-180} initialRotate={12} rotationSpeed={-10} initialScale={0.85} style={{ position: 'absolute', top: '15%', right: '18%' }}>
          <SDGCard imgSrc={SDG_IMAGES[4]} alt="Goal 4" />
        </ParallaxElement>

        {/* SDG Image Cards - Bottom */}
        <ParallaxElement className="hero-logo-bottom-left" yOffset={-280} initialRotate={-15} rotationSpeed={20} initialScale={0.85} style={{ position: 'absolute', bottom: '25%', left: '10%' }}>
          <SDGCard imgSrc={SDG_IMAGES[5]} alt="Goal 5" />
        </ParallaxElement>

        <ParallaxElement className="hero-logo-bottom-right" yOffset={-320} initialRotate={8} rotationSpeed={-15} initialScale={0.9} style={{ position: 'absolute', bottom: '20%', right: '12%' }}>
          <SDGCard imgSrc={SDG_IMAGES[7]} alt="Goal 7" />
        </ParallaxElement>

        {/* Hidden on Mobile: Extra Cards, Wheels, Leaves */}
        <div className="hero-hide-mobile">
          <ParallaxElement yOffset={-190} initialRotate={-6} rotationSpeed={8} initialScale={0.8} style={{ position: 'absolute', bottom: '8%', right: '28%' }}>
            <SDGCard imgSrc={SDG_IMAGES[10]} alt="Goal 10" />
          </ParallaxElement>

          <ParallaxElement yOffset={-140} initialRotate={10} rotationSpeed={-12} initialScale={0.75} style={{ position: 'absolute', bottom: '5%', left: '16%' }}>
            <SDGCard imgSrc={SDG_IMAGES[13]} alt="Goal 13" />
          </ParallaxElement>

          {/* Blurry Wheels */}
          <ParallaxElement yOffset={-100} initialRotate={0} rotationSpeed={45} style={{ position: 'absolute', top: '35%', left: '8%' }}>
            <SDGWheel size={100} blur={2} />
          </ParallaxElement>
          
          <ParallaxElement yOffset={-300} initialRotate={0} rotationSpeed={-30} style={{ position: 'absolute', top: '25%', right: '5%' }}>
            <SDGWheel size={140} blur={4} />
          </ParallaxElement>

          <ParallaxElement yOffset={-250} initialRotate={0} rotationSpeed={60} style={{ position: 'absolute', bottom: '15%', left: '28%' }}>
            <SDGWheel size={120} blur={0} />
          </ParallaxElement>

          <ParallaxElement yOffset={-180} initialRotate={0} rotationSpeed={-40} style={{ position: 'absolute', bottom: '10%', right: '48%' }}>
            <SDGWheel size={90} blur={3} />
          </ParallaxElement>

          {/* Leaves */}
          <ParallaxElement yOffset={-150} initialRotate={45} rotationSpeed={30} style={{ position: 'absolute', top: '18%', left: '10%' }}>
            <Leaf size={32} blur={1} />
          </ParallaxElement>
          <ParallaxElement yOffset={-80} initialRotate={-30} rotationSpeed={-45} style={{ position: 'absolute', top: '25%', right: '26%' }}>
            <Leaf size={28} blur={2} />
          </ParallaxElement>
          <ParallaxElement yOffset={-200} initialRotate={15} rotationSpeed={40} style={{ position: 'absolute', bottom: '28%', left: '22%' }}>
            <Leaf size={45} blur={1} />
          </ParallaxElement>
          <ParallaxElement yOffset={-120} initialRotate={-60} rotationSpeed={-35} style={{ position: 'absolute', bottom: '22%', right: '8%' }}>
            <Leaf size={38} blur={2} />
          </ParallaxElement>
        </div>

        {/* Kept on Mobile: Large Wheel at Bottom */}
        <ParallaxElement className="hero-wheel-bottom" yOffset={-200} initialRotate={0} rotationSpeed={-20} style={{ position: 'absolute', bottom: '-15%', right: '-5%' }}>
          <SDGWheel size={280} blur={8} />
        </ParallaxElement>

        {/* Floating Concept Icons */}
        {/* <ParallaxElement yOffset={-160} initialRotate={-10} rotationSpeed={20} style={{ position: 'absolute', top: '10%', left: '30%' }}>
          <FloatingIcon icon={LightbulbIcon} color="#f59e0b" size={28} blur={0.5} opacity={0.9} />
        </ParallaxElement>
        <ParallaxElement yOffset={-220} initialRotate={15} rotationSpeed={-15} style={{ position: 'absolute', top: '25%', right: '35%' }}>
          <FloatingIcon icon={GraduationCapIcon} color="#3b82f6" size={32} opacity={0.8} />
        </ParallaxElement> */}
        {/* <ParallaxElement yOffset={-180} initialRotate={-5} rotationSpeed={10} style={{ position: 'absolute', bottom: '40%', left: '15%' }}>
          <FloatingIcon icon={SproutIcon} color="#22c55e" size={24} blur={1} opacity={0.7} />
        </ParallaxElement> */}
        {/* <ParallaxElement yOffset={-250} initialRotate={20} rotationSpeed={-25} style={{ position: 'absolute', bottom: '35%', right: '20%' }}>
          <FloatingIcon icon={CpuIcon} color="#10b981" size={36} opacity={0.85} />
        </ParallaxElement> */}
        {/* <ParallaxElement yOffset={-130} initialRotate={-15} rotationSpeed={15} style={{ position: 'absolute', top: '45%', left: '20%' }}>
          <FloatingIcon icon={HandshakeIcon} color="#8b5cf6" size={28} opacity={0.8} />
        </ParallaxElement> */}
        {/* <ParallaxElement yOffset={-210} initialRotate={5} rotationSpeed={-20} style={{ position: 'absolute', top: '15%', right: '45%' }}>
          <FloatingIcon icon={UsersIcon} color="#ec4899" size={26} blur={0.5} opacity={0.9} />
        </ParallaxElement> */}
        {/* <ParallaxElement yOffset={-260} initialRotate={-20} rotationSpeed={25} style={{ position: 'absolute', bottom: '15%', left: '35%' }}>
          <FloatingIcon icon={BookOpenIcon} color="#06b6d4" size={30} opacity={0.8} />
        </ParallaxElement>
        <ParallaxElement yOffset={-140} initialRotate={10} rotationSpeed={-10} style={{ position: 'absolute', bottom: '45%', right: '10%' }}>
          <FloatingIcon icon={GenderEqualIcon} color="#ef4444" size={24} blur={1} opacity={0.7} />
        </ParallaxElement>  */}

        
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Center Logo & Badge */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginBottom: '0px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <SDGWheel size={44} />
          
          {/* Mini badge */}
          <motion.div className="hero-mini-badge-hide" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', border: '1px solid #e5e7eb', borderRadius: 100, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4c9f38', display: 'inline-block' }} />
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#4c9f38', textTransform: 'uppercase' }}>
              Registration Open!
            </span>
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px', marginBottom: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', 
              fontWeight: 800, 
              color: '#374151', 
              margin: 0, 
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <span>SRCAS</span>
              <span style={{ color: '#0562f8ff', fontFamily: theme.fonts.pixel, letterSpacing: '0.02em', textTransform: 'none' }}>Hackathon 3.0!</span>
            </h2>
          </div>

          <div style={{ position: 'relative', marginTop: '12px' }}>
            {/* Left yellow burst lines */}
            <svg style={{ position: 'absolute', top: '10px', left: '-50px', width: 40, height: 40, overflow: 'visible' }}>
              <path d="M 30 10 L 10 -5" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
              <path d="M 25 30 L 5 25" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
              <circle cx="0" cy="5" r="3" fill="#fb923c" />
            </svg>
            {/* Right yellow burst lines */}
            <svg style={{ position: 'absolute', top: '10px', right: '-50px', width: 40, height: 40, overflow: 'visible' }}>
              <path d="M 10 10 L 30 -5" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
              <path d="M 15 30 L 35 25" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <h1 className="hero-main-heading" style={{ 
              fontSize: 'clamp(3.5rem, 8vw, 7.5rem)', 
              fontWeight: 900, 
              color: '#111', 
              lineHeight: 1.05, 
              letterSpacing: '-0.02em', 
              margin: 0,
              textAlign: 'center'
            }}>
              What's Next <br/>
              <span style={{ 
                color: '#0562f8ff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
              }}> 
              <span>Big Idea!</span>
              </span> 
            </h1>
          </div>
        </motion.div>

        {/* Subtext */}
        <motion.div className="hero-subtext-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '520px', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
              India's premier national-level hackathon. Build tech-driven solutions for the 17 UN Sustainable Development Goals.
            </p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to={user ? "/dashboard" : "/register"} style={{ textDecoration: 'none' }}>
            <div className="hero-btn">
              <div className="hero-bg" />
              <div className="hero-border" />
              <div className="hero-content">
                <div className="hero-svgBox">
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={100} height={4} className="hero-svgLine">
                    <line className="hero-line" x1={0} y1={2} x2={100} y2={2} fill="none" strokeLinecap="round" strokeWidth={2} strokeDasharray={60} />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={200} height={4} className="hero-svgLine">
                    <line className="hero-line" x1={0} y1={2} x2={100} y2={2} fill="none" strokeLinecap="round" strokeWidth={2} strokeDasharray={60} />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={100} height={4} className="hero-svgLine">
                    <line className="hero-line" x1={0} y1={2} x2={100} y2={2} fill="none" strokeLinecap="round" strokeWidth={2} strokeDasharray={60} />
                  </svg>
                </div>
                <span className="hero-text" data-text="GO">{user ? "My Dashboard" : "REGISTER NOW"}</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Pills */}
        <div className="h1-pills-mobile-hide" style={{ display: "flex", alignItems: "center", marginTop: "40px"   }}>
          <div style={{
            backgroundColor: "#111",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: "30px 0 0 30px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <StarIcon size={12} fill="#fff" /> NATIONAL HACKATHON 2026
          </div>
          <div style={{
            backgroundColor: "#fff",
            color: "#6b7280",
            padding: "8px 20px",
            borderRadius: "0 30px 30px 0",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            border: "1px solid #e5e7eb",
            borderLeft: "none"
          }}>
            #BUILD THE FUTURE
          </div>
        </div>

      </div>
      
      <style>{`
        /* Custom Hero Button Styles */
        .hero-btn {
          --card-w: 220px;
          --card-h: 52px;
          width: var(--card-w);
          height: var(--card-h);
          border: 2px solid #333;
          border-radius: 8px;
          display: grid;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background-color: #222;
          transition: transform 0.1s ease-in-out;
          user-select: none;
        }
        .hero-btn:active { transform: scale(0.95); }
        .hero-btn:hover .hero-border { opacity: 1; }
        .hero-btn:hover .hero-bg {
          animation-play-state: paused;
          filter: grayscale(0);
        }
        .hero-btn:hover .hero-bg::before {
          animation-play-state: running;
          opacity: 0.6;
        }
        .hero-btn:hover .hero-text { transform: skewX(-15deg); }
        .hero-btn:hover .hero-svgBox {
          opacity: 1;
          width: 50px;
        }

        .hero-bg {
          --size: calc(max(var(--card-w), var(--card-h)) * 1.25);
          width: var(--size);
          height: var(--size);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: grayscale(1);
          animation: heroRotateBg 14s linear infinite;
          animation-play-state: running;
        }
        .hero-bg::before {
          content: "";
          width: 100%;
          height: 100%;
          display: block;
          background: repeating-conic-gradient(
            from 0deg at 50% 50%,
            rgba(246, 194, 92, 0.75) 0deg,
            rgba(246, 194, 92, 0.75) 15deg,
            transparent 15deg,
            transparent 30deg
          );
          opacity: 0.2;
          transition: opacity 0.3s ease-in-out;
          animation: heroRotateBgBefore 4s linear infinite;
          animation-play-state: paused;
        }

        @keyframes heroRotateBg { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes heroRotateBgBefore { to { transform: rotate(360deg); } }

        .hero-border {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 8px;
          box-shadow: inset 0 0 16px 0 rgba(194, 194, 194, 0.75);
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .hero-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .hero-text {
          display: block;
          font-size: 18px;
          font-weight: 900;
          color: #fff;
          position: relative;
          transition: transform 0.3s ease-in-out;
          text-transform: uppercase;
        }

        .hero-svgBox {
          width: 0px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;
          gap: 2px;
          transition: all 0.3s ease-in-out;
          opacity: 0;
        }
        .hero-svgLine { position: relative; }
        .hero-line {
          stroke: #fff;
          animation: heroAnimLine 0.6s linear infinite;
        }
        .hero-svgLine:nth-child(1) { transform: translateX(4px); }
        .hero-svgLine:nth-child(3) { transform: translateX(-4px); }
        .hero-svgLine:nth-child(1) .hero-line { animation-delay: 0.2s; }
        .hero-svgLine:nth-child(2) .hero-line { animation-delay: 0.1s; }

        @keyframes heroAnimLine {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 120; }
        }

        /* Custom Dashboard Button Styles */
        .dashboard-btn {
          border: 1.5px solid black;
          padding: 12px 30px;
          border-radius: 30px;
          background-color: #ffffff;
          font-weight: 800;
          font-size: 15px;
          color: #111;
          box-shadow: 0px 0px 1px;
          transition: all 0.3s ease;
          cursor: pointer;
          letter-spacing: 0.05em;
          height: 52px;
        }

        .dashboard-btn:hover {
          transform: translateY(-8px);
          box-shadow: 0px 8px 1px rgb(0, 0, 0);
        }

        .dashboard-btn:active {
          transform: translateY(4px);
          box-shadow: 0px 0px 1px;
        }

        .hero-logos-card {
          gap: 16px;
          padding: 0 20px;
          height: 80px;
        }

        .logo-wrap-srcas, .logo-wrap-igenius, .logo-wrap-ms {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .logo-wrap-srcas { width: 210px; overflow: visible; }
        .logo-wrap-igenius { width: 220px; }
        .logo-wrap-ms { width: 170px; }

        .logo-srcas { height: 60px !important; transform: scale(2.5); mix-blend-mode: multiply; margin-top: 8px; margin-left: 0; margin-right: 0; margin-bottom: 0; }
        .logo-igenius { height: 60px !important; transform: scale(2.8); mix-blend-mode: multiply; margin: 0; }
        .logo-ms { height: 60px !important; transform: scale(2.2); mix-blend-mode: multiply; margin: 0; }
        .hero-logo-divider {
          height: 40px;
          margin: 0 4px;
        }

        /* ── SDG Card default (Desktop) ── */
        .hero-sdg-card {
          width: 180px;
          height: 180px;
        }

        @media(max-width:1400px), (max-height: 800px) {
          .h1-logo-text { display: none !important; }
          .hero-mini-badge-hide { display: none !important; }
          .h1-pills-mobile-hide { display: none !important; }
          .hero-main-heading { font-size: clamp(3rem, 6vw, 5.5rem) !important; }
          .hero-subtext-container { margin-bottom: 24px !important; }
        }

        @media(max-width:1100px) {
          /* Slightly smaller SDG cards */
          .hero-sdg-card { width: 150px; height: 150px; }
          /* Push floating cards to edges */
          .hero-logo-top-left { left: 4% !important; }
          .hero-logo-top-right { right: 4% !important; }
          .hero-logo-bottom-left { left: 4% !important; }
          .hero-logo-bottom-right { right: 4% !important; }
        }

        @media(max-width:992px){
          .hero-logos-card {
            gap: 12px;
            padding: 0 14px;
            height: 60px;
          }

          .logo-wrap-srcas, .logo-wrap-igenius, .logo-wrap-ms { height: 40px; }
          .logo-wrap-srcas { width: 150px; overflow: visible; }
          .logo-wrap-igenius { width: 145px; }
          .logo-wrap-ms { width: 115px; }

          .logo-srcas { height: 40px !important; transform: scale(2.5); mix-blend-mode: multiply; margin-top: 6px; margin-left: 0; margin-right: 0; margin-bottom: 0; }
          .logo-igenius { height: 40px !important; transform: scale(2.8); mix-blend-mode: multiply; margin: 0; }
          .logo-ms { height: 40px !important; transform: scale(2.2); mix-blend-mode: multiply; margin: 0; }
          .hero-logo-divider { height: 32px; margin: 0 2px; }

          /* Smaller SDG cards */
          .hero-sdg-card { width: 120px; height: 120px; }
          .hero-logo-top-left { left: 2% !important; }
          .hero-logo-top-right { right: 2% !important; }
          .hero-logo-bottom-left { left: 2% !important; }
          .hero-logo-bottom-right { right: 2% !important; }
          .hero-floating-bg { opacity: 0.6; }
        }

        @media(max-width:640px){
          .h1-logos-mobile-hide { display: none !important; }
          .hero-header { padding: 16px 20px !important; justify-content: center !important; }
          .h1-pills-mobile-hide{display:none!important}
          .hero-hide-mobile { display: none !important; }
          .hero-floating-bg { opacity: 0.35; }

          /* Even smaller SDG cards */
          .hero-sdg-card { width: 90px; height: 90px; border-radius: 8px; }
          
          /* Position cards at edges */
          .hero-logo-top-left { top: 5% !important; left: -5% !important; }
          .hero-logo-top-right { top: 8% !important; right: -5% !important; left: auto !important; }
          .hero-logo-bottom-left { bottom: 20% !important; left: -5% !important; top: auto !important; }
          .hero-logo-bottom-right { bottom: 15% !important; right: -5% !important; left: auto !important; top: auto !important; }
          
          /* Center 1 wheel at the bottom */
          .hero-wheel-bottom { bottom: 0% !important; left: 50% !important; right: auto !important; margin-left: -140px !important; }
        }
      `}</style>
    </section>
  );
}
