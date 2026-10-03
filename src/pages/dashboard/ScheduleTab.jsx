import { useState } from 'react';

const EVENTS = [
  { date:'Jun 7–21',  event:'Registration Open',        status:'done',    desc:'Team registration and idea brief.',       time:'All day' },
  { date:'Jul 25',    event:'Idea Submission Deadline', status:'active',  desc:'500-word Project Description of your solution.',     time:'11:59 PM IST' },
  { date:'Aug 7',     event:'Shortlist Announced',      status:'upcoming',desc:'Top 30 teams notified via email.',        time:'12:00 PM IST' },
  { date:'Aug 14',    event:'Grand Finale & Awards',    status:'upcoming',desc:'Live presentations and prize ceremony.',  time:'09:00 AM IST' },
];

const MENTORS = [
  { name:'Dr. Prathiba N.',  role:'Azure AI Specialist',     slots:'3 slots left',  color:'#4C9F38' },
  { name:'Karan Mehta',      role:'Product Strategy',        slots:'1 slot left',   color:'#26BDE2' },
  { name:'Ananya Krishnan',  role:'UX & Interaction Design', slots:'5 slots left',  color:'#FCC30B' },
  { name:'Vikram Iyer',      role:'IoT & Hardware',          slots:'Fully booked',  color:'#E5243B' },
];

const STATUS_STYLE = {
  done:    { dot:'#4C9F38', line:'#4C9F38', label:'Completed', labelColor:'#4C9F38', labelBg:'#f0fdf4' },
  active:  { dot:'#f59e0b', line:'#e5e7eb', label:'In Progress', labelColor:'#92400e', labelBg:'#fffbeb' },
  upcoming:{ dot:'#e5e7eb', line:'#e5e7eb', label:'Upcoming',   labelColor:'#6b7280', labelBg:'#f3f4f6' },
};

export default function ScheduleTab() {
  const [booked, setBooked] = useState({});

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div className="dash-grid-2" style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:18 }}>
        {/* Timeline */}
        <div className="dash-card" style={{ background:'#fff', borderRadius:14, padding:'22px 24px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1.5px solid #f0f0f0' }}>
          <div style={{ fontSize:14, fontWeight:800, color:'#111', marginBottom:20 }}>📅 Full Event Timeline</div>
          {EVENTS.map((ev, i) => {
            const s = STATUS_STYLE[ev.status];
            return (
              <div key={i} style={{ display:'flex', gap:16, paddingBottom: i<EVENTS.length-1?24:0, position:'relative' }}>
                {i < EVENTS.length-1 && (
                  <div style={{ position:'absolute', left:9, top:22, width:2, bottom:0, background:'#e5e7eb' }}>
                    <div style={{ width:'100%', height: EVENTS[i].status === 'done' ? '100%' : '0%', background:'#4C9F38', transition:'height 0.4s ease' }} />
                  </div>
                )}
                <div style={{ width:20, height:20, borderRadius:'50%', background:s.dot, flexShrink:0, zIndex:1, marginTop:2, display:'flex', alignItems:'center', justifyContent:'center', border: ev.status==='active'?'3px solid #fde68a':'none' }}>
                  {ev.status==='done' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:2 }}>
                    <span style={{ fontSize:13, fontWeight:800, color:'#111' }}>{ev.event}</span>
                    <span style={{ fontSize:10, fontWeight:700, color:s.labelColor, background:s.labelBg, padding:'2px 8px', borderRadius:20 }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize:11, color:'#9ca3af', marginBottom:4 }}>{ev.date} · {ev.time}</div>
                  <div style={{ fontSize:12, color:'#6b7280' }}>{ev.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mentors */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="dash-card" style={{ background:'#fff', borderRadius:14, padding:'22px 24px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1.5px solid #f0f0f0' }}>
            <div style={{ fontSize:14, fontWeight:800, color:'#111', marginBottom:16 }}>🧑‍🏫 Mentorship Slots</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {MENTORS.map((m, i) => {
                const full = m.slots === 'Fully booked';
                const bk   = booked[i];
                return (
                  <div key={i} style={{ padding:'12px 14px', background:'#f9fafb', borderRadius:12, display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background: full?'#e5e7eb':m.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14, flexShrink:0 }}>{m.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'#111' }}>{m.name}</div>
                      <div style={{ fontSize:11, color:'#9ca3af' }}>{m.role}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:10, color: full?'#E5243B':bk?'#4C9F38':'#6b7280', fontWeight:600, marginBottom:4 }}>{bk?'Booked ✓':m.slots}</div>
                      <button onClick={() => !full && setBooked(p => ({ ...p, [i]:!p[i] }))}
                        style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:8, border:`1.5px solid ${full?'#e5e7eb':bk?'#4C9F38':'#e5e7eb'}`, background: full?'#f9fafb':bk?'#f0fdf4':'#fff', color: full?'#9ca3af':bk?'#4C9F38':'#374151', cursor: full?'not-allowed':'pointer' }}
                        disabled={full}>
                        {full ? 'Full' : bk ? 'Cancel' : 'Book'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Countdown */}
          <div className="dash-card" style={{ background:'linear-gradient(135deg,#111,#222)', borderRadius:14, padding:'20px 22px', boxShadow:'0 4px 20px rgba(0,0,0,0.15)', color:'#fff' }}>
            <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:8, letterSpacing:'0.06em' }}>FINALS COUNTDOWN</div>
            <div style={{ fontSize:38, fontWeight:900, letterSpacing:'-0.02em', color:'#4C9F38' }}>13 days</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:4 }}>Grand Finale · Aug 14 · SRCAS Campus</div>
            <div style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap' }}>
              {['09:00 AM Start','Live Presentations','Prize Ceremony'].map((t, i) => (
                <span key={i} style={{ fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.6)', background:'rgba(255,255,255,0.08)', padding:'4px 10px', borderRadius:20 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
