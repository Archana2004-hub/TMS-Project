import React, { useEffect, useState } from 'react';
import { getReport, getDepartments, getProgrammes, getUsers } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLOR = { Pending:'#F59E0B', Assigned:'#0D9488', 'In-Progress':'#3B82F6', 'On Hold':'#8B5CF6', Completed:'#10B981' };
const TYPES = ['PC Hardware','PC Software','Application Issues','Network','Electronics','Plumbing','Other'];

export default function Reports() {
  const [filters, setFilters]   = useState({ department:'', programme:'', complaintType:'', status:'', assignedTo:'', from:'', to:'' });
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [depts, setDepts]       = useState([]);
  const [progs, setProgs]       = useState([]);
  const [staff, setStaff]       = useState([]);

  useEffect(() => {
    getDepartments().then(r=>setDepts(r.data.data));
    getProgrammes().then(r=>setProgs(r.data.data));
    getUsers().then(r=>setStaff(r.data.data));
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try { const r = await getReport(filters); setData(r.data.data); }
    catch (err) { toast.error('Failed to generate report'); }
    finally { setLoading(false); }
  };

  const selStyle = { padding:'8px 12px', border:'1.5px solid #E2E8F0', borderRadius:7, fontSize:13, background:'#fff' };
  const inpStyle = { padding:'8px 12px', border:'1.5px solid #E2E8F0', borderRadius:7, fontSize:13 };

  return (
    <div>
      <h2 style={{ color:'#1A2B4A', marginBottom:6 }}>Complaint Details Report</h2>
      <p style={{ color:'#64748B', marginBottom:20, fontSize:14 }}>Filter and generate complaint reports.</p>

      <div style={{ background:'#fff', borderRadius:12, padding:'20px 24px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', marginBottom:20 }}>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:14 }}>
          <select style={selStyle} value={filters.department} onChange={e=>setFilters({...filters,department:e.target.value})}>
            <option value=''>All Departments</option>
            {depts.map(d=><option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <select style={selStyle} value={filters.programme} onChange={e=>setFilters({...filters,programme:e.target.value})}>
            <option value=''>All Programmes</option>
            {progs.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <select style={selStyle} value={filters.complaintType} onChange={e=>setFilters({...filters,complaintType:e.target.value})}>
            <option value=''>All Types</option>
            {TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
          <select style={selStyle} value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}>
            <option value=''>All Statuses</option>
            {['Pending','Assigned','In-Progress','On Hold','Completed'].map(s=><option key={s}>{s}</option>)}
          </select>
          <select style={selStyle} value={filters.assignedTo} onChange={e=>setFilters({...filters,assignedTo:e.target.value})}>
            <option value=''>All Assignees</option>
            {staff.map(s=><option key={s._id} value={s._id}>{s.userName}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
          <input type="date" style={inpStyle} value={filters.from} onChange={e=>setFilters({...filters,from:e.target.value})} />
          <span style={{color:'#64748B',fontSize:13}}>to</span>
          <input type="date" style={inpStyle} value={filters.to} onChange={e=>setFilters({...filters,to:e.target.value})} />
          <button onClick={handleSearch} style={{ background:'#0D9488', color:'#fff', border:'none', borderRadius:7, padding:'9px 24px', fontSize:14, fontWeight:600, cursor:'pointer' }}>
            Generate Report
          </button>
          <span style={{ color:'#64748B', fontSize:13, marginLeft:4 }}>{data.length > 0 && `${data.length} records found`}</span>
        </div>
      </div>

      <div style={{ background:'#fff', borderRadius:10, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
        {loading ? <p style={{padding:20,color:'#64748B'}}>Generating...</p> : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F0F4F8' }}>
                {['#','Type','Department','Block','Room','Raised By','Assigned To','Status','Date'].map(h=>(
                  <th key={h} style={{padding:'10px 12px',textAlign:'left',fontSize:12,fontWeight:600,color:'#64748B'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length===0 && <tr><td colSpan={9} style={{padding:20,textAlign:'center',color:'#94A3B8'}}>No data. Click Generate Report to load results.</td></tr>}
              {data.map((c,i)=>(
                <tr key={c._id} style={{borderBottom:'1px solid #F0F4F8'}}>
                  <td style={{padding:'9px 12px',fontSize:12,color:'#94A3B8'}}>{i+1}</td>
                  <td style={{padding:'9px 12px',fontSize:12}}>{c.complaintType}</td>
                  <td style={{padding:'9px 12px',fontSize:12}}>{c.department?.name}</td>
                  <td style={{padding:'9px 12px',fontSize:12}}>{c.block?.name}</td>
                  <td style={{padding:'9px 12px',fontSize:12}}>{c.room?.roomNumber}</td>
                  <td style={{padding:'9px 12px',fontSize:12}}>{c.raisedBy?.userName}</td>
                  <td style={{padding:'9px 12px',fontSize:12}}>{c.assignedTo?.userName||'—'}</td>
                  <td style={{padding:'9px 12px'}}>
                    <span style={{background:STATUS_COLOR[c.status]+'22',color:STATUS_COLOR[c.status],padding:'2px 8px',borderRadius:12,fontSize:11,fontWeight:600}}>{c.status}</span>
                  </td>
                  <td style={{padding:'9px 12px',fontSize:11,color:'#64748B'}}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
