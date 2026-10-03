import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Users, Flag, CheckSquare, Bell, LayoutDashboard, LogOut, FileText, TrendingUp } from 'lucide-react';

const S = {
  card: '#FFFFFF', border: '#E5E7EB', primary: '#6C4EFF',
  t1: '#111827', t2: '#6B7280', t3: '#9CA3AF', activeBg: '#EEE8FF',
};

const sidebarItems = [
  { icon: Home, label: 'Dashboard', path: '/udview' },
  { icon: Users, label: 'Users', path: '/udview/users' },
  { icon: Flag, label: 'Teams', path: '/udview/teams' },
  { icon: FileText, label: 'Submissions', path: '/udview/submissions' },
  { icon: CheckSquare, label: 'Evaluations', path: '/udview/evaluations' },
  { icon: TrendingUp, label: 'Analytics', path: '/udview/analytics' },
  { icon: Bell, label: 'Announcements', path: '/udview/announcements' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside style={{ width:240, minWidth:240, background:S.card, borderRight:'1px solid '+S.border, display:'flex', flexDirection:'column', flexShrink: 0 }}>
      <div style={{ height:64, padding:'0 20px', borderBottom:'1px solid '+S.border, display:'flex', alignItems:'center', gap:12 }}>
        
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:S.t1 }}>SRCAS HACKATHON 3.0</div>
          <div style={{ fontSize:10, fontWeight:600, color:S.t3, letterSpacing:'0.05em' }}>Admin Panel</div>
        </div>
      </div>
      <nav style={{ flex:1, overflowY:'auto', padding:'16px 12px', display:'flex', flexDirection:'column', gap:2 }}>
        {sidebarItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = item.path === '/udview' 
            ? location.pathname === '/udview' 
            : location.pathname.startsWith(item.path);
            
          return (
            <Link key={i} to={item.path}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, fontSize:13, fontWeight:600, color: isActive ? S.primary : S.t2, background: isActive ? S.activeBg : 'transparent', textDecoration:'none', transition:'background .15s' }}
              onMouseEnter={e => { if(!isActive) e.currentTarget.style.background='#F1F5F9' }}
              onMouseLeave={e => { if(!isActive) e.currentTarget.style.background='transparent' }}>
              <Icon size={18}/> {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding:'16px 12px', borderTop:'1px solid '+S.border, display:'flex', flexDirection:'column', gap:8 }}>
        <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, fontSize:13, fontWeight:600, color:S.t2, background:'transparent', border:'none', cursor:'pointer' }}>
          <LayoutDashboard size={18}/> Back to Site
        </button>
        <button onClick={() => navigate('/dashboard')} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px 14px', borderRadius:10, fontSize:13, fontWeight:700, color:'#DC2626', background:'#FEF2F2', border:'1px solid #FECACA', cursor:'pointer' }}>
          <LogOut size={16}/> Logout
        </button>
      </div>
    </aside>
  );
}

