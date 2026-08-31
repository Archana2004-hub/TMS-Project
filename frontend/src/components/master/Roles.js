import React from 'react';
import MasterTable from '../common/MasterTable';
import * as api from '../../services/api';
const cols = [{key:'name',label:'Role Name'}];
const defaultForm = {name:''};
const FormFields=({form,setForm})=>(
  <div style={{marginBottom:14}}>
    <label style={{display:'block',fontSize:13,fontWeight:600,color:'#1E293B',marginBottom:4}}>Role Name</label>
    <input style={{width:'100%',padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:7,fontSize:14,boxSizing:'border-box'}}
      value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} required />
  </div>
);
export default function Roles() {
  return <MasterTable title="Roles" columns={cols} fetchFn={api.getRoles} createFn={api.createRole}
    updateFn={api.updateRole} deleteFn={api.deleteRole} FormFields={FormFields} defaultForm={defaultForm} />;
}
