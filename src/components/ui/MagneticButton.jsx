import { useRef, useState } from 'react';

/**
 * Cursor-magnetic button with ripple on click and shimmer sweep on hover.
 *
 * Props:
 *   variant   'dark' | 'light' | 'outline' | 'blue'  (default: 'dark')
 *   href      string  → renders as <a>
 *   size      'sm' | 'md' | 'lg'                      (default: 'md')
 *   style     object  → merged onto outer element
 *   children  content (usually text + optional icon)
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'dark',
  size = 'md',
  style: extraStyle,
  ...rest
}) {
  const ref = useRef(null);
  const [mag, setMag]       = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  /* magnetic pull — 30% of offset from centre */
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMag({
      x: (e.clientX - (r.left + r.width  / 2)) * 0.32,
      y: (e.clientY - (r.top  + r.height / 2)) * 0.32,
    });
  };

  const handleLeave = () => {
    setHovered(false);
    setMag({ x: 0, y: 0 });
  };

  const addRipple = (e) => {
    const el = ref.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const id = Date.now();
    setRipples(prev => [...prev, { x: e.clientX - r.left, y: e.clientY - r.top, id }]);
    setTimeout(() => setRipples(prev => prev.filter(rp => rp.id !== id)), 750);
    onClick?.(e);
  };

  /* variant palette */
  const V = {
    dark:    { bg: '#111',     bgH: '#222',               color: '#fff', border: 'transparent',                shadow: 'rgba(0,0,0,0.28)',       ripple: 'rgba(255,255,255,0.35)' },
    light:   { bg: '#fff',     bgH: '#f4f4f4',            color: '#111', border: '#e8e8e8',                    shadow: 'rgba(0,0,0,0.1)',        ripple: 'rgba(0,0,0,0.12)'       },
    outline: { bg: 'transparent', bgH: 'rgba(0,0,0,0.05)', color: '#111', border: '#111',                    shadow: 'rgba(0,0,0,0.08)',       ripple: 'rgba(0,0,0,0.12)'       },
    blue:    { bg: '#0078D4',  bgH: '#005a9e',            color: '#fff', border: 'transparent',                shadow: 'rgba(0,120,212,0.35)',   ripple: 'rgba(255,255,255,0.35)' },
  }[variant] ?? { bg: '#111', bgH: '#222', color: '#fff', border: 'transparent', shadow: 'rgba(0,0,0,0.28)', ripple: 'rgba(255,255,255,0.35)' };

  /* size palette */
  const S = {
    sm: { padding: '9px 18px',  fontSize: '0.78rem', radius: 9  },
    md: { padding: '13px 26px', fontSize: '0.88rem', radius: 12 },
    lg: { padding: '16px 34px', fontSize: '0.96rem', radius: 14 },
  }[size] ?? { padding: '13px 26px', fontSize: '0.88rem', radius: 12 };

  const Tag = href ? 'a' : 'button';

  return (
    <>
      <Tag
        ref={ref}
        href={href}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        onClick={addRipple}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 9,
          padding: S.padding,
          borderRadius: S.radius,
          background: hovered ? V.bgH : V.bg,
          color: V.color,
          border: `1px solid ${V.border}`,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: S.fontSize,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          textDecoration: 'none',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          /* magnetic transform + scale on hover */
          transform: `translate(${mag.x}px, ${mag.y}px) scale(${hovered ? 1.05 : 1})`,
          transition: hovered
            ? 'background 0.18s, box-shadow 0.18s, transform 0.1s'
            : 'background 0.18s, box-shadow 0.25s, transform 0.55s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: hovered
            ? `0 12px 30px ${V.shadow}`
            : '0 2px 6px rgba(0,0,0,0.06)',
          ...extraStyle,
        }}
        {...rest}
      >
        {/* Shimmer sweep */}
        <span aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(108deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
          transform: hovered ? 'translateX(120%)' : 'translateX(-120%)',
          transition: 'transform 0.52s ease',
        }} />

        {/* Ripple dots */}
        {ripples.map(rp => (
          <span key={rp.id} aria-hidden style={{
            position: 'absolute',
            left: rp.x, top: rp.y,
            width: 8, height: 8,
            borderRadius: '50%',
            background: V.ripple,
            transform: 'translate(-50%,-50%) scale(0)',
            animation: 'mag-ripple 0.75s ease-out forwards',
            pointerEvents: 'none',
          }} />
        ))}

        {children}
      </Tag>

      <style>{`
        @keyframes mag-ripple {
          to { transform: translate(-50%,-50%) scale(28); opacity: 0; }
        }
      `}</style>
    </>
  );
}
