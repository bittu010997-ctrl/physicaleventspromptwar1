import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Search, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TicketScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [manualSeat, setManualSeat] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processTicket = (source: 'image' | 'manual') => {
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      setScannedResult(source === 'manual' ? manualSeat : 'Section 104, Row G, Seat 12');
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processTicket('image');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualSeat.trim()) {
      processTicket('manual');
    }
  };

  const navigateToWayfinding = () => {
    // Navigate with the parsed seat in state
    navigate('/app/wayfinding', { state: { autoShowSeatNav: true, seatLocation: scannedResult } });
  };

  return (
    <div className="page-container" style={{ padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Find Your Seat</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Upload your ticket image or enter your seat details manually.</p>
        </div>

        {/* Option 1: File Upload */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-panel"
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          style={{
            padding: '3rem 2rem',
            border: '2px dashed var(--accent-primary)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            textAlign: 'center',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            gap: '1rem'
          }}
        >
          {isProcessing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Camera size={48} style={{ color: 'var(--accent-primary)' }} />
            </motion.div>
          ) : scannedResult ? (
            <CheckCircle2 size={48} style={{ color: 'var(--status-success)' }} />
          ) : (
            <Upload size={48} style={{ color: 'var(--accent-primary)' }} />
          )}
          
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
              {isProcessing ? 'Analyzing Ticket...' : scannedResult ? 'Ticket Scanned!' : 'Scan or Upload Ticket'}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isProcessing ? 'Extracting seat information...' : scannedResult ? `Found: ${scannedResult}` : 'Tap to upload an image of your ticket'}
            </p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload}
          />
        </motion.div>

        {!scannedResult && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }} />
          </div>
        )}

        {/* Option 2: Manual Entry */}
        {!scannedResult && (
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={20} className="gradient-text"/> Enter Manually
            </h3>
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="e.g. Sec 104, Row G, Seat 12 or Ticket ID" 
                value={manualSeat}
                onChange={(e) => setManualSeat(e.target.value)}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                disabled={!manualSeat.trim() || isProcessing}
                style={{
                  padding: '0 1.5rem',
                  backgroundColor: 'var(--accent-glow)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--accent-primary)',
                  borderRadius: 'var(--radius-md)',
                  cursor: (!manualSeat.trim() || isProcessing) ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)'
                }}
              >
                Find
              </button>
            </form>
          </div>
        )}

        {scannedResult && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={navigateToWayfinding}
            className="pulse"
            style={{
              padding: '1.25rem',
              width: '100%',
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1rem'
            }}
          >
            Navigate to Seat
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default TicketScanPage;
