import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Users, Flag, FileText, CheckSquare, Shield, Search, ChevronDown, Megaphone, ChevronRight } from 'lucide-react';

// Style constants
const S = {
  bg: '#F8FAFC', card: '#FFFFFF', border: '#E5E7EB', primary: '#6C4EFF',
  t1: '#111827', t2: '#6B7280', t3: '#9CA3AF', green: '#059669',
  activeBg: '#EEE8FF', radius: '14px', pad: '24px', gap: '20px',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [exactCounts, setExactCounts] = useState({ teams: 0, members: 0, subs: 0, evals: 0 });

  const fetchData = useCallback(async () => {
    // 1. Fetch exact counts (instant, no data download)
    const [cT, cM, cS, cE] = await Promise.all([
      supabase.from('teams').select('*', { count: 'exact', head: true }),
      supabase.from('team_members').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }),
      supabase.from('teams').select('*', { count: 'exact', head: true }).gt('score', 0)
    ]);
    setExactCounts({ teams: cT.count || 0, members: cM.count || 0, subs: cS.count || 0, evals: cE.count || 0 });

    // 2. Fetch data for charts & tables
    const [{ data: t }, { data: m }, { data: s }] = await Promise.all([
      supabase.from('teams').select('*').order('created_at', { ascending: false }),
      supabase.from('team_members').select('*').order('created_at', { ascending: false }),
      supabase.from('submissions').select('*').order('created_at', { ascending: false }),
    ]);
    if (t) setTeams(t); if (m) setMembers(m); if (s) setSubmissions(s);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { navigate('/register'); return; }
      const { data: adminList } = await supabase.from('admins').select('email');
      setAdminEmail(user.email);
      if (adminList && adminList.length > 0) { setIsAdmin(true); fetchData(); } else { alert("Not admin!"); navigate('/dashboard'); }
      setLoadingAuth(false);
    };
    checkAuth();
  }, [navigate, fetchData]);

  // eslint-disable-next-line no-unused-vars
  const exportCSV = () => {
    let csv = "data:text/csv;charset=utf-8,Team,Status,Score,Name,Email,Phone,College,Dept,Year\n";
    teams.forEach(t => {
      members.filter(m => m.team_id === t.id).forEach(m => {
        csv += ['"'+t.team_name+'"',t.status||'Pending',t.score||0,'"'+m.full_name+'"',m.email,m.phone_number,'"'+m.college_name+'"','"'+m.dept+'"',m.year].join(",") + "\n";
      });
    });
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "hackathon_export.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const getTrend = useCallback((arr, dateField = 'created_at') => {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last14Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const currentWeekCount = arr.filter(item => item[dateField] && new Date(item[dateField]) >= last7Days).length;
    const previousWeekCount = arr.filter(item => {
      if (!item[dateField]) return false;
      const d = new Date(item[dateField]);
      return d >= last14Days && d < last7Days;
    }).length;
    
    if (previousWeekCount === 0) return currentWeekCount > 0 ? 100 : 0;
    return Math.round(((currentWeekCount - previousWeekCount) / previousWeekCount) * 100);
  }, []);

  const statCards = [
    { title: 'Total Teams', value: exactCounts.teams, trend: getTrend(teams), color: '#6C4EFF', bg: '#EEE8FF' },
    { title: 'Total Participants', value: exactCounts.members, trend: getTrend(members), color: '#059669', bg: '#D1FAE5' },
    { title: 'Submissions', value: exactCounts.subs, trend: getTrend(submissions), color: '#D97706', bg: '#FEF3C7' },
    { title: 'Evaluations', value: exactCounts.evals, trend: getTrend(teams.filter(t => t.score > 0)), color: '#2563EB', bg: '#DBEAFE' },
  ];

  const chartsData = useMemo(() => {
    const days = 7;
    const regCounts = Array(days).fill(0);
    const subCounts = Array(days).fill(0);
    const labels = Array(days).fill('');
    
    const now = new Date();
    for(let i = 0; i < days; i++) {
      const d = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
      labels[i] = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      regCounts[i] = members.filter(s => {
        if(!s.created_at) return false;
        const sd = new Date(s.created_at);
        return sd.getDate() === d.getDate() && sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
      }).length;
      
      subCounts[i] = submissions.filter(s => {
        if(!s.created_at) return false;
        const sd = new Date(s.created_at);
        return sd.getDate() === d.getDate() && sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
      }).length;
    }
    
    const getPathData = (counts) => {
      const maxVal = Math.max(...counts, 4);
      const points = counts.map((count, i) => {
        const x = (i / (days - 1)) * 800;
        const y = 200 - (count / maxVal) * 180;
        return [Math.round(x), Math.round(y)];
      });
      const pathString = "M" + points.map(p => p.join(',')).join(' L');
      const fillString = pathString + " L800,200 L0,200Z";
      const yLabels = [maxVal, Math.round(maxVal*0.75), Math.round(maxVal*0.5), Math.round(maxVal*0.25), 0];
      return { counts, points, pathString, fillString, yLabels };
    };
    
    return { 
      labels, 
      registration: getPathData(regCounts), 
      submission: getPathData(subCounts) 
    };
  }, [members, submissions]);

  if (loadingAuth) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:S.bg}}><div style={{width:40,height:40,border:'3px solid '+S.primary,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>;
  if (!isAdmin) return null;

  const statusStyle = (s) => {
    if (s === 'Shortlisted') return { color: '#6C4EFF', background: '#EEE8FF' };
    if (s === 'Rejected') return { color: '#DC2626', background: '#FEF2F2' };
    return { color: '#D97706', background: '#FEF3C7' };
  };

  return (
    <>
        {/* TOP NAV */}
        <header style={{ height:64, background:S.card, borderBottom:'1px solid '+S.border, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div>
              <h1 style={{ fontSize:18, fontWeight:700, margin:0, color:S.t1 }}>Dashboard</h1>
              <div style={{ fontSize:11, fontWeight:500, color:S.t2, display:'flex', alignItems:'center', gap:4 }}>Home <ChevronRight size={12}/> <span style={{color:S.t1}}>Dashboard</span></div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <div 
              onClick={() => setShowEmail(!showEmail)}
              style={{ display:'flex', alignItems:'center', gap:10, borderLeft:'1px solid '+S.border, paddingLeft:20, cursor:'pointer' }}
            >
              <div style={{ width:34, height:34, borderRadius:'50%', background:'#059669', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14 }}>
                {adminEmail ? adminEmail.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:S.t1 }}>Admin User</div>
                <div style={{ fontSize:11, fontWeight:500, color:S.t2 }}>{showEmail ? adminEmail : 'Super Admin'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex:1, overflowY:'auto', padding:S.pad }}>
          <div style={{ display:'flex', flexDirection:'column', gap:S.gap }}>

            {/* STAT CARDS */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:S.gap }}>
              {statCards.map((c, i) => (
                <div key={i} style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:'20px 22px', boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                    {[<Users size={20}/>, <Users size={20}/>, <FileText size={20}/>, <Shield size={20}/>][i]}
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:S.t2, marginBottom:4 }}>{c.title}</div>
                  <div style={{ fontSize:28, fontWeight:800, color:S.t1, marginBottom:6 }}>{c.value}</div>
                  <div style={{ fontSize:11, fontWeight:600, color: c.trend >= 0 ? S.green : '#DC2626' }}>{c.trend >= 0 ? '↑' : '↓'} {Math.abs(c.trend)}% <span style={{ color:S.t3, fontWeight:400, marginLeft:4 }}>vs last 7 days</span></div>
                </div>
              ))}
            </div>

            {/* CHARTS ROW */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:S.gap, minHeight:380 }}>
              {/* Registration Chart */}
              <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:S.pad, boxShadow:'0 1px 3px rgba(0,0,0,.04)', display:'flex', flexDirection:'column' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <h3 style={{ fontSize:15, fontWeight:700, margin:0 }}>Registration Graph</h3>
                  <div style={{ fontSize:12, fontWeight:500, color:S.t2, background:'#F1F5F9', padding:'5px 10px', borderRadius:8, border:'1px solid '+S.border, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>This Week</div>
                </div>
                <div style={{ flex:1, position:'relative', minHeight:180 }}>
                  <div style={{ position:'absolute', left:0, top:0, bottom:32, display:'flex', flexDirection:'column', justifyContent:'space-between', fontSize:10, fontWeight:500, color:S.t3, width:24 }}>
                    {chartsData.registration.yLabels.map((yl, i) => <span key={i}>{yl}</span>)}
                  </div>
                  <svg viewBox="0 0 800 200" style={{ width:'calc(100% - 30px)', height:'calc(100% - 32px)', marginLeft:30, overflow:'visible' }} preserveAspectRatio="none">
                    <defs><linearGradient id="cgReg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15"/><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/></linearGradient></defs>
                    <path d={chartsData.registration.fillString} fill="url(#cgReg)"/>
                    <path d={chartsData.registration.pathString} fill="none" stroke="#8b5cf6" strokeWidth="2.5"/>
                    {chartsData.registration.points.map(([x,y],i) => (
                      <circle key={i} cx={x} cy={y} r="6" fill="#8b5cf6" style={{cursor: 'pointer'}}><title>{chartsData.registration.counts[i]} Registrations on this day</title></circle>
                    ))}
                  </svg>
                  <div style={{ position:'absolute', bottom:0, left:30, right:0, display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:500, color:S.t3 }}>
                    {chartsData.labels.map((d, i) => <span key={i}>{d}</span>)}
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:16 }}>
                  {[
                    { dot:'#6C4EFF', label:'Total Users', val: exactCounts.members },
                    { dot:'#D97706', label:'Total Teams', val: exactCounts.teams },
                    { dot:'#059669', label:'Avg Team Size', val: exactCounts.teams ? (exactCounts.members / exactCounts.teams).toFixed(1) : 0 },
                    { dot:'#2563EB', label:'Submissions', val: exactCounts.subs },
                  ].map((s,i) => (
                    <div key={i} style={{ background:'#FAFAFA', border:'1px solid #F1F5F9', borderRadius:10, padding:'10px 12px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:s.dot }}/>
                        <span style={{ fontSize:11, fontWeight:600, color:S.t2 }}>{s.label}</span>
                      </div>
                      <div style={{ fontSize:20, fontWeight:800, color:S.t1 }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submissions Chart */}
              <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:S.pad, boxShadow:'0 1px 3px rgba(0,0,0,.04)', display:'flex', flexDirection:'column' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <h3 style={{ fontSize:15, fontWeight:700, margin:0 }}>Submissions Graph</h3>
                  <div style={{ fontSize:12, fontWeight:500, color:S.t2, background:'#F1F5F9', padding:'5px 10px', borderRadius:8, border:'1px solid '+S.border, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>This Week</div>
                </div>
                <div style={{ flex:1, position:'relative', minHeight:180 }}>
                  <div style={{ position:'absolute', left:0, top:0, bottom:32, display:'flex', flexDirection:'column', justifyContent:'space-between', fontSize:10, fontWeight:500, color:S.t3, width:24 }}>
                    {chartsData.submission.yLabels.map((yl, i) => <span key={i}>{yl}</span>)}
                  </div>
                  <svg viewBox="0 0 800 200" style={{ width:'calc(100% - 30px)', height:'calc(100% - 32px)', marginLeft:30, overflow:'visible' }} preserveAspectRatio="none">
                    <defs><linearGradient id="cgSub" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#059669" stopOpacity="0.15"/><stop offset="100%" stopColor="#059669" stopOpacity="0"/></linearGradient></defs>
                    <path d={chartsData.submission.fillString} fill="url(#cgSub)"/>
                    <path d={chartsData.submission.pathString} fill="none" stroke="#059669" strokeWidth="2.5"/>
                    {chartsData.submission.points.map(([x,y],i) => (
                      <circle key={i} cx={x} cy={y} r="6" fill="#059669" style={{cursor: 'pointer'}}><title>{chartsData.submission.counts[i]} Submissions on this day</title></circle>
                    ))}
                  </svg>
                  <div style={{ position:'absolute', bottom:0, left:30, right:0, display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:500, color:S.t3 }}>
                    {chartsData.labels.map((d, i) => <span key={i}>{d}</span>)}
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:16 }}>
                  {[
                    { dot:'#3b82f6', label:'Submitted', val: exactCounts.subs },
                    { dot:'#eab308', label:'Pending', val: teams.filter(t => t.status === 'Pending').length },
                    { dot:'#8b5cf6', label:'Shortlisted', val: teams.filter(t => t.status === 'Shortlisted').length },
                    { dot:'#ef4444', label:'Rejected', val: teams.filter(t => t.status === 'Rejected').length },
                  ].map((s,i) => (
                    <div key={i} style={{ background:'#FAFAFA', border:'1px solid #F1F5F9', borderRadius:10, padding:'10px 12px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:s.dot }}/>
                        <span style={{ fontSize:11, fontWeight:600, color:S.t2, whiteSpace:'nowrap' }}>{s.label}</span>
                      </div>
                      <div style={{ fontSize:20, fontWeight:800, color:S.t1 }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:S.gap }}>
              {/* Recent Submissions */}
              <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, boxShadow:'0 1px 3px rgba(0,0,0,.04)', overflow:'hidden' }}>
                <div style={{ padding:'18px 22px', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <h3 style={{ fontSize:15, fontWeight:700, margin:0 }}>Recently Created Team</h3>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                  <thead>
                    <tr style={{ background:'#FAFAFA', borderBottom:'1px solid #F1F5F9' }}>
                      {['Team Name','Track','Submission Title','Submitted On','Status'].map(h => (
                        <th key={h} style={{ padding:'12px 18px', fontWeight:600, color:S.t2, textAlign: h==='Action' ? 'center' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teams.slice(0,5).map(team => {
                      const sub = submissions.find(s => s.team_id === team.id);
                      const st = statusStyle(team.status);
                      return (
                        <tr key={team.id} style={{ borderBottom:'1px solid #F8FAFC' }}>
                          <td style={{ padding:'14px 18px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <div style={{ width:28, height:28, borderRadius:6, background:'#D1FAE5', color:'#059669', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:11 }}>{team.team_name.charAt(0)}</div>
                              <span style={{ fontWeight:700, color:S.t1 }}>{team.team_name}</span>
                            </div>
                          </td>
                          <td style={{ padding:'14px 18px', color:S.t2 }}>{sub?.category || 'General'}</td>
                          <td style={{ padding:'14px 18px', color:S.t2, maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{sub?.project_title || '-'}</td>
                          <td style={{ padding:'14px 18px', color:S.t3 }}>{team.created_at ? new Date(team.created_at).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'}) : '-'}</td>
                          <td style={{ padding:'14px 18px' }}>
                            <span style={{ ...st, padding:'4px 10px', borderRadius:6, fontSize:10, fontWeight:700, display:'inline-block' }}>
                              {team.status === 'Pending' ? 'Under Review' : team.status || 'Submitted'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ padding:'14px 22px', borderTop:'1px solid #F1F5F9', textAlign:'center' }}>
                  <button onClick={() => navigate('/udview/submissions')} style={{ background:'none', border:'none', fontSize:12, fontWeight:700, color:S.primary, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4 }}>
                    View all submissions <ChevronRight size={14}/>
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 style={{ fontSize:15, fontWeight:700, margin:'0 0 16px' }}>Quick Actions</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {[
                    { Icon: Users, label:'Users', color:'#2563EB', bg:'#DBEAFE', onClick: () => navigate('/udview/users') },
                    { Icon: Flag, label:'Teams', color:'#059669', bg:'#D1FAE5', onClick: () => navigate('/udview/teams') },
                    { Icon: CheckSquare, label:'Evaluations', color:'#D97706', bg:'#FEF3C7', onClick: () => navigate('/udview/evaluations') },
                    { Icon: Megaphone, label:'Announcements', color:'#6C4EFF', bg:'#EEE8FF', onClick: () => navigate('/udview/announcements') }
                  ].map((a, i) => (
                    <button key={i} onClick={a.onClick} style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, padding:'18px 12px', borderRadius:12, border:'1px solid #F1F5F9', background:S.card, cursor:'pointer', boxShadow:'0 1px 2px rgba(0,0,0,.04)', transition:'box-shadow .15s' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,.08)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow='0 1px 2px rgba(0,0,0,.04)'}>
                      <div style={{ padding:8, borderRadius:10, background:a.bg, color:a.color }}><a.Icon size={20}/></div>
                      <span style={{ fontSize:11, fontWeight:700, color:a.color }}>{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      
    </>
  );
}
