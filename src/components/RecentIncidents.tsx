import { AlertTriangle, AlertCircle, CheckCircle, AlertOctagon, Eye } from 'lucide-react'
import { Incident } from '../data/mockData'
import { useCommandStore } from '../store/useCommandStore'
import '../styles/recent-incidents.css'

interface RecentIncidentsProps {
  selectedIncident?: Incident
  onSelectIncident?: (incident: Incident) => void
}

export default function RecentIncidents({ selectedIncident, onSelectIncident }: RecentIncidentsProps) {
  const incidents = useCommandStore((state) => state.incidents)
  const setIncidentModalOpen = useCommandStore((state) => state.setIncidentModalOpen)

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return <AlertOctagon size={14} />
      case 'HIGH': return <AlertTriangle size={14} />
      case 'MEDIUM': return <AlertCircle size={14} />
      default: return <CheckCircle size={14} />
    }
  }

  const handleSelect = (inc: Incident) => {
    if (onSelectIncident) onSelectIncident(inc)
  }

  const handleView = (e: React.MouseEvent, inc: Incident) => {
    e.stopPropagation()
    if (onSelectIncident) onSelectIncident(inc)
    setIncidentModalOpen(true)
  }

  return (
    <div className="recent-incidents">
      <div className="section-header">
        <h3>Recent Incidents</h3>
        <a href="#incidents" className="view-all">View All →</a>
      </div>

      <div className="incidents-table-container">
        <div className="table-header">
          <div className="col-priority">PRIORITY</div>
          <div className="col-id">ID</div>
          <div className="col-type">TYPE</div>
          <div className="col-location">LOCATION</div>
          <div className="col-time">TIME</div>
          <div className="col-score">SCORE</div>
          <div className="col-actions">ACTION</div>
        </div>

        <div className="table-body">
          {incidents.map((inc) => {
            const isSelected = selectedIncident && selectedIncident.id === inc.id
            return (
              <div
                key={inc.id}
                className={`table-row row-${inc.severity.toLowerCase()} ${isSelected ? 'selected-row' : ''}`}
                onClick={() => handleSelect(inc)}
              >
                <div className="col-priority">
                  <span className={`priority-badge badge-${inc.severity.toLowerCase()}`}>
                    {getPriorityIcon(inc.severity)}
                    {inc.severity}
                  </span>
                </div>
                <div className="col-id">#{inc.id}</div>
                <div className="col-type">Incident</div>
                <div className="col-location">{inc.location}</div>
                <div className="col-time">{inc.reportedAgo}</div>
                <div className="col-score">{inc.priority}/100</div>
                <div className="col-actions">
                  <button
                    className="view-btn"
                    onClick={(e) => handleView(e, inc)}
                    title="View Incident Details"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
