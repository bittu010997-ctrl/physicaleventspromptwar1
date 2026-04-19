import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Plus, CheckCircle2, Clock, X, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type Incident = {
  id: string;
  type: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved';
  timestamp: Date;
  assignee?: string;
};

const mockIncidents: Incident[] = [
  { id: 'INC-001', type: 'Medical Emergency', location: 'Section 114, Row F', severity: 'high', status: 'active', timestamp: new Date(Date.now() - 1000 * 60 * 5), assignee: 'Med Team 1' },
  { id: 'INC-002', type: 'Spill / Hazard', location: 'Concourse C Near Gate 3', severity: 'low', status: 'active', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 'INC-003', type: 'Crowd Control', location: 'Gate A Entrance', severity: 'medium', status: 'resolved', timestamp: new Date(Date.now() - 1000 * 60 * 45), assignee: 'Security Team B' },
];

const availableTeams = [
  { id: 't2', name: 'Med Team 1', zone: 'Section 100s' },
  { id: 't3', name: 'Security Team A', zone: 'Concourse A' },
  { id: 't4', name: 'Security Team B', zone: 'Gate A' },
  { id: 't1', name: 'Team Alpha', zone: 'Roaming (Center)' }
];

const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Incident Form State
  const [newType, setNewType] = useState('Crowd Control');
  const [newLocation, setNewLocation] = useState('');
  const [newSeverity, setNewSeverity] = useState<'high' | 'medium' | 'low'>('medium');
  const [newAssignee, setNewAssignee] = useState('');

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'high': return 'var(--status-red)';
      case 'medium': return 'var(--status-amber)';
      case 'low': return 'var(--status-info)';
      default: return 'var(--text-muted)';
    }
  };

  const markResolved = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'resolved' } : inc));
  };

  const suggestTeam = (locationStr: string) => {
    if (!locationStr) return null;
    const lower = locationStr.toLowerCase();
    if (lower.includes('gate a') || lower.includes('concourse a')) return 'Security Team A';
    if (lower.includes('section 1')) return 'Med Team 1';
    return 'Team Alpha'; // Default roaming
  };

  const handleLocationChange = (val: string) => {
    setNewLocation(val);
    const suggestion = suggestTeam(val);
    if (suggestion) {
      setNewAssignee(suggestion);
    } else {
      setNewAssignee('');
    }
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const newInc: Incident = {
      id: `INC-00${incidents.length + 1}`,
      type: newType,
      location: newLocation,
      severity: newSeverity,
      status: 'active',
      timestamp: new Date(),
      assignee: newAssignee || undefined
    };
    setIncidents([newInc, ...incidents]);
    
    // Reset Form
    setIsModalOpen(false);
    setNewLocation('');
    setNewType('Crowd Control');
    setNewSeverity('medium');
    setNewAssignee('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Incident Feed</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Manage and dispatch operations teams.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            padding: '0.75rem 1.5rem', backgroundColor: 'var(--accent-primary)', 
            color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600,
            border: 'none', cursor: 'pointer', transition: 'var(--transition-fast)'
          }}
        >
          <Plus size={20} /> New Incident
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {incidents.map((incident) => (
            <motion.div 
              key={incident.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel"
              style={{ 
                padding: '1.5rem', 
                borderLeft: `4px solid ${incident.status === 'resolved' ? 'var(--status-green)' : getSeverityColor(incident.severity)}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: incident.status === 'resolved' ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 'var(--radius-md)', 
                  backgroundColor: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: incident.status === 'resolved' ? 'var(--status-green)' : getSeverityColor(incident.severity)
                }}>
                  {incident.status === 'resolved' ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
                </div>
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{incident.type}</h3>
                    <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>
                      {incident.id}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>{incident.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} /> 
                      {formatDistanceToNow(incident.timestamp, { addSuffix: true })}
                    </span>
                    {incident.assignee && (
                      <span style={{ color: 'var(--accent-primary)' }}>Assigned: {incident.assignee}</span>
                    )}
                  </div>
                </div>
              </div>

              {incident.status === 'active' && (
                <button 
                  onClick={() => markResolved(incident.id)}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Resolve
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* New Incident Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert color="var(--status-amber)" /> Report Incident
                </h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateIncident} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Incident Type</label>
                  <select 
                    value={newType} onChange={(e) => setNewType(e.target.value)} required
                    style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="Crowd Control">Crowd Control / Congestion</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Security Disturbance">Security Disturbance</option>
                    <option value="Spill / Hazard">Spill / Hazard</option>
                    <option value="Maintenance Issue">Maintenance Issue</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Location</label>
                  <input 
                    type="text" value={newLocation} onChange={(e) => handleLocationChange(e.target.value)} required
                    placeholder="e.g. Gate A Entrance"
                    style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Severity</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {['low', 'medium', 'high'].map(sev => (
                      <label key={sev} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', backgroundColor: newSeverity === sev ? 'var(--glass-bg)' : 'transparent', border: `1px solid ${newSeverity === sev ? getSeverityColor(sev) : 'var(--glass-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition-fast)' }}>
                        <input type="radio" value={sev} checked={newSeverity === sev} onChange={(e) => setNewSeverity(e.target.value as any)} style={{ display: 'none' }} />
                        <span style={{ textTransform: 'capitalize', color: newSeverity === sev ? getSeverityColor(sev) : 'var(--text-secondary)', fontWeight: newSeverity === sev ? 600 : 400 }}>{sev}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Recommended Dispatch Team</span>
                  </div>
                  <select 
                    value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="">-- Leave Unassigned --</option>
                    {availableTeams.map(team => (
                      <option key={team.id} value={team.name}>{team.name} ({team.zone})</option>
                    ))}
                  </select>
                  {newAssignee && newLocation && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--status-green)', marginTop: '0.5rem' }}>
                      ✓ {newAssignee} auto-selected for proximity to {newLocation}.
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--accent-primary)', border: 'none', color: '#fff', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>Create Incident</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IncidentsPage;
