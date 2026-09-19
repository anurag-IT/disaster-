import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import IncidentDetailModal from './components/IncidentDetailModal'
import AdminAlertModal from './components/AdminAlertModal'

import Dashboard from './pages/Dashboard'
import LiveIncidents from './pages/LiveIncidents'
import EmergencyAlerts from './pages/EmergencyAlerts'
import MapView from './pages/MapView'
import RiskZones from './pages/RiskZones'
import Calls from './pages/Calls'
import PoliceUnits from './pages/PoliceUnits'
import TeamsResources from './pages/TeamsResources'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents" element={<LiveIncidents />} />
          <Route path="/live-incidents" element={<LiveIncidents />} />
          <Route path="/alerts" element={<EmergencyAlerts />} />
          <Route path="/emergency-alerts" element={<EmergencyAlerts />} />
          <Route path="/admin" element={<EmergencyAlerts />} />
          <Route path="/admin-command" element={<EmergencyAlerts />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/risk-zones" element={<RiskZones />} />
          <Route path="/riskzones" element={<RiskZones />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/emergency-calls" element={<Calls />} />
          <Route path="/units" element={<PoliceUnits />} />
          <Route path="/police" element={<PoliceUnits />} />
          <Route path="/police-units" element={<PoliceUnits />} />
          <Route path="/resources" element={<TeamsResources />} />
          <Route path="/teams-resources" element={<TeamsResources />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          {/* Wildcard Fallback Route to prevent blank screens */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* Global Modals */}
        <IncidentDetailModal />
        <AdminAlertModal />
      </Layout>
    </Router>
  )
}
