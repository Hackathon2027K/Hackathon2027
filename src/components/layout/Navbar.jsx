'use client';

import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'motion/react';
import {
  House,
  Handshake,
  Star,
  Trophy,
  BookOpen,
  HelpCircle,
  Phone,
  Menu,
  X,
  UserPlus,
  Users
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';

// ─── Site color tokens (black & white) ──────────────────────────────────────
const ACTIVE    = '#111111';
const ACTIVE_BG = '#F3F3F3';
const BG_PANEL  = 'rgba(255,255,255,0.88)';
const BORDER    = 'rgba(0,0,0,0.12)';

// ─── Nav items ────────────────────────────────────────────────────────────────
const getNavItems = (user) => [
  { id: 'home',       label: 'Home',               icon: House,         path: '/', hash: '#hero' },
  { id: 'partners',   label: 'Partners',            icon: Handshake,     path: '/partners', hash: '' },
  { id: 'highlights', label: 'Highlights',          icon: Star,          path: '/highlights', hash: '' },
  { id: 'prizes',     label: 'Prizes',              icon: Trophy,        path: '/prizes', hash: '' },
  { id: 'problems',   label: 'Problem Statements',  icon: BookOpen,      path: '/', hash: '#problems' },
  { id: 'humans',     label: 'Humans',              icon: Users,         path: '/humans', hash: '' },
  { id: 'faq',        label: 'FAQ',                 icon: HelpCircle,    path: '/faq', hash: '' },
  { id: 'contact',    label: 'Contact',             icon: Phone,         path: '/contact', hash: '' },
  { id: 'register',   label: user ? 'Dashboard' : 'Register', icon: UserPlus, path: user ? '/dashboard' : '/register', hash: '' },
];

// ─── Active-section tracker ───────────────────────────────────────────────────
function useActiveSection() {
  const [active, setActive] = useState('home');
  const location = useLocation();

  useEffect(() => {
    // Non-home routes — set immediately from pathname
    const routeMap = {
      '/prizes':     'prizes',
      '/highlights': 'highlights',
      '/partners':   'partners',
      '/humans':     'humans',
      '/faq':        'faq',
      '/contact':    'contact',
    };

    if (routeMap[location.pathname]) {
      setActive(routeMap[location.pathname]);
      return;
    }

    // Home route — track sections via scroll
    if (location.pathname === '/') {
      // Always start at home
      setActive('home');

      const onScroll = () => {
        if (window.scrollY < 80) {
          setActive('home');
          return;
        }
        // Find which section is most visible
        const sections = getNavItems(null).filter(i => i.path === '/').map(i => i.hash.replace('#', '')).filter(Boolean);
        let current = 'home';
        for (const id of sections) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) current = id;
        }
        setActive(current);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // run once on mount
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [location.pathname]);

  return active;
}

// ─── Single Dock Item (magnifies on Y proximity) ──────────────────────────────
function NavDockItem({
  children,
  className = '',
  onClick,
  mouseY,
  spring,
  distance,
  magnification,
  baseItemSize,
  isActive,
}) {
  const ref       = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseY, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { y: 0, height: baseItemSize };
    return val - rect.y - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
        background: isActive ? ACTIVE : 'rgba(255,255,255,0.95)',
        boxShadow: isActive
          ? '0 4px 14px rgba(0,0,0,0.22)'
          : '0 1px 4px rgba(0,0,0,0.07)',
        border: isActive
          ? '2px solid #111'
          : '2px solid rgba(0,0,0,0.10)',
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      whileHover={{
        background: isActive ? ACTIVE : ACTIVE_BG,
        borderColor: '#111',
        boxShadow: '0 4px 18px rgba(0,0,0,0.15)',
      }}
      className={`relative inline-flex items-center justify-center rounded-full cursor-pointer transition-colors ${className}`}
      tabIndex={0}
      role="button"
    >
      {Children.map(children, (child) => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

// ─── Tooltip label (appears to the RIGHT of the icon) ────────────────────────
function NavDockLabel({ children, className = '', ...rest }) {
  const { isHovered } = rest;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsub = isHovered.on('change', (v) => setVisible(v === 1));
    return () => unsub();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 6 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.16 }}
          className={`${className} pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2 w-fit whitespace-pre rounded-xl border z-50 px-4 py-2 text-sm font-semibold shadow-md`}
          style={{
            background: '#fff',
            border: `1px solid rgba(0,0,0,0.12)`,
            color: '#111',
            boxShadow: '0 4px 14px rgba(0,0,0,0.10)',
          }}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Icon wrapper ─────────────────────────────────────────────────────────────
function NavDockIcon({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

// ─── Desktop: Vertical Dock on the left ──────────────────────────────────────
const DesktopNavBar = ({ user }) => {
  const activeSection = useActiveSection();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [hovered,   setHovered]   = useState(false);
  const collapseTimer = useRef(null);
  const leaveTimer    = useRef(null);

  useEffect(() => {
    collapseTimer.current = setTimeout(() => setCollapsed(true), 7000);
    return () => clearTimeout(collapseTimer.current);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current);
    setHovered(true);
    mouseY.set(Infinity);
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setHovered(false);
      mouseY.set(Infinity);
    }, 200);
  };

  const expanded = !collapsed || hovered;

  const spring        = { mass: 0.1, stiffness: 150, damping: 12 };
  const baseItemSize  = 52;
  const magnification = 72;
  const distance      = 130;
  const panelWidth    = baseItemSize + 28; // 80px
  const peekWidth     = 32;
  const hiddenX       = -(panelWidth - peekWidth);

  const mouseY = useMotionValue(Infinity);

  const handleNav = (item) => {
    if (item.path !== location.pathname) {
      navigate(item.path);
      if (item.hash && item.id !== 'home') {
        setTimeout(() => {
          const el = document.getElementById(item.hash.replace('#', ''));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else if (item.hash && item.id !== 'home') {
      const el = document.getElementById(item.hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    // ── Outer hover zone: covers panel + peek tab with extra padding ──
    // This single div owns all mouse enter/leave — no gap = no flicker
    <div
      className="fixed hidden sm:flex flex-col items-start top-1/2 -translate-y-1/2 left-0 z-50"
      style={{
        // paddingLeft pushes content right so panel sits at left:20px when expanded
        paddingLeft: 20,
        // paddingRight extends the hover zone past the peek tab edge
        paddingRight: peekWidth + 16,
        // paddingTop/Bottom so mouse doesn't leave when near top/bottom of panel
        paddingTop: 24,
        paddingBottom: 24,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={({ clientY }) => mouseY.set(clientY)}
    >
      
      <motion.div
        animate={{ x: expanded ? 0 : -(panelWidth + 20 - peekWidth) }}
        transition={{ type: 'spring', stiffness: 200, damping: 34, mass: 1 }}
        className="relative flex flex-col items-center gap-4 rounded-2xl py-6 px-3"
        style={{
          width: panelWidth,
          background: BG_PANEL,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1.5px solid ${BORDER}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
        }}
        role="toolbar"
        aria-label="Site navigation"
      >
        {/* ── Peek tab ── */}
        <motion.div
          animate={{ opacity: collapsed && !hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'absolute',
            right: -(peekWidth),
            top: '50%',
            transform: 'translateY(-50%)',
            width: peekWidth,
            height: 88,
            borderRadius: '0 10px 10px 0',
            background: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#fff',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}>
            NAVBAR
          </span>
        </motion.div>

        {/* Left accent line */}
        <div
          className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full"
          style={{ background: 'linear-gradient(to bottom, transparent, #111, transparent)', opacity: 0.18 }}
        />

        {getNavItems(user).map((item) => {
          const isActive   = activeSection === item.id;
          const LucideIcon = item.icon;
          return (
            <NavDockItem
              key={item.id}
              isActive={isActive}
              onClick={() => handleNav(item)}
              mouseY={mouseY}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
            >
              <NavDockIcon>
                <LucideIcon
                  size={22}
                  color={isActive ? '#ffffff' : '#111111'}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={{ opacity: isActive ? 1 : 0.5 }}
                />
              </NavDockIcon>
              <NavDockLabel>{item.label}</NavDockLabel>
            </NavDockItem>
          );
        })}
      </motion.div>
    </div>
  );
};

// ─── Mobile: Floating hamburger bottom-right ──────────────────────────────────
const MobileNavBar = ({ user }) => {
  const activeSection  = useActiveSection();
  const [isOpen, setIsOpen]         = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => {
    if (isOpen) {
      setShowLabels(false);
      setTimeout(() => setIsOpen(false), 200);
    } else {
      setIsOpen(true);
      setTimeout(() => setShowLabels(true), 280);
    }
  };

  const handleNav = (item) => {
    setShowLabels(false);
    setTimeout(() => setIsOpen(false), 200);
    
    if (item.path !== location.pathname) {
      navigate(item.path);
      if (item.hash && item.id !== 'home') {
        setTimeout(() => {
          const el = document.getElementById(item.hash.replace('#', ''));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 250); // Mobile might need a bit more time
      }
    } else if (item.hash && item.id !== 'home') {
      const el = document.getElementById(item.hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowLabels(false);
        setTimeout(() => setIsOpen(false), 200);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div className="fixed sm:hidden top-4 right-4" style={{ zIndex: 99999 }}>
      <div
        ref={menuRef}
        onClick={!isOpen ? handleToggle : undefined}
        className={[
          'relative flex flex-col rounded-3xl transition-all duration-300 ease-out overflow-hidden',
          isOpen ? 'p-3 gap-2' : 'p-0',
          showLabels ? 'w-56' : isOpen ? 'w-14' : 'w-14',
          !isOpen ? 'cursor-pointer' : '',
        ].join(' ')}
        style={{
          background: BG_PANEL,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1.5px solid ${BORDER}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* Hamburger / Close */}
        <button
          onClick={handleToggle}
          className={[
            'flex items-center justify-center shrink-0 rounded-2xl transition-all duration-300 ease-out active:scale-95',
            isOpen ? 'w-10 h-10 self-end' : 'w-14 h-14',
          ].join(' ')}
          style={{ background: '#111' }}
        >
          {isOpen
            ? <X    size={18} color="#fff" />
            : <Menu size={22} color="#fff" />
          }
        </button>

        {/* Nav items */}
        <div
          className={[
            'flex flex-col gap-1 transition-all duration-300 ease-out overflow-hidden',
            isOpen ? 'max-h-[600px] opacity-100 pt-2' : 'max-h-0 opacity-0',
          ].join(' ')}
        >
          {getNavItems(user).map((item) => {
            const isActive   = activeSection === item.id;
            const LucideIcon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className="flex items-center h-11 gap-3 rounded-xl transition-all duration-300 focus:outline-none w-full text-left"
                style={{
                  background: isActive ? ACTIVE_BG : 'transparent',
                  paddingLeft: '16px',
                  paddingRight: '8px',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = ACTIVE_BG; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="shrink-0 flex items-center justify-center w-6 h-6">
                  <LucideIcon
                    size={18}
                    color={isActive ? '#111' : '#aaaaaa'}
                    strokeWidth={isActive ? 2.2 : 1.6}
                  />
                </div>
                <span
                  className={[
                    'text-sm font-medium whitespace-nowrap transition-all duration-300',
                    showLabels ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none',
                  ].join(' ')}
                  style={{ color: isActive ? '#111' : '#888', fontWeight: isActive ? 700 : 500 }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const activeSection = useActiveSection();
  const user = useAuth();

  return (
    <>
      <DesktopNavBar user={user} />
      <MobileNavBar user={user} />

      {/* Floating Auth Button - Top Right */}
      {activeSection !== 'home' && (
        <div className="fixed top-6 right-8 z-50 hidden sm:flex items-center gap-3">
          <a href={user ? "/dashboard" : "/register"} style={{ textDecoration: 'none' }}>
            <button className="nav-register-btn">
              {user ? "DASHBOARD" : "REGISTER"}
            </button>
          </a>
        </div>
      )}

      <style>{`
        .nav-register-btn {
          border: 1px solid black;
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
        }

        .nav-register-btn:hover {
          transform: translateY(-10px);
          box-shadow: 0px 7px 1px rgb(0, 0, 0);
          border: 1px solid black;
        }

        .nav-register-btn:active {
          transform: translateY(10px);
          box-shadow: 0px 0px 1px;
        }
      `}</style>
    </>
  );
};

export default Navbar;
