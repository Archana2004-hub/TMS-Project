import React, { useEffect, useState } from 'react';
import { getDashboard, getComplaints } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const STATUS_META = {
  Pending:       { color:'#f59e0b', bg:'#fef3c7', icon:'⏳', grad:'#f59e0b,#f97316' },
  Assigned:      { color:'#a855f7', bg:'#f3e8ff', icon:'👤', grad:'#a855f7,#7c3aed' },
  'In-Progress': { color:'#3b82f6', bg:'#dbeafe', icon:'⚙️', grad:'#3b82f6,#6366f1' },
  'On Hold':     { color:'#ec4899', bg:'#fce7f3', icon:'⏸️', grad:'#ec4899,#f43f5e' },
  Completed:     { color:'#10b981', bg:'#d1fae5', icon:'✅', grad:'#10b981,#059669' },
};

function StatCard({ label, value, color, bg, icon, grad, delay }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) return;
    const step = Math.ceil(end / 20);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 40);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '22px 20px',
      flex: 1, minWidth: 140,
      border: `1px solid ${color}22`,
      boxShadow: `0 4px 20px ${color}18`,
      position: 'relative', overflow: 'hidden',
      animation: `fadeUp 0.5s ${delay}s cubic-bezier(0.22,1,0.36,1) both`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${color}28`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${color}18`; }}
    >
      {/* BG glow */}
      <div style={{
        position:'absolute', top:-30, right:-30, width:100, height:100,
        borderRadius:'50%', background:`radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        pointerEvents:'none',
      }}/>
      <div style={{ fontSize:28, marginBottom:10 }}>{icon}</div>
      <div style={{
        fontSize: 38, fontWeight: 800, color,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1, marginBottom: 6,
        animation: 'countUp 0.5s cubic-bezier(0.22,1,0.36,1) both',
      }}>{display}</div>
      <div style={{ fontSize:12, color:'#9ca3af', fontWeight:500 }}>{label}</div>
      {/* Bottom accent */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:3,
        background:`linear-gradient(90deg,${grad})`,
        borderRadius:'0 0 16px 16px',
      }}/>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]   = useState({});
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getComplaints({ limit: 5 })]).then(([s, c]) => {
      setStats(s.data.data);
      setRecent(c.data.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, gap:12 }}>
      <div style={{ width:32, height:32, border:'3px solid #e9d5ff', borderTopColor:'#a855f7', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
      <span style={{ color:'#9ca3af', fontSize:14 }}>Loading dashboard...</span>
    </div>
  );

  const statList = [
    { label:'Total', value:stats.total||0, ...{ color:'#6d28d9', bg:'#f3e8ff', icon:'🎫', grad:'#6d28d9,#a855f7' }},
    { label:'Pending',     value:stats.pending||0,    ...STATUS_META['Pending'] },
    { label:'Assigned',    value:stats.assigned||0,   ...STATUS_META['Assigned'] },
    { label:'In Progress', value:stats.inProgress||0, ...STATUS_META['In-Progress'] },
    { label:'On Hold',     value:stats.onHold||0,     ...STATUS_META['On Hold'] },
    { label:'Completed',   value:stats.completed||0,  ...STATUS_META['Completed'] },
  ];

  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes countUp{from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ marginBottom:28, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontSize:26, fontWeight:800, color:'#1e1035', marginBottom:4 }}>
            Dashboard <span style={{ fontSize:22 }}>📊</span>
          </h2>
          <p style={{ color:'#9ca3af', fontSize:14 }}>
            Welcome back, <strong style={{ color:'#a855f7' }}>{user?.userName}</strong> — {user?.role?.name}
          </p>
        </div>
        <div style={{
          background:'linear-gradient(135deg,#6d28d9,#ec4899)',
          color:'#fff', padding:'8px 18px', borderRadius:30,
          fontSize:12, fontWeight:600, letterSpacing:0.5,
        }}>
          {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:28 }}>
        {statList.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>

      {/* Recent Complaints */}
      <div style={{
        background:'#fff', borderRadius:16,
        boxShadow:'0 4px 24px rgba(109,40,217,0.08)',
        border:'1px solid rgba(168,85,247,0.12)',
        overflow:'hidden',
        animation:'fadeUp 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <div style={{
          padding:'16px 22px',
          background:'linear-gradient(135deg,rgba(109,40,217,0.04),rgba(236,72,153,0.03))',
          borderBottom:'1px solid rgba(168,85,247,0.1)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <h3 style={{ margin:0, color:'#1e1035', fontSize:15, fontWeight:700 }}>
            🕐 Recent Complaints
          </h3>
          <span style={{ fontSize:12, color:'#c4b5d4' }}>Last {recent.length} entries</span>
        </div>
        <table>
          <thead>
            <tr>
              {['Type','Block','Room','Raised By','Status'].map(h => (
                <th key={h} style={{ padding:'12px 18px', textAlign:'left', fontSize:12, fontWeight:600, color:'#fff', background:'linear-gradient(135deg,#6d28d9,#a855f7)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((c, i) => {
              const sm = STATUS_META[c.status] || { color:'#6b7280', bg:'#f3f4f6' };
              return (
                <tr key={c._id} style={{ borderBottom:'1px solid rgba(168,85,247,0.06)', animation:`fadeUp 0.4s ${0.1+i*0.05}s both` }}>
                  <td style={{ padding:'12px 18px', fontSize:13, fontWeight:500 }}>{c.complaintType}</td>
                  <td style={{ padding:'12px 18px', fontSize:13, color:'#6b7280' }}>{c.block?.name}</td>
                  <td style={{ padding:'12px 18px', fontSize:13, color:'#6b7280' }}>{c.room?.roomNumber}</td>
                  <td style={{ padding:'12px 18px', fontSize:13 }}>{c.raisedBy?.userName}</td>
                  <td style={{ padding:'12px 18px' }}>
                    <span style={{
                      background:sm.bg, color:sm.color,
                      padding:'4px 12px', borderRadius:20,
                      fontSize:11, fontWeight:700,
                      display:'inline-flex', alignItems:'center', gap:4,
                    }}>
                      {sm.icon} {c.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {recent.length === 0 && (
              <tr><td colSpan={5} style={{ padding:40, textAlign:'center', color:'#c4b5d4', fontSize:14 }}>
                No complaints yet 🎉
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
