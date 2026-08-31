import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ADMIN_ROLES = ['SuperAdmin', 'Super Admin', 'superadmin'];

export default function Layout({ children }) {
  const { user, logout }  = useAuth();
  const location          = useLocation();
  const navigate          = useNavigate();
  const [open, setOpen]   = useState(true);

  const roleName   = user?.role?.name || '';
  const isSA       = ADMIN_ROLES.includes(roleName);
  const isNormalUser = !isSA;

  const NAV = [
    { label: 'Dashboard',      icon: '📊', path: '/dashboard',          show: true },
    { label: 'My Tickets',     icon: '🎫', path: '/my-tickets',         show: isNormalUser },
    { label: 'Raise Ticket',   icon: '✦',  path: '/complaints/new',     show: isNormalUser },
    { label: 'All Complaints', icon: '📋', path: '/complaints',         show: isSA },
    { label: 'Raise Ticket',   icon: '✦',  path: '/complaints/new',     show: isSA },
    { divider: true,                                                      show: isSA },
    { label: 'Departments',    icon: '🏢', path: '/master/departments', show: isSA },
    { label: 'Programmes',     icon: '🎓', path: '/master/programmes',  show: isSA },
    { label: 'Blocks',         icon: '🏗️', path: '/master/blocks',      show: isSA },
    { label: 'Rooms',          icon: '🚪', path: '/master/rooms',       show: isSA },
    { label: 'Roles',          icon: '👥', path: '/master/roles',       show: isSA },
    { label: 'Users',          icon: '👤', path: '/master/users',       show: isSA },
    { divider: true,                                                      show: isSA },
    { label: 'Reports',        icon: '📈', path: '/reports',            show: isSA },
  ].filter(n => n.show);

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleBadgeColor = isSA
    ? 'linear-gradient(135deg, #f59e0b, #f97316)'
    : 'linear-gradient(135deg, #a855f7, #ec4899)';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
        .nav-link:hover { background: rgba(168,85,247,0.15) !important; color: #a855f7 !important; }
        .logout-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(236,72,153,0.4); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1a0533; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 4px; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        width: open ? 240 : 68,
        background: 'linear-gradient(180deg, #1a0533 0%, #2d1b4e 60%, #1e0a3c 100%)',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0, display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
        position: 'relative', zIndex: 100,
        borderRight: '1px solid rgba(168,85,247,0.15)',
      }}>

        {/* Glow effect */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 200,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{
          padding: open ? '20px 20px 16px' : '20px 0 16px',
          borderBottom: '1px solid rgba(168,85,247,0.15)',
          display: 'flex', alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          position: 'relative', zIndex: 1,
        }}>
          {open && (
            <div>
              <div style={{
                fontSize: 22, fontWeight: 800, letterSpacing: 2,
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>TMS</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: -2 }}>
                Ticket Management
              </div>
            </div>
          )}
          <button onClick={() => setOpen(!open)} style={{
            background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.2)',
            color: '#a855f7', cursor: 'pointer', fontSize: 16,
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>☰</button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
          {NAV.map((n, i) => {
            if (n.divider) return (
              <div key={i} style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)',
                margin: '10px 8px',
              }} />
            );
            const active = location.pathname === n.path;
            return (
              <Link key={n.path + i} to={n.path} className="nav-link" style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: open ? '10px 14px' : '10px 0',
                justifyContent: open ? 'flex-start' : 'center',
                color: active ? '#e879f9' : 'rgba(255,255,255,0.55)',
                background: active
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.1))'
                  : 'transparent',
                textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 400,
                borderRadius: 10, marginBottom: 2,
                borderLeft: active ? '3px solid #a855f7' : '3px solid transparent',
                transition: 'all 0.2s',
                boxShadow: active ? 'inset 0 0 20px rgba(168,85,247,0.1)' : 'none',
              }}>
                <span style={{ fontSize: 17, flexShrink: 0, filter: active ? 'drop-shadow(0 0 6px rgba(168,85,247,0.8))' : 'none' }}>
                  {n.icon}
                </span>
                {open && (
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {n.label}
                  </span>
                )}
                {active && open && (
                  <div style={{
                    marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    boxShadow: '0 0 8px rgba(168,85,247,0.8)',
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div style={{
          padding: '14px 12px',
          borderTop: '1px solid rgba(168,85,247,0.15)',
          position: 'relative', zIndex: 1,
        }}>
          {open && (
            <div style={{
              background: 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.15)',
              borderRadius: 12, padding: '10px 12px', marginBottom: 10,
            }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                {user?.userName}
              </div>
              <span style={{
                background: roleBadgeColor, color: '#fff',
                fontSize: 10, fontWeight: 700, padding: '2px 10px',
                borderRadius: 20, display: 'inline-block',
              }}>
                {roleName}
              </span>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 4 }}>
                {user?.email}
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="logout-btn" style={{
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: open ? '9px 14px' : '9px',
            cursor: 'pointer', width: '100%', fontSize: 12,
            fontWeight: 700, transition: 'all 0.2s',
            boxShadow: '0 4px 14px rgba(236,72,153,0.3)',
            letterSpacing: 0.5,
          }}>
            {open ? '🚪  Logout' : '↩'}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{
        flex: 1,
        background: 'linear-gradient(135deg, #fdf4ff 0%, #fce7f3 50%, #f5f3ff 100%)',
        padding: 28, overflowY: 'auto', minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  );
}
