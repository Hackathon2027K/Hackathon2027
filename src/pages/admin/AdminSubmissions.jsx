import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { FileText, Search, ChevronRight, Download, Calendar as CalendarIcon, Filter, Eye } from 'lucide-react';

const S = {
  bg: '#F8FAFC', card: '#FFFFFF', border: '#E5E7EB', primary: '#6C4EFF',
  t1: '#111827', t2: '#6B7280', t3: '#9CA3AF', green: '#16A34A',
  activeBg: '#EEE8FF', radius: '14px', pad: '24px', gap: '20px',
};

export default function AdminSubmissions() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissionsList, setSubmissionsList] = useState([]);
  
  // Filters and Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Submissions');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [tabCounts, setTabCounts] = useState({ all: 0, pending: 0, shortlisted: 0, rejected: 0 });
  const [teams, setTeams] = useState([]);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);

  const fetchData = useCallback(async () => {
    const [cAll, cP, cS, cR] = await Promise.all([
      supabase.from('submissions').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'Shortlisted'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'Rejected'),
    ]);
    
    setTabCounts({
      all: cAll.count || 0,
      pending: cP.count || 0,
      shortlisted: cS.count || 0,
      rejected: cR.count || 0
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
    setTeams(allTeams);
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
    
    if (activeTab !== 'All Submissions') {
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
        const subs = data.map((sub) => {
          const team = teams.find(tm => tm.id === sub.team_id);
          return {
            id: sub.id,
            teamId: team?.id,
            teamName: team?.team_name || 'Unknown Team',
            teamTrack: sub.category || 'General',
            subTitle: sub.project_title || 'Untitled Project',
            subDesc: sub.project_description || 'No description provided',
            status: sub.status || 'Pending',
            fileUrl: sub.pdf_url || null,
            date: sub.created_at || new Date().toISOString()
          };
        });
        setSubmissionsList(subs);
      }
      if (count !== null) setTotalFilteredCount(count);
    };
    fetchPage();
  }, [loading, isAdmin, currentPage, searchTerm, activeTab, teams]);

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:S.bg}}><div style={{width:40,height:40,border:'3px solid '+S.primary,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>;
  if (!isAdmin) return null;

  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);
  const currentSubs = submissionsList;

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
    const headers = ['Submission ID', 'Team Name', 'Track', 'Project Title', 'Status', 'Submitted On'];
    const csvContent = [
      headers.join(','),
      ...data.map(sub => {
        const team = teams.find(tm => tm.id === sub.team_id);
        return [
          `"${sub.id}"`,
          `"${team?.team_name || 'Unknown'}"`,
          `"${sub.category || 'General'}"`,
          `"${sub.project_title || ''}"`,
          `"${sub.status || 'Pending'}"`,
          `"${new Date(sub.created_at || new Date()).toLocaleString()}"`
        ];
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "submissions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { label: 'All Submissions', count: tabCounts.all, bg: '#F1F5F9', color: '#64748B' },
    { label: 'Pending', count: tabCounts.pending, bg: '#FEF3C7', color: '#D97706' },
    { label: 'Shortlisted', count: tabCounts.shortlisted, bg: '#DBEAFE', color: '#2563EB' },
    { label: 'Rejected', count: tabCounts.rejected, bg: '#FEF2F2', color: '#DC2626' }
  ];

  const getStatusStyle = (status) => {
    if (status === 'Shortlisted') return { color: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE' };
    if (status === 'Rejected') return { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
    return { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' };
  };

  return (
    <>
        <header style={{ height:64, background:S.card, borderBottom:'1px solid '+S.border, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div>
              <h1 style={{ fontSize:18, fontWeight:700, margin:0, color:S.t1 }}>Submissions</h1>
              <div style={{ fontSize:11, fontWeight:500, color:S.t2, display:'flex', alignItems:'center', gap:4 }}>Home <ChevronRight size={12}/> <span style={{color:S.t1}}>Submissions</span></div>
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

        <div style={{ flex:1, overflowY:'auto', padding:S.pad }}>
          <div style={{ display:'flex', flexDirection:'column', gap:S.gap }}>
            
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                <h2 style={{ fontSize:24, fontWeight:800, color:S.t1, margin:'0 0 6px' }}>Project Submissions</h2>
                <p style={{ fontSize:13, color:S.t2, margin:0 }}>View all team submissions and presentations.</p>
              </div>
              <button onClick={handleExport} style={{ display:'flex', alignItems:'center', gap:8, background:S.card, color:S.t1, border:'1px solid '+S.border, padding:'10px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 1px 2px rgba(0,0,0,.05)' }}>
                <Download size={16}/> Export CSV
              </button>
            </div>

            <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, boxShadow:'0 1px 3px rgba(0,0,0,.04)', display:'flex', flexDirection:'column' }}>
              
              <div style={{ padding:'20px', borderBottom:'1px solid '+S.border, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, flexWrap:'wrap' }}>
                  <div style={{ position:'relative', minWidth:260 }}>
                    <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:S.t3 }}/>
                    <input 
                      placeholder="Search submissions..." 
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft:36, paddingRight:16, paddingTop:10, paddingBottom:10, background:S.card, border:'1px solid '+S.border, borderRadius:8, fontSize:13, width:'100%', outline:'none', color:S.t1 }}
                    />
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', border:'1px solid '+S.border, borderRadius:8, fontSize:13, fontWeight:500, color:S.t1, cursor:'pointer' }}>
                    <CalendarIcon size={14} style={{color:S.t3}}/> All Time
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <span onClick={() => setSearchTerm('')} style={{ fontSize:13, fontWeight:600, color:S.t2, cursor:'pointer' }}>Clear Filters</span>
                  <button style={{ display:'flex', alignItems:'center', gap:6, background:S.card, color:S.t1, border:'1px solid '+S.border, padding:'10px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Filter size={16}/> Filters
                  </button>
                </div>
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
                      {['S.No', 'Team Name', 'Project Title', 'Track', 'Status', 'Submitted On', 'PDF File'].map(h => (
                        <th key={h} style={{ padding:'16px 20px', fontWeight:600, color:S.t2, textAlign: h==='PDF File'?'center':'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentSubs.map((s, index) => {
                      const sc = getStatusStyle(s.status);
                      return (
                        <tr key={s.id} style={{ borderBottom:'1px solid #F8FAFC' }}>
                          <td style={{ padding:'16px 20px', color:S.t2, fontSize:12, fontWeight:600 }}>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td style={{ padding:'16px 20px' }}>
                            <div style={{ fontWeight:700, color:S.t1 }}>{s.teamName}</div>
                          </td>
                          <td style={{ padding:'16px 20px' }}>
                            <div style={{ fontWeight:600, color:S.t1, fontSize:13 }}>{s.subTitle}</div>
                            <div style={{ fontSize:11, color:S.t3, maxWidth:250, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.subDesc}</div>
                          </td>
                          <td style={{ padding:'16px 20px' }}>
                            <span style={{ background:'#F1F5F9', color:'#475569', padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:600 }}>
                              {s.teamTrack}
                            </span>
                          </td>
                          <td style={{ padding:'16px 20px' }}>
                            <span style={{ color: sc.color, background:sc.bg, border:'1px solid '+sc.border, padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:600 }}>
                              {s.status}
                            </span>
                          </td>
                          <td style={{ padding:'16px 20px', color:S.t2 }}>
                            {new Date(s.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                          </td>
                          <td style={{ padding:'16px 20px', textAlign:'center' }}>
                            {s.fileUrl ? (
                              <a href={s.fileUrl} target="_blank" rel="noreferrer" title="View PDF" style={{ width:32, height:32, borderRadius:'50%', border:'1px solid '+S.border, background:S.card, display:'inline-flex', alignItems:'center', justifyContent:'center', color:S.t2, cursor:'pointer', textDecoration:'none', transition:'all 0.2s' }}>
                                <Eye size={16}/>
                              </a>
                            ) : (
                              <span title="No PDF" style={{ width:32, height:32, borderRadius:'50%', border:'1px solid '+S.border, background:S.bg, display:'inline-flex', alignItems:'center', justifyContent:'center', color:S.border, cursor:'not-allowed' }}>
                                <Eye size={16}/>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {currentSubs.length === 0 && (
                  <div style={{ padding:'60px 20px', textAlign:'center', color:S.t3 }}>
                    <FileText size={40} style={{ opacity:0.2, marginBottom:16 }}/>
                    <div style={{ fontSize:15, fontWeight:600, color:S.t2 }}>No submissions found</div>
                    <div style={{ fontSize:13, marginTop:4 }}>Try adjusting your filters or search query.</div>
                  </div>
                )}
              </div>

              <div style={{ padding:'16px 20px', borderTop:'1px solid '+S.border, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
                <div style={{ color:S.t2, fontWeight:500 }}>Showing {totalFilteredCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalFilteredCount)} of {totalFilteredCount} submissions</div>
                {totalPages > 1 && (
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ background:S.card, border:'1px solid '+S.border, borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', color: currentPage === 1 ? S.border : S.t3, cursor: currentPage === 1 ? 'default' : 'pointer' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    
                    {getPageNumbers().map((p, idx) => (
                      p === '...' ? (
                        <span key={`ellipsis-${idx}`} style={{ color:S.t3, padding:'0 4px', fontWeight:600 }}>...</span>
                      ) : (
                        <button key={p} onClick={() => setCurrentPage(p)} style={{ background: currentPage === p ? '#EEE8FF' : S.card, border: currentPage === p ? 'none' : '1px solid '+S.border, borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', color: currentPage === p ? S.primary : S.t2, fontWeight: currentPage === p ? 700 : 600, cursor:'pointer' }}>{p}</button>
                      )
                    ))}
                    
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ background:S.card, border:'1px solid '+S.border, borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', color: currentPage === totalPages ? S.border : S.t3, cursor: currentPage === totalPages ? 'default' : 'pointer' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
    </>
  );
}
