import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome, ${user.userName}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes gradMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }

        .login-card {
          animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .login-input {
          transition: all 0.25s ease !important;
        }
        .login-input:focus {
          border-color: #a855f7 !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(168,85,247,0.15) !important;
          outline: none !important;
          transform: translateY(-1px);
        }
        .login-input::placeholder {
          color: #c4b5d4 !important;
        }
        .login-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease !important;
        }
        .login-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: shimmer 2.5s infinite;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 30px rgba(168,85,247,0.5) !important;
          background: linear-gradient(135deg, #7c3aed, #a855f7, #ec4899) !important;
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0) !important;
        }
        .eye-btn:hover {
          color: #a855f7 !important;
        }
        .dot { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      {/* Animated background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div className="login-card" style={styles.card}>

        {/* Left Panel */}
        <div style={styles.left}>
          {/* Glow */}
          <div style={styles.leftGlow} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            {/* Floating icon */}
            <div style={{ fontSize: 58, marginBottom: 10, animation: 'float 4s ease-in-out infinite' }}>
              🎫
            </div>

            <h1 style={styles.brand}>TMS</h1>
            <p style={styles.brandSub}>Ticket Management System</p>

            {/* Animated dots */}
            <div style={styles.dotsRow}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="dot" style={{
                  ...styles.dot, animationDelay: `${i * 0.25}s`
                }} />
              ))}
            </div>

            {/* Feature list */}
            <div style={styles.features}>
              {[
                { icon: '🎫', text: 'Raise Tickets Instantly' },
                { icon: '📊', text: 'Track Status Live' },
                { icon: '⚡', text: 'Smart Assignment' },
                { icon: '📱', text: 'Real-time Updates' },
              ].map((f, i) => (
                <div key={i} style={{
                  ...styles.featureItem,
                  animationDelay: `${0.3 + i * 0.1}s`,
                  animation: 'fadeUp 0.5s ease both',
                }}>
                  <span style={styles.featureIcon}>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={styles.right}>
          <div style={{ width: '100%', maxWidth: 340, animation: 'fadeUp 0.7s 0.1s ease both' }}>

            <div style={styles.formHeader}>
              <h2 style={styles.title}>Welcome Back 👋</h2>
              <p style={styles.subtitle}>Sign in to continue to TMS</p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={styles.field}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputBox}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    className="login-input"
                    style={styles.input}
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputBox}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    className="login-input"
                    style={styles.input}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPass(!showPass)}
                    style={styles.eyeBtn}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn"
                style={{
                  ...styles.btn,
                  opacity: loading ? 0.8 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <div style={{
                      width: 16, height: 16,
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    Signing in...
                  </span>
                ) : (
                  <span>Sign In →</span>
                )}
              </button>

            </form>

            <p style={styles.hint}>
              🔐 Use your registered credentials to login
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0520 0%, #1e0a3c 50%, #0d0219 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20, position: 'relative', overflow: 'hidden',
  },

  /* Blobs */
  blob1: {
    position: 'absolute', width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 65%)',
    top: -150, left: -150, pointerEvents: 'none',
    animation: 'float 9s ease-in-out infinite',
  },
  blob2: {
    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 65%)',
    bottom: -100, right: -100, pointerEvents: 'none',
    animation: 'float 11s ease-in-out infinite reverse',
  },
  blob3: {
    position: 'absolute', width: 350, height: 350, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)',
    top: '40%', right: '30%', pointerEvents: 'none',
    animation: 'float 7s ease-in-out infinite',
  },

  /* Card */
  card: {
    display: 'flex', width: '100%', maxWidth: 920, minHeight: 580,
    borderRadius: 24, overflow: 'hidden',
    boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.2)',
    position: 'relative', zIndex: 1,
  },

  /* Left */
  left: {
    flex: '0 0 360px',
    background: 'linear-gradient(150deg, #6d28d9 0%, #9333ea 40%, #ec4899 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradMove 6s ease infinite',
    padding: '52px 36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
  },
  leftGlow: {
    position: 'absolute', top: -60, left: -60,
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  brand: {
    color: '#fff', fontSize: 44, fontWeight: 900,
    letterSpacing: 3, margin: '0 0 6px',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  brandSub: {
    color: 'rgba(255,255,255,0.75)', fontSize: 12,
    marginBottom: 28, fontWeight: 400, letterSpacing: 0.5,
  },
  dotsRow: { display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 },
  dot: {
    width: 9, height: 9, borderRadius: '50%',
    background: 'rgba(255,255,255,0.7)',
  },
  features: { display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' },
  featureItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    color: '#fff', fontSize: 13, fontWeight: 500,
    background: 'rgba(255,255,255,0.1)',
    padding: '8px 14px', borderRadius: 10,
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  featureIcon: { fontSize: 16, flexShrink: 0 },

  /* Right */
  right: {
    flex: 1, background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '52px 44px',
  },
  formHeader: { marginBottom: 30 },
  title: { fontSize: 26, fontWeight: 800, color: '#1a0533', margin: '0 0 6px' },
  subtitle: { fontSize: 13, color: '#9ca3af', margin: 0 },

  /* Form */
  field: { marginBottom: 18 },
  label: {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: '#4b2d7f', marginBottom: 7, letterSpacing: 0.4,
  },
  inputBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    border: '1.5px solid #e9d5ff', borderRadius: 12,
    padding: '0 12px', background: '#faf5ff',
    transition: 'all 0.2s',
  },
  inputIcon: { fontSize: 15, flexShrink: 0, opacity: 0.6 },
  input: {
    flex: 1, padding: '12px 4px',
    border: 'none', background: 'transparent',
    fontSize: 13, color: '#1a0533', fontWeight: 500,
  },
  eyeBtn: {
    background: 'none', border: 'none',
    cursor: 'pointer', fontSize: 16,
    padding: '4px', color: '#c4b5d4',
    transition: 'color 0.2s',
  },

  /* Button */
  btn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
    backgroundSize: '200% 100%',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 14, fontWeight: 700,
    boxShadow: '0 6px 20px rgba(168,85,247,0.38)',
    marginTop: 8, letterSpacing: 0.5,
  },

  hint: {
    textAlign: 'center', fontSize: 11,
    color: '#c4b5d4', marginTop: 20, lineHeight: 1.6,
  },
};
