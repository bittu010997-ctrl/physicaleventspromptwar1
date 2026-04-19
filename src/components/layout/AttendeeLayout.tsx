import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Map, MessageSquare, LogOut, Ticket } from 'lucide-react';

const AttendeeLayout: React.FC = () => {
  return (
    <div className="page-container">
      <header style={{ 
        height: '60px', 
        borderBottom: '1px solid var(--glass-border)', 
        backgroundColor: 'var(--bg-secondary)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 1.5rem' 
      }}>
        <div style={{ fontWeight: 800, fontSize: '1.2rem' }} className="gradient-text">StadiumIQ Fan</div>
        <NavLink to="/login" style={{ color: 'var(--text-muted)' }}>
          <LogOut size={20} />
        </NavLink>
      </header>

      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav style={{ 
        height: '70px', 
        backgroundColor: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        <NavLink 
          to="/app/heatmap" 
          style={({isActive}) => ({ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' 
          })}
        >
          <Map size={24} />
          <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Map</span>
        </NavLink>
        <NavLink 
          to="/app/ticket-scan" 
          style={({isActive}) => ({ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' 
          })}
        >
          <Ticket size={24} />
          <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Ticket</span>
        </NavLink>
        <NavLink 
          to="/app/wayfinding" 
          style={({isActive}) => ({ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' 
          })}
        >
          <MessageSquare size={24} />
          <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Assistant</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AttendeeLayout;
