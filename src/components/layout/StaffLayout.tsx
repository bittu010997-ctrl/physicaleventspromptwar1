import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Activity, AlertTriangle, LogOut } from 'lucide-react';

const StaffLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h1 className="gradient-text" style={{ fontSize: '1.5rem', margin: 0 }}>StadiumIQ</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>Command Center</p>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink 
            to="/staff/dashboard"
            style={({isActive}) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isActive ? 'var(--glass-bg)' : 'transparent',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 400
            })}
          >
            <Activity size={20} /> Dashboard
          </NavLink>
          <NavLink 
            to="/staff/incidents"
            style={({isActive}) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isActive ? 'var(--glass-bg)' : 'transparent',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 400
            })}
          >
            <AlertTriangle size={20} /> Incidents
          </NavLink>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <NavLink to="/login" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <LogOut size={16} /> Exit Dashboard
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
