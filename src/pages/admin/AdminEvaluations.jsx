import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { FileText, Search, ChevronDown, Download, ChevronRight, MoreVertical, ChevronLeft, Star, Clock, XCircle, Eye, Calendar as CalendarIcon, ClipboardCheck, Filter } from 'lucide-react';

const S = {
  bg: '#F8FAFC', card: '#FFFFFF', border: '#E5E7EB', primary: '#6C4EFF',
  t1: '#111827', t2: '#6B7280', t3: '#9CA3AF', green: '#16A34A',
  activeBg: '#EEE8FF', radius: '14px', pad: '24px', gap: '20px',
};



export default function AdminEvaluations() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);
  
  // Filters and Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Evaluations');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [tabCounts, setTabCounts] = useState({ all: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0 });
  const [teams, setTeams] = useState([]);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);

  const fetchData = useCallback(async () => {
    const [cAll, cC, cP, cI, cO] = await Promise.all([
      supabase.from('submissions').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'Completed'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'In Progress'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'Overdue'),
    ]);
    
    setTabCounts({
      all: cAll.count || 0,
      completed: cC.count || 0,
      pending: cP.count || 0,
      inProgress: cI.count || 0,
      overdue: cO.count || 0
    });

    let allTeams = [];
    let p = 0;
    while (true) {
      const { data } = await supabase.from('teams').select('id, team_name').range(p * 1000, (p + 1) * 1000 - 1);
      if (data && data.length > 0) {
        allTeams.push(...data);
        if (data.length < 1000) break;
        p++;
      } else {
        break;
      }
    }
    
    let allLeaders = [];
    let lp = 0;
    while (true) {
      const { data } = await supabase.from('team_members').select('team_id, full_name, email, college_name, location').eq('is_leader', true).range(lp * 1000, (lp + 1) * 1000 - 1);
      if (data && data.length > 0) {
        allLeaders.push(...data);
        if (data.length < 1000) break;
        lp++;
      } else {
        break;
      }
    }

    const enhancedTeams = allTeams.map(t => {
      const leader = allLeaders.find(l => l.team_id === t.id);
      return { ...t, leader };
    });
    setTeams(enhancedTeams);
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { navigate('/register'); return; }
      const { data: adminList } = await supabase.from('admins').select('email');
      if (adminList && adminList.length > 0) { setIsAdmin(true); fetchData(); } else { alert("Not admin!"); navigate('/dashboard'); }
    };
    checkAuth();
  }, [navigate, fetchData]);



  const buildQuery = (isExport = false) => {
    let query = supabase.from('submissions').select('*', { count: 'exact' });
    
    if (activeTab !== 'All Evaluations') {
      query = query.eq('status', activeTab);
    }

    if (searchTerm) {
      const safeTerm = searchTerm.replace(/[%_\*()]/g, '');
      const matchingTeamIds = teams.filter(t => t.team_name.toLowerCase().includes(safeTerm.toLowerCase())).map(t => t.id);
      if (matchingTeamIds.length > 0) {
        query = query.or(`project_title.ilike.%${safeTerm}%,team_id.in.(${matchingTeamIds.join(',')})`);
      } else {
        query = query.ilike('project_title', `%${safeTerm}%`);
      }
    }

    if (!isExport) {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);
    }
    
    return query.order('created_at', { ascending: false });
  };

  useEffect(() => {
    if (loading || !isAdmin) return;
    const fetchPage = async () => {
      const query = buildQuery(false);
      const { data, count } = await query;
      if (data) {
        const evals = data.map((sub) => {
          const team = teams.find(tm => tm.id === sub.team_id);
          const evalName = sub.evaluator_name || 'Unassigned';
          return {
            id: sub.id,
            teamName: team?.team_name || 'Unknown Team',
            leaderName: team?.leader?.full_name || 'Unknown',
            leaderEmail: team?.leader?.email || 'N/A',
            college: team?.leader?.college_name || 'N/A',
            location: team?.leader?.location || 'N/A',
            teamTrack: sub.category || 'General',
            subTitle: sub.project_title || 'Untitled Project',
            subDesc: sub.project_description || 'No description provided',
            status: sub.status || 'Pending',
            score: sub.score || null,
            round: sub.round || 'Evaluation',
            evaluator: { name: evalName, email: '', inits: evalName.charAt(0).toUpperCase(), color: '#64748B', bg: '#F1F5F9' },
            date: sub.created_at || new Date().toISOString()
          };
        });
        setEvaluations(evals);
      }
      if (count !== null) setTotalFilteredCount(count);
    };
    fetchPage();
  }, [loading, isAdmin, currentPage, searchTerm, activeTab, teams]);

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:S.bg}}><div style={{width:40,height:40,border:'3px solid '+S.primary,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>;
  if (!isAdmin) return null;

  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);
  const currentEvals = evaluations;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleExport = async () => {
    const query = buildQuery(true);
    const { data } = await query;
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = ['Submission ID', 'Team Name', 'Leader Name', 'Leader Email', 'College', 'Location', 'Track', 'Project Title', 'Project Description', 'Status', 'Score', 'Round', 'Evaluator', 'Submitted On'];
    const csvContent = [
      headers.join(','),
      ...data.map(sub => {
        const team = teams.find(tm => tm.id === sub.team_id);
        const evalName = sub.evaluator_name || 'Unassigned';
        // Escape quotes in description for CSV
        const safeDesc = sub.project_description ? sub.project_description.replace(/"/g, '""') : '';
        return [
          `"${sub.id}"`,
          `"${team?.team_name || 'Unknown'}"`,
          `"${team?.leader?.full_name || 'Unknown'}"`,
          `"${team?.leader?.email || 'N/A'}"`,
          `"${team?.leader?.college_name || 'N/A'}"`,
          `"${team?.leader?.location || 'N/A'}"`,
          `"${sub.category || 'General'}"`,
          `"${sub.project_title || ''}"`,
          `"${safeDesc}"`,
          `"${sub.status || 'Pending'}"`,
          `"${sub.score || 'Pending'}"`,
          `"${sub.round || 'Evaluation'}"`,
          `"${evalName}"`,
          `"${new Date(sub.created_at || new Date()).toLocaleString()}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'evaluations_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statCounts = {
    total: tabCounts.all,
    completed: tabCounts.completed,
    pending: tabCounts.pending,
    inProgress: tabCounts.inProgress,
    overdue: tabCounts.overdue
  };

  const stats = [
    { title: 'Total Evaluations', value: statCounts.total, trend: '12.8%', c: S.primary, bg: S.activeBg, icon: Star },
    { title: 'Completed', value: statCounts.completed, trend: '14.3%', c: S.green, bg: '#DCFCE7', icon: ClipboardCheck },
    { title: 'Pending', value: statCounts.pending, trend: '8.7%', c: '#D97706', bg: '#FEF3C7', icon: Clock },
    { title: 'In Progress', value: statCounts.inProgress, trend: '20.0%', c: '#2563EB', bg: '#DBEAFE', icon: CalendarIcon },
    { title: 'Overdue', value: statCounts.overdue, trend: '0%', c: '#DC2626', bg: '#FEF2F2', icon: XCircle, hideTrend: true },
  ];

  const tabs = [
    { label: 'All Evaluations', count: statCounts.total, color: S.primary, bg: S.activeBg },
    { label: 'Completed', count: statCounts.completed, color: S.green, bg: '#DCFCE7' },
    { label: 'Pending', count: statCounts.pending, color: '#D97706', bg: '#FEF3C7' },
    { label: 'In Progress', count: statCounts.inProgress, color: '#2563EB', bg: '#DBEAFE' },
    { label: 'Overdue', count: statCounts.overdue, color: '#DC2626', bg: '#FEF2F2' }
  ];

  const getStatusStyle = (s) => {
    if (s === 'Completed') return {color: '#16A34A', bg: '#DCFCE7'};
    if (s === 'Pending') return {color: '#D97706', bg: '#FEF3C7'};
    if (s === 'In Progress') return {color: '#D97706', bg: '#FEF3C7'}; // Orange text for in progress
    return {color: S.t2, bg: S.bg};
  };

  return (
    <>
        {/* TOP NAV */}
        <header style={{ height:64, background:S.card, borderBottom:'1px solid '+S.border, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div>
              <h1 style={{ fontSize:18, fontWeight:700, margin:0, color:S.t1 }}>Dashboard</h1>
              <div style={{ fontSize:11, fontWeight:500, color:S.t2, display:'flex', alignItems:'center', gap:4 }}>Home <ChevronRight size={12}/> <span style={{color:S.t1}}>Evaluations</span></div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, borderLeft:'1px solid '+S.border, paddingLeft:20, cursor:'pointer' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:'#059669', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14 }}>A</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:S.t1 }}>Admin User</div>
                <div style={{ fontSize:11, fontWeight:500, color:S.t2 }}>Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex:1, overflowY:'auto', padding:S.pad }}>
          <div style={{ display:'flex', flexDirection:'column', gap:S.gap }}>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, margin:0 }}>Evaluations</h2>
                <p style={{ fontSize:13, color:S.t2, margin:'4px 0 0' }}>Monitor and manage all team evaluations across rounds and criteria.</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                
                <button onClick={handleExport} style={{ display:'flex', alignItems:'center', gap:6, background:S.primary, color:'#fff', border:'none', padding:'10px 16px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 1px 2px rgba(0,0,0,.04)' }}>
                  <Download size={16}/> Export <ChevronDown size={14}/>
                </button>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:S.gap }}>
              {stats.map((c, i) => (
                <div key={i} style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.04)', display:'flex', gap:16, alignItems:'flex-start' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <c.icon size={20}/>
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:S.t2, marginBottom:4 }}>{c.title}</div>
                    <div style={{ fontSize:24, fontWeight:800, color:S.t1, marginBottom:4 }}>{c.value}</div>
                    {!c.hideTrend ? (
                      <div style={{ fontSize:11, fontWeight:600, color:S.green }}>↑ {c.trend} <span style={{ color:S.t3, fontWeight:400, marginLeft:4 }}>vs last 7 days</span></div>
                    ) : (
                      <div style={{ fontSize:11, fontWeight:400, color:S.t3 }}>vs last 7 days</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, boxShadow:'0 1px 3px rgba(0,0,0,.04)', display:'flex', flexDirection:'column' }}>
              
              <div style={{ padding:'20px', borderBottom:'1px solid '+S.border, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, flexWrap:'wrap' }}>
                  <div style={{ position:'relative', minWidth:260 }}>
                    <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:S.t3 }}/>
                    <input 
                      placeholder="Search by team name or submission title..." 
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft:36, paddingRight:16, paddingTop:10, paddingBottom:10, background:S.card, border:'1px solid '+S.border, borderRadius:8, fontSize:13, width:'100%', outline:'none', color:S.t1 }}
                    />
                  </div>
                  {/* {['All Rounds', 'All Tracks', 'All Evaluators', 'All Status'].map((lbl, i) => (
                    <select key={i} style={{ padding:'10px 14px', border:'1px solid '+S.border, borderRadius:8, fontSize:13, fontWeight:500, color:S.t1, outline:'none', cursor:'pointer', appearance:'none', background:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 10px center`, paddingRight:32 }}>
                      <option>{lbl}</option>
                    </select>
                  ))} 
                  <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', border:'1px solid '+S.border, borderRadius:8, fontSize:13, fontWeight:500, color:S.t1, cursor:'pointer' }}>
                    <CalendarIcon size={14} style={{color:S.t3}}/> May 20, 2025 - May 26, 2025
                  </div>*/}
                </div>
                {/* <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <span onClick={() => setSearchTerm('')} style={{ fontSize:13, fontWeight:600, color:S.t2, cursor:'pointer' }}>Clear Filters</span>
                  <button style={{ display:'flex', alignItems:'center', gap:6, background:S.card, color:S.t1, border:'1px solid '+S.border, padding:'10px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Filter size={16}/> Filters
                  </button>
                </div> */}
              </div>

              <div style={{ padding:'0 20px', borderBottom:'1px solid '+S.border, display:'flex', gap:24 }}>
                {tabs.map((t, i) => (
                  <div key={i} onClick={() => { setActiveTab(t.label); setCurrentPage(1); }} style={{ padding:'16px 0', borderBottom: activeTab === t.label ? '2px solid '+S.primary : '2px solid transparent', color: activeTab === t.label ? S.primary : S.t2, fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                    {t.label}
                    <span style={{ padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:700, background: t.bg, color: t.color }}>{t.count}</span>
                  </div>
                ))}
              </div>

              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr style={{ background:'#FAFAFA', borderBottom:'1px solid '+S.border }}>
                      {['S.No', 'Team Details', 'Submission', 'Evaluator', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding:'16px 20px', fontWeight:600, color:S.t2, textAlign: h==='Actions'?'center':'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentEvals.map((e, index) => {
                      const ac = {bg: '#EEE8FF', text: '#6C4EFF'};
                      const subIconColor = '#16A34A'; // Greenish
                      const sc = getStatusStyle(e.status);

                      return (
                        <tr key={e.id} style={{ borderBottom:'1px solid #F8FAFC' }}>
                          <td style={{ padding:'16px 20px', color:S.t2, fontSize:12, fontWeight:600 }}>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td style={{ padding:'16px 20px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                              <div style={{ width:36, height:36, borderRadius:'8px', background:ac.bg, color:ac.text, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13 }}>
                                {e.teamName.substring(0,2).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight:700, color:S.t1 }}>{e.teamName}</div>
                                <div style={{ fontSize:11, color:S.t3, marginTop:4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <span>👤 {e.leaderName} ({e.leaderEmail})</span>
                                  <span>🏛️ {e.college} • {e.location}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'16px 20px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <div style={{ width:28, height:28, borderRadius:'6px', background:'#DCFCE7', color:subIconColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                                <FileText size={14}/>
                              </div>
                              <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight:600, color:S.t1, fontSize:12 }}>{e.subTitle}</div>
                                <div style={{ fontSize:11, color:S.t3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {e.subDesc.length > 80 ? e.subDesc.substring(0, 80) + '...' : e.subDesc}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'16px 20px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <div style={{ width:28, height:28, borderRadius:'50%', background:e.evaluator.bg, color:e.evaluator.color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:10 }}>
                                {e.evaluator.inits}
                              </div>
                              <div>
                                <div style={{ fontWeight:600, color:S.t1, fontSize:12 }}>{e.evaluator.name}</div>
                                <div style={{ fontSize:11, color:S.t3 }}>{e.evaluator.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'16px 20px' }}>
                            <span style={{ color: sc.color, fontWeight:600, fontSize:12 }}>
                              {e.status}
                            </span>
                          </td>
                          <td style={{ padding:'16px 20px', textAlign:'center' }}>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                              <button onClick={() => navigate(`/udview/evaluations/${e.id}`)} style={{ background:S.card, border:'1px solid '+S.border, borderRadius:6, color:S.t2, cursor:'pointer', padding:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <Eye size={14}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {currentEvals.length === 0 && (
                      <tr>
                        <td colSpan="9" style={{ padding:40, textAlign:'center', color:S.t3 }}>No evaluations found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ padding:'16px 20px', borderTop:'1px solid '+S.border, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
                <div style={{ color:S.t2, fontWeight:500 }}>Showing {totalFilteredCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalFilteredCount)} of {totalFilteredCount} evaluations</div>
                {totalPages > 1 && (
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ background:S.card, border:'1px solid '+S.border, borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', color: currentPage === 1 ? S.border : S.t3, cursor: currentPage === 1 ? 'default' : 'pointer' }}><ChevronLeft size={14}/></button>
                    
                    {getPageNumbers().map((p, idx) => (
                      p === '...' ? (
                        <span key={`ellipsis-${idx}`} style={{ color:S.t3, padding:'0 4px', fontWeight:600 }}>...</span>
                      ) : (
                        <button key={p} onClick={() => setCurrentPage(p)} style={{ background: currentPage === p ? '#EEE8FF' : S.card, border: currentPage === p ? 'none' : '1px solid '+S.border, borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', color: currentPage === p ? S.primary : S.t2, fontWeight: currentPage === p ? 700 : 600, cursor:'pointer' }}>{p}</button>
                      )
                    ))}
                    
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ background:S.card, border:'1px solid '+S.border, borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', color: currentPage === totalPages ? S.border : S.t3, cursor: currentPage === totalPages ? 'default' : 'pointer' }}><ChevronRight size={14}/></button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      
    </>
  );
}

