import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import EventTimeline from '../../components/EventTimeline';
import { motion, AnimatePresence } from 'framer-motion';
import OfficialPPT from '../../assets/PPT/SRCAS HACKATHON 3.0.pptx';

const TIMELINE_STEPS = [
  { title:'Registration', date:'Jun 21' },
  { title:'Team Confirmation', date:'Jul 25' },
  { title:'Idea Submission', date:'Jul 25' },
  { title:'Shortlist Announced', date:'Aug 7' },
  { title:'Grand Finale', date:'Aug 14' },
];

const card = (extra={}) => ({ background:'#fff', borderRadius:16, padding:'24px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1px solid #f3f4f6', ...extra });

const CheckItem = ({ label, status }) => {
  let icon, style, color;
  if (status === 'done') {
    icon = <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
    style = { width:16, height:16, borderRadius:'50%', background:'#10b981', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 };
    color = '#111';
  } else if (status === 'active') {
    icon = null;
    style = { width:16, height:16, borderRadius:'50%', border:'2px dashed #10b981', flexShrink:0 };
    color = '#10b981';
  } else {
    icon = null;
    style = { width:16, height:16, borderRadius:'50%', border:'2px solid #e5e7eb', flexShrink:0 };
    color = '#9ca3af';
  }
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={style}>{icon}</div>
      <span style={{ fontSize:13, fontWeight:600, color }}>{label}</span>
    </div>
  );
};

export default function OverviewTab({ hasTeam, teamData, teamMembers, submissions, user, setActiveTab, announcements = [] }) {
  const [totalTeams, setTotalTeams] = useState(245);
  const [showRulebook, setShowRulebook] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  // const missingIds = teamMembers?.some(m => !m.id_card_front_url || !m.id_card_back_url);
  // const [showIdPopup, setShowIdPopup] = useState(missingIds);
  const [showIdPopup, setShowIdPopup] = useState(false);

  useEffect(() => {
    const fetchTeamCount = async () => {
      const { count } = await supabase.from('teams').select('id', { count: 'exact', head: true });
      if (count !== null) setTotalTeams(count);
    };
    fetchTeamCount();
  }, []);

  useEffect(() => {
    if (showRulebook) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showRulebook]);

  const memberCount = teamMembers?.length || 1;
  const hasSubmitted = submissions?.length > 0;
  const overallProgress = hasTeam ? (hasSubmitted ? 60 : 40) : 20; 
  const currentStepIndex = hasSubmitted ? 2 : (hasTeam ? 1 : 0);

  const now = new Date();
  const milestones = [
    { title: 'Team Confirmation', dateStr: '2026-07-25T23:59:59', icon: '👥', desc: 'Form your team and confirm details' },
    { title: 'Idea Submission', dateStr: '2026-07-25T23:59:59', icon: '💡', desc: 'Submit your Idea' },
    { title: 'Shortlist Announced', dateStr: '2026-08-07T12:00:00', icon: '🚩', desc: 'Top teams will be shortlisted' },
    { title: 'Grand Finale', dateStr: '2026-08-14T09:00:00', icon: '🏆', desc: 'Final presentations and winner announcement' }
  ];

  const upcomingMilestones = milestones.filter(m => new Date(m.dateStr) > now);
  const nextMilestone = upcomingMilestones.length > 0 ? upcomingMilestones[0] : milestones[milestones.length - 1];

  const getDaysLeft = (targetDate) => {
    const diff = new Date(targetDate) - now;
    if (diff < 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const daysToNext = getDaysLeft(nextMilestone.dateStr);


  
  // Time ago formatter
  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${Math.max(1, diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  };

  // Synthesize Recent Activity
  const activities = [];
  if (teamData?.created_at) {
    activities.push({ id: 'team_created', icon: '✅', color: '#16a34a', bg: '#f0fdf4', title: <span><strong>Registration completed successfully</strong></span>, date: new Date(teamData.created_at) });
  }
  if (teamMembers?.length > 0) {
    teamMembers.forEach(m => {
      if (m.created_at && m.email !== user?.email) {
        activities.push({ id: `member_${m.id}`, icon: '👥', color: '#8b5cf6', bg: '#f5f3ff', title: <span><strong style={{color:'#111'}}>{m.full_name}</strong> joined the team</span>, date: new Date(m.created_at) });
      }
    });
  }
  if (submissions?.length > 0) {
    submissions.forEach(sub => {
      activities.push({ id: `sub_${sub.id}`, icon: '☁️', color: '#f97316', bg: '#fff7ed', title: <span>Project <strong>"{sub.project_title || 'Submission'}"</strong> uploaded</span>, date: new Date(sub.created_at) });
    });
  }
  
  activities.sort((a, b) => b.date - a.date);
  const recentActivities = activities.slice(0, 5);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      
      {/* Scroll Notification */}
      {showNotification && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
          <span style={{ fontSize: 18 }}>🚨</span>
          <marquee style={{ fontSize: 14, fontWeight: 700, color: '#b91c1c', flex: 1 }} scrollamount="6">
            Important: All project development and coding must begin strictly on the morning of August 14th. Pre-built projects or pre-written code are not allowed. You have exactly 24 hours to build your solution during the hackathon!
          </marquee>
          <button onClick={() => setShowNotification(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#b91c1c', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity='1'} onMouseLeave={e => e.currentTarget.style.opacity='0.7'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* Scroll Notification */}
      <EventTimeline steps={TIMELINE_STEPS} currentStepIndex={currentStepIndex} />

      {/* 2. Stats Grid (4 columns) */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16 }}>
        
        {/* Rulebook Card */}
        <div style={card({ display:'flex', flexDirection:'column', padding:'20px', cursor:'pointer', border:'1.5px solid #fca5a5', background:'#fef2f2' })} onClick={() => setShowRulebook(true)}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:'#fee2e2', color:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📄</div>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:'#111', lineHeight:1 }}>Rulebook</div>
              <div style={{ fontSize:12, fontWeight:700, color:'#ef4444', marginTop:4 }}>Important</div>
            </div>
          </div>
          <div style={{ marginTop:'auto', fontSize:13, fontWeight:700, color:'#dc2626' }}>View rules & criteria →</div>
        </div>

        

        {/* Submission Guidelines Video Card */}
        {/* <a href="https://www.youtube.com" target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>
          <div style={card({ display:'flex', flexDirection:'column', padding:'20px', cursor:'pointer', height:'100%', border:'1.5px solid #c4b5fd', background:'#f5f3ff' })}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:'#ede9fe', color:'#8b5cf6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📹</div>
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:'#111', lineHeight:1 }}>Submission Guide</div>
                <div style={{ fontSize:12, fontWeight:700, color:'#8b5cf6', marginTop:4 }}>Video Tutorial</div>
              </div>
            </div>
            <div style={{ marginTop:'auto', fontSize:13, fontWeight:700, color:'#6d28d9' }}>Watch on YouTube ↗</div>
          </div>
        </a> */}

        {/* Days to Next Milestone Card */}
        <div style={card({ display:'flex', flexDirection:'column', padding:'20px' })}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:'#eff6ff', color:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📅</div>
            <div>
              <div style={{ fontSize:24, fontWeight:800, color:'#111', lineHeight:1 }}>{daysToNext}</div>
              <div style={{ fontSize:13, fontWeight:600, color:'#6b7280', marginTop:4 }}>Days to Milestone</div>
            </div>
          </div>
          <div style={{ marginTop:'auto', fontSize:13, fontWeight:700, color:'#9ca3af' }}>{nextMilestone.title}</div>
        </div>

        {/* Teams Participating Card */}
        <div style={card({ display:'flex', flexDirection:'column', padding:'20px' })}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:'#fefce8', color:'#eab308', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>⭐</div>
            <div>
              <div style={{ fontSize:24, fontWeight:800, color:'#111', lineHeight:1 }}>{totalTeams}</div>
              <div style={{ fontSize:13, fontWeight:600, color:'#6b7280', marginTop:4 }}>Teams Participating</div>
            </div>
          </div>
          <div style={{ marginTop:'auto', fontSize:13, fontWeight:700, color:'#9ca3af' }}>Active hackers</div>
        </div>

      </div>

      {/* 3. Main Grid (3 columns) */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:16 }}>
        {/* Announcements */}
        <div style={card({ display:'flex', flexDirection:'column' })}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:'#111', margin:0 }}>Announcements</h3>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16, flex:1 }}>
            {announcements.length === 0 ? (
              <div style={{ textAlign:'center', color:'#9ca3af', padding:'20px 0', fontSize:13 }}>
                No announcements yet.
              </div>
            ) : announcements.slice(0, 3).map(a => (
              <div key={a.id} style={{ display:'flex', gap:12 }}>
                {a.tag ? (
                  <span style={{ fontSize:10, fontWeight:800, color:'#10b981', background:'#ecfdf5', padding:'4px 8px', borderRadius:6, height:'fit-content' }}>{a.tag}</span>
                ) : (
                  <span style={{ fontSize:14, color:'#3b82f6', padding:'4px 8px' }}>📢</span>
                )}
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#111' }}>{a.title}</div>
                  <div style={{ fontSize:13, color:'#6b7280', marginTop:4, display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{a.message}</div>
                  <div style={{ fontSize:11, color:'#9ca3af', marginTop:6 }}>{new Date(a.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})} • Admin</div>
                </div>
              </div>
            ))}
          </div>
          <div onClick={() => setActiveTab('announcements')} style={{ marginTop:20, textAlign:'center', fontSize:13, fontWeight:700, color:'#6b7280', cursor:'pointer' }}>View all announcements</div>
        </div>

        {/* Project Progress */}
        <div style={card({ display:'flex', flexDirection:'column' })}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:'#111', margin:0 }}>Project Progress</h3>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:24, flex:1 }}>
            {/* Circular Gauge */}
            <div style={{ position:'relative', width:120, height:120, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg viewBox="0 0 36 36" style={{ position:'absolute', width:'100%', height:'100%', transform:'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${overallProgress}, 100`} />
              </svg>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:24, fontWeight:900, color:'#111', lineHeight:1 }}>{overallProgress}%</div>
                <div style={{ fontSize:10, fontWeight:600, color:'#6b7280', marginTop:2 }}>Overall Progress</div>
              </div>
            </div>
            {/* Checklist */}
            <div style={{ display:'flex', flexDirection:'column', gap:12, flex:1 }}>
              <CheckItem label="Registration" status="done" />
              <CheckItem label="Team Confirmation" status={hasTeam ? 'done' : 'active'} />
              <CheckItem label="Idea Submission" status={hasSubmitted ? 'done' : (hasTeam ? 'active' : 'pending')} />
              <CheckItem label="Shortlist Announced" status={hasSubmitted ? 'active' : 'pending'} />
              <CheckItem label="Grand Finale" status="pending" />
            </div>
          </div>
          <div style={{ marginTop:20, textAlign:'center', fontSize:13, fontWeight:700, color:'#10b981' }}>Keep going! You're on the right track.</div>
        </div>

        {/* Upcoming Milestones */}
        <div style={card({ display:'flex', flexDirection:'column' })}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:'#111', margin:0 }}>Upcoming Milestones</h3>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16, flex:1 }}>
            {upcomingMilestones.slice(0, 4).map((m, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:10, background: m.icon==='🏆'?'#fefce8':'#eff6ff', color: m.icon==='🏆'?'#eab308':'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{m.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:'#111' }}>{m.title}</div>
                  <div style={{ fontSize:12, color:'#6b7280' }}>{m.desc}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#111' }}>{new Date(m.dateStr).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</div>
                  <div style={{ fontSize:11, color:'#9ca3af' }}>{getDaysLeft(m.dateStr)} days left</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid (2 columns) */}
      <div className="dash-grid-2" style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr', gap:16 }}>
        {/* Recent Activity */}
        <div style={card({ display:'flex', flexDirection:'column' })}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:'#111', margin:0 }}>Recent Activity</h3>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {recentActivities.length > 0 ? recentActivities.map(act => (
              <div key={act.id} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:act.bg, color:act.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>{act.icon}</div>
                <div style={{ fontSize:14, color:'#374151', flex:1 }}>{act.title}</div>
                <div style={{ fontSize:12, color:'#9ca3af' }}>{timeAgo(act.date)}</div>
              </div>
            )) : (
              <div style={{ fontSize:13, color:'#9ca3af', fontStyle:'italic' }}>No recent activity.</div>
            )}
          </div>
        </div>

        {/* Team Activity */}
        <div style={card({ display:'flex', flexDirection:'column' })}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:'#111', margin:0 }}>Team Activity</h3>
            <span style={{ fontSize:13, fontWeight:700, color:'#3b82f6', cursor:'pointer' }} onClick={() => setActiveTab('team')}>View team</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16, flex:1 }}>
            {teamMembers?.length > 0 ? teamMembers.map((m, i) => {
              const isMe = m.email === user?.email;
              const isLeader = m.email === user?.email || m.id === teamData?.leader_id;
              const colors = [
                { bg:'#10b981', labelBg:'#ecfdf5', labelColor:'#10b981' },
                { bg:'#8b5cf6', labelBg:'#f3e8ff', labelColor:'#7e22ce' },
                { bg:'#f97316', labelBg:'#ffedd5', labelColor:'#c2410c' },
                { bg:'#3b82f6', labelBg:'#dbeafe', labelColor:'#1d4ed8' }
              ];
              const c = colors[i % colors.length];

              return (
                <div key={m.id || i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:c.bg, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14 }}>
                    {m.full_name ? m.full_name[0].toUpperCase() : '?'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'#111' }}>{m.full_name || 'Member'} {isMe && <span style={{ color:'#9ca3af', fontWeight:500 }}>(You)</span>}</div>
                  </div>
                  {isLeader ? (
                    <div style={{ fontSize:11, fontWeight:700, color:c.labelColor, background:c.labelBg, padding:'2px 8px', borderRadius:20 }}>Team Lead</div>
                  ) : (
                    <div style={{ fontSize:11, fontWeight:600, color:'#6b7280' }}>Member</div>
                  )}
                </div>
              );
            }) : (
              <div style={{ fontSize:13, color:'#9ca3af', fontStyle:'italic' }}>No team members yet.</div>
            )}
          </div>
          
          <div style={{ marginTop:24, paddingTop:16, borderTop:'1px solid #f3f4f6', display:'flex', alignItems:'center', gap:12 }}>
            
          </div>
        </div>
      </div>

      {/* Rulebook Modal */}
      <AnimatePresence>
        {showRulebook && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRulebook(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 9998,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                cursor: 'pointer'
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px', pointerEvents: 'none'
              }}
            >
              <div style={{
                pointerEvents: 'auto',
                width: '100%', maxWidth: 700, maxHeight: '85vh',
                background: '#fff', borderRadius: 24,
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E5243B15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📄</div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>Official Rulebook</h2>
                      <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>SRCAS Hackathon 3.0</p>
                    </div>
                  </div>
                  <button onClick={() => setShowRulebook(false)} style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>&times;</button>
                </div>
                
                {/* Body */}
                <div style={{ padding: '32px', overflowY: 'auto', fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.7 }}>
                  <h3 style={{ color: '#111', fontSize: '1.1rem', fontWeight: 800, marginTop: 0, letterSpacing: '-0.01em' }}>1. Eligibility & Team Formation</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                    <li style={{ marginBottom: 6 }}>All team members must be currently enrolled college students.</li>
                    <li style={{ marginBottom: 6 }}>Teams must consist of exactly 2 to 4 members. Solo participation is not permitted.</li>
                    <li style={{ marginBottom: 6 }}>All members must belong to the same institution.</li>
                    <li style={{ marginBottom: 6 }}><strong>Registration:</strong> Only the Team Leader needs to create an account on the hackathon platform. Team members should NOT register separately.</li>
                    <li>Valid college ID cards are mandatory for the offline finale.</li>
                  </ul>

                  <h3 style={{ color: '#111', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>2. Problem Statements & Tracks</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                    <li style={{ marginBottom: 6 }}>Projects must address one of the provided 17 UN Sustainable Development Goals (SDGs).</li>
                    <li>Teams may change their selected SDG until the Idea Submission deadline.</li>
                  </ul>

                  <h3 style={{ color: '#111', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>3. Submission & Development Rules</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                    <li style={{ marginBottom: 6 }}><strong>Round 1 (Idea Submission):</strong> Teams must submit a 500-word Project Description and the official PPT format.</li>
                    <li style={{ marginBottom: 6 }}><strong>Round 2 (Finale):</strong> Shortlisted teams will present their working prototypes offline at the SRCAS campus.</li>
                    <li style={{ marginBottom: 6 }}><strong>24-Hour Software Rule:</strong> All software coding and application development must take place exclusively during the 24-hour hackathon period. Bringing pre-written code, using proprietary existing projects, or plagiarism will lead to immediate disqualification.</li>
                    <li style={{ marginBottom: 6 }}><strong>Hardware & IoT Exception:</strong> If you are building a hardware-based project, you may procure the required devices, assemble, and test them before the Hackathon. However, during the 24-hour event, you are strictly expected to develop the software application, integrate it with your IoT devices, and demonstrate the final connected solution.</li>
                    <li><strong>Vibe Coding:</strong> "Vibe coding" (using AI-assisted coding tools and LLMs to help build your project) is completely allowed during the 24-hour hacking period.</li>
                  </ul>

                  <h3 style={{ color: '#111', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>4. Judging Criteria</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                    <li style={{ marginBottom: 6 }}><strong>Innovation & Creativity (25%):</strong> How unique is the approach?</li>
                    <li style={{ marginBottom: 6 }}><strong>Impact & SDG Alignment (25%):</strong> Does it effectively address the chosen goal?</li>
                    <li style={{ marginBottom: 6 }}><strong>Technical Complexity (25%):</strong> Quality of code and technology stack used.</li>
                    <li><strong>Feasibility & Presentation (25%):</strong> Can this be implemented in the real world? How well was it pitched?</li>
                  </ul>

                  <h3 style={{ color: '#111', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>5. Code of Conduct</h3>
                  <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                    <li style={{ marginBottom: 6 }}>Maintain a respectful and collaborative environment. Harassment of any kind will not be tolerated.</li>
                    <li>The decisions made by the judges are final and binding.</li>
                  </ul>
                </div>

                {/* Footer */}
                <div style={{ padding: '20px 32px', borderTop: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowRulebook(false)} style={{ padding: '10px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#333'}
                    onMouseLeave={e => e.currentTarget.style.background = '#111'}>
                    I Understand
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* ID card popup - commented out
        {showIdPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIdPopup(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 9998,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                cursor: 'pointer'
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px', pointerEvents: 'none'
              }}
            >
              <div style={{
                pointerEvents: 'auto',
                width: '100%', maxWidth: 450,
                background: '#fff', borderRadius: 24,
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif",
                textAlign: 'center', padding: '32px 24px'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🆔</div>
                <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>Action Required: Upload ID Cards</h2>
                <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6 }}>
                  Please upload Front & Back Student ID cards for all team members to complete verification before proceeding.
                </p>
                <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                  <button onClick={() => setShowIdPopup(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Later</button>
                  <button 
                    onClick={() => {
                      setShowIdPopup(false);
                      window.location.hash = '#upload-id';
                      setActiveTab('team');
                    }} 
                    style={{ flex: 1, padding: '12px', background: '#D97706', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Add ID Cards Now
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
        */}
      </AnimatePresence>

    </div>
  );
}
