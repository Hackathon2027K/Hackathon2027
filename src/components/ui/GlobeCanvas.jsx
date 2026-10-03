import { useRef, useEffect, useCallback } from 'react';

/**
 * Full globe rendered with dots.
 * The canvas is sized to the hero height.
 * The globe CENTER is placed BELOW the canvas bottom,
 * so only the top dome (~40%) is visible — creating the half-globe look.
 */
export default function GlobeCanvas() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    dots: [],
    rotationY: 0,
    rotationX: 0,
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    mouse: { x: -9999, y: -9999 },
    animId: null,
    autoSpeed: 0.0025,
    targetRotX: 0,
  });

  // Build FULL SPHERE dot positions with highly varied sizes
  const buildDots = useCallback((totalCount) => {
    const dots = [];
    const phi = Math.PI * (Math.sqrt(5) - 1); // golden angle
    for (let i = 0; i < totalCount; i++) {
      const y = 1 - (i / (totalCount - 1)) * 2; // y in [-1, 1]
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      // Size distribution: power law — many small, few large
      const r = Math.random();
      let size;
      if (r < 0.55) {
        size = 0.8 + r * 3.6;          // tiny: 0.8–2.8px
      } else if (r < 0.82) {
        size = 3 + (r - 0.55) * 18.5;  // medium: 3–8px
      } else {
        size = 8 + (r - 0.82) * 55;    // large: 8–19px (rare)
      }

      dots.push({ nx: x, ny: y, nz: z, size });
    }
    return dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    state.dots = buildDots(1600);

    // ── Resize ─────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Rotation helpers ───────────────────────────────────
    const rotY = (v, a) => ({
      x: v.x * Math.cos(a) + v.z * Math.sin(a),
      y: v.y,
      z: -v.x * Math.sin(a) + v.z * Math.cos(a),
    });
    const rotX = (v, a) => ({
      x: v.x,
      y: v.y * Math.cos(a) - v.z * Math.sin(a),
      z: v.y * Math.sin(a) + v.z * Math.cos(a),
    });

    // ── Render loop ────────────────────────────────────────
    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      if (!state.isDragging) {
        state.rotationY += state.autoSpeed;
        state.rotationX += (state.targetRotX - state.rotationX) * 0.05;
      }

      // Globe radius = 55% of canvas width (responsive)
      // Cap so it looks good on wide screens too
      const R = Math.min(w * 0.55, 500);

      // Center X = middle, Center Y = BELOW canvas (only top dome visible)
      // We push center down so ~38-42% of the globe shows above canvas bottom
      const cx = w / 2;
      const cy = h + R * 0.42; // center is below canvas bottom

      // Mouse pos in canvas logical coords
      const rect = canvas.getBoundingClientRect();
      const mx = state.mouse.x - rect.left;
      const my = state.mouse.y - rect.top;

      // Project all dots
      const projected = state.dots.map((d) => {
        let v = { x: d.nx * R, y: d.ny * R, z: d.nz * R };
        v = rotY(v, state.rotationY);
        v = rotX(v, state.rotationX);

        // Perspective
        const fov = 1100;
        const scale = fov / (fov + v.z);
        let sx = cx + v.x * scale;
        let sy = cy + v.y * scale;

        // Mouse repel - Increased for longer movement
        const MOUSE_R_ACTUAL = Math.max(w * 0.25, 200);
        const ddx = sx - mx;
        const ddy = sy - my;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < MOUSE_R_ACTUAL && dist > 0.1) {
          const force = (1 - dist / MOUSE_R_ACTUAL) * 60; // Stronger force
          sx += (ddx / dist) * force;
          sy += (ddy / dist) * force;
        }

        // Depth factor: 0 = back, 1 = front
        const depth = (v.z + R) / (2 * R);
        // Opacity: front dots are dark/opaque, back dots are lighter
        const alpha = 0.12 + depth * 0.88;
        // Size scales slightly with depth
        const dotR = d.size * (0.55 + depth * 0.55);

        return { sx, sy, depth, alpha, dotR, z: v.z, isPureBlack: d.isPureBlack };
      });

      // Filter only dots that are within canvas bounds (+ small padding)
      const visible = projected.filter(p => p.sy < h + 30 && p.sy > -30 && p.sx > -30 && p.sx < w + 30);

      // Painter's algo: back → front
      visible.sort((a, b) => a.z - b.z);

      visible.forEach(({ sx, sy, alpha, dotR, isPureBlack }) => {
        if (sy > h + 10) return; // hard clip at canvas bottom
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(dotR * 0.5, 0.4), 0, Math.PI * 2);

        if (isPureBlack) {
          // Pure black dots stand out more
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha > 0.3 ? 1 : alpha * 1.5})`;
        } else {
          ctx.fillStyle = `rgba(14, 12, 10, ${alpha})`;
        }
        ctx.fill();
      });

      state.animId = requestAnimationFrame(render);
    };

    render();

    // ── Events ────────────────────────────────────────────
    const getPos = (e) => e.touches
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };

    const onDown = (e) => {
      state.isDragging = true;
      state.lastMouse = getPos(e);
    };
    const onMove = (e) => {
      const pos = getPos(e);
      state.mouse = pos;
      if (state.isDragging) {
        const dx = pos.x - state.lastMouse.x;
        const dy = pos.y - state.lastMouse.y;
        state.rotationY += dx * 0.006;
        state.rotationX += dy * 0.004;
        state.rotationX = Math.max(-0.5, Math.min(0.5, state.rotationX));
        state.lastMouse = pos;
      }
    };
    const onUp = () => {
      state.isDragging = false;
      state.targetRotX = 0;
    };
    const onLeave = () => { state.mouse = { x: -9999, y: -9999 }; };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    return () => {
      cancelAnimationFrame(state.animId);
      ro.disconnect();
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [buildDots]);

  const canvasStyle = {
    display: 'block',
    width: '100%',
    height: '100%',
    cursor: 'grab',
    touchAction: 'none',
  };

  return (
    <canvas
      ref={canvasRef}
      style={canvasStyle}
      aria-label="Interactive rotating globe visualization"
      role="img"
      onMouseDown={(e) => e.target.style.cursor = 'grabbing'}
      onMouseUp={(e) => e.target.style.cursor = 'grab'}
    />
  );
}
