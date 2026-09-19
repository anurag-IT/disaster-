import { useState } from 'react'
import { User, Bell, Sliders, ShieldCheck, Activity, Save } from 'lucide-react'

import '../styles/settings-page.css'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'dashboard' | 'security' | 'system'>('account')

  return (
    <div className="page-container settings-page">
      <div className="page-header-block">
        <div>
          <h2>SYSTEM SETTINGS</h2>
          <p className="page-subtitle">Configure police operator account preferences, alert triggers, security, and map parameters.</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Left Sub-Nav Tabs */}
        <div className="settings-nav-card">
          <button className={`s-nav-btn ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
            <User size={16} /> Account Profile
          </button>
          <button className={`s-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <Bell size={16} /> Notifications
          </button>
          <button className={`s-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Sliders size={16} /> Dashboard & Map
          </button>
          <button className={`s-nav-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <ShieldCheck size={16} /> Security & 2FA
          </button>
          <button className={`s-nav-btn ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
            <Activity size={16} /> System Health
          </button>
        </div>

        {/* Right Settings Form Body */}
        <div className="settings-content-card">
          {activeTab === 'account' && (
            <div className="settings-section">
              <h3>ACCOUNT PROFILE</h3>
              <div className="s-form-grid">
                <div className="s-field">
                  <label>Operator Name</label>
                  <input type="text" defaultValue="Constable Sharma" />
                </div>
                <div className="s-field">
                  <label>Operator Role</label>
                  <input type="text" defaultValue="Police Operator - Command Center" disabled />
                </div>
                <div className="s-field">
                  <label>Official Phone Number</label>
                  <input type="text" defaultValue="+977 98410-00001" />
                </div>
                <div className="s-field">
                  <label>Official Email</label>
                  <input type="email" defaultValue="c.sharma@police.gov.np" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>NOTIFICATIONS PREFERENCES</h3>
              <div className="toggle-list">
                <label className="toggle-item">
                  <input type="checkbox" defaultChecked />
                  <div>
                    <strong>Critical Incident Audio Alerts</strong>
                    <p>Play emergency sound siren when priority score &gt; 90/100</p>
                  </div>
                </label>

                <label className="toggle-item">
                  <input type="checkbox" defaultChecked />
                  <div>
                    <strong>Risk Zone Warnings</strong>
                    <p>Notify operator when Admin creates or updates a geographic risk zone polygon</p>
                  </div>
                </label>
                <label className="toggle-item">
                  <input type="checkbox" defaultChecked />
                  <div>
                    <strong>New Voice Call Notifications</strong>
                    <p>Pop up toast when Flood ResQ AI transcribes a new emergency call</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="settings-section">
              <h3>DASHBOARD & MAP PREFERENCES</h3>
              <div className="s-form-grid">
                <div className="s-field">
                  <label>Default Map Provider</label>
                  <select defaultValue="esri">
                    <option value="esri">Esri High-Res World Satellite Imagery</option>
                    <option value="osm">OpenStreetMap Standard View</option>
                  </select>
                </div>
                <div className="s-field">
                  <label>Default Center Coordinates</label>
                  <input type="text" defaultValue="Kathmandu Valley (27.7172° N, 85.3240° E)" disabled />
                </div>
                <div className="s-field">
                  <label>Auto-Refresh Interval</label>
                  <select defaultValue="5">
                    <option value="5">Every 5 seconds (Real-time)</option>
                    <option value="15">Every 15 seconds</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>SECURITY & ACCESS CONTROL</h3>
              <div className="security-badge-box">
                <ShieldCheck size={20} className="sec-icon" />
                <div>
                  <strong>Encrypted Police Network Session</strong>
                  <p>Authenticated as Police Command Operator #CS-4091. 2FA is Active.</p>
                </div>
              </div>

              <div className="s-form-grid">
                <div className="s-field">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••••••" />
                </div>
                <div className="s-field">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="settings-section">
              <h3>SYSTEM HEALTH & INFRASTRUCTURE STATUS</h3>
              <div className="health-status-grid">
                <div className="health-card">
                  <span className="dot green" />
                  <div>
                    <strong>Flood ResQ AI Voice Engine</strong>
                    <p>Status: Online (Latency: 140ms)</p>
                  </div>
                </div>

                <div className="health-card">
                  <span className="dot green" />
                  <div>
                    <strong>Leaflet Map & GIS Tile Server</strong>
                    <p>Status: Online (Esri / OSM Active)</p>
                  </div>
                </div>

                <div className="health-card">
                  <span className="dot green" />
                  <div>
                    <strong>Emergency Call Connection Stream</strong>
                    <p>Status: Online (Active)</p>
                  </div>
                </div>

                <div className="health-card">
                  <span className="dot green" />
                  <div>
                    <strong>Police Dispatch Network</strong>
                    <p>Status: Online (Secure)</p>
                  </div>
                </div>

                <div className="health-card">
                  <span className="dot green" />
                  <div>
                    <strong>RAKSHA Operational Database</strong>
                    <p>Status: Online (Zero lag)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="settings-save-bar">
            <button className="btn-save-settings">
              <Save size={14} /> SAVE PREFERENCES
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
