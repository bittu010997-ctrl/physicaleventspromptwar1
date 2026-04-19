import React, { useState } from 'react';
import { Users, AlertTriangle, Battery, Wifi, Map, Activity, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const recommendedDeployments = [
  { id: 'dep-1', zone: 'Zone C (Gate 3)', capacity: 95, status: 'critical', recommendedTeam: 'Team Alpha', timeToReach: '2 mins' },
  { id: 'dep-2', zone: 'Concourse A', capacity: 82, status: 'warning', recommendedTeam: 'Security Team B', timeToReach: '4 mins' },
  { id: 'dep-3', zone: 'Section 114 Restrooms', capacity: 75, status: 'warning', recommendedTeam: 'Team Delta', timeToReach: '3 mins' }
];

const DashboardPage: React.FC = () => {
  const [deployments, setDeployments] = useState(recommendedDeployments);

  const dispatchTeam = (id: string) => {
    setDeployments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Operations Overview</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Real-time stadium metrics and active alerts.</p>
        </div>
        <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--status-green)', boxShadow: '0 0 8px var(--status-green)' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>System Normal</span>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { icon: <Users />, label: 'Current Attendance', value: '42,109', sub: '85% Capacity', color: 'var(--accent-primary)' },
          { icon: <AlertTriangle />, label: 'Active Incidents', value: '3', sub: '2 Medical, 1 Security', color: 'var(--status-amber)' },
          { icon: <Battery />, label: 'IoT Sensor Health', value: '99.8%', sub: 'Online', color: 'var(--status-green)' },
          { icon: <Wifi />, label: 'Network Load', value: '64%', sub: 'Stable', color: 'var(--status-info)' },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel" 
            style={{ padding: '1.5rem', borderLeft: `4px solid ${kpi.color}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)', color: kpi.color }}>
                {kpi.icon}
              </div>
            </div>
            <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{kpi.value}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{kpi.label}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{kpi.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Layout: Heatmap & Deployment */}
      <div style={{ display: 'grid', gridTemplateColumns: 'revert', gridAutoColumns: '1fr', gridAutoFlow: 'column', gap: '1.5rem', flex: 1, minHeight: '400px' }}>
        
        {/* Map Area */}
        <div className="glass-panel" style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map size={20} color="var(--accent-primary)" />
            <h3 style={{ margin: 0 }}>Live Stadium Heatmap</h3>
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Placeholder Map Vector */}
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 200, height: 200 }}>
                {/* Simulated Heatmap Blips */}
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', top: '20%', left: '30%', width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--status-red)', filter: 'blur(10px)' }} />
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ repeat: Infinity, duration: 3 }} style={{ position: 'absolute', bottom: '30%', right: '20%', width: 60, height: 60, borderRadius: '50%', backgroundColor: 'var(--status-amber)', filter: 'blur(15px)' }} />
                
                <div style={{ width: '100%', height: '100%', border: '2px dashed var(--glass-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, var(--glass-bg), transparent)' }}>
                  <span style={{color: 'var(--status-amber)', zIndex: 1}}>Stadium Layout</span>
                </div>
              </div>
              <p style={{ marginTop: '1rem' }}>Map Integration Active</p>
            </div>
          </div>
        </div>

        {/* Hotspots & Deployments Area */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--status-red)" />
            <h3 style={{ margin: 0 }}>Crowd Hotspots & Deployment</h3>
          </div>
          
          <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
              {deployments.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Users size={24} color="var(--status-green)" />
                  </div>
                  Crowd distributed evenly. No urgent deployments needed.
                </motion.div>
              )}
              
              {deployments.map((dep, index) => (
                <motion.div 
                  key={dep.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ 
                    padding: '1rem', 
                    backgroundColor: 'var(--bg-tertiary)', 
                    borderRadius: 'var(--radius-md)', 
                    borderLeft: `3px solid ${dep.status === 'critical' ? 'var(--status-red)' : 'var(--status-amber)'}` 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} color={dep.status === 'critical' ? 'var(--status-red)' : 'var(--status-amber)'} />
                      {dep.zone}
                    </h4>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: dep.status === 'critical' ? 'var(--status-red)' : 'var(--status-amber)' }}>
                      {dep.capacity}% Cap.
                    </span>
                  </div>
                  
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Nearest Available Unit:</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{dep.recommendedTeam}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ETA {dep.timeToReach}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => dispatchTeam(dep.id)}
                    style={{ 
                      width: '100%', padding: '0.5rem', 
                      backgroundColor: 'var(--glass-bg)', 
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--glass-bg)'}
                  >
                    Deploy Team
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
