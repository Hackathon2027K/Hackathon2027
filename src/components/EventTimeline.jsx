import React from 'react';

export default function EventTimeline({ steps, currentStepIndex }) {
  // We assume steps are distributed evenly with flex: 1.
  // With N steps, the centers are at exactly (1/(2N)), (3/(2N)), ..., ((2N-1)/(2N)).
  // For 5 steps, centers are at 10%, 30%, 50%, 70%, 90%.
  // So the line spans from left: 10% to width: 80%.
  const leftOffset = 100 / (2 * steps.length);
  const lineWidth = 100 - (2 * leftOffset);

  // Foreground width calculation
  const progressRatio = currentStepIndex / Math.max(1, steps.length - 1);
  const progressWidth = progressRatio * lineWidth;

  return (
    <div className="dash-card" style={{ padding: '32px 20px', overflowX: 'auto', background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1.5px solid #f0f0f0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', minWidth: 600, position: 'relative' }}>
        
        {/* Background Gray Line */}
        <div style={{ position: 'absolute', top: 14, left: `${leftOffset}%`, width: `${lineWidth}%`, height: 4, background: '#f3f4f6', borderRadius: 4, zIndex: 0 }} />
        
        {/* Foreground Green Line */}
        <div style={{ position: 'absolute', top: 14, left: `${leftOffset}%`, height: 4, background: '#4C9F38', borderRadius: 4, zIndex: 0, transition: 'width 0.5s ease-in-out', width: `${progressWidth}%` }} />

        {steps.map((step, i) => {
          const isActive = i <= currentStepIndex;
          return (
            <div key={i} style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: '50%', 
                background: isActive ? '#4C9F38' : '#fff', 
                border: isActive ? '3px solid #4C9F38' : '3px solid #e5e7eb', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                marginBottom: 12, transition: 'all 0.3s ease', 
                boxShadow: isActive ? '0 0 0 4px rgba(76,159,56,0.15)' : 'none' 
              }}>
                {isActive && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: isActive ? '#111' : '#6b7280', lineHeight: 1.3, marginBottom: 4, transition: 'color 0.3s' }}>
                {step.title}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af' }}>
                {step.date}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
