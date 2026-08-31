import React, { useEffect, useState } from 'react';
import MasterTable from '../common/MasterTable';
import * as api from '../../services/api';
const cols = [
  {key:'department',label:'Department',render:r=>r.department?.name||''},
  {key:'programme',label:'Programme',render:r=>r.programme?.name||''},
  {key:'name',label:'Block Name'}
];
export default function Blocks() {
  const [depts,setDepts]=useState([]); const [progs,setProgs]=useState([]);
  useEffect(()=>{ api.getDepartments().then(r=>setDepts(r.data.data)); api.getProgrammes().then(r=>setProgs(r.data.data)); },[]);
  const defaultForm={department:'',programme:'',name:''};
  const sel=(label,name,opts,form,setForm)=>(
    <div style={{marginBottom:14}}>
      <label style={{display:'block',fontSize:13,fontWeight:600,color:'#1E293B',marginBottom:4}}>{label}</label>
      <select style={{width:'100%',padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:7,fontSize:14,boxSizing:'border-box'}}
        value={form[name]||''} onChange={e=>setForm({...form,[name]:e.target.value})} required>
        <option value=''>Select {label}</option>
        {opts.map(o=><option key={o._id} value={o._id}>{o.name}</option>)}
      </select>
    </div>
  );
  const FormFields=({form,setForm})=>(<>
    {sel('Department','department',depts,form,setForm)}
    {sel('Programme','programme',progs.filter(p=>!form.department||p.department?._id===form.department||p.department===form.department),form,setForm)}
    <div style={{marginBottom:14}}>
      <label style={{display:'block',fontSize:13,fontWeight:600,color:'#1E293B',marginBottom:4}}>Block Name</label>
      <input style={{width:'100%',padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:7,fontSize:14,boxSizing:'border-box'}}
        value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} required />
    </div>
  </>);
  return <MasterTable title="Blocks" columns={cols} fetchFn={api.getBlocks} createFn={api.createBlock}
    updateFn={api.updateBlock} deleteFn={api.deleteBlock} FormFields={FormFields} defaultForm={defaultForm} />;
}
