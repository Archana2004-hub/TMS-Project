import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlocks, getRooms, createComplaint } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TYPES = ['PC Hardware','PC Software','Application Issues','Network','Electronics','Plumbing','Other'];
const TYPE_META = {
  'PC Hardware':        { icon:'🖥️', color:'#6366f1' },
  'PC Software':        { icon:'💻', color:'#8b5cf6' },
  'Application Issues': { icon:'📱', color:'#a855f7' },
  'Network':            { icon:'🌐', color:'#3b82f6' },
  'Electronics':        { icon:'⚡', color:'#f59e0b' },
  'Plumbing':           { icon:'🔧', color:'#10b981' },
  'Other':              { icon:'📋', color:'#ec4899' },
};

const STEPS = ['Complaint Type', 'Location', 'Details', 'Submit'];

export default function RaiseComplaint() {
  const navigate                    = useNavigate();
  const { user, isSuperAdmin }      = useAuth();
  const [blocks, setBlocks]         = useState([]);
  const [rooms, setRooms]           = useState([]);
  const [form, setForm]             = useState({ block:'', room:'', complaintType:'', remarks:'', attachment:null });
  const [submitting, setSubmitting] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(true);
  const [step, setStep]             = useState(0);

  // Auto-advance step based on form fill
  useEffect(() => {
    if (form.complaintType && step === 0) setStep(1);
  }, [form.complaintType]);
  useEffect(() => {
    if (form.block && form.room && step === 1) setStep(2);
  }, [form.block, form.room]);

  useEffect(() => {
    getBlocks().then(r => setBlocks(r.data.data||[])).finally(()=>setLoadingBlocks(false));
  }, []);
  useEffect(() => {
    if (form.block) {
      getRooms().then(r => setRooms((r.data.data||[]).filter(rm=>rm.block?._id===form.block||rm.block===form.block)));
    } else setRooms([]);
  }, [form.block]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.block || !form.room || !form.complaintType || !form.remarks.trim()) {
      toast.error('Please fill all required fields'); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('block',         form.block);
      fd.append('room',          form.room);
      fd.append('complaintType', form.complaintType);
      fd.append('remarks',       form.remarks);
      if (form.attachment) fd.append('attachment', form.attachment);
      await createComplaint(fd);
      toast.success('🎫 Complaint raised successfully!');
      navigate(isSuperAdmin() ? '/complaints' : '/my-tickets');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally { setSubmitting(false); }
  };

  const tm = TYPE_META[form.complaintType] || {};

  return (
    <div style={{ maxWidth:660, animation:'fadeUp 0.4s ease both' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .type-btn:hover{transform:translateY(-2px)!important;box-shadow:0 6px 18px rgba(109,40,217,0.2)!important}
        .submit-btn:hover{box-shadow:0 10px 30px rgba(168,85,247,0.5)!important}
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ margin:0, fontSize:26, fontWeight:800, color:'#1e1035' }}>Raise a Complaint ✦</h2>
        <p style={{ margin:'4px 0 0', color:'#9ca3af', fontSize:13 }}>
          {user?.userName} — {user?.department?.name}
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{ display:'flex', alignItems:'center', marginBottom:28, gap:0 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
              <div style={{
                width:32, height:32, borderRadius:'50%',
                background: i <= step ? 'linear-gradient(135deg,#6d28d9,#a855f7)' : '#f0e6ff',
                color: i <= step ? '#fff' : '#c4b5d4',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:700,
                boxShadow: i <= step ? '0 4px 12px rgba(109,40,217,0.3)' : 'none',
                transition:'all 0.3s',
              }}>{i < step ? '✓' : i+1}</div>
              <span style={{ fontSize:10, color: i<=step ? '#6d28d9' : '#c4b5d4', fontWeight: i<=step?600:400, whiteSpace:'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length-1 && (
              <div style={{ flex:1, height:2, background: i<step ? 'linear-gradient(90deg,#6d28d9,#a855f7)' : '#f0e6ff', margin:'0 6px 18px', transition:'background 0.3s' }}/>
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ background:'#fff', borderRadius:16, padding:'28px 30px', boxShadow:'0 4px 24px rgba(109,40,217,0.1)', border:'1px solid rgba(168,85,247,0.1)' }}>

        {/* Complaint Type */}
        <div style={{ marginBottom:24 }}>
          <label style={lbl}>Complaint Type <span style={{ color:'#ec4899' }}>*</span></label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:9, marginTop:10 }}>
            {TYPES.map(t => {
              const m = TYPE_META[t];
              const active = form.complaintType === t;
              return (
                <button key={t} type="button" onClick={()=>setForm({...form,complaintType:t})} className="type-btn"
                  style={{
                    padding:'9px 15px', borderRadius:10, cursor:'pointer',
                    fontSize:13, fontWeight:500,
                    border: active ? `2px solid ${m.color}` : '1.5px solid #e9d5ff',
                    background: active ? `${m.color}18` : '#faf5ff',
                    color: active ? m.color : '#9ca3af',
                    display:'flex', alignItems:'center', gap:6,
                    transition:'all 0.18s',
                    boxShadow: active ? `0 4px 14px ${m.color}28` : 'none',
                    transform: active ? 'translateY(-2px)' : 'none',
                  }}>
                  {m.icon} {t}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Block + Room Row */}
          <div style={{ display:'flex', gap:14, marginBottom:18 }}>
            <div style={{ flex:1 }}>
              <label style={lbl}>Block <span style={{ color:'#ec4899' }}>*</span></label>
              {loadingBlocks ? (
                <div style={{ ...inp, color:'#c4b5d4', display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:14,height:14,border:'2px solid #e9d5ff',borderTopColor:'#a855f7',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>
                  Loading...
                </div>
              ) : (
                <select style={inp} value={form.block} onChange={e=>setForm({...form,block:e.target.value,room:''})} required>
                  <option value="">-- Select Block --</option>
                  {blocks.map(b=><option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              )}
            </div>
            <div style={{ flex:1 }}>
              <label style={lbl}>Room <span style={{ color:'#ec4899' }}>*</span></label>
              <select style={{ ...inp, opacity:!form.block?0.5:1 }}
                value={form.room} onChange={e=>setForm({...form,room:e.target.value})}
                disabled={!form.block} required>
                <option value="">-- Select Room --</option>
                {rooms.map(r=><option key={r._id} value={r._id}>{r.roomNumber}</option>)}
              </select>
            </div>
          </div>

          {/* Remarks */}
          <div style={{ marginBottom:18 }}>
            <label style={lbl}>Describe the Issue <span style={{ color:'#ec4899' }}>*</span></label>
            <textarea
              style={{ ...inp, height:110, resize:'vertical' }}
              placeholder="Describe the problem in detail..."
              value={form.remarks}
              onChange={e=>{setForm({...form,remarks:e.target.value}); if(e.target.value.length>5) setStep(s=>Math.max(s,2));}}
              required />
            <div style={{ textAlign:'right', fontSize:11, color:'#d8b4fe', marginTop:4 }}>
              {form.remarks.length} chars
            </div>
          </div>

          {/* Attachment */}
          <div style={{ marginBottom:24 }}>
            <label style={lbl}>Attachment <span style={{ color:'#c4b5d4', fontWeight:400 }}>(optional)</span></label>
            <div style={{
              border:'2px dashed #e9d5ff', borderRadius:12, padding:'16px',
              textAlign:'center', cursor:'pointer', background:'#faf5ff',
              transition:'border 0.2s, background 0.2s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#a855f7'; e.currentTarget.style.background='#f5f0ff';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#e9d5ff'; e.currentTarget.style.background='#faf5ff';}}
            onClick={()=>document.getElementById('file-input').click()}>
              <div style={{ fontSize:28, marginBottom:6 }}>{form.attachment ? '📎' : '☁️'}</div>
              <div style={{ fontSize:12, color:'#c4b5d4' }}>
                {form.attachment ? form.attachment.name : 'Click to upload — JPG, PNG, PDF (max 5MB)'}
              </div>
              <input id="file-input" type="file" style={{ display:'none' }}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={e=>setForm({...form,attachment:e.target.files[0]})} />
            </div>
          </div>

          {/* User Info */}
          <div style={{
            background:'linear-gradient(135deg,rgba(168,85,247,0.06),rgba(236,72,153,0.04))',
            borderRadius:10, padding:'12px 16px', marginBottom:24,
            border:'1px solid rgba(168,85,247,0.12)',
            display:'flex', gap:10, alignItems:'center',
          }}>
            <span style={{ fontSize:20 }}>ℹ️</span>
            <div style={{ fontSize:12, color:'#7c6a9a', lineHeight:1.6 }}>
              Auto-attached: <strong style={{ color:'#6d28d9' }}>{user?.userName}</strong> —{' '}
              <strong style={{ color:'#6d28d9' }}>{user?.department?.name}</strong> /{' '}
              <strong style={{ color:'#6d28d9' }}>{user?.programme?.name}</strong>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display:'flex', gap:12 }}>
            <button type="submit" disabled={submitting} className="submit-btn" style={{
              flex:1, padding:'13px',
              background: submitting ? '#c4b5d4' : 'linear-gradient(135deg,#6d28d9,#a855f7,#ec4899)',
              backgroundSize:'200% 100%',
              color:'#fff', border:'none', borderRadius:12,
              fontSize:14, fontWeight:700, cursor: submitting?'not-allowed':'pointer',
              boxShadow:'0 6px 20px rgba(168,85,247,0.35)',
              transition:'all 0.2s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>
              {submitting
                ? <><div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/> Submitting...</>
                : '🎫 Submit Complaint'
              }
            </button>
            <button type="button" onClick={()=>navigate(isSuperAdmin()?'/complaints':'/my-tickets')} style={{
              padding:'13px 20px', background:'#f5f0ff', color:'#6d28d9',
              border:'1.5px solid #e9d5ff', borderRadius:12,
              fontSize:13, fontWeight:600, cursor:'pointer',
            }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const lbl = { display:'block', fontSize:12, fontWeight:600, color:'#4b2d7f', marginBottom:7, letterSpacing:0.3 };
const inp = {
  width:'100%', padding:'11px 14px',
  border:'1.5px solid #e9d5ff', borderRadius:10,
  fontSize:13, outline:'none', boxSizing:'border-box',
  background:'#faf5ff', fontFamily:'Poppins,sans-serif',
  transition:'border 0.2s, box-shadow 0.2s', color:'#1e1035',
};
