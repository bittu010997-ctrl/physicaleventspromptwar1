import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, User } from 'lucide-react';
import { motion } from 'framer-motion';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate signup for prototyping
    setTimeout(() => {
      setLoading(false);
      navigate('/app');
    }, 1000);
  };

  return (
    <div className="page-container" style={{ alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top left, var(--bg-tertiary), var(--bg-primary))' }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel" 
        style={{ padding: '3rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>StadiumIQ</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create an account to manage your event</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 3rem',
                backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 3rem',
                backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              placeholder="Password" 
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
              padding: '1rem', backgroundColor: 'var(--accent-glow)', 
              color: 'var(--text-primary)', border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)', transition: 'var(--transition-fast)',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem'
            }}
          >
            {loading ? <span className="pulse">Creating account...</span> : <><UserPlus size={20} /> <span style={{ fontWeight: 600 }}>Sign Up</span></>}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
