import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getComplaints } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SM = {
  Pending:       { bg:'#fef3c7', color:'#d97706', border:'#fcd34d', icon:'⏳', prog:20 },
  Assigned:      { bg:'#f3e8ff', color:'#7c3aed', border:'#c4b5fd', icon:'👤', prog:40 },
  'In-Progress': { bg:'#dbeafe', color:'#2563eb', border:'#93c5fd', icon:'⚙️', prog:65 },
  'On Hold':     { bg:'#fce7f3', color:'#db2777', border:'#f9a8d4', icon:'⏸️', prog:50 },
  Completed:     { bg:'#d1fae5', color:'#059669', border:'#6ee7b7', icon:'✅', prog:100 },
};

const TYPE_ICON = {
  'PC Hardware':'🖥️','PC Software':'💻','Application Issues':'📱',
  'Network':'🌐','Electronics':'⚡','Plumbing':'🔧','Other':'📋',
};

export default function MyTickets() {
  const { user }                        = useAuth();
  const [tickets, setTickets]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('All');
  const [search, setSearch]             = useState('');
  const [error, setError]               = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const r = await getComplaints();
      setTickets(r.data.data || []);
    } catch { setError('Failed to load tickets.'); }
    finally   { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const statuses = ['All','Pending','Assigned','In-Progress','On Hold','Completed'];
  const counts   = statuses.reduce((a,s) => ({ ...a, [s]: s==='All' ? tickets.length : tickets.filter(t=>t.status===s).length }), {});
  const filtered = tickets.filter(t => {
    const ms = filter==='All' || t.status===filter;
    const mq = !search || [t.complaintType,t.remarks,t.block?.name].some(v=>v?.toLowerCase().includes(search.toLowerCase()));
    return ms && mq;
  });

  return (
    <div style={{ maxWidth:900, margin:'0 auto', animation:'fadeUp 0.4s ease both' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        .filter-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(168,85,247,0.2)!important}
        .ticket-card:hover{transform:translateY(-3px)!important;box-shadow:0 20px 50px rgba(109,40,217,0.15)!important}
        .view-btn:hover{background:linear-gradient(135deg,#6d28d9,#a855f7)!important;color:#fff!important;border-color:transparent!important}
        .raise-btn:hover{background:linear-gradient(135deg,#7c3aed,#ec4899)!important;box-shadow:0 8px 24px rgba(168,85,247,0.4)!important}
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:24, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ margin:0, fontSize:26, fontWeight:800, color:'#1e1035' }}>My Tickets 🎫</h2>
          <p style={{ margin:'4px 0 0', color:'#9ca3af', fontSize:14 }}>
            Welcome, <strong style={{ color:'#a855f7' }}>{user?.userName}</strong> — track your complaints
          </p>
        </div>
        <Link to="/complaints/new" className="raise-btn" style={{
          padding:'10px 22px',
          background:'linear-gradient(135deg,#a855f7,#ec4899)',
          color:'#fff', borderRadius:12, textDecoration:'none',
          fontWeight:700, fontSize:13, display:'flex', alignItems:'center', gap:6,
          boxShadow:'0 4px 16px rgba(168,85,247,0.3)', transition:'all 0.2s',
        }}>
          ✦ Raise New Ticket
        </Link>
      </div>

      {/* Filter Buttons */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {statuses.map(s => {
          const sc    = SM[s] || { bg:'#f5f0ff', color:'#6d28d9', border:'#d8b4fe' };
          const active = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)} className="filter-btn" style={{
              padding:'8px 16px', borderRadius:30,
              border:`1.5px solid ${active ? sc.color : '#e9d5ff'}`,
              background: active ? sc.bg : '#fff',
              color: active ? sc.color : '#9ca3af',
              cursor:'pointer', fontWeight: active ? 700 : 500, fontSize:12,
              display:'flex', alignItems:'center', gap:6,
              transition:'all 0.18s',
              boxShadow: active ? `0 4px 14px ${sc.color}30` : 'none',
            }}>
              {s !== 'All' && SM[s]?.icon} {s}
              <span style={{
                background: active ? sc.color : '#e9d5ff',
                color: active ? '#fff' : '#9ca3af',
                borderRadius:20, padding:'1px 7px', fontSize:10, fontWeight:700,
              }}>{counts[s]||0}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:20 }}>
        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:14, pointerEvents:'none', opacity:0.5 }}>🔍</span>
        <input
          type="text" placeholder="Search by type, block or description..."
          value={search} onChange={e=>setSearch(e.target.value)}
          style={{
            width:'100%', padding:'11px 14px 11px 38px',
            border:'1.5px solid #e9d5ff', borderRadius:12,
            fontSize:13, background:'#fff',
            boxShadow:'0 2px 8px rgba(168,85,247,0.06)',
            boxSizing:'border-box',
          }}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:'center', padding:60, display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, border:'3px solid #e9d5ff', borderTopColor:'#a855f7', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
          <p style={{ color:'#c4b5d4', fontSize:14 }}>Loading your tickets...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ textAlign:'center', padding:40, background:'#fff0f6', borderRadius:14, border:'1px solid #fbb6ce' }}>
          <p style={{ color:'#ec4899', marginBottom:12, fontWeight:600 }}>⚠️ {error}</p>
          <button onClick={load} style={{ background:'linear-gradient(135deg,#a855f7,#ec4899)', color:'#fff', border:'none', borderRadius:8, padding:'9px 22px', cursor:'pointer', fontWeight:600 }}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:60, background:'#fff', borderRadius:16, boxShadow:'0 4px 24px rgba(109,40,217,0.08)', border:'1px solid rgba(168,85,247,0.1)' }}>
          <div style={{ fontSize:52, marginBottom:16, animation:'float 3s ease-in-out infinite' }}>📭</div>
          <h3 style={{ color:'#1e1035', margin:'0 0 8px', fontSize:18 }}>{tickets.length===0 ? 'No tickets yet!' : 'No matches found'}</h3>
          <p style={{ color:'#c4b5d4', fontSize:13, marginBottom:20 }}>{tickets.length===0 ? "Raise your first ticket and we'll get it sorted!" : "Try a different filter or search term"}</p>
          {tickets.length===0 && (
            <Link to="/complaints/new" style={{
              background:'linear-gradient(135deg,#a855f7,#ec4899)',
              color:'#fff', padding:'11px 26px', borderRadius:10,
              textDecoration:'none', fontWeight:700, fontSize:13,
              boxShadow:'0 4px 16px rgba(168,85,247,0.3)',
            }}>✦ Raise First Ticket</Link>
          )}
        </div>
      )}

      {/* Ticket Cards */}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map((ticket, i) => {
            const sc   = SM[ticket.status] || { bg:'#f5f0ff', color:'#6d28d9', border:'#d8b4fe', icon:'📋', prog:0 };
            const icon = TYPE_ICON[ticket.complaintType] || '📋';
            return (
              <div key={ticket._id} className="ticket-card" style={{
                background:'#fff', borderRadius:14, padding:'18px 20px',
                boxShadow:'0 4px 18px rgba(109,40,217,0.08)',
                border:`1px solid ${sc.color}22`,
                borderLeft:`4px solid ${sc.color}`,
                transition:'all 0.2s', cursor:'default',
                animation:`fadeUp 0.4s ${i*0.07}s both`,
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                  {/* Icon + Info */}
                  <div style={{ display:'flex', gap:14, flex:1 }}>
                    <div style={{
                      width:46, height:46, borderRadius:12,
                      background:`linear-gradient(135deg,${sc.bg},${sc.color}22)`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:22, flexShrink:0,
                      boxShadow:`0 4px 12px ${sc.color}20`,
                    }}>{icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
                        <span style={{ fontWeight:700, color:'#1e1035', fontSize:15 }}>{ticket.complaintType}</span>
                        <span style={{
                          background:sc.bg, color:sc.color,
                          border:`1px solid ${sc.border}`,
                          padding:'3px 11px', borderRadius:20,
                          fontSize:11, fontWeight:700,
                          display:'inline-flex', alignItems:'center', gap:4,
                        }}>{sc.icon} {ticket.status}</span>
                      </div>
                      <p style={{ margin:'0 0 8px', color:'#9ca3af', fontSize:13, lineHeight:1.5 }}>
                        {ticket.remarks?.length>100 ? ticket.remarks.slice(0,100)+'...' : ticket.remarks}
                      </p>
                      <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                        <span style={{ fontSize:11, color:'#c4b5d4' }}>📍 {ticket.block?.name||'—'} — Room {ticket.room?.roomNumber||'—'}</span>
                        <span style={{ fontSize:11, color:'#c4b5d4' }}>📅 {new Date(ticket.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                        {ticket.assignedTo && <span style={{ fontSize:11, color:'#a855f7', fontWeight:600 }}>👤 {ticket.assignedTo.userName}</span>}
                      </div>
                    </div>
                  </div>

                  {/* ID + View */}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
                    <span style={{ fontSize:10, color:'#d8b4fe', fontFamily:'monospace', fontWeight:700 }}>
                      #{ticket._id.slice(-6).toUpperCase()}
                    </span>
                    <Link to={`/complaints/${ticket._id}`} className="view-btn" style={{
                      background:'#f5f0ff', color:'#6d28d9',
                      padding:'6px 14px', borderRadius:8,
                      textDecoration:'none', fontSize:12, fontWeight:600,
                      border:'1.5px solid #e9d5ff', transition:'all 0.2s',
                    }}>View →</Link>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop:14, height:5, background:'#f5f0ff', borderRadius:10, overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:10,
                    width:`${sc.prog}%`,
                    background:`linear-gradient(90deg,${sc.color},${sc.border})`,
                    transition:'width 0.8s cubic-bezier(0.22,1,0.36,1)',
                  }}/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p style={{ textAlign:'right', fontSize:11, color:'#d8b4fe', marginTop:12 }}>
          Showing {filtered.length} of {tickets.length} tickets
        </p>
      )}
    </div>
  );
}
