import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Search, ChevronDown, ChevronRight, ChevronLeft, Check, Leaf, ExternalLink, Bold, Italic, Underline, List, Link2, Mail, Phone, User, MapPin, Building2, Hash } from 'lucide-react';

const S = {
  bg: '#F8FAFC', card: '#FFFFFF', border: '#E5E7EB', primary: '#6C4EFF',
  t1: '#111827', t2: '#6B7280', t3: '#9CA3AF', green: '#16A34A',
  activeBg: '#EEE8FF', radius: '14px', pad: '24px', gap: '20px',
};



export default function AdminEvaluateSubmission() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [allSubmissionIds, setAllSubmissionIds] = useState([]);

  // Evaluation state
  const [scores, setScores] = useState({
    problem: 0,
    innovation: 0,
    technical: 0,
    impact: 0,
    presentation: 0
  });
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchData() {
      // Attempt to fetch real submission
      const { data: sub } = await supabase.from('submissions').select('*').eq('id', id).single();
      
      if (sub) {
        setSubmission(sub);
        
        if (sub.evaluation_scores) setScores(sub.evaluation_scores);
        if (sub.evaluation_notes) setNotes(sub.evaluation_notes);

        const { data: allSubs } = await supabase.from('submissions').select('id').order('created_at', { ascending: false });
        if (allSubs) setAllSubmissionIds(allSubs.map(s => s.id));

        const { data: tm } = await supabase.from('teams').select('*').eq('id', sub.team_id).single();
        if (tm) setTeam(tm);
        const { data: mbrs } = await supabase.from('team_members').select('*').eq('team_id', sub.team_id);
        if (mbrs) setMembers(mbrs);
      } else {
        // Fallback for visual mock if ID doesn't exist
        setSubmission({
          id: 'SUB-2025-00156',
          project_title: 'AI Based Waste Management',
          project_description: 'AI Based Waste Management is an intelligent platform that leverages machine learning and computer vision to optimize waste collection routes, classify waste types in real-time, and promote recycling. The system aims to reduce landfill usage, lower carbon emissions, and build smarter, cleaner cities.',
          category: 'Climate Action',
          created_at: '2025-05-26T23:59:00Z',
          status: 'Under Review',
          round: 'Evaluation'
        });
        setTeam({ team_name: 'Greenovate', college_name: 'KPR Institute of Engineering and Technology', city: 'Coimbatore', state: 'Tamil Nadu' });
        setMembers([
          {id:1, full_name: 'Alice Johnson', role: 'Team Leader', email: 'alice@example.com', phone: '1234567890', college_name: 'KPR Institute of Engineering and Technology', city: 'Coimbatore', state: 'Tamil Nadu'},
          {id:2, full_name: 'Bob Smith', role: 'Team Member', email: 'bob@example.com', phone: '0987654321'},
          {id:3, full_name: 'Charlie Brown', role: 'Team Member', email: 'charlie@example.com', phone: '1112223333'},
          {id:4, full_name: 'Diana Prince', role: 'Team Member', email: 'diana@example.com', phone: '4445556666'}
        ]); // Mock 4 members
      }
      
      setLoading(false);
    };

    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { navigate('/register'); return; }
      const { data: adminList } = await supabase.from('admins').select('email');
      if (adminList && adminList.length > 0) { setIsAdmin(true); fetchData(); } else { alert("Not admin!"); navigate('/dashboard'); }
    };
    checkAuth();
  }, [navigate, id]);
  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:S.bg}}><div style={{width:40,height:40,border:'3px solid '+S.primary,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>;
  if (!isAdmin) return null;

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const isComplete = Object.values(scores).every(s => s > 0);
  const avgScore = (totalScore / 5).toFixed(1);
  const circumference = 2 * Math.PI * 36; // r=36
  const strokeDashoffset = circumference - (totalScore / 50) * circumference;

  const handleSave = async () => {
    try {
      const { error } = await supabase.from('submissions').update({
        status: 'Completed',
        score: Math.round(Number(avgScore) * 10), // e.g. 8.4 * 10 = 84 / 100
        evaluator_name: adminName,
        evaluation_notes: notes,
        evaluation_scores: scores
      }).eq('id', id);

      if (error) {
        // console.error(error);
        alert('Error saving evaluation: ' + error.message + '\n\nPlease run the SQL migration to add evaluation columns to your submissions table.');
        return;
      }

      alert('Evaluation saved successfully!');
      navigate('/udview/evaluations');
    } catch (err) {
      // console.error(err);
      alert('An unexpected error occurred.');
    }
  };

  const renderScoreRow = (num, title, desc, key) => (
    <div style={{ display:'flex', alignItems:'flex-start', gap:16, padding:'24px 0', borderBottom:'1px solid '+S.border }}>
      <div style={{ width:24, height:24, borderRadius:'50%', background:S.activeBg, color:S.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>{num}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:700, color:S.t1 }}>{title}</div>
        <div style={{ fontSize:12, color:S.t2, marginTop:4 }}>{desc}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
        <select 
          value={scores[key]} 
          onChange={e => setScores({...scores, [key]: Number(e.target.value)})}
          style={{ padding:'8px 12px', borderRadius:6, border:'1px solid '+S.border, fontSize:13, color:S.t1, outline:'none', cursor:'pointer', minWidth:120 }}
        >
          <option value={0} disabled>Select Score</option>
          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div style={{ width:60, textAlign:'right' }}>
        <div style={{ fontSize:10, color:S.t3 }}>Score</div>
        <div style={{ fontSize:14, fontWeight:700, color:S.green }}>{scores[key]}/10</div>
      </div>
    </div>
  );

  const leadMember = members.find(m => m.is_leader) || members[0];

  return (
    <>
        {/* TOP NAV */}
        <header style={{ height:64, background:S.card, borderBottom:'1px solid '+S.border, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div>
              <h1 style={{ fontSize:18, fontWeight:700, margin:0, color:S.t1 }}>Evaluate Submission</h1>
              <div style={{ fontSize:11, fontWeight:500, color:S.t2, display:'flex', alignItems:'center', gap:4 }}>Home <ChevronRight size={12}/> Evaluations <ChevronRight size={12}/> <span style={{color:S.t1}}>{submission?.project_title || 'Submission'}</span></div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, borderLeft:'1px solid '+S.border, paddingLeft:20, cursor:'pointer' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:'#059669', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14 }}>A</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:S.t1 }}>{adminName}</div>
                <div style={{ fontSize:11, fontWeight:500, color:S.t2 }}>Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex:1, overflowY:'auto', padding:S.pad, display:'flex', flexDirection:'column', gap:S.gap }}>
          
          {/* Top Actions */}
          <div style={{ display:'flex', justifyContent:'flex-end', gap:12 }}>
            <button 
              onClick={() => {
                const currentIndex = allSubmissionIds.indexOf(id);
                if (currentIndex > 0) navigate(`/udview/evaluations/${allSubmissionIds[currentIndex - 1]}`);
              }}
              disabled={allSubmissionIds.indexOf(id) <= 0}
              style={{ display:'flex', alignItems:'center', gap:6, background:S.card, border:'1px solid '+S.border, padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, color: allSubmissionIds.indexOf(id) <= 0 ? S.t3 : S.t1, cursor: allSubmissionIds.indexOf(id) <= 0 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16}/> Previous
            </button>
            <button 
              onClick={() => {
                const currentIndex = allSubmissionIds.indexOf(id);
                if (currentIndex >= 0 && currentIndex < allSubmissionIds.length - 1) navigate(`/udview/evaluations/${allSubmissionIds[currentIndex + 1]}`);
              }}
              disabled={allSubmissionIds.indexOf(id) === -1 || allSubmissionIds.indexOf(id) >= allSubmissionIds.length - 1}
              style={{ display:'flex', alignItems:'center', gap:6, background:S.card, border:'1px solid '+S.border, padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, color: (allSubmissionIds.indexOf(id) === -1 || allSubmissionIds.indexOf(id) >= allSubmissionIds.length - 1) ? S.t3 : S.t1, cursor: (allSubmissionIds.indexOf(id) === -1 || allSubmissionIds.indexOf(id) >= allSubmissionIds.length - 1) ? 'not-allowed' : 'pointer' }}
            >
              Next <ChevronRight size={16}/>
            </button>
            <button 
              onClick={handleSave} 
              disabled={!isComplete} 
              style={{ display:'flex', alignItems:'center', gap:6, background: isComplete ? S.primary : '#E5E7EB', border:'none', padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, color: isComplete ? '#fff' : S.t3, cursor: isComplete ? 'pointer' : 'not-allowed' }}
            >
              <Check size={16}/> Mark as Completed
            </button>
          </div>

          {/* Hero Card */}
          <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:'24px', display:'flex', gap:40 }}>
            
            {/* Left Col */}
            <div style={{ flex:1, display:'flex', gap:20 }}>
              <div style={{ width:80, height:80, borderRadius:16, background:'#DCFCE7', color:S.green, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Leaf size={40}/>
              </div>
              <div>
                <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:S.t1, lineHeight:'1.2' }}>{submission?.project_title}</h2>
                <div style={{ fontSize:13, color:S.t2, marginTop:6 }}>Team {team?.team_name}</div>
                <div style={{ display:'flex', alignItems:'center', marginTop:12 }}>
                  {members.slice(0,3).map((m, idx) => (
                    <div key={idx} style={{ width:28, height:28, borderRadius:'50%', background:'#E2E8F0', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#475569', marginLeft: idx > 0 ? -8 : 0 }}>
                      {m.full_name?.charAt(0) || 'U'}
                    </div>
                  ))}
                  {members.length > 3 && (
                    <div style={{ width:28, height:28, borderRadius:'50%', background:'#F1F5F9', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#64748B', marginLeft:-8 }}>
                      +{members.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Col */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:16, borderLeft:'1px solid '+S.border, paddingLeft:40 }}>
              <div style={{ display:'grid', gridTemplateColumns:'100px 1fr', gap:8, fontSize:13 }}>
                <div style={{ color:S.t3, fontWeight:500 }}>Track</div>
                <div style={{ color:S.t1, fontWeight:600 }}>{submission?.category || 'Climate Action'}</div>
                <div style={{ color:S.t3, fontWeight:500 }}>Round</div>
                <div style={{ color:S.t1, fontWeight:600 }}>{submission?.round || 'Evaluation'}</div>
                <div style={{ color:S.t3, fontWeight:500 }}>Submitted On</div>
                <div style={{ color:S.t1, fontWeight:600 }}>{submission?.created_at ? new Date(submission.created_at).toLocaleString('en-US', {month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit'}) : 'May 26, 2025, 11:59 PM'}</div>
                <div style={{ color:S.t3, fontWeight:500 }}>Submission ID</div>
                <div style={{ color:S.t1, fontWeight:600 }}>{submission?.id || 'SUB-2025-00156'}</div>
              </div>
              {/* <button onClick={() => navigate('/udview/teams')} style={{ display:'flex', alignItems:'center', gap:6, color:S.primary, background:'none', border:'none', fontSize:13, fontWeight:600, cursor:'pointer', padding:0 }}>View Team Profile <ExternalLink size={14}/></button> */}
            </div>

            {/* Right Col */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:16, borderLeft:'1px solid '+S.border, paddingLeft:40 }}>
              <div style={{ display:'grid', gridTemplateColumns:'100px 1fr', gap:8, fontSize:13 }}>
                <div style={{ color:S.t3, fontWeight:500 }}>Status</div>
                <div><span style={{ background:'#FEF3C7', color:'#D97706', padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:600 }}>Under Review</span></div>
                <div style={{ color:S.t3, fontWeight:500 }}>Reviewer</div>
                <div style={{ display:'flex', alignItems:'center', gap:8, color:S.t1, fontWeight:600 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:S.primary, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>{adminName.charAt(0).toUpperCase()}</div> {adminName}
                </div>
                <div style={{ color:S.t3, fontWeight:500 }}>Started On</div>
                <div style={{ color:S.t1, fontWeight:600 }}>May 26, 2025, 01:30 PM</div>
                <div style={{ color:S.t3, fontWeight:500 }}>Last Saved</div>
                <div style={{ color:S.t1, fontWeight:600 }}>May 26, 2025, 01:45 PM</div>
              </div>
            </div>

          </div>

          <div style={{ display:'flex', gap:24 }}>
            
            {/* Left Content Column */}
            <div style={{ flex:2, display:'flex', flexDirection:'column', gap:24 }}>
              
              {/* Project Details */}
              <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:'24px' }}>
                <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:S.t1 }}>Project Details</h3>
                
                <div style={{ display:'flex', gap:32, marginTop:24 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:S.t1, marginBottom:12 }}>SDG's Addressed</div>
                    <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                      {submission?.sdg_goal ? submission.sdg_goal.split(',').map((sdg, idx) => {
                        const match = sdg.match(/SDG (\d+)\s*-\s*(.*)/i);
                        const num = match ? match[1] : '?';
                        const text = match ? match[2] : sdg.trim();
                        const colors = ['#F59E0B', '#D97706', '#16A34A', '#2563EB', '#9333EA', '#E11D48'];
                        const bg = colors[idx % colors.length];
                        return (
                          <div key={idx} style={{ width:100, height:100, background:bg, borderRadius:8, color:'#fff', padding:10, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                            <div style={{ fontSize:18, fontWeight:800 }}>{num}</div>
                            <div style={{ fontSize:9, fontWeight:700, lineHeight:1.1, textTransform:'uppercase' }}>{text}</div>
                          </div>
                        );
                      }) : (
                        <div style={{ fontSize:12, color:S.t3 }}>No SDGs specified</div>
                      )}
                    </div>

                    <div style={{ fontSize:13, fontWeight:600, color:S.t1, marginTop:32, marginBottom:12 }}>Description</div>
                    <div style={{ fontSize:13, color:S.t2, lineHeight:1.6 }}>
                      {submission?.project_description || 'No description provided.'}
                    </div>
                  </div>

                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:S.t1 }}>Project Document</div>
                      <button onClick={() => submission?.pdf_url && window.open(submission.pdf_url, '_blank', 'noopener,noreferrer')} disabled={!submission?.pdf_url} style={{ background:'transparent', border:'none', color:S.primary, fontSize:12, fontWeight:600, cursor: submission?.pdf_url ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', gap:4 }}>
                        View Submission <ExternalLink size={12}/>
                      </button>
                    </div>
                    <div style={{ background:'#1F2937', borderRadius:8, overflow:'hidden', height:600, display:'flex', flexDirection:'column' }}>
                      {submission?.pdf_url ? (
                        <iframe src={submission.pdf_url} width="100%" height="100%" style={{ border: 'none' }} title="Project Document" />
                      ) : (
                        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#9CA3AF', fontSize:14 }}>No PDF document available.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Criteria */}
              <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:'24px' }}>
                <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:S.t1 }}>Evaluation Criteria</h3>
                <p style={{ fontSize:12, color:S.t3, margin:'4px 0 0' }}>Rate each criterion on a scale of 1 to 10</p>
                
                <div style={{ marginTop:16 }}>
                  {renderScoreRow(1, 'Problem Understanding', 'How well the team understood the problem and its real-world impact.', 'problem')}
                  {renderScoreRow(2, 'Innovation & Originality', 'Creativity and uniqueness of the solution idea and approach.', 'innovation')}
                  {renderScoreRow(3, 'Technical Implementation', 'Quality of technical implementation and use of technologies.', 'technical')}
                  {renderScoreRow(4, 'Impact & Scalability', 'Potential impact of the solution and ability to scale.', 'impact')}
                  {renderScoreRow(5, 'Presentation & Demo', 'Clarity of presentation and effectiveness of the demo.', 'presentation')}
                </div>

                <h3 style={{ margin:'32px 0 0', fontSize:16, fontWeight:700, color:S.t1 }}>Overall Notes</h3>
                <p style={{ fontSize:12, color:S.t3, margin:'4px 0 16px' }}>Add your overall feedback and suggestions for the team.</p>
                
                <div style={{ border:'1px solid '+S.border, borderRadius:8, overflow:'hidden' }}>
                  <div style={{ borderBottom:'1px solid '+S.border, padding:'8px 12px', display:'flex', gap:16, background:'#FAFAFA', color:S.t2 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, fontWeight:600 }}>Paragraph <ChevronDown size={14}/></div>
                    <div style={{ width:1, height:20, background:S.border }}></div>
                    <div style={{ display:'flex', gap:12 }}>
                      <Bold size={16}/> <Italic size={16}/> <Underline size={16}/>
                    </div>
                    <div style={{ width:1, height:20, background:S.border }}></div>
                    <div style={{ display:'flex', gap:12 }}>
                      <List size={16}/> <Link2 size={16}/>
                    </div>
                  </div>
                  <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)}
                    style={{ width:'100%', height:120, border:'none', padding:16, fontSize:13, color:S.t1, outline:'none', resize:'vertical', lineHeight:1.5 }}
                  />
                </div>

                <div style={{ display:'flex', justifyContent:'flex-end', gap:12, marginTop:24 }}>
                  <button 
                    onClick={handleSave} 
                    disabled={!isComplete} 
                    style={{ background: isComplete ? S.primary : '#E5E7EB', border:'none', color: isComplete ? '#fff' : S.t3, padding:'10px 24px', borderRadius:8, fontSize:13, fontWeight:600, cursor: isComplete ? 'pointer' : 'not-allowed' }}
                  >
                    Save & Mark as Completed
                  </button>
                </div>
              </div>

            </div>

            {/* Right Sidebar Column */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:24 }}>
              
              {/* Score Summary */}
              <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:'24px' }}>
                <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:S.t1 }}>Score Summary</h3>
                
                <div style={{ display:'flex', justifyContent:'center', margin:'32px 0' }}>
                  <div style={{ position:'relative', width:140, height:140 }}>
                    <svg width="140" height="140" style={{ transform:'rotate(-90deg)' }}>
                      <circle cx="70" cy="70" r="60" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                      <circle cx="70" cy="70" r="60" fill="none" stroke={S.primary} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition:'stroke-dashoffset 0.5s ease-out' }} />
                    </svg>
                    <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                      <div style={{ fontSize:28, fontWeight:800, color:S.t1 }}>{avgScore}</div>
                      <div style={{ fontSize:10, fontWeight:600, color:S.t3 }}>Average Score</div>
                    </div>
                  </div>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:12, fontSize:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, color:S.t1 }}><div style={{width:6,height:6,borderRadius:'50%',background:S.primary}}></div> Problem Understanding</div>
                    <div style={{ fontWeight:700 }}>{scores.problem}/10</div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, color:S.t1 }}><div style={{width:6,height:6,borderRadius:'50%',background:S.primary}}></div> Innovation & Originality</div>
                    <div style={{ fontWeight:700 }}>{scores.innovation}/10</div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, color:S.t1 }}><div style={{width:6,height:6,borderRadius:'50%',background:S.primary}}></div> Technical Implementation</div>
                    <div style={{ fontWeight:700 }}>{scores.technical}/10</div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, color:S.t1 }}><div style={{width:6,height:6,borderRadius:'50%',background:S.primary}}></div> Impact & Scalability</div>
                    <div style={{ fontWeight:700 }}>{scores.impact}/10</div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, color:S.t1 }}><div style={{width:6,height:6,borderRadius:'50%',background:S.primary}}></div> Presentation & Demo</div>
                    <div style={{ fontWeight:700 }}>{scores.presentation}/10</div>
                  </div>
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', marginTop:24, paddingTop:16, borderTop:'1px solid '+S.border }}>
                  <div style={{ fontSize:14, fontWeight:700, color:S.t1 }}>Total Score</div>
                  <div style={{ fontSize:16, fontWeight:800, color:S.green }}>{totalScore}/50</div>
                </div>
              </div>

              {/* Team Details */}
              <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:'24px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:S.t1 }}>Team Details</h3>
                  <div style={{ fontSize:12, fontWeight:600, color:S.primary, background:S.activeBg, padding:'4px 8px', borderRadius:6 }}>{team?.team_name || 'Team'}</div>
                </div>
                
                {(leadMember?.college_name || leadMember?.location) && (
                  <div style={{ marginBottom:16, display:'flex', flexDirection:'column', gap:8, padding:'12px', background:'#F8FAFC', borderRadius:8, border:'1px solid '+S.border }}>
                    {leadMember?.college_name && (
                      <div style={{ fontSize:12, color:S.t1, fontWeight:600, display:'flex', alignItems:'center', gap:8 }}>
                        <Building2 size={14} color={S.primary} /> {leadMember.college_name}
                      </div>
                    )}
                    {leadMember?.location && (
                      <div style={{ fontSize:12, color:S.t2, display:'flex', alignItems:'center', gap:8 }}>
                        <MapPin size={14} color={S.t2} /> {leadMember.location}
                      </div>
                    )}
                    {team?.id && (
                      <div style={{ fontSize:12, color:S.t2, display:'flex', alignItems:'center', gap:8 }}>
                        <Hash size={14} color={S.t2} /> <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={team.id}>ID: {team.id}</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {members.map((m, idx) => (
                    <div key={idx} style={{ display:'flex', alignItems:'flex-start', gap:12, paddingBottom:idx !== members.length-1 ? 16 : 0, borderBottom:idx !== members.length-1 ? '1px solid '+S.border : 'none' }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:'#F8FAFC', border:'1px solid '+S.border, color:S.t1, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, flexShrink:0 }}>
                        {m.full_name?.charAt(0) || 'U'}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:S.t1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.full_name || `Member ${idx+1}`}</div>
                          <div style={{ fontSize:10, fontWeight:600, color: idx === 0 ? S.primary : S.t2, background: idx === 0 ? S.activeBg : '#F1F5F9', padding:'2px 6px', borderRadius:4, flexShrink:0, marginLeft:8 }}>
                            {m.role || (idx === 0 ? 'Leader' : 'Member')}
                          </div>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                          {m.id && <div style={{ fontSize:11, color:S.t2, display:'flex', alignItems:'center', gap:6 }}><Hash size={12} style={{flexShrink:0}}/> <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={m.id}>ID: {m.id}</span></div>}
                          {m.email && <div style={{ fontSize:11, color:S.t2, display:'flex', alignItems:'center', gap:6 }}><Mail size={12} style={{flexShrink:0}}/> <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={m.email}>{m.email}</span></div>}
                          {m.phone && <div style={{ fontSize:11, color:S.t2, display:'flex', alignItems:'center', gap:6 }}><Phone size={12} style={{flexShrink:0}}/> <span>{m.phone}</span></div>}
                          {m.gender && <div style={{ fontSize:11, color:S.t2, display:'flex', alignItems:'center', gap:6 }}><User size={12} style={{flexShrink:0}}/> <span>{m.gender}</span></div>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {members.length === 0 && (
                    <div style={{ fontSize:12, color:S.t3, textAlign:'center', padding:'20px 0' }}>No team members found.</div>
                  )}
                </div>
              </div>              {/* Quick Actions */}
              <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, padding:'24px' }}>
                <h3 style={{ margin:0, fontSize:14, fontWeight:700, color:S.t1 }}>Quick Actions</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:16 }}>
                  <button onClick={() => submission?.pdf_url && window.open(submission.pdf_url, '_blank', 'noopener,noreferrer')} disabled={!submission?.pdf_url} style={{ background:'#F8FAFC', border:'1px solid '+S.border, borderRadius:8, padding:12, fontSize:13, fontWeight:600, color: submission?.pdf_url ? S.primary : S.t3, display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor: submission?.pdf_url ? 'pointer' : 'not-allowed' }}>
                    View Submission <ExternalLink size={14}/>
                  </button>
                  {/* <button onClick={() => navigate('/udview/teams')} style={{ background:'#F8FAFC', border:'1px solid '+S.border, borderRadius:8, padding:12, fontSize:13, fontWeight:600, color:S.t2, display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer' }}>
                    View Team Profile <ExternalLink size={14}/>
                  </button> */}
                </div>
              </div>

            </div>
          </div>
        </div>
      
    </>
  );
}

