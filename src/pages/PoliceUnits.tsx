import { useState } from 'react'
import { Users, Truck, MapPin, Phone, CheckCircle2, Eye, Navigation } from 'lucide-react'

import { useCommandStore } from '../store/useCommandStore'
import { PoliceUnit } from '../data/mockData'
import '../styles/police-units-page.css'

export default function PoliceUnits() {
  const units = useCommandStore((state) => state.units)
  const toggleUnitStatus = useCommandStore((state) => state.toggleUnitStatus)
  const [selectedUnit, setSelectedUnit] = useState<PoliceUnit | null>(null)

  const availableCount = units.filter((u) => u.status === 'AVAILABLE').length
  const deployedCount = units.filter((u) => u.status === 'DEPLOYED').length
  const offlineCount = units.filter((u) => u.status === 'OFFLINE' || u.status === 'MAINTENANCE').length

  return (
    <div className="page-container police-units-page">
      <div className="page-header-block">
        <div>
          <h2>POLICE UNITS</h2>
          <p className="page-subtitle">
            Manage operational police response units, personnel deployment, and rapid response vehicles.
          </p>
        </div>
      </div>

      {/* Top Statistics Bar */}
      <div className="units-stats-grid">
        <div className="u-stat-card">
          <div className="u-stat-label">TOTAL UNITS</div>
          <div className="u-stat-val">24</div>
        </div>
        <div className="u-stat-card available-card">
          <div className="u-stat-label">AVAILABLE</div>
          <div className="u-stat-val">{availableCount}</div>
        </div>
        <div className="u-stat-card deployed-card">
          <div className="u-stat-label">DEPLOYED</div>
          <div className="u-stat-val">{deployedCount}</div>
        </div>
        <div className="u-stat-card offline-card">
          <div className="u-stat-label">OFFLINE / MAINT</div>
          <div className="u-stat-val">{offlineCount}</div>
        </div>
      </div>

      {/* Unit Cards List */}
      <div className="unit-cards-grid">
        {units.map((unit) => (
          <div key={unit.id} className={`unit-card status-border-${unit.status.toLowerCase()}`}>
            <div className="u-card-header">
              <div>
                <span className="u-id">#{unit.id}</span>
                <h3>{unit.name}</h3>
              </div>
              <span className={`u-status-badge st-${unit.status.toLowerCase()}`}>{unit.status}</span>
            </div>

            <div className="u-card-body">
              <div className="u-type-line">{unit.type}</div>

              <div className="u-metric-row">
                <span><Users size={12} /> Officers: <strong>{unit.officers}</strong></span>
                <span><Truck size={12} /> Vehicles: <strong>{unit.vehicles}</strong></span>
              </div>

              <div className="u-field">
                <span className="lbl">Base Location:</span>
                <span className="val"><MapPin size={12} /> {unit.location}</span>
              </div>

              {unit.currentAssignment && (
                <div className="u-field assignment-field">
                  <span className="lbl">Current Assignment:</span>
                  <span className="val highlight">{unit.currentAssignment}</span>
                </div>
              )}

              <div className="u-field">
                <span className="lbl">Contact Phone:</span>
                <span className="val"><Phone size={12} /> {unit.contact}</span>
              </div>
            </div>

            <div className="u-card-actions">
              <button className="u-btn btn-view-unit" onClick={() => setSelectedUnit(unit)}>
                <Eye size={13} /> VIEW DETAILS
              </button>

              {unit.status === 'AVAILABLE' ? (
                <button
                  className="u-btn btn-deploy-unit"
                  onClick={() => toggleUnitStatus(unit.id, 'DEPLOYED')}
                >
                  <Navigation size={13} /> DEPLOY
                </button>
              ) : (
                <button
                  className="u-btn btn-recall-unit"
                  onClick={() => toggleUnitStatus(unit.id, 'AVAILABLE')}
                >
                  <CheckCircle2 size={13} /> MARK AVAILABLE
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Unit Modal */}
      {selectedUnit && (
        <div className="unit-modal-overlay" onClick={() => setSelectedUnit(null)}>
          <div className="unit-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="u-modal-header">
              <div>
                <span className="u-id">Unit ID: #{selectedUnit.id}</span>
                <h3>{selectedUnit.name}</h3>
              </div>
              <button className="close-btn" onClick={() => setSelectedUnit(null)}>✕</button>
            </div>

            <div className="u-modal-body">
              <div className="u-details-grid">
                <div className="det-item">
                  <span className="lbl">Unit Type:</span>
                  <span className="val">{selectedUnit.type}</span>
                </div>
                <div className="det-item">
                  <span className="lbl">Current Status:</span>
                  <span className={`val st-${selectedUnit.status.toLowerCase()}`}>{selectedUnit.status}</span>
                </div>
                <div className="det-item">
                  <span className="lbl">Personnel Officers:</span>
                  <span className="val">{selectedUnit.officers} Officers</span>
                </div>
                <div className="det-item">
                  <span className="lbl">Assigned Vehicles:</span>
                  <span className="val">{selectedUnit.vehicles} Response Vehicles</span>
                </div>
                <div className="det-item">
                  <span className="lbl">Base Sector:</span>
                  <span className="val">{selectedUnit.location}</span>
                </div>
                <div className="det-item">
                  <span className="lbl">Direct Radio / Phone:</span>
                  <span className="val">{selectedUnit.contact}</span>
                </div>
                {selectedUnit.currentAssignment && (
                  <div className="det-item full">
                    <span className="lbl">Active Mission Assignment:</span>
                    <span className="val highlight">{selectedUnit.currentAssignment}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="u-modal-footer">
              <button className="btn-close" onClick={() => setSelectedUnit(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
