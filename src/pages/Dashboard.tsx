import StatisticsCards from '../components/StatisticsCards'
import MapContainer from '../components/MapContainer'
import IncidentDetailsPanel from '../components/IncidentDetailsPanel'
import RecentIncidents from '../components/RecentIncidents'
import LiveAlerts from '../components/LiveAlerts'
import { useCommandStore } from '../store/useCommandStore'
import '../styles/dashboard.css'

export default function Dashboard() {
  const selectedIncident = useCommandStore((state) => state.selectedIncident)
  const setSelectedIncident = useCommandStore((state) => state.setSelectedIncident)

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <StatisticsCards />
      </div>

      <div className="dashboard-middle">
        <div className="map-section">
          <MapContainer
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
          />
        </div>
        <aside className="incident-panel-wrapper">
          <IncidentDetailsPanel incident={selectedIncident} />
        </aside>
      </div>

      <div className="dashboard-bottom">
        <RecentIncidents
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
        />
        <LiveAlerts
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
        />
      </div>
    </div>
  )
}
