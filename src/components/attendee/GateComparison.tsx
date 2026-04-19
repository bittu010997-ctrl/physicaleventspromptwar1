import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Navigation } from 'lucide-react';
import { STADIUM_GATES } from '../../lib/ticketService';

type GateComparisonProps = {
  gateIds: string[];
  liveWaits: Record<string, number>;
  recommendedGateId: string;
  onClose: () => void;
  onSelectOverride: (id: string) => void;
};

const GateComparison: React.FC<GateComparisonProps> = ({ gateIds, liveWaits, recommendedGateId, onClose, onSelectOverride }) => {
  
  const getWaitColor = (wait: number) => {
    if (wait < 5) return 'var(--status-green)';
    if (wait <= 15) return 'var(--status-amber)';
    return 'var(--status-red)';
  };

  const getWaitWidth = (wait: number) => {
    const max = 30; // Max visual wait scale
    return `${Math.min(100, (wait / max) * 100)}%`;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, 
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}
      >
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
          <h3 style={{ margin: 0 }}>Gate Comparison</h3>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
            We dynamically recommend gates based on total walking distance + queue wait time, but you can override our routing.
          </p>

          {gateIds.map(id => {
            const gate = STADIUM_GATES[id];
            const wait = liveWaits[id] || 0;
            const isRecommended = id === recommendedGateId;

            return (
              <div 
                key={id} 
                onClick={() => onSelectOverride(id)}
                style={{ 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: isRecommended ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                  backgroundColor: 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isRecommended && (
                  <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'var(--accent-primary)', fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderBottomLeftRadius: 'var(--radius-md)', fontWeight: 'bold' }}>
                    RECOMMENDED
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600 }}>{gate.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: getWaitColor(wait), fontWeight: 'bold', fontSize: '1.1rem' }}>
                    <Clock size={16} /> {wait} min
                  </span>
                </div>
                
                {/* Visual Bar */}
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--glass-bg)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: getWaitWidth(wait) }}
                    style={{ height: '100%', backgroundColor: getWaitColor(wait) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default GateComparison;
