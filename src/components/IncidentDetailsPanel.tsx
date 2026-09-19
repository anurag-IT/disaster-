import { MapPin, Users, Activity, Utensils, Droplets, Shield, ExternalLink, AlertCircle, Phone } from 'lucide-react'
import { Incident, INITIAL_INCIDENTS } from '../data/mockData'
import { useCommandStore } from '../store/useCommandStore'
import '../styles/incident-details.css'

interface IncidentDetailsPanelProps {
  incident?: Incident
}

export default function IncidentDetailsPanel({ incident }: IncidentDetailsPanelProps) {
  const storeIncident = useCommandStore((state) => state.selectedIncident)
  const setIncidentModalOpen = useCommandStore((state) => state.setIncidentModalOpen)
  const currentIncident = incident || storeIncident || INITIAL_INCIDENTS[0]

  return (
    <div className="incident-panel">
      {/* Top Header */}
      <div className="panel-header">
        <h2 className="panel-title">Next 6 Hours</h2>
        <span className={`priority-tag tag-${currentIncident.severity.toLowerCase()}`}>
          {currentIncident.severity}
        </span>
      </div>

      <div className="panel-body-content">
        {/* Main Incident Card */}
        <div className="incident-main-card">
          <div className="incident-id-row">
            <div className="alert-circle-icon">
              <AlertCircle size={24} />
            </div>
            <div className="id-group">
              <span className="incident-id-text">Incident #{currentIncident.id}</span>
              <span className="reported-text">Reported • {currentIncident.reportedAgo} <Phone size={12} className="inline-phone" /></span>
            </div>
          </div>

          <h3 className="incident-headline">{currentIncident.title}</h3>

          <div className="location-row">
            <MapPin size={14} className="loc-icon" />
            <span className="loc-name">{currentIncident.location}</span>
          </div>
          <div className="coords-row">
            <span className="coords-text">{currentIncident.coordinates[0]}° N, {currentIncident.coordinates[1]}° E</span>
            <a
              href={`https://www.google.com/maps?q=${currentIncident.coordinates[0]},${currentIncident.coordinates[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="open-maps-link"
            >
              <ExternalLink size={12} /> Open in Maps
            </a>
          </div>
        </div>

        {/* Warning Callout Box */}
        <div className="warning-callout-box">
          <div className="warning-icon-col">
            <AlertCircle size={20} />
          </div>
          <p className="warning-text">
            {currentIncident.aiSummary}
          </p>
        </div>

        {/* Key Information */}
        <div className="incident-section">
          <h4 className="section-subtitle">Key Information</h4>
          <div className="key-info-list">
            <div className="key-info-item">
              <div className="item-label-group"><Users size={15} /><span>People</span></div>
              <span className="item-value">{currentIncident.people}</span>
            </div>
            <div className="key-info-item">
              <div className="item-label-group"><Users size={15} /><span>Elderly</span></div>
              <span className="item-value">{currentIncident.elderly}</span>
            </div>
            <div className="key-info-item">
              <div className="item-label-group"><Users size={15} /><span>Children</span></div>
              <span className="item-value">{currentIncident.children}</span>
            </div>
            <div className="key-info-item">
              <div className="item-label-group"><Activity size={15} /><span>Injuries</span></div>
              <span className="item-value">{currentIncident.injuries}</span>
            </div>
            <div className="key-info-item">
              <div className="item-label-group"><Utensils size={15} /><span>Food Availability</span></div>
              <span className="item-value">{currentIncident.food}</span>
            </div>
            <div className="key-info-item">
              <div className="item-label-group"><Droplets size={15} /><span>Drinking Water</span></div>
              <span className={`item-value ${currentIncident.water.toLowerCase() === 'critical' ? 'critical-value' : ''}`}>
                {currentIncident.water}
              </span>
            </div>
            {currentIncident.otherNeeds && (
              <div className="key-info-item full-width">
                <div className="item-label-group"><Shield size={15} /><span>Other Needs</span></div>
                <span className="item-value">{currentIncident.otherNeeds}</span>
              </div>
            )}
          </div>
        </div>

        {/* Police Response */}
        {currentIncident.assignedUnit && (
          <div className="incident-section unit-response-box">
            <h4 className="section-subtitle">Assigned Police Response</h4>
            <div className="unit-details-row">
              <span><strong>Unit:</strong> {currentIncident.assignedUnit}</span>
              <span className="status-badge-available">DEPLOYED</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="emergency-actions-row">
          <button
            className="btn-action btn-call-action"
            onClick={() => setIncidentModalOpen(true)}
            style={{ gridColumn: '1 / -1' }}
          >
            OPEN FULL INCIDENT DETAILS & DISPATCH
          </button>
        </div>
      </div>
    </div>
  )
}
