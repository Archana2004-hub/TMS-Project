import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getComplaints, assignComplaint, getUsers, getRoles } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLOR = { Pending:'#F59E0B', Assigned:'#0D9488', 'In-Progress':'#3B82F6', 'On Hold':'#8B5CF6', Completed:'#10B981' };

export default function ComplaintList() {
  const { isSuperAdmin } = useAuth();
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filters, setFilters]     = useState({ status:'', complaintType:'' });
  const [staffList, setStaffList] = useState([]);
  const [assigning, setAssigning] = useState(null);
  const [assignTo, setAssignTo]   = useState('');

  const load = async () => {
    setLoading(true);
    try { const r = await getComplaints(filters); setItems(r.data.data); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filters]);

  useEffect(() => {
    if (isSuperAdmin()) {
      Promise.all([getUsers(), getRoles()]).then(([u, r]) => {
        const staffRoles = r.data.data.filter(role =>
          ['Networking Staff','Plumber','Electrician','Software Developer'].includes(role.name)
        ).map(r=>r._id);
        setStaffList(u.data.data.filter(u => staffRoles.includes(u.role?._id)));
      });
    }
  }, []);

  const handleAssign = async (id) => {
    if (!assignTo) return toast.error('Select a staff member');
    try {
      await assignComplaint(id, { assignedTo: assignTo });
      toast.success('Assigned!'); setAssigning(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ margin:0, color:'#1A2B4A' }}>Complaints</h2>
        <Link to="/complaints/new" style={{ background:'#0D9488', color:'#fff', padding:'8px 18px', borderRadius:7, textDecoration:'none', fontWeight:600, fontSize:13 }}>
          + Raise Ticket
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap' }}>
        {['status','complaintType'].map(key=>(
          key==='status' ? (
            <select key={key} value={filters[key]} onChange={e=>setFilters({...filters,[key]:e.target.value})}
              style={{padding:'8px 12px',border:'1.5px solid #E2E8F0',borderRadius:7,fontSize:13,background:'#fff'}}>
              <option value=''>All Statuses</option>
              {['Pending','Assigned','In-Progress','On Hold','Completed'].map(s=><option key={s}>{s}</option>)}
            </select>
          ) : (
            <select key={key} value={filters[key]} onChange={e=>setFilters({...filters,[key]:e.target.value})}
              style={{padding:'8px 12px',border:'1.5px solid #E2E8F0',borderRadius:7,fontSize:13,background:'#fff'}}>
              <option value=''>All Types</option>
              {['PC Hardware','PC Software','Application Issues','Network','Electronics','Plumbing','Other'].map(s=><option key={s}>{s}</option>)}
            </select>
          )
        ))}
        <button onClick={load} style={{padding:'8px 14px',background:'#1A2B4A',color:'#fff',border:'none',borderRadius:7,fontSize:13,cursor:'pointer'}}>Refresh</button>
      </div>

      <div style={{ background:'#fff', borderRadius:10, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
        {loading ? <p style={{padding:20,color:'#64748B'}}>Loading...</p> : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F0F4F8' }}>
                {['#','Type','Block','Room','Raised By','Assigned To','Status','Actions'].map(h=>(
                  <th key={h} style={{padding:'11px 14px',textAlign:'left',fontSize:13,fontWeight:600,color:'#64748B'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length===0 && <tr><td colSpan={8} style={{padding:20,textAlign:'center',color:'#94A3B8'}}>No complaints found</td></tr>}
              {items.map((c,i)=>(
                <tr key={c._id} style={{borderBottom:'1px solid #F0F4F8'}}>
                  <td style={{padding:'10px 14px',fontSize:13,color:'#94A3B8'}}>{i+1}</td>
                  <td style={{padding:'10px 14px',fontSize:13}}>{c.complaintType}</td>
                  <td style={{padding:'10px 14px',fontSize:13}}>{c.block?.name}</td>
                  <td style={{padding:'10px 14px',fontSize:13}}>{c.room?.roomNumber}</td>
                  <td style={{padding:'10px 14px',fontSize:13}}>{c.raisedBy?.userName}</td>
                  <td style={{padding:'10px 14px',fontSize:13}}>{c.assignedTo?.userName||<span style={{color:'#CBD5E1'}}>Unassigned</span>}</td>
                  <td style={{padding:'10px 14px'}}>
                    <span style={{background:STATUS_COLOR[c.status]+'22',color:STATUS_COLOR[c.status],padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{c.status}</span>
                  </td>
                  <td style={{padding:'10px 14px'}}>
                    <Link to={`/complaints/${c._id}`} style={{color:'#0D9488',fontSize:12,marginRight:8,fontWeight:600}}>View</Link>
                    {isSuperAdmin() && c.status !== 'Completed' && (
                      assigning===c._id ? (
                        <span>
                          <select value={assignTo} onChange={e=>setAssignTo(e.target.value)} style={{fontSize:12,borderRadius:5,border:'1px solid #E2E8F0',padding:'3px 6px',marginRight:4}}>
                            <option value=''>Select Staff</option>
                            {staffList.map(s=><option key={s._id} value={s._id}>{s.userName} ({s.role?.name})</option>)}
                          </select>
                          <button onClick={()=>handleAssign(c._id)} style={{background:'#0D9488',color:'#fff',border:'none',borderRadius:5,padding:'3px 8px',fontSize:12,cursor:'pointer',marginRight:4}}>OK</button>
                          <button onClick={()=>setAssigning(null)} style={{background:'#E2E8F0',color:'#64748B',border:'none',borderRadius:5,padding:'3px 8px',fontSize:12,cursor:'pointer'}}>✕</button>
                        </span>
                      ) : (
                        <button onClick={()=>{setAssigning(c._id);setAssignTo('');}} style={{background:'#1A2B4A',color:'#fff',border:'none',borderRadius:5,padding:'4px 10px',fontSize:12,cursor:'pointer'}}>
                          {c.assignedTo ? 'Reassign' : 'Assign'}
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
