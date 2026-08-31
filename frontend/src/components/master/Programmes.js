import React, { useEffect, useState } from 'react';
import MasterTable from '../common/MasterTable';
import * as api from '../../services/api';
const Field = ({label,name,form,setForm}) => (
  <div style={{marginBottom:14}}>
    <label style={{display:'block',fontSize:13,fontWeight:600,color:'#1E293B',marginBottom:4}}>{label}</label>
    <input style={{width:'100%',padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:7,fontSize:14,boxSizing:'border-box'}}
      value={form[name]||''} onChange={e=>setForm({...form,[name]:e.target.value})} required />
  </div>
);
const cols = [
  {key:'department',label:'Department',render:r=>r.department?.name||''},
  {key:'name',label:'Programme'},
  {key:'shortName',label:'Short Name'}
];
export default function Programmes() {
  const [depts,setDepts] = useState([]);
  useEffect(()=>{api.getDepartments().then(r=>setDepts(r.data.data));},[]);
  const defaultForm = {department:'',name:'',shortName:''};
  const FormFields = ({form,setForm}) => (<>
    <div style={{marginBottom:14}}>
      <label style={{display:'block',fontSize:13,fontWeight:600,color:'#1E293B',marginBottom:4}}>Department</label>
      <select style={{width:'100%',padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:7,fontSize:14,boxSizing:'border-box'}}
        value={form.department||''} onChange={e=>setForm({...form,department:e.target.value})} required>
        <option value=''>Select Department</option>
        {depts.map(d=><option key={d._id} value={d._id}>{d.name}</option>)}
      </select>
    </div>
    <Field label="Programme Name" name="name" form={form} setForm={setForm} />
    <Field label="Short Name" name="shortName" form={form} setForm={setForm} />
  </>);
  return <MasterTable title="Programmes" columns={cols} fetchFn={api.getProgrammes} createFn={api.createProgramme}
    updateFn={api.updateProgramme} deleteFn={api.deleteProgramme} FormFields={FormFields} defaultForm={defaultForm} />;
}
