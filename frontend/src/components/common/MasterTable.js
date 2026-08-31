import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function MasterTable({ title, columns, fetchFn, createFn, updateFn, deleteFn, FormFields, defaultForm }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(defaultForm);

  const load = async () => { setLoading(true); try { const r = await fetchFn(); setItems(r.data.data); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(defaultForm); setModal(true); };
  const openEdit   = (item) => { setEditing(item); setForm(item); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await updateFn(editing._id, form);
      else         await createFn(form);
      toast.success(editing ? 'Updated!' : 'Created!');
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try { await deleteFn(id); toast.success('Deleted'); load(); } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: '#1A2B4A', fontSize: 22 }}>{title}</h2>
        <button onClick={openCreate} style={btn}>+ Add New</button>
      </div>

      <div style={card}>
        {loading ? <p style={{ padding: 20, color: '#64748B' }}>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F0F4F8' }}>
                {columns.map(c => <th key={c.key} style={th}>{c.label}</th>)}
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={columns.length+1} style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>No records found</td></tr>}
              {items.map(item => (
                <tr key={item._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  {columns.map(c => <td key={c.key} style={td}>{c.render ? c.render(item) : item[c.key]}</td>)}
                  <td style={td}>
                    <button onClick={() => openEdit(item)} style={editBtn}>Edit</button>
                    <button onClick={() => handleDelete(item._id)} style={delBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div style={overlay}>
          <div style={modalBox}>
            <h3 style={{ marginTop: 0, color: '#1A2B4A' }}>{editing ? 'Edit' : 'Add'} {title}</h3>
            <form onSubmit={handleSubmit}>
              <FormFields form={form} setForm={setForm} />
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" style={btn}>Save</button>
                <button type="button" onClick={() => setModal(false)} style={cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const card     = { background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' };
const th       = { padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' };
const td       = { padding: '12px 16px', fontSize: 14, color: '#1E293B' };
const btn      = { background: '#0D9488', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 };
const editBtn  = { background: '#1A2B4A', color: '#fff', border: 'none', borderRadius: 5, padding: '5px 12px', cursor: 'pointer', fontSize: 12, marginRight: 6 };
const delBtn   = { background: '#EF4444', color: '#fff', border: 'none', borderRadius: 5, padding: '5px 12px', cursor: 'pointer', fontSize: 12 };
const cancelBtn= { background: '#E2E8F0', color: '#64748B', border: 'none', borderRadius: 7, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 };
const overlay  = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalBox = { background: '#fff', borderRadius: 12, padding: 28, width: 460, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };
