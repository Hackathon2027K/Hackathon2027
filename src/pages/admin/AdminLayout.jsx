import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const S = {
  bg: '#F8FAFC',
  t1: '#111827',
};

export default function AdminLayout() {
  return (
    <div style={{ display:'flex', height:'100vh', width:'100vw', overflow:'hidden', background:S.bg, position:'fixed', top:0, left:0, fontFamily:"'Inter','Segoe UI',sans-serif", color:S.t1 }}>
      <AdminSidebar />
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}

