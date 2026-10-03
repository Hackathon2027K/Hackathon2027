import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const SDG_COLORS = ['#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21','#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367','#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B','#00689D','#19486A'];

export function SDGWheel({ size = 32 }) {
  const cx = size/2, cy = size/2, r = size/2-1, ri = r*0.38, n = 17, gap = 0.04;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {SDG_COLORS.map((color, i) => {
        const a1 = (2*Math.PI/n)*i - Math.PI/2 + gap/2;
        const a2 = (2*Math.PI/n)*(i+1) - Math.PI/2 - gap/2;
        return <path key={i} d={`M${cx+r*Math.cos(a1)} ${cy+r*Math.sin(a1)} A${r} ${r} 0 0 1 ${cx+r*Math.cos(a2)} ${cy+r*Math.sin(a2)} L${cx+ri*Math.cos(a2)} ${cy+ri*Math.sin(a2)} A${ri} ${ri} 0 0 0 ${cx+ri*Math.cos(a1)} ${cy+ri*Math.sin(a1)}Z`} fill={color}/>;
      })}
      <circle cx={cx} cy={cy} r={ri*0.8} fill="white"/>
    </svg>
  );
}

const NAV = [
  { id:'overview',     icon:'⊞',   label:'Overview'      },
  { id:'team',         icon:'◎',   label:'My Team'       },
  { id:'submission',   icon:'↑',   label:'Submission'    },
  { id:'resources',    icon:'≡',   label:'Resources'     },
  { id:'announcements',icon:'⚑',   label:'Announcements' },
];

export default function DashboardLayout({ activeTab, setActiveTab, children, hasTeam, announcements, user }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter','Segoe UI',sans-serif", background:'#f5f6fa' }}>
      {/* Sidebar */}
      <aside className="dash-sidebar" style={{ width: collapsed ? 64 : 230, background:'#fff', borderRight:'1.5px solid #ebebeb', display:'flex', flexDirection:'column', transition:'width 0.25s ease', flexShrink:0, position:'sticky', top:0, height:'100vh', overflow:'hidden', zIndex:10 }}>
        {/* Logo */}
        <div onClick={() => setCollapsed(!collapsed)} style={{ padding:'20px 16px', borderBottom:'1.5px solid #ebebeb', display:'flex', alignItems:'center', gap:10, cursor:'pointer', minHeight:64 }}>
          <SDGWheel size={32}/>
          {!collapsed && <div>
            <div style={{ fontWeight:800, fontSize:13, color:'#111', whiteSpace:'nowrap', letterSpacing:'0.04em' }}>SRCAS HACKATHON 3.0</div>
            <div style={{ fontSize:10, color:'#aaa', whiteSpace:'nowrap' }}>Participant Portal</div>
          </div>}
        </div>

        {/* Nav items */}
        <nav style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(item => {
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, border:'none', cursor:'pointer', textAlign:'left', width:'100%', background: active ? '#f0fdf4' : 'transparent', outline:'none', transition:'all 0.15s' }}
                onMouseEnter={e => { if(!active) e.currentTarget.style.background='#f9fafb'; }}
                onMouseLeave={e => { if(!active) e.currentTarget.style.background='transparent'; }}>
                <span style={{ fontSize:17, flexShrink:0, color: active ? '#4C9F38' : '#9ca3af', fontWeight:800 }}>{item.icon}</span>
                {!collapsed && <span style={{ fontSize:13, fontWeight: active ? 700 : 500, color: active ? '#4C9F38' : '#374151', whiteSpace:'nowrap' }}>{item.label}</span>}
                {!collapsed && active && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#4C9F38' }}/>}
              </button>
            );
          })}
        </nav>

        {/* Footer nav */}
        <div style={{ padding:'10px 8px', borderTop:'1.5px solid #ebebeb' }}>
          <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, border:'none', cursor:'pointer', width:'100%', background:'transparent', textAlign:'left', outline:'none', marginBottom:4 }}
            onMouseEnter={e => e.currentTarget.style.background='#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <span style={{ fontSize:15, color:'#9ca3af' }}>←</span>
            {!collapsed && <span style={{ fontSize:12, color:'#9ca3af', fontWeight:500 }}>Back to Site</span>}
          </button>

          <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:12, border:'1px solid #fca5a5', cursor:'pointer', width:'100%', background:'#fef2f2', textAlign:'left', outline:'none', transition:'all 0.2s', marginTop:8 }}
            onMouseEnter={e => { e.currentTarget.style.background='#fee2e2'; e.currentTarget.style.borderColor='#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#fef2f2'; e.currentTarget.style.borderColor='#fca5a5'; }}>
            <span style={{ fontSize:16, color:'#dc2626' }}>🚪</span>
            {!collapsed && <span style={{ fontSize:13, color:'#dc2626', fontWeight:700 }}>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="dash-main-wrapper" style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Topbar */}
        <header className="dash-header" style={{ background:'#fff', borderBottom:'1.5px solid #ebebeb', padding:'0 28px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:9 }}>
          <div>
            <h1 style={{ fontSize:17, fontWeight:800, color:'#111', margin:0 }}>
              {NAV.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="dash-subtitle" style={{ fontSize:11, color:'#9ca3af', margin:0 }}>SRCAS Hackathon 3.0 · iGenius - Authorized Microsoft Partner</p>
          </div>
          <div className="dash-header-right" style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* Notification Icon */}
            <button onClick={() => setShowAnnouncements(true)} style={{ background:'transparent', border:'none', cursor:'pointer', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', padding:4, marginRight:4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <div style={{ position:'absolute', top:2, right:4, width:8, height:8, borderRadius:'50%', background:'#E5243B', border:'2px solid #fff' }}/>
            </button>

            <div onClick={() => setShowProfile(true)} style={{ cursor:'pointer', marginLeft:8, width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#4C9F38,#26BDE2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="dash-content" style={{ flex:1, padding:'24px 28px', overflow:'auto' }}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="dash-bottom-nav">
        {NAV.map(item => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} 
              style={{ 
                display:'flex', alignItems:'center', justifyContent:'center', gap:6, 
                background: active ? '#ebfbee' : 'transparent', 
                border:'none', outline:'none', 
                padding: active ? '10px 16px' : '10px 0', 
                borderRadius: '100px',
                flex: active ? '0 0 auto' : '1 1 0', 
                cursor:'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: 0,
                overflow: 'hidden'
              }}>
              <span style={{ fontSize: active ? 18 : 20, color: active ? '#22c55e' : '#9ca3af', fontWeight: active ? 900 : 500, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
              {active && (
                <span style={{ fontSize:13, color: '#22c55e', fontWeight: 800, whiteSpace: 'nowrap' }}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Announcements Modal */}
      {showAnnouncements && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:500, overflow:'hidden', boxShadow:'0 20px 40px rgba(0,0,0,0.2)', position:'relative' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:18, fontWeight:800, color:'#111' }}>Notifications</div>
              <button onClick={() => setShowAnnouncements(false)} style={{ background:'none', border:'none', fontSize:24, cursor:'pointer', color:'#9ca3af' }}>&times;</button>
            </div>
            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:16, maxHeight:'70vh', overflowY:'auto' }}>
              {announcements && announcements.length > 0 ? announcements.map((a, i, arr) => (
                <div key={a.id || i} style={{ paddingBottom: i<arr.length-1?14:0, marginBottom: i<arr.length-1?14:0, borderBottom: i<arr.length-1?'1px solid #f3f4f6':'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                    {a.tag && <span style={{ fontSize:10, fontWeight:700, color:'#4C9F38', background:'#f0fdf4', padding:'2px 8px', borderRadius:20 }}>{a.tag}</span>}
                    <span style={{ fontSize:11, color:'#9ca3af', fontWeight:500 }}>{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ fontSize:14, fontWeight:700, color:'#111', margin:'0 0 4px 0' }}>{a.title}</h4>
                  <p style={{ fontSize:13, color:'#374151', lineHeight:1.5, margin:0 }}>{a.message}</p>
                </div>
              )) : (
                <p style={{ fontSize:13, color:'#9ca3af', fontStyle:'italic' }}>No announcements yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:600, overflow:'hidden', boxShadow:'0 20px 40px rgba(0,0,0,0.2)', position:'relative' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:18, fontWeight:800, color:'#111' }}>User Profile</div>
              <button onClick={() => setShowProfile(false)} style={{ background:'none', border:'none', fontSize:24, cursor:'pointer', color:'#9ca3af' }}>&times;</button>
            </div>
            <div style={{ padding:'24px', display:'flex', flexDirection:'column', gap:16, maxHeight:'75vh', overflowY:'auto' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, fontWeight:700, color:'#111' }}>Full Name</label>
                <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #e5e7eb', borderRadius:8, padding:'10px 14px', gap:10, background:'#f9fafb' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" defaultValue={user?.user_metadata?.full_name || ''} placeholder="Full Name" readOnly style={{ border:'none', outline:'none', width:'100%', fontSize:13, background:'transparent', color:'#6b7280', cursor:'not-allowed' }}/>
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, fontWeight:700, color:'#111' }}>Email Address</label>
                <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #e5e7eb', borderRadius:8, padding:'10px 14px', gap:10, background:'#f9fafb' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" defaultValue={user?.email || ''} readOnly style={{ border:'none', outline:'none', width:'100%', fontSize:13, background:'transparent', color:'#6b7280', cursor:'not-allowed' }}/>
                </div>
              </div>
            </div>
            
            <div style={{ padding:'20px 24px', borderTop:'1px solid #f3f4f6', display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, fontSize:12, fontWeight:600 }}>
                <Link to="/terms" onClick={() => setShowProfile(false)} style={{ color:'#9ca3af', textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#4C9F38'} onMouseLeave={e => e.currentTarget.style.color='#9ca3af'}>Terms & Conditions</Link>
                <span style={{ color:'#d1d5db' }}>|</span>
                <Link to="/privacy" onClick={() => setShowProfile(false)} style={{ color:'#9ca3af', textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#4C9F38'} onMouseLeave={e => e.currentTarget.style.color='#9ca3af'}>Privacy Policy</Link>
              </div>
              <button onClick={() => navigate('/')} style={{ padding:'12px 18px', borderRadius:10, border:'1.5px solid #e5e7eb', background:'#fff', fontWeight:700, color:'#374151', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', transition:'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='#f9fafb'} onMouseLeave={e => e.currentTarget.style.background='#fff'}>
                <span style={{ fontSize:16, color:'#6b7280' }}>←</span> Back to Site
              </button>
              <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} style={{ padding:'12px 18px', borderRadius:10, border:'none', background:'#fef2f2', fontWeight:700, color:'#dc2626', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', transition:'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='#fee2e2'} onMouseLeave={e => e.currentTarget.style.background='#fef2f2'}>
                <span style={{ fontSize:16 }}>🚪</span> Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        button{font-family:inherit}
        input,textarea{font-family:inherit}
        .dash-bottom-nav { display: none; }
        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-bottom-nav { 
            display: flex; position: fixed; bottom: 0; left: 0; right: 0; 
            background: #fff; border-top: 1.5px solid #ebebeb; z-index: 50; 
            justify-content: space-between; align-items: center; 
            padding: 8px 12px;
            padding-bottom: calc(8px + env(safe-area-inset-bottom));
            gap: 4px;
          }
          .dash-main-wrapper { padding-bottom: calc(68px + env(safe-area-inset-bottom)) !important; }
          .dash-header { padding: 18px 16px 22px !important; min-height: 70px !important; height: auto !important; flex-direction: column; align-items: flex-start !important; justify-content: center; gap: 4px; }
          .dash-subtitle { display: none !important; }
          .dash-header-right { position: absolute; right: 16px; top: 18px; }
          .dash-content { padding: 16px !important; }
          .dash-grid-2 { grid-template-columns: 1fr !important; }
          .dash-grid-4 { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .dash-card { padding: 16px !important; }
          .dash-hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
