import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Incident } from '../data/mockData'
import { useCommandStore } from '../store/useCommandStore'
import '../styles/live-alerts.css'

interface LiveAlertsProps {
  selectedIncident?: Incident
  onSelectIncident?: (incident: Incident) => void
}

export default function LiveAlerts({ selectedIncident, onSelectIncident }: LiveAlertsProps) {
  const incidents = useCommandStore((state) => state.incidents)
  const setIncidentModalOpen = useCommandStore((state) => state.setIncidentModalOpen)
  const [activeTab, setActiveTab] = useState('ALL')

  const tabs = ['ALL (12)', 'CRITICAL (8)', 'HIGH (15)', 'MEDIUM (24)', 'LOW (12)']

  const filteredIncidents = incidents.filter((inc) => {
    if (activeTab === 'ALL') return true
    return inc.severity === activeTab
  })

  const handleSelect = (inc: Incident) => {
    if (onSelectIncident) onSelectIncident(inc)
  }

  const handleView = (e: React.MouseEvent, inc: Incident) => {
    e.stopPropagation()
    if (onSelectIncident) onSelectIncident(inc)
    setIncidentModalOpen(true)
  }

  return (
    <div className="live-alerts">
      <div className="section-header">
        <h3>Live Calls</h3>
        <a href="#calls" className="view-all">View All →</a>
      </div>

      <div className="alerts-tabs">
        {tabs.map((tab) => {
          const tabName = tab.split(' ')[0]
          return (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tabName ? 'active' : ''}`}
              onClick={() => setActiveTab(tabName)}
            >
              {tab}
            </button>
          )
        })}
      </div>

      <div className="alerts-table-container">
        <div className="table-header">
          <div className="col-time">TIME</div>
          <div className="col-location">LOCATION</div>
          <div className="col-priority">PRIORITY</div>
          <div className="col-status">STATUS</div>
          <div className="col-actions">ACTION</div>
        </div>

        <div className="table-body">
          {filteredIncidents.map((inc) => {
            const isSelected = selectedIncident && selectedIncident.id === inc.id
            return (
              <div
                key={inc.id}
                className={`table-row row-${inc.severity.toLowerCase()} ${isSelected ? 'selected-row' : ''}`}
                onClick={() => handleSelect(inc)}
              >
                <div className="col-time">{inc.createdAt}</div>
                <div className="col-location">{inc.location}</div>
                <div className="col-priority">
                  <span className={`status-badge badge-${inc.severity.toLowerCase()}`}>
                    {inc.severity}
                  </span>
                </div>
                <div className="col-status">
                  <span className={`status-badge status-${inc.status.toLowerCase().replace(/_/g, '-')}`}>
                    {inc.status}
                  </span>
                </div>
                <div className="col-actions">
                  <button
                    className="view-btn"
                    onClick={(e) => handleView(e, inc)}
                    title="View Call & Incident Details"
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
