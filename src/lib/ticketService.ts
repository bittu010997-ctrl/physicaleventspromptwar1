export type Gate = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  baseWaitTime: number; // in minutes
  type: 'general' | 'vip' | 'staff';
};

export type TicketProfile = {
  uid: string;
  name: string;
  section: string;
  row: string;
  seat: string;
  level: string;
  validGates: string[]; // List of gate IDs that technically work
  currentLocation: { lat: number; lng: number };
};

// Generic coordinates for a stadium (approx Downtown LA for routing purposes)
export const STADIUM_GATES: Record<string, Gate> = {
  'gate-a': { id: 'gate-a', name: 'Main Gate A', location: { lat: 34.0410, lng: -118.2670 }, baseWaitTime: 12, type: 'general' },
  'gate-b': { id: 'gate-b', name: 'East Gate B', location: { lat: 34.0415, lng: -118.2655 }, baseWaitTime: 5, type: 'general' },
  'gate-c': { id: 'gate-c', name: 'Upper Deck Gate C', location: { lat: 34.0425, lng: -118.2660 }, baseWaitTime: 4, type: 'general' },
  'gate-vip': { id: 'gate-vip', name: 'VIP Entrance', location: { lat: 34.0405, lng: -118.2665 }, baseWaitTime: 1, type: 'vip' },
};

// Start locations scattered around the stadium to simulate walking
export const MOCK_USERS: TicketProfile[] = [
  {
    uid: 'user-1',
    name: 'General Fan',
    section: '114',
    row: 'F',
    seat: '12',
    level: '100 Level Concourse',
    validGates: ['gate-a', 'gate-b'],
    currentLocation: { lat: 34.0390, lng: -118.2690 } // Approaching from southwest
  },
  {
    uid: 'user-2',
    name: 'Upper Deck Fan',
    section: '320',
    row: 'A',
    seat: '1',
    level: '300 Level Escalators',
    validGates: ['gate-c', 'gate-b'],
    currentLocation: { lat: 34.0435, lng: -118.2640 } // Approaching from northeast
  },
  {
    uid: 'user-3',
    name: 'VIP Floor Guest',
    section: 'FLR-1',
    row: '1',
    seat: 'A',
    level: 'Floor / Field Level',
    validGates: ['gate-vip', 'gate-a'],
    currentLocation: { lat: 34.0395, lng: -118.2650 } // Approaching from south
  }
];

export const ticketService = {
  async getTicket(uid: string): Promise<TicketProfile | null> {
    // In production, this reads from Firebase doc(db, 'users', uid). 
    // For rigorous testing as requested, we return our mock dictionary.
    const user = MOCK_USERS.find(u => u.uid === uid);
    return user || null;
  },

  // Simulates pulling real-time crowd density specifically for gates
  async getLiveGateWaits(): Promise<Record<string, number>> {
    // Returns base wait time + random noise to simulate fluctuating crowds
    const live: Record<string, number> = {};
    for (const [id, gate] of Object.entries(STADIUM_GATES)) {
      live[id] = Math.max(0, gate.baseWaitTime + Math.floor(Math.random() * 6 - 2)); 
    }
    return live;
  }
};
