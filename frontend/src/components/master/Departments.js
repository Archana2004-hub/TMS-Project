import React from 'react';
import MasterTable from '../common/MasterTable';
import * as api from '../../services/api';
const Field = ({ label, name, form, setForm, type='text' }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:4 }}>{label}</label>
    <input style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E2E8F0', borderRadius:7, fontSize:14, boxSizing:'border-box' }}
      type={type} value={form[name]||''} onChange={e=>setForm({...form,[name]:e.target.value})} required />
  </div>
);
const cols = [{ key:'name', label:'Department Name' }, { key:'shortName', label:'Short Name' }];
const defaultForm = { name:'', shortName:'' };
const FormFields = ({form,setForm}) => (<>
  <Field label="Department Name" name="name" form={form} setForm={setForm} />
  <Field label="Short Name" name="shortName" form={form} setForm={setForm} />
</>);
export default function Departments() {
  return <MasterTable title="Departments" columns={cols} fetchFn={api.getDepartments} createFn={api.createDepartment}
    updateFn={api.updateDepartment} deleteFn={api.deleteDepartment} FormFields={FormFields} defaultForm={defaultForm} />;
}
