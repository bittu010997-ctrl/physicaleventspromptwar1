import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import StaffLoginPage from './pages/auth/StaffLoginPage';
import AttendeeLayout from './components/layout/AttendeeLayout';
import StaffLayout from './components/layout/StaffLayout';
import HeatmapPage from './pages/attendee/HeatmapPage';
import TicketScanPage from './pages/attendee/TicketScanPage';
import WayfindingPage from './pages/attendee/WayfindingPage';
import DashboardPage from './pages/staff/DashboardPage';
import IncidentsPage from './pages/staff/IncidentsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/staff-login" element={<StaffLoginPage />} />
        
        {/* Attendee App Routes */}
        <Route path="/app" element={<AttendeeLayout />}>
          <Route index element={<Navigate to="/app/heatmap" replace />} />
          <Route path="heatmap" element={<HeatmapPage />} />
          <Route path="ticket-scan" element={<TicketScanPage />} />
          <Route path="wayfinding" element={<WayfindingPage />} />
        </Route>

        {/* Staff Dashboard Routes */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
