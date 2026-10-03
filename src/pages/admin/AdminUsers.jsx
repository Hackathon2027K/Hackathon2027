import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Users, Flag, BookOpen, Shield, Search, ChevronDown, Download, ChevronRight, Plus, ChevronLeft, Eye, CheckCircle, X, Clock } from 'lucide-react';

const S = {
  bg: '#F8FAFC', card: '#FFFFFF', border: '#E5E7EB', primary: '#6C4EFF',
  t1: '#111827', t2: '#6B7280', t3: '#9CA3AF', green: '#16A34A',
  activeBg: '#EEE8FF', radius: '14px', pad: '24px', gap: '20px',
};



export default function AdminUsers() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  
  // Filters and Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [teamFilter, setTeamFilter] = useState('All Teams');
  const [yearFilter, setYearFilter] = useState('All Years');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [totalUsersDB, setTotalUsersDB] = useState(0);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);

  // ID Card Verification Modal
  const [idModal, setIdModal] = useState(null);
  const [verifyConfirmed, setVerifyConfirmed] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  const fetchData = useCallback(async () => {
    const { count: total } = await supabase.from('team_members').select('*', { count: 'exact', head: true });
    setTotalUsersDB(total || 0);

    let allTeams = [];
    let p = 0;
    while (true) {
      const { data } = await supabase.from('teams').select('*').range(p * 1000, (p + 1) * 1000 - 1);
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
      setAdminEmail(user.email);
      const { data: adminList } = await supabase.from('admins').select('email');
      if (adminList && adminList.length > 0) { setIsAdmin(true); fetchData(); } else { alert("Not admin!"); navigate('/dashboard'); }
    };
    checkAuth();
  }, [navigate, fetchData]);


  const buildQuery = (isExport = false) => {
    let query = supabase.from('team_members').select('*', { count: 'exact' });
    
    if (searchTerm) {
      const safeTerm = searchTerm.replace(/[%_\*()]/g, '');
      query = query.or(`full_name.ilike.%${safeTerm}%,email.ilike.%${safeTerm}%`);
    }
    if (roleFilter === 'Team Lead') {
      query = query.eq('is_leader', true);
    } else if (roleFilter === 'Member') {
      query = query.not('is_leader', 'is', true);
    }
    if (teamFilter !== 'All Teams') {
      const teamObj = teams.find(t => t.team_name === teamFilter);
      if (teamObj) query = query.eq('team_id', teamObj.id);
    }
    if (yearFilter !== 'All Years') {
      query = query.eq('year', yearFilter);
    }
    if (collegeFilter) {
      query = query.ilike('college_name', `%${collegeFilter}%`);
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
      if (data) setMembers(data);
      if (count !== null) setTotalFilteredCount(count);
    };
    fetchPage();
  }, [loading, isAdmin, currentPage, searchTerm, roleFilter, teamFilter, yearFilter, collegeFilter, teams]);

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:S.bg}}><div style={{width:40,height:40,border:'3px solid '+S.primary,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>;
  if (!isAdmin) return null;

  const getIsLeader = (member) => {
    return member.is_leader === true;
  };

  const handleVerify = async () => {
    if (!idModal || !verifyConfirmed) return;
    setVerifying(true);
    const { error } = await supabase.from('team_members').update({
      id_card_verified: true,
      id_card_verified_by: adminEmail
    }).eq('id', idModal.id);
    if (error) {
      alert('Failed to verify: ' + error.message + '. Please check RLS policies on team_members table.');
    } else {
      setMembers(prev => prev.map(m => m.id === idModal.id ? { ...m, id_card_verified: true, id_card_verified_by: adminEmail } : m));
    }
    setVerifying(false);
    setIdModal(null);
    setVerifyConfirmed(false);
  };

  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);
  const currentMembers = members;

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

  const stats = [
    { title: 'Total Users', value: totalUsersDB, trend: '12.8%', c: S.primary, bg: S.activeBg, icon: Users },
    { title: 'Team Leads', value: teams.length, trend: '10.6%', c: '#D97706', bg: '#FEF3C7', icon: BookOpen },
    { title: 'Admins', value: '2', trend: '0%', c: '#9333EA', bg: '#F3E8FF', icon: Shield },
  ];

  const exportCSV = async () => {
    const query = buildQuery(true);
    const { data } = await query;
    if (!data) return;
    
    let csv = "data:text/csv;charset=utf-8,User,Role,Team,Email,College,Location,Year,Registered On\n";
    data.forEach(m => {
      const t = teams.find(team => team.id === m.team_id);
      const isLeader = getIsLeader(m);
      const role = isLeader ? 'Team Lead' : 'Member';
      csv += `"${m.full_name || ''}","${role}","${t ? t.team_name : ''}","${m.email || ''}","${m.college_name || ''}","${m.location || m.city || ''}","${m.year || ''}","${new Date(m.created_at).toLocaleString()}"\n`;
    });
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "users_export.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <>
      <header style={{ height:64, background:S.card, borderBottom:'1px solid '+S.border, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div>
              <h1 style={{ fontSize:18, fontWeight:700, margin:0, color:S.t1 }}>Dashboard</h1>
              <div style={{ fontSize:11, fontWeight:500, color:S.t2, display:'flex', alignItems:'center', gap:4 }}>Home <ChevronRight size={12}/> <span style={{color:S.t1}}>Users</span></div>
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

        <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:S.pad }}>
          <div style={{ display:'flex', flexDirection:'column', gap:S.gap, minWidth:0 }}>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, margin:0 }}>Users</h2>
                <p style={{ fontSize:13, color:S.t2, margin:'4px 0 0' }}>Manage all users of the hackathon platform.</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:6, background:S.card, color:S.t1, border:'1px solid '+S.border, padding:'10px 16px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 1px 2px rgba(0,0,0,.04)' }}>
                  <Download size={16}/> Export
                </button>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:S.gap, minWidth:0 }}>
              {stats.map((c, i) => (
                <div key={i} style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.04)', display:'flex', gap:16, alignItems:'flex-start' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <c.icon size={20}/>
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:S.t2, marginBottom:4 }}>{c.title}</div>
                    <div style={{ fontSize:24, fontWeight:800, color:S.t1, marginBottom:4 }}>{c.value}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:S.green }}>↑ {c.trend} <span style={{ color:S.t3, fontWeight:400, marginLeft:4 }}>vs last 7 days</span></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, boxShadow:'0 1px 3px rgba(0,0,0,.04)', display:'flex', flexDirection:'column', minWidth: 0 }}>
              
              <div style={{ padding:'16px 20px', borderBottom:'1px solid '+S.border, display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, overflowX:'auto', paddingBottom:4, flexWrap:'nowrap' }}>
                  <div style={{ position:'relative', minWidth:220 }}>
                    <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:S.t3 }}/>
                    <input 
                      placeholder="Search name or email..." 
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft:36, paddingRight:16, paddingTop:10, paddingBottom:10, background:S.card, border:'1px solid '+S.border, borderRadius:8, fontSize:13, width:'100%', outline:'none', color:S.t1 }}
                    />
                  </div>
                  <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }} style={{ padding:'10px 14px', border:'1px solid '+S.border, borderRadius:8, fontSize:13, fontWeight:500, color:S.t1, outline:'none', cursor:'pointer', appearance:'none', background:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 10px center`, paddingRight:32, flexShrink:0 }}>
                    <option>All Roles</option>
                    <option>Team Lead</option>
                    <option>Member</option>
                  </select>
                  <select value={teamFilter} onChange={e => { setTeamFilter(e.target.value); setCurrentPage(1); }} style={{ padding:'10px 14px', border:'1px solid '+S.border, borderRadius:8, fontSize:13, fontWeight:500, color:S.t1, outline:'none', cursor:'pointer', appearance:'none', background:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 10px center`, paddingRight:32, flexShrink:0 }}>
                    <option>All Teams</option>
                    {teams.map(t => <option key={t.id} value={t.team_name}>{t.team_name}</option>)}
                  </select>
                  <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setCurrentPage(1); }} style={{ padding:'10px 14px', border:'1px solid '+S.border, borderRadius:8, fontSize:13, fontWeight:500, color:S.t1, outline:'none', cursor:'pointer', appearance:'none', background:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 10px center`, paddingRight:32, flexShrink:0 }}>
                    <option>All Years</option>
                    <option>1</option><option>2</option><option>3</option><option>4</option>
                  </select>
                  <input placeholder="Filter by college..." value={collegeFilter} onChange={e => { setCollegeFilter(e.target.value); setCurrentPage(1); }} style={{ padding:'10px 14px', border:'1px solid '+S.border, borderRadius:8, fontSize:13, outline:'none', minWidth:160, flexShrink:0 }}/>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
                  <span onClick={() => { setSearchTerm(''); setRoleFilter('All Roles'); setTeamFilter('All Teams'); setYearFilter('All Years'); setCollegeFilter(''); setCurrentPage(1); }} style={{ fontSize:13, fontWeight:600, color:S.t2, cursor:'pointer' }}>Clear Filters</span>
                </div>
              </div>

              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, tableLayout:'auto' }}>
                  <thead>
                    <tr style={{ background:'#FAFAFA', borderBottom:'1px solid '+S.border }}>
                      {['S.No', 'User', 'Role', 'Team', 'Email', 'College', 'Location', 'Year', 'ID Card', 'Verified By', 'Registered On'].map(h => (
                        <th key={h} style={{ padding:'14px 16px', fontWeight:600, color:S.t2, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.map((m, index) => {
                      const t = teams.find(team => team.id === m.team_id);
                      const isLeader = getIsLeader(m);
                      const avatarColors = [
                        {bg: '#DCFCE7', text: '#16A34A'}, {bg: '#EEE8FF', text: '#6C4EFF'},
                        {bg: '#FEF3C7', text: '#D97706'}, {bg: '#DBEAFE', text: '#2563EB'},
                        {bg: '#F3E8FF', text: '#9333EA'}
                      ];
                      const ac = avatarColors[m.id % avatarColors.length] || avatarColors[0];
                      
                      return (
                        <tr key={m.id} style={{ borderBottom:'1px solid #F8FAFC' }}>
                          <td style={{ padding:'14px 16px', color:S.t2, fontSize:12, fontWeight:600 }}>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td style={{ padding:'14px 16px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <div style={{ width:34, height:34, borderRadius:'50%', background:ac.bg, color:ac.text, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, flexShrink:0 }}>
                                {m.full_name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <div style={{ fontWeight:700, color:S.t1 }}>{m.full_name || 'N/A'}</div>
                                <div style={{ fontSize:11, color:S.t3, marginTop:1 }}>@{m.full_name?.toLowerCase().replace(/\s+/g,'') || 'user'}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'14px 16px' }}>
                            <span style={{ 
                              background: isLeader ? '#EEE8FF' : '#DBEAFE', 
                              color: isLeader ? '#6C4EFF' : '#2563EB', 
                              padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:600, whiteSpace:'nowrap', display:'inline-block'
                            }}>
                              {isLeader ? 'Team Lead' : 'Member'}
                            </span>
                          </td>
                          <td style={{ padding:'14px 16px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:6, fontWeight:600, color:S.t1, fontSize:12 }}>
                              <div style={{ width:18, height:18, borderRadius:4, background:ac.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <Flag size={10} color={ac.text}/>
                              </div>
                              {t ? t.team_name : '-'}
                            </div>
                          </td>
                          <td style={{ padding:'14px 16px', color:S.t2, fontSize:12 }}>{m.email || 'N/A'}</td>
                          <td style={{ padding:'14px 16px', color:S.t2, fontSize:12 }}>{m.college_name || '-'}</td>
                          <td style={{ padding:'14px 16px', color:S.t2, fontSize:12 }}>{m.location || '-'}</td>
                          <td style={{ padding:'14px 16px', color:S.t2 }}>{m.year || '-'}</td>
                          
                          {/* ID Card Column */}
                          <td style={{ padding:'14px 16px' }}>
                            {m.id_card_front_url && m.id_card_back_url ? (
                              <button onClick={() => { setIdModal(m); setVerifyConfirmed(false); }} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:8, border:'1px solid '+S.border, background:m.id_card_verified ? '#f0fdf4' : S.card, color:m.id_card_verified ? '#16a34a' : S.primary, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                                <Eye size={14}/> View
                              </button>
                            ) : (
                              <span style={{ fontSize:11, color:'#d97706', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                                <Clock size={12}/> Missing
                              </span>
                            )}
                          </td>
                          
                          {/* Verified By Column */}
                          <td style={{ padding:'14px 16px', fontSize:12 }}>
                            {m.id_card_verified ? (
                              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                                <CheckCircle size={14} color="#16a34a"/>
                                <span style={{ color:S.t1, fontWeight:600 }}>{m.id_card_verified_by || 'Admin'}</span>
                              </div>
                            ) : (
                              <span style={{ color:S.t3 }}>—</span>
                            )}
                          </td>

                          <td style={{ padding:'14px 16px', color:S.t2, whiteSpace: 'nowrap', fontSize:12 }}>
                            {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} <br/>
                            <span style={{ fontSize: 11, color: S.t3 }}>{new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>
                        </tr>
                      );
                    })}
                    {currentMembers.length === 0 && (
                      <tr>
                        <td colSpan="11" style={{ padding:40, textAlign:'center', color:S.t3 }}>No participants found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ padding:'16px 20px', borderTop:'1px solid '+S.border, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
                <div style={{ color:S.t2, fontWeight:500 }}>Showing {totalFilteredCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalFilteredCount)} of {totalFilteredCount} users</div>
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

      {/* ID Card Verification Modal */}
      {idModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:24, backdropFilter:'blur(4px)' }}>
          <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:800, overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,0.2)', display:'flex', flexDirection:'column', maxHeight:'90vh' }}>
            
            {/* Modal Header */}
            <div style={{ padding:'20px 28px', borderBottom:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <h2 style={{ fontSize:18, fontWeight:800, color:'#111', margin:'0 0 4px 0' }}>ID Card — {idModal.full_name}</h2>
                <p style={{ fontSize:13, color:'#6b7280', margin:0 }}>{idModal.email} · {idModal.college_name || 'N/A'}</p>
              </div>
              <button onClick={() => { setIdModal(null); setVerifyConfirmed(false); }} style={{ background:'#f3f4f6', border:'none', width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#4b5563' }}>
                <X size={18}/>
              </button>
            </div>

            {/* Modal Images */}
            <div style={{ padding:28, overflowY:'auto', flex:1, display:'flex', gap:24, flexWrap:'wrap', justifyContent:'center', background:'#f8fafc' }}>
              <div style={{ flex:'1 1 300px', maxWidth:380 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:10, textAlign:'center' }}>Front Side</div>
                <div style={{ background:'#fff', padding:10, borderRadius:14, boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }}>
                  <img src={idModal.id_card_front_url} alt="Front" style={{ width:'100%', height:'auto', borderRadius:8, objectFit:'contain' }}/>
                </div>
              </div>
              <div style={{ flex:'1 1 300px', maxWidth:380 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:10, textAlign:'center' }}>Back Side</div>
                <div style={{ background:'#fff', padding:10, borderRadius:14, boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }}>
                  <img src={idModal.id_card_back_url} alt="Back" style={{ width:'100%', height:'auto', borderRadius:8, objectFit:'contain' }}/>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding:'20px 28px', borderTop:'1px solid #e5e7eb', background:'#fff' }}>
              {idModal.id_card_verified ? (
                <div style={{ display:'flex', alignItems:'center', gap:10, background:'#f0fdf4', padding:'14px 18px', borderRadius:12, border:'1.5px solid #bbf7d0' }}>
                  <CheckCircle size={20} color="#16a34a"/>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#166534' }}>Already Verified</div>
                    <div style={{ fontSize:12, color:'#15803d' }}>Verified by: {idModal.id_card_verified_by || 'Admin'}</div>
                  </div>
                </div>
              ) : (
                <>
                  <label style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer', background:'#f0fdf4', padding:'14px 18px', borderRadius:12, border:'1.5px solid #bbf7d0', marginBottom:16 }}>
                    <input type="checkbox" checked={verifyConfirmed} onChange={e => setVerifyConfirmed(e.target.checked)} style={{ width:18, height:18, accentColor:'#16a34a', cursor:'pointer' }}/>
                    <span style={{ fontSize:14, fontWeight:700, color:'#166534' }}>I verify this is a correct and valid student ID card.</span>
                  </label>
                  <div style={{ display:'flex', justifyContent:'flex-end', gap:12 }}>
                    <button onClick={() => { setIdModal(null); setVerifyConfirmed(false); }} style={{ padding:'10px 20px', borderRadius:10, background:'#fff', border:'1.5px solid #e5e7eb', fontSize:14, fontWeight:600, color:'#374151', cursor:'pointer' }}>Cancel</button>
                    <button onClick={handleVerify} disabled={!verifyConfirmed || verifying} style={{ padding:'10px 24px', borderRadius:10, background:(!verifyConfirmed || verifying) ? '#9ca3af' : '#16a34a', border:'none', fontSize:14, fontWeight:700, color:'#fff', cursor:(!verifyConfirmed || verifying) ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:8 }}>
                      <CheckCircle size={16}/> {verifying ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}
      
    </>
  );
}
