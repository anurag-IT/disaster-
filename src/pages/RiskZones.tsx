import { useState } from 'react'
import { MapPin, Users, Shield, CheckCircle2, Eye, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCommandStore } from '../store/useCommandStore'
import { RiskZone } from '../data/mockData'
import '../styles/risk-zones-page.css'

export default function RiskZones() {
  const riskZones = useCommandStore((state) => state.riskZones)
  const setSelectedRiskZone = useCommandStore((state) => state.setSelectedRiskZone)
  const acknowledgeRiskZone = useCommandStore((state) => state.acknowledgeRiskZone)
  const units = useCommandStore((state) => state.units)
  const navigate = useNavigate()


  const [activeZoneDetail, setActiveZoneDetail] = useState<RiskZone | null>(null)

  const handleViewMap = (zone: RiskZone) => {
    setSelectedRiskZone(zone)
    navigate('/map')
  }

  return (
    <div className="page-container risk-zones-page">
      <div className="page-header-block">
        <div>
          <h2>RISK ZONES</h2>
          <p className="page-subtitle">
            Geographic areas identified as high danger due to flash flooding and rising river basins.
          </p>
        </div>
        <div className="zones-count-tag">
          Active Risk Zones: <strong>{riskZones.length}</strong>
        </div>
      </div>

      {/* Cards & Details Grid */}
      <div className="risk-zones-layout">
        <div className="risk-cards-list">
          {riskZones.map((zone) => (
            <div key={zone.id} className={`risk-zone-card risk-border-${zone.riskLevel.toLowerCase()}`}>
              <div className="rz-card-header">
                <div>
                  <span className="rz-id">#{zone.id}</span>
                  <h3>{zone.name}</h3>
                </div>
                <span className={`risk-tag r-${zone.riskLevel.toLowerCase()}`}>{zone.riskLevel}</span>
              </div>

              <div className="rz-card-body">
                <div className="rz-info-row">
                  <span className="rz-label">Population:</span>
                  <span className="rz-val"><Users size={12} /> {zone.population.toLocaleString()}</span>
                </div>

                <div className="rz-info-row">
                  <span className="rz-label">Reason:</span>
                  <span className="rz-val">{zone.reason}</span>
                </div>

                <div className="rz-info-row">
                  <span className="rz-label">Forecast:</span>
                  <span className="rz-val">{zone.forecast}</span>
                </div>

                <div className="rz-info-row">
                  <span className="rz-label">Created By:</span>
                  <span className="rz-val">{zone.createdBy} ({zone.createdAt})</span>
                </div>

                <div className="rz-status-bar">
                  <span>Police Status:</span>
                  <span className={`police-st-badge st-${zone.policeStatus.toLowerCase()}`}>
                    {zone.policeStatus}
                  </span>
                </div>
              </div>

              <div className="rz-card-actions">
                <button className="rz-btn btn-view-on-map" onClick={() => handleViewMap(zone)}>
                  <MapPin size={13} /> VIEW MAP
                </button>
                <button className="rz-btn btn-open-detail" onClick={() => setActiveZoneDetail(zone)}>
                  <Eye size={13} /> OPEN DETAILS
                </button>
                {zone.policeStatus === 'NEW' && (
                  <button className="rz-btn btn-ack-zone" onClick={() => acknowledgeRiskZone(zone.id)}>
                    <CheckCircle2 size={13} /> ACKNOWLEDGE
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Zone Detail Modal */}
      {activeZoneDetail && (
        <div className="rz-detail-modal-overlay" onClick={() => setActiveZoneDetail(null)}>
          <div className="rz-detail-card" onClick={(e) => e.stopPropagation()}>
            <div className="rz-modal-header">
              <div>
                <span className="rz-id">Zone ID: #{activeZoneDetail.id}</span>
                <h3>{activeZoneDetail.name}</h3>
              </div>
              <button className="close-btn" onClick={() => setActiveZoneDetail(null)}>✕</button>
            </div>

            <div className="rz-modal-body">
              <div className="rz-detail-grid">
                <div className="detail-item">
                  <span className="lbl">Risk Level:</span>
                  <span className={`val r-${activeZoneDetail.riskLevel.toLowerCase()}`}>{activeZoneDetail.riskLevel}</span>
                </div>
                <div className="detail-item">
                  <span className="lbl">Population Affected:</span>
                  <span className="val">{activeZoneDetail.population.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="lbl">Created By:</span>
                  <span className="val">{activeZoneDetail.createdBy} ({activeZoneDetail.createdAt})</span>
                </div>
                <div className="detail-item">
                  <span className="lbl">Police Acknowledgement:</span>
                  <span className="val">{activeZoneDetail.policeStatus}</span>
                </div>
                <div className="detail-item full">
                  <span className="lbl">Flood Reason:</span>
                  <span className="val">{activeZoneDetail.reason}</span>
                </div>
                <div className="detail-item full">
                  <span className="lbl">Weather Forecast:</span>
                  <span className="val">{activeZoneDetail.forecast}</span>
                </div>
              </div>

              {/* Nearby Resources & Incidents */}
              <div className="nearby-section">
                <h4>Nearby Response Units</h4>
                <div className="units-mini-list">
                  {units.map((u) => (
                    <div key={u.id} className="u-mini-item">
                      <Shield size={14} className="u-icon" />
                      <span>{u.name} ({u.type})</span>
                      <span className="u-st">{u.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rz-modal-footer">
              <button className="btn-primary" onClick={() => handleViewMap(activeZoneDetail)}>
                <ExternalLink size={14} /> Open in Operational Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
