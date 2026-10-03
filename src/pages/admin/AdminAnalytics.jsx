import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { RefreshCw, Users, Flag, FileText, TrendingUp, ChevronRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const S = {
  bg: '#F8FAFC', card: '#FFFFFF', border: '#E5E7EB', primary: '#6C4EFF',
  t1: '#111827', t2: '#6B7280', t3: '#9CA3AF', green: '#16A34A',
  activeBg: '#EEE8FF', radius: '14px', pad: '24px', gap: '20px',
};

const COLORS = ['#6C4EFF','#06B6D4','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6','#F97316','#84CC16'];

const SDG_LABELS = {
  '1':'No Poverty','2':'Zero Hunger','3':'Good Health','4':'Quality Education','5':'Gender Equality',
  '6':'Clean Water','7':'Clean Energy','8':'Decent Work','9':'Industry & Innovation','10':'Reduced Inequalities',
  '11':'Sustainable Cities','12':'Responsible Consumption','13':'Climate Action','14':'Life Below Water',
  '15':'Life on Land','16':'Peace & Justice','17':'Partnerships',
};

function KPICard({ icon: Icon, label, value, sub, color = S.primary, bg = S.activeBg }) {
  return (
    <div style={{ background: S.card, border: '1px solid ' + S.border, borderRadius: S.radius, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 180, boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: S.t2, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: S.t1 }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: S.t3, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: S.t1 }}>{title}</h2>
      {sub && <p style={{ margin: '4px 0 0', fontSize: 12, color: S.t2 }}>{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children, flex = 1 }) {
  return (
    <div style={{ background: S.card, border: '1px solid ' + S.border, borderRadius: S.radius, padding: '20px 24px', flex, boxShadow: '0 1px 4px rgba(0,0,0,.04)', minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: S.t1, marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1F2937', color: '#fff', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600 }}>
        {label && <div style={{ color: '#9CA3AF', marginBottom: 2 }}>{label}</div>}
        {payload.map((p, i) => <div key={i}>{p.name}: <strong>{p.value}</strong></div>)}
      </div>
    );
  }
  return null;
};

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // KPIs
  const [counts, setCounts] = useState({ members: 0, teams: 0, subs: 0 });

  // Chart data
  const [collegeData, setCollegeData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [teamTimeline, setTeamTimeline] = useState([]);
  const [avgTeamSize, setAvgTeamSize] = useState(0);
  const [sdgData, setSdgData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [subTimeline, setSubTimeline] = useState([]);

  const processData = useCallback((members, teams, subs) => {
    // KPI
    setCounts({ members: members.length, teams: teams.length, subs: subs.length });
    setAvgTeamSize(teams.length ? (members.length / teams.length).toFixed(2) : 0);

    // College top 10
    const colleges = {};
    members.forEach(m => { if (m.college_name) { const k = m.college_name.trim(); colleges[k] = (colleges[k] || 0) + 1; } });
    setCollegeData(Object.entries(colleges).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name: name.length > 25 ? name.slice(0, 25) + '…' : name, count })));

    // Year
    const years = { '1st Year': 0, '2nd Year': 0, '3rd Year': 0, '4th Year': 0, 'Other': 0 };
    members.forEach(m => {
      const y = String(m.year || '').trim();
      if (y === '1' || y.includes('1st')) years['1st Year']++;
      else if (y === '2' || y.includes('2nd')) years['2nd Year']++;
      else if (y === '3' || y.includes('3rd')) years['3rd Year']++;
      else if (y === '4' || y.includes('4th')) years['4th Year']++;
      else years['Other']++;
    });
    setYearData(Object.entries(years).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value })));

    // Department top 10
    const depts = {};
    members.forEach(m => { if (m.dept) { const k = m.dept.trim(); depts[k] = (depts[k] || 0) + 1; } });
    setDeptData(Object.entries(depts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name: name.length > 30 ? name.slice(0, 30) + '…' : name, count })));

    // City top 10
    const cities = {};
    members.forEach(m => { const k = (m.city || m.district || m.location || '').trim(); if (k) cities[k] = (cities[k] || 0) + 1; });
    setCityData(Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count })));

    // Team registration timeline
    const dayMap = {};
    teams.forEach(t => {
      if (!t.created_at) return;
      const d = t.created_at.slice(0, 10);
      dayMap[d] = (dayMap[d] || 0) + 1;
    });
    const sortedDays = Object.keys(dayMap).sort();
    let cumulative = 0;
    setTeamTimeline(sortedDays.map(d => { cumulative += dayMap[d]; return { date: d.slice(5), daily: dayMap[d], total: cumulative }; }));

    // SDG breakdown
    const sdgMap = {};
    subs.forEach(s => {
      if (!s.sdg_goal) return;
      s.sdg_goal.split(',').forEach(raw => {
        const match = raw.match(/SDG\s*(\d+)/i);
        if (match) { const k = match[1]; sdgMap[k] = (sdgMap[k] || 0) + 1; }
      });
    });
    setSdgData(Object.entries(sdgMap).sort((a, b) => Number(a[0]) - Number(b[0])).map(([num, count]) => ({ name: `SDG ${num}`, label: SDG_LABELS[num] || `SDG ${num}`, count })));

    // Submission status
    const statMap = {};
    subs.forEach(s => { const k = s.status || 'Submitted'; statMap[k] = (statMap[k] || 0) + 1; });
    setStatusData(Object.entries(statMap).map(([name, value]) => ({ name, value })));

    // Submission timeline
    const subDay = {};
    subs.forEach(s => {
      if (!s.created_at) return;
      const d = s.created_at.slice(0, 10);
      subDay[d] = (subDay[d] || 0) + 1;
    });
    const sortedSubs = Object.keys(subDay).sort();
    let subCum = 0;
    setSubTimeline(sortedSubs.map(d => { subCum += subDay[d]; return { date: d.slice(5), daily: subDay[d], total: subCum }; }));
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const pageSize = 1000;

    const fetchAll_ = async (table, select) => {
      let all = [], page = 0;
      while (true) {
        const { data, error } = await supabase.from(table).select(select).range(page * pageSize, (page + 1) * pageSize - 1);
        if (error) console.error(`Error fetching ${table}:`, error);
        if (!data || data.length === 0) break;
        all.push(...data);
        if (data.length < pageSize) break;
        page++;
      }
      return all;
    };

    const [members, teams, subs] = await Promise.all([
      fetchAll_('team_members', '*'),
      fetchAll_('teams', '*'),
      fetchAll_('submissions', '*'),
    ]);

    processData(members, teams, subs);
    setLastUpdated(new Date());
    setLoading(false);
  }, [processData]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { navigate('/register'); return; }
      const { data: adminList } = await supabase.from('admins').select('email');
      if (adminList && adminList.length > 0) { setIsAdmin(true); fetchAll(); }
      else { alert('Not admin!'); navigate('/dashboard'); }
    };
    checkAuth();
  }, [navigate, fetchAll]);

  const subRate = counts.teams ? ((counts.subs / counts.teams) * 100).toFixed(1) : 0;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: S.bg, gap: 16 }}>
      <div style={{ width: 44, height: 44, border: '3px solid ' + S.primary, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div style={{ fontSize: 13, color: S.t2, fontWeight: 600 }}>Crunching live data…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!isAdmin) return null;

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} * { box-sizing: border-box; }`}</style>

      {/* Header */}
      <header style={{ height: 64, background: S.card, borderBottom: '1px solid ' + S.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: S.t1 }}>Analytics Dashboard</h1>
          <div style={{ fontSize: 11, fontWeight: 500, color: S.t2, display: 'flex', alignItems: 'center', gap: 4 }}>Home <ChevronRight size={12} /> <span style={{ color: S.t1 }}>Analytics</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 11, color: S.t3 }}>Last updated: {lastUpdated.toLocaleTimeString()}</div>
          <button onClick={fetchAll} style={{ display: 'flex', alignItems: 'center', gap: 6, background: S.activeBg, color: S.primary, border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: S.pad, display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* KPI Cards */}
        <div style={{ display: 'flex', gap: S.gap, flexWrap: 'wrap' }}>
          <KPICard icon={Users} label="Total Registrations" value={counts.members.toLocaleString()} sub="Team Members" color="#6C4EFF" bg="#EEE8FF" />
          <KPICard icon={Flag} label="Total Teams" value={counts.teams.toLocaleString()} sub="Registered Teams" color="#0891B2" bg="#CFFAFE" />
          <KPICard icon={FileText} label="Total Submissions" value={counts.subs.toLocaleString()} sub="Projects Submitted" color="#059669" bg="#D1FAE5" />
          <KPICard icon={TrendingUp} label="Submission Rate" value={subRate + '%'} sub="Submissions / Teams" color="#D97706" bg="#FEF3C7" />
          <KPICard icon={Users} label="Avg Team Size" value={avgTeamSize} sub={`${counts.members} members / ${counts.teams} teams`} color="#7C3AED" bg="#EDE9FE" />
        </div>

        {/* Section A */}
        <div>
          <SectionTitle title="A. Participant Demographics" sub="Insights from the team_members table" />
          <div style={{ display: 'flex', gap: S.gap, flexWrap: 'wrap' }}>

            {/* College Bar Chart */}
            <ChartCard title="Top 10 Colleges by Participation" flex={2}>
              {collegeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={collegeData} layout="vertical" margin={{ left: 8, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: S.t3 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: S.t2 }} width={160} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Members" fill={S.primary} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.t3 }}>No data</div>}
            </ChartCard>

            {/* Year Pie */}
            <ChartCard title="Year of Study Breakdown" flex={1}>
              {yearData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={yearData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} dataKey="value" nameKey="name" paddingAngle={3}>
                      {yearData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: S.t2 }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.t3 }}>No data</div>}
            </ChartCard>
          </div>

          {/* Dept + City */}
          <div style={{ display: 'flex', gap: S.gap, flexWrap: 'wrap', marginTop: S.gap }}>
            <ChartCard title="Top Departments / Majors" flex={1}>
              {deptData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={deptData} layout="vertical" margin={{ left: 8, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: S.t3 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: S.t2 }} width={130} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Members" fill="#06B6D4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.t3 }}>No data</div>}
            </ChartCard>

            <ChartCard title="Top Cities / Districts" flex={1}>
              {cityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={cityData} margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: S.t2 }} />
                    <YAxis tick={{ fontSize: 11, fill: S.t3 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Members" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.t3 }}>No city data found. Check if `city` or `district` column exists in team_members.</div>}
            </ChartCard>
          </div>
        </div>

        {/* Section B */}
        <div>
          <SectionTitle title="B. Team Insights" sub="Registration trends and team size analytics" />
          <div style={{ display: 'flex', gap: S.gap, flexWrap: 'wrap' }}>
            <ChartCard title="Teams Registered Over Time (Cumulative)" flex={2}>
              {teamTimeline.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={teamTimeline} margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: S.t2 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 11, fill: S.t3 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="total" name="Total Teams" stroke={S.primary} strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="daily" name="Daily" stroke="#06B6D4" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: S.t2 }}>{v}</span>} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.t3 }}>No timeline data</div>}
            </ChartCard>

            <ChartCard title="Team Size Statistics" flex={1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 12 }}>
                {[
                  { label: 'Average Team Size', value: avgTeamSize, color: S.primary, bg: S.activeBg },
                  { label: 'Total Members', value: counts.members.toLocaleString(), color: '#059669', bg: '#D1FAE5' },
                  { label: 'Total Teams', value: counts.teams.toLocaleString(), color: '#0891B2', bg: '#CFFAFE' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 10, background: item.bg }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Section C */}
        <div>
          <SectionTitle title="C. Submission Insights" sub="SDG targeting, status and daily trends" />

          {/* SDG Chart */}
          <ChartCard title="Submissions by UN SDG Goal">
            {sdgData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={sdgData} margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: S.t2 }} />
                  <YAxis tick={{ fontSize: 11, fill: S.t3 }} />
                  <Tooltip content={({ active, payload }) => active && payload?.length ? (
                    <div style={{ background: '#1F2937', color: '#fff', borderRadius: 8, padding: '8px 14px', fontSize: 12 }}>
                      <div style={{ color: '#9CA3AF', marginBottom: 2 }}>{payload[0]?.payload?.label}</div>
                      <div>Submissions: <strong>{payload[0]?.value}</strong></div>
                    </div>
                  ) : null} />
                  <Bar dataKey="count" name="Submissions" radius={[4, 4, 0, 0]}>
                    {sdgData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.t3 }}>No SDG data. Ensure submissions have `sdg_goal` field (e.g., "SDG 13 - Climate Action").</div>}
          </ChartCard>

          <div style={{ display: 'flex', gap: S.gap, flexWrap: 'wrap', marginTop: S.gap }}>

            {/* Status Pie */}
            <ChartCard title="Submission Status Breakdown" flex={1}>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="45%" innerRadius={55} outerRadius={85} dataKey="value" nameKey="name" paddingAngle={3}>
                      {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: S.t2 }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.t3 }}>No data</div>}
            </ChartCard>

            {/* Daily submissions line */}
            <ChartCard title="Daily Submission Rate" flex={2}>
              {subTimeline.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={subTimeline} margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: S.t2 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 11, fill: S.t3 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="total" name="Cumulative" stroke="#10B981" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="daily" name="Daily" stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: S.t2 }}>{v}</span>} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.t3 }}>No submission timeline data</div>}
            </ChartCard>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: 11, color: S.t3, paddingBottom: 8 }}>
          All data is real-time and fetched directly from Supabase. Last refreshed: {lastUpdated.toLocaleString()}.
        </div>
      </div>
    </>
  );
}
