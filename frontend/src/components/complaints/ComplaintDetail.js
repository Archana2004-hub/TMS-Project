import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintById, updateStatus } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLOR = { Pending:'#F59E0B', Assigned:'#0D9488', 'In-Progress':'#3B82F6', 'On Hold':'#8B5CF6', Completed:'#10B981' };

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isStaff } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [status, setStatus]       = useState('');
  const [note, setNote]           = useState('');
  const [saving, setSaving]       = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await getComplaintById(id); setComplaint(r.data.data); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const handleUpdateStatus = async () => {
    if (!status) return toast.error('Select a status');
    setSaving(true);
    try {
      await updateStatus(id, { status, note });
      toast.success('Status updated!'); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  if (loading) return <p style={{color:'#64748B'}}>Loading...</p>;
  if (!complaint) return <p style={{color:'#EF4444'}}>Complaint not found.</p>;

  const Row = ({label, value}) => (
    <div style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid #F0F4F8'}}>
      <span style={{minWidth:160,fontSize:13,color:'#64748B',fontWeight:600}}>{label}</span>
      <span style={{fontSize:14,color:'#1E293B'}}>{value}</span>
    </div>
  );

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={()=>navigate(-1)} style={{background:'#E2E8F0',border:'none',borderRadius:7,padding:'7px 14px',cursor:'pointer',fontSize:13}}>← Back</button>
        <h2 style={{ margin:0, color:'#1A2B4A' }}>Complaint Details</h2>
        <span style={{ marginLeft:'auto', background:STATUS_COLOR[complaint.status]+'22', color:STATUS_COLOR[complaint.status], padding:'5px 14px', borderRadius:20, fontSize:13, fontWeight:700 }}>
          {complaint.status}
        </span>
      </div>

      <div style={{ background:'#fff', borderRadius:12, padding:'24px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', marginBottom:16 }}>
        <Row label="Complaint Type" value={complaint.complaintType} />
        <Row label="Block"          value={complaint.block?.name} />
        <Row label="Room"           value={complaint.room?.roomNumber} />
        <Row label="Department"     value={complaint.department?.name} />
        <Row label="Programme"      value={complaint.programme?.name} />
        <Row label="Raised By"      value={`${complaint.raisedBy?.userName} (${complaint.raisedBy?.email})`} />
        <Row label="Assigned To"    value={complaint.assignedTo?.userName || 'Not assigned yet'} />
        <Row label="Raised On"      value={new Date(complaint.createdAt).toLocaleString()} />
        {complaint.closedAt && <Row label="Closed On" value={new Date(complaint.closedAt).toLocaleString()} />}
        <div style={{padding:'10px 0'}}>
          <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:6}}>Remarks</div>
          <div style={{fontSize:14,color:'#1E293B',background:'#F0F4F8',padding:12,borderRadius:8}}>{complaint.remarks}</div>
        </div>
        {complaint.attachment && (
          <div style={{padding:'10px 0'}}>
            <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:6}}>Attachment</div>
            <a href={`/uploads/${complaint.attachment}`} target='_blank' rel='noopener noreferrer' style={{color:'#0D9488',fontSize:14}}>
              View Attachment
            </a>
          </div>
        )}
      </div>

      {/* Status History */}
      <div style={{ background:'#fff', borderRadius:12, padding:'20px 24px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', marginBottom:16 }}>
        <h3 style={{margin:'0 0 14px', color:'#1A2B4A', fontSize:16}}>Status History</h3>
        {complaint.statusHistory?.map((h,i)=>(
          <div key={i} style={{display:'flex',gap:12,marginBottom:8,fontSize:13}}>
            <span style={{background:STATUS_COLOR[h.status]+'22',color:STATUS_COLOR[h.status],padding:'2px 10px',borderRadius:12,fontWeight:600,whiteSpace:'nowrap'}}>{h.status}</span>
            <span style={{color:'#64748B'}}>{new Date(h.changedAt).toLocaleString()}</span>
            {h.note && <span style={{color:'#1E293B'}}>— {h.note}</span>}
          </div>
        ))}
      </div>

      {/* Staff: update status */}
      {isStaff() && complaint.status !== 'Completed' && (
        <div style={{ background:'#fff', borderRadius:12, padding:'20px 24px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{margin:'0 0 14px', color:'#1A2B4A', fontSize:16}}>Update Status</h3>
          <select value={status} onChange={e=>setStatus(e.target.value)}
            style={{padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:7,fontSize:14,background:'#fff',marginRight:10}}>
            <option value=''>Select new status</option>
            {['In-Progress','On Hold','Completed'].map(s=><option key={s}>{s}</option>)}
          </select>
          <input placeholder="Add a note (optional)" value={note} onChange={e=>setNote(e.target.value)}
            style={{padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:7,fontSize:14,marginRight:10,width:220}} />
          <button onClick={handleUpdateStatus} disabled={saving}
            style={{background:'#0D9488',color:'#fff',border:'none',borderRadius:7,padding:'9px 20px',fontSize:14,fontWeight:600,cursor:'pointer'}}>
            {saving?'Saving...':'Update'}
          </button>
        </div>
      )}
    </div>
  );
}
