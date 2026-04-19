import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const StaffLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth verification for Staff ID
    setTimeout(() => {
      setLoading(false);
      navigate('/staff');
    }, 1000);
  };

  return (
    <div className="page-container" style={{ alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at bottom right, var(--bg-secondary), var(--bg-primary))' }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel" 
        style={{ padding: '3rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem', borderTop: '4px solid var(--status-info)' }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', marginBottom: '1rem' }}>
            <Shield size={32} style={{ color: 'var(--status-info)' }} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Staff Operations</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter your authorized Staff ID to continue</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Shield size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Staff ID (e.g., EMP-1024)" 
              value={staffId}
              onChange={(e) => setStaffId(e.target.value.toUpperCase())}
              required
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 3rem',
                backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                outline: 'none', textTransform: 'uppercase'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              placeholder="Secure Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 3rem',
                backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
              padding: '1rem', backgroundColor: 'var(--status-info)', 
              color: '#fff', border: 'none',
              borderRadius: 'var(--radius-md)', transition: 'var(--transition-fast)',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem', fontWeight: 600
            }}
          >
            {loading ? <span className="pulse">Authenticating...</span> : <><LogIn size={20} /> Access Dashboard</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            &larr; Back to Fan Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffLoginPage;
