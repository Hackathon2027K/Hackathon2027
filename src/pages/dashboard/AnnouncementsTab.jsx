import React from 'react';

export default function AnnouncementsTab({ announcements = [] }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24, maxWidth:800, margin:'0 auto', width:'100%' }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'32px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1px solid #f3f4f6' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
          <div style={{ fontSize:28 }}>📢</div>
          <h2 style={{ fontSize:24, fontWeight:900, color:'#111', margin:0 }}>Announcements</h2>
        </div>
        <p style={{ color:'#6b7280', margin:'0 0 32px 0' }}>Stay updated with the latest news and important notices about the hackathon.</p>
        
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {announcements.length === 0 ? (
            <div style={{ textAlign:'center', color:'#9ca3af', padding:'40px 0', fontSize:14 }}>
              No announcements available yet.
            </div>
          ) : announcements.map(a => (
            <div key={a.id} style={{ padding:'20px', borderRadius:12, border:'1.5px solid #f3f4f6', background:'#f9fafb' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div>
                  <h3 style={{ fontSize:16, fontWeight:800, color:'#111', margin:'0 0 6px 0' }}>{a.title}</h3>
                  <div style={{ fontSize:12, color:'#9ca3af', fontWeight:500 }}>{new Date(a.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})} • Admin</div>
                </div>
                {a.tag && (
                  <span style={{ fontSize:11, fontWeight:800, color: '#3b82f6', background: '#eff6ff', padding:'4px 10px', borderRadius:20 }}>
                    {a.tag}
                  </span>
                )}
              </div>
              <p style={{ fontSize:14, color:'#4b5563', lineHeight:1.6, margin:0, whiteSpace:'pre-wrap' }}>{a.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
