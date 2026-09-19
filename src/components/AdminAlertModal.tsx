import { useState } from 'react'
import { X, Send, ShieldAlert } from 'lucide-react'

import { useCommandStore } from '../store/useCommandStore'
import '../styles/admin-modal.css'

export default function AdminAlertModal() {
  const isAdminModalOpen = useCommandStore((state) => state.isAdminModalOpen)
  const setAdminModalOpen = useCommandStore((state) => state.setAdminModalOpen)
  const createAdminRiskZoneAndAlert = useCommandStore((state) => state.createAdminRiskZoneAndAlert)

  const [name, setName] = useState('Balkhu Riverside Sector B')
  const [riskLevel, setRiskLevel] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('CRITICAL')
  const [population, setPopulation] = useState(2400)
  const [reason, setReason] = useState('River level rapidly rising above 2.2m danger mark')
  const [forecast, setForecast] = useState('Heavy monsoon downpour expected for next 6 hours (80-120mm)')

  if (!isAdminModalOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Map location presets based on selected area name
    let coordinates: [number, number] = [27.6880, 85.3050] // Balkhu default
    if (name.includes('Sundarijal')) coordinates = [27.7550, 85.4200]
    if (name.includes('Bhaktapur')) coordinates = [27.6710, 85.4293]
    if (name.includes('Tokha')) coordinates = [27.7600, 85.3200]

    createAdminRiskZoneAndAlert({
      name,
      riskLevel,
      population: Number(population),
      reason,
      forecast,
      coordinates
    })
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-card">
        <div className="admin-modal-header">
          <div className="header-title-group">
            <ShieldAlert size={22} className="admin-icon" />
            <div>
              <h3>Admin Command Center Simulator</h3>
              <p>Simulate Geographic Risk Zone Creation & Push Alert to RAKSHA</p>
            </div>
          </div>
          <button className="close-btn" onClick={() => setAdminModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form-body">
          <div className="flow-steps-banner">
            <span>ADMIN</span> → <span>CREATE RISK ZONE</span> → <span>SET RISK</span> → <span>PUSH TO RAKSHA</span>
          </div>

          <div className="form-group">
            <label>Geographic Area Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Balkhu Riverside Sector B"
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Risk Level</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as any)}
              >
                <option value="CRITICAL">🔴 CRITICAL</option>
                <option value="HIGH">🟠 HIGH</option>
                <option value="MEDIUM">🟡 MEDIUM</option>
                <option value="LOW">🟢 LOW</option>
              </select>
            </div>

            <div className="form-group">
              <label>Affected Population</label>
              <input
                type="number"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Risk Reason / Cause</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. River level rising rapidly"
              required
            />
          </div>

          <div className="form-group">
            <label>Precipitation & Flood Forecast</label>
            <textarea
              rows={2}
              value={forecast}
              onChange={(e) => setForecast(e.target.value)}
              placeholder="e.g. Heavy rainfall expected (80-120mm)"
              required
            />
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setAdminModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-send-alert">
              <Send size={16} /> SEND ALERT TO RAKSHA
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
