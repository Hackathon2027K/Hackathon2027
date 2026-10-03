import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { theme } from '../../theme';
import sdgLogo from '../../assets/logo/sdg-logo-circle.png';

// Inlined so Vite doesn't choke on the space in "problem statements/" during peer-import resolution
const SDGs = [
  {
    id: 1, num: '01', title: 'No Poverty',
    color: '#E5243B',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Sustainable_Development_Goal_01NoPoverty.svg/960px-Sustainable_Development_Goal_01NoPoverty.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093018',
    imageUrl: 'https://images.unsplash.com/photo-1635929114944-8bab23b98e74?q=80&w=1534&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'End poverty in all its forms everywhere by 2030.',
    challenges: [
      'Build a digital platform connecting low-income families to financial aid, food banks, and government schemes using AI-driven eligibility matching.',
      'Design a micro-finance app that uses alternative credit-scoring to provide loans to those without bank accounts or formal credit history.',
    ],
  },
  {
    id: 2, num: '02', title: 'Zero Hunger',
    color: '#DDA63A',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Sustainable_Development_Goal_02ZeroHunger.svg/960px-Sustainable_Development_Goal_02ZeroHunger.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093219',
    imageUrl: 'https://images.unsplash.com/photo-1694286068611-d0c24cbc2cd5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UG92ZXJ0eSUyMEh1bmdlcnxlbnwwfHwwfHx8Mg%3D%3D',
    description: 'End hunger, achieve food security and improved nutrition.',
    challenges: [
      'Create an AI-powered crop yield prediction system that helps smallholder farmers optimize planting schedules and reduce food waste.',
      'Build a food redistribution network that connects surplus food from restaurants and markets to shelters and food banks in real-time.',
    ],
  },
  {
    id: 3, num: '03', title: 'Good Health',
    color: '#4C9F38',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sustainable_Development_Goal_03GoodHealth.svg/960px-Sustainable_Development_Goal_03GoodHealth.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093219',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R29vZCUyMEhlYWx0aHxlbnwwfHwwfHx8Mg%3D%3D',
    description: 'Ensure healthy lives and promote well-being for all at all ages.',
    challenges: [
      'Develop low-cost AI diagnostic tools for rural clinics that detect common diseases from basic images or symptoms with high accuracy.',
      'Build a mental health companion app with crisis detection, anonymous peer support, and integration with licensed therapists.',
    ],
  },
  {
    id: 4, num: '04', title: 'Quality Education',
    color: '#C5192D',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sustainable_Development_Goal_04QualityEducation.svg/960px-Sustainable_Development_Goal_04QualityEducation.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093221',
    imageUrl: 'https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFF1YWxpdHklMjBFZHVjYXRpb24lMjB0YW1pbHxlbnwwfHwwfHx8Mg%3D%3D',
    description: 'Ensure inclusive, equitable quality education for all.',
    challenges: [
      'Build an adaptive AI tutor that adjusts lesson complexity in real-time based on student comprehension, supporting 10+ regional languages.',
      'Create an offline-first learning platform for schools in bandwidth-limited areas, with teacher dashboards and progress analytics.',
    ],
  },
  {
    id: 5, num: '05', title: 'Gender Equality',
    color: '#FF3A21',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sustainable_Development_Goal_05GenderEquality.svg/960px-Sustainable_Development_Goal_05GenderEquality.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093223',
    imageUrl: 'https://images.unsplash.com/photo-1622675205169-901710ac8643?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEdlbmRlciUyMEVxdWFsaXR5fGVufDB8fDB8fHwy',
    description: 'Achieve gender equality and empower all women and girls.',
    challenges: [
      'Develop an anonymous reporting and legal aid platform for survivors of gender-based violence, with AI-powered case documentation.',
      'Build a bias-detection tool that audits job listings and HR practices for discriminatory language and patterns.',
    ],
  },
  {
    id: 6, num: '06', title: 'Clean Water',
    color: '#26BDE2',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Sustainable_Development_Goal_06CleanWaterSanitation.svg/960px-Sustainable_Development_Goal_06CleanWaterSanitation.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093223',
    imageUrl: 'https://images.unsplash.com/photo-1624948465027-6f9b51067557?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNsZWFuJTIwd2F0ZXJ8ZW58MHx8MHx8fDI%3D',
    description: 'Ensure access to water and sanitation for all.',
    challenges: [
      'Design an IoT water quality monitoring network that flags contamination events in real-time and alerts municipalities and households.',
      'Build a community sanitation tracker that maps open-defecation-free zones and guides NGOs to areas needing urgent intervention.',
    ],
  },
  {
    id: 7, num: '07', title: 'Clean Energy',
    color: '#FCC30B',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Sustainable_Development_Goal_07CleanEnergy.svg/960px-Sustainable_Development_Goal_07CleanEnergy.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093224',
    imageUrl: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q2xlYW4lMjBFbmVyZ3l8ZW58MHx8MHx8fDI%3D',
    description: 'Ensure access to affordable, reliable, sustainable energy.',
    challenges: [
      'Create an AI energy management system for micro-grids in rural villages powered by solar, balancing load and predicting demand.',
      'Build a marketplace platform for peer-to-peer renewable energy trading between prosumers and consumers in urban neighbourhoods.',
    ],
  },
  {
    id: 8, num: '08', title: 'Decent Work',
    color: '#A21942',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Sustainable_Development_Goal_08DecentWork.svg/960px-Sustainable_Development_Goal_08DecentWork.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093225',
    imageUrl: 'https://images.unsplash.com/photo-1733826544839-2282050204e6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZGVjZW50JTIwd29ya3xlbnwwfHwwfHx8Mg%3D%3D',
    description: 'Promote inclusive economic growth and decent work for all.',
    challenges: [
      'Develop a skills-matching platform for informal-sector workers that translates vernacular experience into verified digital credentials.',
      'Build a gig-worker wellbeing app that tracks income volatility, suggests diversification, and provides safety-net micro-insurance options.',
    ],
  },
  {
    id: 9, num: '09', title: 'Industry & Innovation',
    color: '#FD6925',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sustainable_Development_Goal_09Industry.svg/960px-Sustainable_Development_Goal_09Industry.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093227',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
    description: 'Build resilient infrastructure and foster innovation.',
    challenges: [
      'Design an AI-driven predictive maintenance system for public infrastructure (bridges, roads) using sensor data and computer vision.',
      'Build a startup incubator platform connecting rural entrepreneurs with mentors, funding, and markets using AI-based opportunity matching.',
    ],
  },
  {
    id: 10, num: '10', title: 'Reduced Inequalities',
    color: '#DD1367',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Sustainable_Development_Goal_10ReducedInequalities.svg/960px-Sustainable_Development_Goal_10ReducedInequalities.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093226',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    description: 'Reduce inequality within and among countries.',
    challenges: [
      'Develop an algorithmic audit tool that detects racial, gender, or socioeconomic bias in lending, hiring, or admissions AI systems.',
      'Build an accessible digital-public-services navigator for immigrants and refugees, supporting 20+ languages with step-by-step guidance.',
    ],
  },
  {
    id: 11, num: '11', title: 'Sustainable Cities',
    color: '#FD9D24',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Sustainable_Development_Goal_11SustainableCities.svg/960px-Sustainable_Development_Goal_11SustainableCities.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093228',
    imageUrl: 'https://images.unsplash.com/photo-1578913020856-1c5ded2ce3e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VzdGFpbmFibGUlMjBjaXRpZXN8ZW58MHx8MHx8fDI%3D',
    description: 'Make cities inclusive, safe, resilient and sustainable.',
    challenges: [
      'Create a smart traffic orchestration system using real-time sensor feeds and ML to reduce congestion and lower urban emissions.',
      'Build a civic engagement platform where residents can report infrastructure issues, vote on local budgets, and track government responses.',
    ],
  },
  {
    id: 12, num: '12', title: 'Responsible Consumption',
    color: '#BF8B2E',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Sustainable_Development_Goal_12ResponsibleConsumption.svg/960px-Sustainable_Development_Goal_12ResponsibleConsumption.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093228',
    imageUrl: 'https://images.unsplash.com/vector-1738396045672-e1675c8cb1a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVzcG9uc2libGUlMjBjb25zdW1wdGlvbnxlbnwwfHwwfHx8Mg%3D%3D',
    description: 'Ensure sustainable consumption and production patterns.',
    challenges: [
      'Design a product lifecycle tracker (using QR/blockchain) showing consumers the full environmental cost of a product from factory to disposal.',
      'Build an AI-powered waste sorting assistant for homes and businesses that gamifies recycling and tracks diversion rates.',
    ],
  },
  {
    id: 13, num: '13', title: 'Climate Action',
    color: '#3F7E44',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sustainable_Development_Goal_13Climate.svg/960px-Sustainable_Development_Goal_13Climate.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093231',
    imageUrl: 'https://images.unsplash.com/photo-1570095378004-ce65d6c2d5bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xpbWF0ZSUyMGFjdGlvbnxlbnwwfHwwfHx8Mg%3D%3D',
    description: 'Take urgent action to combat climate change.',
    challenges: [
      'Build a personal carbon footprint dashboard that integrates travel, diet, and energy data, then suggests and tracks offset actions.',
      'Develop an early-warning system for extreme weather events using satellite imagery and ML to protect vulnerable communities.',
    ],
  },
  {
    id: 14, num: '14', title: 'Life Below Water',
    color: '#0A97D9',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sustainable_Development_Goal_14LifeBelowWater.svg/960px-Sustainable_Development_Goal_14LifeBelowWater.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093229',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZpc2h8ZW58MHx8MHx8fDI%3D',
    description: 'Conserve and sustainably use oceans and marine resources.',
    challenges: [
      'Create a computer-vision system for fishing vessels that automatically identifies and rejects bycatch species before they are hauled aboard.',
      'Build a coral-reef health monitoring platform using underwater drone imagery and AI to predict bleaching events and guide restoration.',
    ],
  },
  {
    id: 15, num: '15', title: 'Life on Land',
    color: '#56C02B',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Sustainable_Development_Goal_15LifeOnLand.svg/960px-Sustainable_Development_Goal_15LifeOnLand.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093236',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    description: 'Protect, restore and promote sustainable use of ecosystems.',
    challenges: [
      'Develop a real-time deforestation alert system using satellite data and ML that notifies rangers and authorities within hours of illegal clearing.',
      'Build a biodiversity mapping app that lets citizen scientists log wildlife sightings, auto-classifies species via camera, and feeds open datasets.',
    ],
  },
  {
    id: 16, num: '16', title: 'Peace & Justice',
    color: '#00689D',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Sustainable_Development_Goal_16PeaceJusticeInstitutions.svg/960px-Sustainable_Development_Goal_16PeaceJusticeInstitutions.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093231',
    imageUrl: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=600&q=80',
    description: 'Promote just, peaceful and inclusive societies.',
    challenges: [
      'Build a transparent public-procurement tracker that uses ML to flag anomalous contracts and potential corruption in government spending.',
      'Design a legal-aid chatbot for low-income users that navigates jurisdictional law, drafts basic documents, and connects to pro-bono lawyers.',
    ],
  },
  {
    id: 17, num: '17', title: 'Partnerships',
    color: '#19486A',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sustainable_Development_Goal_17Partnerships.svg/960px-Sustainable_Development_Goal_17Partnerships.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093233',
    imageUrl: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UGFydG5lcnNoaXBzfGVufDB8fDB8fHwy',
    description: 'Strengthen global partnerships for sustainable development.',
    challenges: [
      'Create a cross-sector collaboration platform matching NGOs, governments, and startups based on complementary resources and shared SDG targets.',
      'Build an open data aggregator that standardises development metrics from 50+ countries, enabling transparent progress tracking toward the 2030 Agenda.',
    ],
  },
  {
    id: 18, num: '', title: 'Example Problem Statements',
    color: '#19486A',
    // logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sustainable_Development_Goal_17Partnerships.svg/960px-Sustainable_Development_Goal_17Partnerships.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093233',
    imageUrl: 'https://img.magnific.com/free-vector/creative-thinking-original-suggestion-non-standard-decision-problem-solving-man-with-big-lightbulb-cartoon-character-innovative-development_335657-2110.jpg?semt=ais_hybrid&w=740&q=80',
    description: 'Strengthen global partnerships for sustainable development.',
    challenges: [
      'Create a cross-sector collaboration platform matching NGOs, governments, and startups based on complementary resources and shared SDG targets.',
      'Build an open data aggregator that standardises development metrics from 50+ countries, enabling transparent progress tracking toward the 2030 Agenda.',
    ],
  },
];

export default function ProblemStatements() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // For horizontal sliding of the filmstrip track (desktop only)
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-85%']);

  const [activeSDG, setActiveSDG] = useState(SDGs[0]);
  const [mobileIndex, setMobileIndex] = useState(0);
  const isHoveringRef = useRef(false);
  const mobileScrollRef = useRef(null);

  // ── One-card-at-a-time swipe ─────────────────────────────────────────────────
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping   = useRef(false);   // locked to horizontal once determined

  const goToIndex = (idx) => {
    const next = Math.max(0, Math.min(idx, SDGs.length - 1));
    setMobileIndex(next);
    setActiveSDG(SDGs[next]);
    const el = mobileScrollRef.current;
    if (!el) return;
    // Each card slot = container width (one card fills the view)
    const slotWidth = el.clientWidth;
    el.scrollTo({ left: next * slotWidth, behavior: 'smooth' });
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const onTouchMove = (e) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Lock axis on first significant move
    if (!isSwiping.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      isSwiping.current = Math.abs(dx) > Math.abs(dy);
    }
    // Prevent page scroll only when swiping horizontally
    if (isSwiping.current) e.preventDefault();
  };

  const onTouchEnd = (e) => {
    if (!isSwiping.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const THRESHOLD = 40; // px — any swipe beyond this = advance one card
    if (dx < -THRESHOLD) goToIndex(mobileIndex + 1);
    else if (dx > THRESHOLD) goToIndex(mobileIndex - 1);
    else goToIndex(mobileIndex); // snap back if not far enough
    isSwiping.current = false;
  };

  // Attach passive:false so we can call preventDefault in onTouchMove
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el || !isMobile) return;
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, mobileIndex]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (isHoveringRef.current || isMobile) return;
      const index = Math.max(0, Math.min(Math.floor(latest * SDGs.length * 1.1), SDGs.length - 1));
      setActiveSDG(SDGs[index]);
    });
    return () => unsubscribe();
  }, [scrollYProgress, isMobile]);

  const handleHoverStart = (sdg) => {
    if (isMobile) return;
    isHoveringRef.current = true;
    setActiveSDG(sdg);
  };

  const handleHoverEnd = () => {
    if (isMobile) return;
    isHoveringRef.current = false;
  };

  const handleMobilePrev = () => goToIndex(mobileIndex - 1);
  const handleMobileNext = () => goToIndex(mobileIndex + 1);

  return (
    <section
      id="problems"
      ref={targetRef}
      style={{
        height: isMobile ? 'auto' : '400vh',
        background: '#ffffff',
        position: 'relative',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
        <div style={{
          position: isMobile ? 'relative' : 'sticky',
          top: 0,
          height: isMobile ? 'auto' : '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff',
        }}>
        {/* Title area */}
        <div style={{
          padding: isMobile ? '32px 6vw 16px' : 'clamp(10px, 2vh, 20px) 6vw clamp(5px, 1vh, 10px)',
          flexShrink: 0,
          background: '#ffffff',
          zIndex: 10,
          borderBottom: '1px solid #f0f0f0',
        }}>
          <p style={{
            fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.22em',
            color: '#999', marginBottom: '0.5rem', textTransform: 'uppercase',
          }}>
            Problem Statements
          </p>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: 700, color: '#333', 
            marginBottom: '0.6rem', lineHeight: 1.4, fontStyle: 'italic',
          }}>
            The floor is completely open to your ideas
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{
              fontFamily: theme.fonts.heading,
              fontSize: 'clamp(1.8rem, 3.8vw, 3.4rem)',
              fontWeight: 800, color: '#111111',
              letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              The <img src={sdgLogo} alt="SDG" style={{ height: 'clamp(4.4rem, 8vw, 7.6rem)', objectFit: 'contain' }} /> <span style={{ color: activeSDG.color, transition: 'color 0.4s ease' }}>Filmstrip</span>
            </h2>
            {/* Mobile nav buttons */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleMobilePrev}
                  disabled={mobileIndex === 0}
                  aria-label="Previous SDG"
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: `2px solid ${mobileIndex === 0 ? '#e0e0e0' : activeSDG.color}`,
                    background: mobileIndex === 0 ? '#f5f5f5' : activeSDG.color,
                    color: mobileIndex === 0 ? '#bbb' : '#fff',
                    fontSize: '18px', cursor: mobileIndex === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s ease',
                  }}
                >‹</button>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#666', minWidth: '48px', textAlign: 'center' }}>
                  {mobileIndex + 1} / {SDGs.length}
                </span>
                <button
                  onClick={handleMobileNext}
                  disabled={mobileIndex === SDGs.length - 1}
                  aria-label="Next SDG"
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: `2px solid ${mobileIndex === SDGs.length - 1 ? '#e0e0e0' : activeSDG.color}`,
                    background: mobileIndex === SDGs.length - 1 ? '#f5f5f5' : activeSDG.color,
                    color: mobileIndex === SDGs.length - 1 ? '#bbb' : '#fff',
                    fontSize: '18px', cursor: mobileIndex === SDGs.length - 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s ease',
                  }}
                >›</button>
              </div>
            )}
          </div>
          {isMobile && (
            <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
              ← Swipe left to explore all 17 Sustainable Development Goals
            </p>
          )}
          {!isMobile && (
            <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#999' }}>
              ↕ Scroll down to explore all 17 goals — hover a card to preview
            </p>
          )}
        </div>

        {/* Filmstrip Track */}
        {isMobile ? (
          // Mobile: one-card-at-a-time gallery swipe
          <div
            ref={mobileScrollRef}
            style={{
              display: 'flex',
              overflowX: 'hidden',   // hide scrollbar, we control scroll programmatically
              padding: '24px 0',
              WebkitOverflowScrolling: 'touch',
              userSelect: 'none',
            }}
            className="mobile-filmstrip"
          >
            {SDGs.map((sdg, idx) => {
              const isActive = activeSDG.id === sdg.id;
              return (
                <div
                  key={sdg.id}
                  style={{
                    minWidth: '100%',
                    padding: '0 6vw',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '340px',
                      height: '320px',
                      borderRadius: '24px',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: isActive
                        ? `0 20px 40px ${sdg.color}50`
                        : '0 8px 20px rgba(0,0,0,0.10)',
                      border: `2px solid ${isActive ? sdg.color : 'rgba(0,0,0,0.06)'}`,
                      transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
                      transform: isActive ? 'scale(1.02)' : 'scale(0.96)',
                    }}
                  >
                    <img
                      src={sdg.imageUrl}
                      alt={sdg.title}
                      draggable={false}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(0deg, ${sdg.color}CC 0%, rgba(0,0,0,0.45) 80%)`,
                    }} />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '16px',
                      zIndex: 2, color: '#fff',
                    }}>
                      <div style={{
                        background: 'rgba(0,0,0,0.35)',
                        padding: '4px 8px', borderRadius: '4px',
                        fontSize: '12px', fontWeight: 800,
                        display: 'inline-block', marginBottom: '6px',
                      }}>SDG {sdg.num}</div>
                      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}>{sdg.title}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Desktop: horizontal scroll filmstrip
          <div style={{
            flex: '1 1 auto',
            minHeight: '220px',
            maxHeight: '380px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10,
            overflow: 'visible',
            flexShrink: 1,
            marginBottom: '0px',
          }}>
            <motion.div
              style={{ x, display: 'flex', gap: '30px', padding: '0 6vw', alignItems: 'center' }}
            >
              {SDGs.map(sdg => {
                const isActive = activeSDG.id === sdg.id;
                return (
                  <motion.div
                    key={sdg.id}
                    onMouseEnter={() => handleHoverStart(sdg)}
                    onMouseLeave={handleHoverEnd}
                    animate={{
                      scale: isActive ? 1.01 : 0.95,
                      opacity: isActive ? 1 : 0.65,
                      y: isActive ? -4 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 'clamp(180px, 24vh, 240px)', height: 'clamp(220px, 32vh, 320px)',
                      borderRadius: '20px', position: 'relative',
                      overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                      boxShadow: isActive ? `0 20px 40px ${sdg.color}45` : '0 6px 16px rgba(0,0,0,0.10)',
                      border: `1px solid ${isActive ? sdg.color : 'rgba(0,0,0,0.08)'}`,
                      zIndex: isActive ? 10 : 5,
                    }}
                  >
                    <img src={sdg.imageUrl} alt={sdg.title}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(0deg, ${sdg.color}CC 0%, rgba(0,0,0,0.35) 60%)`, zIndex: 1,
                    }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '18px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                        color: '#fff', fontSize: '12px', fontWeight: 800,
                        padding: '3px 10px', borderRadius: '6px', alignSelf: 'flex-start',
                      }}>SDG {sdg.num}</div>
                      <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{sdg.title}</h3>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* Dedicated Bottom Panel */}
        <div style={{
          minHeight: '120px',
          background: '#f9f9f9',
          borderTop: '1.5px solid #ebebeb',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          position: 'relative',
          zIndex: 5,
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSDG.id}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: 'clamp(16px, 3vh, 32px) 6vw',
                height: '100%',
                display: 'flex',
                gap: 'clamp(20px, 4vw, 40px)',
                alignItems: 'center',
              }}
              className="bottom-panel-inner"
            >

              {activeSDG.id === 18 ? (
                /* ── Download panel ── */
                <div style={{ display: 'flex', alignItems: 'center', gap: 40, width: '100%', flexWrap: 'wrap' }}>
                  {/* Left: icon + title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: '0 0 auto' }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 18,
                      background: '#111',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="12" y1="18" x2="12" y2="12"/>
                        <polyline points="9 15 12 18 15 15"/>
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 'clamp(18px, 3vh, 24px)', fontWeight: 900, color: '#111', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                        Example Problem's
                      </h3>
                      <p style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600, margin: 0 }}>
                        30 curated challenges
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ width: 1, height: 56, background: '#e5e7eb', flexShrink: 0 }} className="panel-divider" />

                  {/* Middle: description */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontSize: 'clamp(13px, 2vh, 15px)', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
                      These are curated real-world challenges across 30 problem areas — from climate &amp; water to fraud, farming, and public health. Your idea must align with any UN SDG.
                    </p>
                  </div>

                  {/* Right: download button */}
                  <a
                    href="/problem-statement-2026.pdf"
                    download="Hackathon-Problem-Statement-2026.pdf"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '13px 26px', borderRadius: 100,
                      background: '#111', color: '#fff',
                      fontSize: '0.85rem', fontWeight: 800,
                      letterSpacing: '0.04em', textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      transition: 'background 0.2s, transform 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </a>
                </div>
              ) : (
                /* ── Normal SDG panel ── */
                <>
                  <div style={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div style={{
                        width: '64px', height: '64px',
                        borderRadius: '16px', background: `${activeSDG.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <img src={activeSDG.logoUrl} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 'clamp(18px, 3vh, 24px)', fontWeight: 800, color: '#111', margin: 0 }}>{activeSDG.title}</h3>
                        <p style={{ fontSize: 'clamp(12px, 2vh, 14px)', color: activeSDG.color, fontWeight: 700, margin: 0 }}>SDG {activeSDG.num}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 'clamp(13px, 2.2vh, 15px)', color: '#555', lineHeight: 1.6, margin: 0 }}>
                      {activeSDG.description}
                    </p>
                  </div>

                  <div style={{ width: '1px', background: '#eee', margin: '0 10px' }} className="panel-divider" />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{
                      fontSize: 'clamp(10px, 1.8vh, 11px)', fontWeight: 700, color: '#999',
                      letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'clamp(8px, 2vh, 16px)', margin: 0,
                    }}>
                      Challenge Statements
                    </p>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginTop: '4px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: '#fef3c7', border: '1.5px solid #fde68a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', flexShrink: 0, marginTop: '2px'
                      }}>
                        💡
                      </div>
                      <p style={{ fontSize: 'clamp(12px, 2vh, 14px)', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                        <strong style={{ color: '#111' }}>Open Innovation:</strong> These are just examples! You are completely free to choose your own problem statement as long as it aligns with this SDG.
                      </p>
                    </div>
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile-only standalone download card (above Event Guidelines) ── */}
      {isMobile && (
        <div style={{ padding: '32px 6vw 8px' }}>
          <a
            href="/problem-statement-2026.pdf"
            download="Hackathon-Problem-Statement-2026.pdf"
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px 20px',
              background: '#111',
              borderRadius: 20,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Grid texture */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.07,
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '20px 20px', pointerEvents: 'none',
            }} />
            {/* Icon */}
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: 'rgba(255,255,255,0.1)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9 15 12 18 15 15"/>
              </svg>
            </div>
            {/* Text */}
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: '0 0 3px', letterSpacing: '-0.01em' }}>
                Example Problem Statements
              </p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                30 curated challenges
              </p>
            </div>
            {/* Download pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
              background: '#fff', color: '#111', borderRadius: 100,
              padding: '7px 14px', fontSize: '12px', fontWeight: 800,
              position: 'relative', zIndex: 1,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              PDF
            </div>
          </a>
        </div>
      )}

      <style>{`
        .mobile-filmstrip::-webkit-scrollbar { display: none; }
        @media (max-width: 900px) {
          .bottom-panel-inner {
            flex-direction: column !important;
            gap: 16px !important;
            padding: 24px 6vw !important;
            overflow-y: auto !important;
          }
          .panel-divider {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
