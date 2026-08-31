import React, { useEffect, useState } from 'react';
import MasterTable from '../common/MasterTable';
import * as api from '../../services/api';

const cols = [
  {key:'userName',label:'Name'},
  {key:'email',label:'Email'},
  {key:'phoneNumber',label:'Phone'},
  {key:'role',label:'Role',render:r=>r.role?.name||''},
  {key:'department',label:'Department',render:r=>r.department?.name||''},
];

export default function Users() {
  const [roles,setRoles]=useState([]); const [depts,setDepts]=useState([]); const [progs,setProgs]=useState([]);
  useEffect(()=>{
    api.getRoles().then(r=>setRoles(r.data.data));
    api.getDepartments().then(r=>setDepts(r.data.data));
    api.getProgrammes().then(r=>setProgs(r.data.data));
  },[]);

  const defaultForm={userName:'',phoneNumber:'',email:'',password:'',role:'',department:'',programme:''};

  const inp=(label,name,form,setForm,type='text')=>(
    <div style={{marginBottom:14}}>
      <label style={{display:'block',fontSize:13,fontWeight:600,color:'#1E293B',marginBottom:4}}>{label}</label>
      <input type={type} style={{width:'100%',padding:'9px 12px',border:'1.5px solid #E2E8F0',borderRadius:7,fontSize:14,boxSizing:'border-box'}}
        value={form[name]||''} onChange={e=>setForm({...form,[name]:e.target.value})} required />
    </div>
  );
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
    {inp('Full Name','userName',form,setForm)}
    {inp('Phone Number','phoneNumber',form,setForm)}
    {inp('Email','email',form,setForm,'email')}
    {inp('Password','password',form,setForm,'password')}
    {sel('Role','role',roles,form,setForm)}
    {sel('Department','department',depts,form,setForm)}
    {sel('Programme','programme',progs,form,setForm)}
  </>);

  return <MasterTable title="Users" columns={cols} fetchFn={api.getUsers} createFn={api.createUser}
    updateFn={api.updateUser} deleteFn={api.deleteUser} FormFields={FormFields} defaultForm={defaultForm} />;
}
