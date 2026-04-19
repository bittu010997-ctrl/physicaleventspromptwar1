import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, UserCircle } from 'lucide-react';
import { DynamicNavigationCard } from '../../components/attendee/DynamicNavigationCard';

const HeatmapPage: React.FC = () => {
  const [activeUid, setActiveUid] = useState('user-1'); // Default to General Fan

  const [zones, setZones] = useState([
    { id: 'gate-a', name: 'Gate A Entrance', density: 85, waitTime: 14, status: 'red' },
    { id: 'gate-c', name: 'Gate C Entrance', density: 40, waitTime: 2, status: 'green' },
    { id: 'conc-1', name: 'Concession 114', density: 65, waitTime: 8, status: 'amber' },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => ({
        ...zone,
        density: Math.min(100, Math.max(0, zone.density + (Math.random() * 10 - 5))),
        waitTime: Math.max(0, zone.waitTime + Math.floor(Math.random() * 3 - 1))
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'red': return 'var(--status-red)';
      case 'amber': return 'var(--status-amber)';
      case 'green': return 'var(--status-green)';
      default: return 'var(--status-info)';
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem', overflowY: 'auto' }}>
      {/* Dev UI: User Switcher for strict testing */}
      <div className="glass-panel" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto', border: '1px dashed var(--accent-primary)' }}>
        <UserCircle size={20} color="var(--accent-primary)" />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Test User Profile:</span>
        <select 
          value={activeUid} 
          onChange={(e) => setActiveUid(e.target.value)}
          style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
        >
          <option value="user-1">User 1 - Section 114 (Gen Gate)</option>
          <option value="user-2">User 2 - Section 320 (Upper Gate)</option>
          <option value="user-3">User 3 - Section FLR-1 (VIP Gate)</option>
        </select>
      </div>

      {/* Smart Seating Element */}
      <DynamicNavigationCard uid={activeUid} />

      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--status-green)', boxShadow: '0 0 8px var(--status-green)' }}></div>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Live Crowd Sensors Active · Updated Just Now</span>
      </div>

      <div style={{ minHeight: '300px', flex: 1, position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
        {/* Placeholder for Google Maps */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"20\\" height=\\"20\\" viewBox=\\"0 0 20 20\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cg fill=\\"%239C92AC\\" fill-opacity=\\"0.4\\" fill-rule=\\"evenodd\\"%3E%3Ccircle cx=\\"3\\" cy=\\"3\\" r=\\"3\\"/>%3Ccircle cx=\\"13\\" cy=\\"13\\" r=\\"3\\"/>%3C/g%3E%3C/svg%3E")' }}>
          <MapPin size={100} color="var(--text-muted)" />
        </div>

        {/* Mock Data Overlay */}
        <div style={{ position: 'absolute', inset: 0, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', pointerEvents: 'none' }}>
          {zones.map((zone) => (
            <motion.div 
              key={zone.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel"
              style={{
                padding: '1rem',
                borderLeft: `4px solid ${getStatusColor(zone.status)}`,
                backdropFilter: 'blur(16px)',
                width: '100%',
                maxWidth: '350px',
                pointerEvents: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{zone.name}</h3>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: getStatusColor(zone.status) }}>
                  {Math.round(zone.density)}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Clock size={16} /> <span>{zone.waitTime} min wait preview</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;
