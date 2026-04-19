import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Clock, Bell, Map as MapIcon, ArrowRight, ShieldAlert, Footprints } from 'lucide-react';
import { ticketService, STADIUM_GATES } from '../../lib/ticketService';
import type { TicketProfile } from '../../lib/ticketService';
import GateComparison from './GateComparison';

const mapContainerStyle = {
  width: '100%',
  height: '250px',
  borderRadius: '12px'
};

const center = {
  lat: 34.0415,
  lng: -118.2660
};

export type RouteGoal = {
  type: 'seat' | 'restroom' | 'food';
  name: string;
  lat: number;
  lng: number;
  crowdWaitMins: number;
  walkTimeMins: number;
  reason?: string;
};

export const DynamicNavigationCard: React.FC<{ uid: string, goal?: RouteGoal }> = ({ uid, goal }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY || "dummy_key_to_enforce_no_crash",
  });

  const [ticket, setTicket] = useState<TicketProfile | null>(null);
  const [liveWaits, setLiveWaits] = useState<Record<string, number>>({});
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [recommendedGateId, setRecommendedGateId] = useState<string>('');
  
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [walkingDistanceText, setWalkingDistanceText] = useState('Calculating...');
  
  const [alert, setAlert] = useState<{title: string, message: string} | null>(null);

  useEffect(() => {
    const init = async () => {
      const data = await ticketService.getTicket(uid);
      if (data) {
        setTicket(data);
        setUserLocation(data.currentLocation);
        const waits = await ticketService.getLiveGateWaits();
        setLiveWaits(waits);
        
        let bestGate = data.validGates[0];
        let bestScore = Infinity;
        data.validGates.forEach(gid => {
          if ((waits[gid] || 0) < bestScore) {
            bestScore = waits[gid] || 0;
            bestGate = gid;
          }
        });
        setRecommendedGateId(bestGate);
      }
    };
    init();
  }, [uid]);

  useEffect(() => {
    if (isLoaded && userLocation) {
      if (!window.google) return; 

      const dest = goal && goal.type !== 'seat' 
        ? { lat: goal.lat, lng: goal.lng }
        : (recommendedGateId ? STADIUM_GATES[recommendedGateId].location : center);

      const ds = new window.google.maps.DirectionsService();
      ds.route({
        origin: userLocation,
        destination: dest,
        travelMode: window.google.maps.TravelMode.WALKING
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          if (result.routes[0]?.legs[0]?.duration?.text) {
            setWalkingDistanceText(result.routes[0].legs[0].duration.text);
          }
        } else {
          setWalkingDistanceText(goal ? `Approx. ${goal.walkTimeMins} mins` : "Approx. 5 mins");
        }
      });
    }
  }, [isLoaded, userLocation, recommendedGateId, goal]);

  if (loadError) return <div className="glass-panel" style={{ padding: '2rem' }}>Cannot load map.</div>;
  if (!ticket) return null;

  const isCustomGoal = goal && goal.type !== 'seat';
  const waitTime = isCustomGoal ? goal.crowdWaitMins : (liveWaits[recommendedGateId] || 0);
  const destinationName = isCustomGoal ? goal.name : STADIUM_GATES[recommendedGateId]?.name;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--accent-primary)', boxShadow: '0 0 20px rgba(14, 165, 233, 0.1)' }}>
      
      {/* Route Rationale Header if applicable */}
      {isCustomGoal && goal.reason && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px dashed var(--status-green)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-green)', fontWeight: 600, marginBottom: '0.25rem' }}>
            <Footprints size={18} /> Optimal Route Chosen
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {goal.reason}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 className="gradient-text" style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={24} /> {isCustomGoal ? `Navigating to ${goal.type}` : 'Get to My Seat'}
          </h3>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {isCustomGoal ? `Heading to ${destinationName}` : `Routing for Section ${ticket.section}, Row ${ticket.row}`}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Destination</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{destinationName}</span>
        </div>

        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Queue / Wait Time</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 600, color: waitTime < 5 ? 'var(--status-green)' : waitTime < 15 ? 'var(--status-amber)' : 'var(--status-red)' }}>
              {waitTime} minutes
            </span>
          </div>
          <Clock size={24} color="var(--text-muted)" />
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={16}
            center={destLocation(goal, recommendedGateId)}
            options={{ disableDefaultUI: true, styles: [ { elementType: "geometry", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] } ] }}
          >
            {directions && <DirectionsRenderer directions={directions} options={{ polylineOptions: { strokeColor: "#0ea5e9", strokeWeight: 5 } }}/>}
          </GoogleMap>
        ) : (
          <div style={{ ...mapContainerStyle, backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Map Loading...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '1rem' }}>Step-by-Step</h4>
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <MapIcon size={20} color="var(--text-muted)" />
          <span>Walk {walkingDistanceText} to <strong>{destinationName}</strong>.</span>
        </div>
        {!isCustomGoal && (
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ArrowRight size={20} color="var(--accent-primary)" />
            <span>After clearing security, proceed to <strong>{ticket.level}</strong>.</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper for map centering
function destLocation(goal: RouteGoal | undefined, gateId: string) {
  if (goal && goal.type !== 'seat') {
    return { lat: goal.lat, lng: goal.lng };
  }
  return STADIUM_GATES[gateId]?.location || center;
}

export default DynamicNavigationCard;
