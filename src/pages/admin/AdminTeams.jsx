import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Users, Flag, CheckSquare, Search, ChevronDown, Download, ChevronRight, MoreVertical, ChevronLeft, Trophy } from 'lucide-react';

const S = {
  bg: '#F8FAFC', card: '#FFFFFF', border: '#E5E7EB', primary: '#6C4EFF',
  t1: '#111827', t2: '#6B7280', t3: '#9CA3AF', green: '#16A34A',
  activeBg: '#EEE8FF', radius: '14px', pad: '24px', gap: '20px',
};



export default function AdminTeams() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  // Filters and Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [trackFilter, setTrackFilter] = useState('All Tracks');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [totalTeamsDB, setTotalTeamsDB] = useState(0);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);

  const fetchData = useCallback(async () => {
    const { count: total } = await supabase.from('teams').select('*', { count: 'exact', head: true });
    setTotalTeamsDB(total || 0);
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
    let query = supabase.from('teams').select('*', { count: 'exact' });
    if (searchTerm) {
      const safeTerm = searchTerm.replace(/[%_\*()]/g, '');
      query = query.ilike('team_name', `%${safeTerm}%`);
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
      const { data: pageTeams, count } = await query;
      if (pageTeams) {
        setTeams(pageTeams);
        const teamIds = pageTeams.map(t => t.id);
        if (teamIds.length > 0) {
          const [{ data: m }, { data: s }] = await Promise.all([
            supabase.from('team_members').select('*').in('team_id', teamIds),
            supabase.from('submissions').select('team_id, category').in('team_id', teamIds)
          ]);
          if (m) setMembers(m);
          if (s) setSubmissions(s);
        } else {
          setMembers([]); setSubmissions([]);
        }
      }
      if (count !== null) setTotalFilteredCount(count);
    };
    fetchPage();
  }, [loading, isAdmin, currentPage, searchTerm]);

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:S.bg}}><div style={{width:40,height:40,border:'3px solid '+S.primary,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>;
  if (!isAdmin) return null;

  const toggleShortlist = async (teamId, currentStatus) => {
    const newStatus = currentStatus === 'Shortlisted' ? 'Pending' : 'Shortlisted';
    const { error } = await supabase.from('teams').update({ status: newStatus }).eq('id', teamId);
    if (!error) {
      setTeams(teams.map(t => t.id === teamId ? { ...t, status: newStatus } : t));
    } else {
      alert("Error: " + error.message);
    }
  };

  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);
  const currentTeams = teams;

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

  const exportCSV = async () => {
    const query = buildQuery(true);
    const { data } = await query;
    if (!data) return;

    let csv = "data:text/csv;charset=utf-8,Team,Status,Registered On\n";
    data.forEach(t => {
      csv += `"${t.team_name || ''}","${t.status || 'Active'}","${t.created_at || ''}"\n`;
    });
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "teams_export.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <>
        {/* TOP NAV */}
        <header style={{ height:64, background:S.card, borderBottom:'1px solid '+S.border, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div>
              <h1 style={{ fontSize:18, fontWeight:700, margin:0, color:S.t1 }}>Dashboard</h1>
              <div style={{ fontSize:11, fontWeight:500, color:S.t2, display:'flex', alignItems:'center', gap:4 }}>Home <ChevronRight size={12}/> <span style={{color:S.t1}}>Teams</span></div>
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
                <h2 style={{ fontSize:20, fontWeight:700, margin:0 }}>Teams</h2>
                <p style={{ fontSize:13, color:S.t2, margin:'4px 0 0' }}>Manage all teams participating in the hackathon.</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                
                <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:6, background:S.card, color:S.t1, border:'1px solid '+S.border, padding:'10px 16px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 1px 2px rgba(0,0,0,.04)' }}>
                  <Download size={16}/> Export
                </button>
              </div>
            </div>

            <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, boxShadow:'0 1px 3px rgba(0,0,0,.04)', display:'flex', flexDirection:'column' }}>
              
              <div style={{ padding:'20px', borderBottom:'1px solid '+S.border, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, flexWrap:'wrap' }}>
                  <div style={{ position:'relative', minWidth:260 }}>
                    <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:S.t3 }}/>
                    <input 
                      placeholder="Search teams by name..." 
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft:36, paddingRight:16, paddingTop:10, paddingBottom:10, background:S.card, border:'1px solid '+S.border, borderRadius:8, fontSize:13, width:'100%', outline:'none', color:S.t1 }}
                    />
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <span onClick={() => { setSearchTerm(''); setCurrentPage(1); }} style={{ fontSize:13, fontWeight:600, color:S.primary, cursor:'pointer' }}>Clear Filters</span>
                </div>
              </div>

              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr style={{ background:'#FAFAFA', borderBottom:'1px solid '+S.border }}>
                      {['S.No', 'Team', 'Team Lead', 'Members', 'Registered On'].map(h => (
                        <th key={h} style={{ padding:'16px 20px', fontWeight:600, color:S.t2, textAlign:'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTeams.map((t, index) => {
                      const sub = submissions.find(s => s.team_id === t.id);
                      const track = sub?.category || 'General';
                      const teamMembers = members.filter(m => m.team_id === t.id);
                      const lead = teamMembers.find(m => m.is_leader === true) || teamMembers[0];
                      
                      const avatarColors = [
                        {bg: '#EEE8FF', text: '#6C4EFF'}, {bg: '#DBEAFE', text: '#2563EB'},
                        {bg: '#FEF3C7', text: '#D97706'}, {bg: '#F3E8FF', text: '#9333EA'},
                        {bg: '#DCFCE7', text: '#16A34A'}
                      ];
                      const ac = avatarColors[t.id % avatarColors.length] || avatarColors[0];
                      
                      const trackColors = {
                        'Climate Action': {bg:'#DCFCE7', text:'#16A34A'},
                        'Affordable Energy': {bg:'#FEF3C7', text:'#D97706'},
                        'Sustainable Cities': {bg:'#F3E8FF', text:'#9333EA'},
                        'Life on Land': {bg:'#DCFCE7', text:'#16A34A'},
                        'Quality Education': {bg:'#DBEAFE', text:'#2563EB'},
                        'Software': {bg:'#DBEAFE', text:'#2563EB'},
                        'Hardware': {bg:'#FEF3C7', text:'#D97706'},
                        'General': {bg:'#F1F5F9', text:'#64748B'}
                      };
                      const tc = trackColors[track] || {bg:'#F1F5F9', text:'#64748B'};

                      let sdgNumbers = '-';
                      if (sub?.sdg_goal) {
                        const matches = sub.sdg_goal.match(/SDG\s*(\d+)/gi);
                        if (matches) {
                          sdgNumbers = matches.map(m => m.replace(/SDG\s*/i, '')).join(', ');
                        } else {
                          const justNums = sub.sdg_goal.replace(/[^0-9,]/g, '').trim();
                          if (justNums) sdgNumbers = justNums;
                        }
                      }

                      return (
                        <tr key={t.id} style={{ borderBottom:'1px solid #F8FAFC' }}>
                          <td style={{ padding:'16px 20px', color:S.t2, fontSize:12, fontWeight:600 }}>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td style={{ padding:'16px 20px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                              <div style={{ width:36, height:36, borderRadius:'8px', background:ac.bg, color:ac.text, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13 }}>
                                {t.team_name?.substring(0,2)?.toUpperCase() || 'TM'}
                              </div>
                              <div>
                                <div style={{ fontWeight:700, color:S.t1 }}>{t.team_name || 'Unnamed Team'}</div>
                                <div style={{ fontSize:12, color:S.t3, marginTop:2 }}>@{t.team_name?.toLowerCase().replace(/\s+/g,'') || 'team'}</div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding:'16px 20px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <div style={{ width:28, height:28, borderRadius:'50%', background:S.activeBg, color:S.primary, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:10 }}>
                                {lead?.full_name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <div style={{ fontWeight:600, color:S.t1, fontSize:12 }}>{lead?.full_name || 'N/A'}</div>
                                <div style={{ fontSize:11, color:S.t3 }}>{lead?.email || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'16px 20px' }}>
                            <div style={{ display:'flex', alignItems:'center' }}>
                              {teamMembers.slice(0,3).map((m, idx) => (
                                <div key={m.id} style={{ width:28, height:28, borderRadius:'50%', background:'#E2E8F0', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#475569', marginLeft: idx > 0 ? -8 : 0 }}>
                                  {m.full_name?.charAt(0)}
                                </div>
                              ))}
                              {teamMembers.length > 3 && (
                                <div style={{ width:28, height:28, borderRadius:'50%', background:'#F1F5F9', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#64748B', marginLeft:-8 }}>
                                  +{teamMembers.length - 3}
                                </div>
                              )}
                            </div>
                          </td>

                          <td style={{ padding:'16px 20px', color:S.t2 }}>{t.created_at ? new Date(t.created_at).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'}) : '-'}</td>
                        </tr>
                      );
                    })}
                    {currentTeams.length === 0 && (
                      <tr>
                        <td colSpan="8" style={{ padding:40, textAlign:'center', color:S.t3 }}>No teams found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ padding:'16px 20px', borderTop:'1px solid '+S.border, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
                <div style={{ color:S.t2, fontWeight:500 }}>Showing {totalFilteredCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalFilteredCount)} of {totalFilteredCount} teams</div>
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

