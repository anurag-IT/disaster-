import { useState } from 'react'
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Search, Plus, Minus, Navigation, Layers } from 'lucide-react'

import { useCommandStore } from '../store/useCommandStore'
import '../styles/map-view-page.css'

function MapActionControls() {
  const map = useMap()
  return (
    <div className="map-view-controls-right">
      <button className="ctrl-btn" onClick={() => map.zoomIn()} title="Zoom In">
        <Plus size={18} />
      </button>
      <button className="ctrl-btn" onClick={() => map.zoomOut()} title="Zoom Out">
        <Minus size={18} />
      </button>
      <button className="ctrl-btn" onClick={() => map.flyTo([27.7172, 85.3240], 12)} title="Recenter Kathmandu">
        <Navigation size={18} />
      </button>
    </div>
  )
}

const createCustomIcon = (type: string, priority?: string) => {
  let color = '#ef4444'
  let label = '!'
  let extraClass = ''

  if (type === 'incident') {
    if (priority === 'CRITICAL') { color = '#ef4444'; extraClass = 'pulse-red'; }
    else if (priority === 'HIGH') { color = '#f97316'; }
    else if (priority === 'MEDIUM') { color = '#eab308'; }
    else { color = '#22c55e'; }
  } else if (type === 'police') {
    color = '#3b82f6'
    label = '🛡️'
  } else if (type === 'station') {
    color = '#1d4ed8'
    label = '🏛️'
  } else if (type === 'hospital') {
    color = '#ec4899'
    label = '🏥'
  } else if (type === 'shelter') {
    color = '#8b5cf6'
    label = '⛺'
  }

  const html = `
    <div class="map-view-pin ${extraClass}" style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 13px;
      border: 2px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      cursor: pointer;
    ">
      ${label}
    </div>
  `

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker-view',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
}

export default function MapView() {
  const incidents = useCommandStore((state) => state.incidents)
  const riskZones = useCommandStore((state) => state.riskZones)
  const units = useCommandStore((state) => state.units)
  const setSelectedIncident = useCommandStore((state) => state.setSelectedIncident)
  const setIncidentModalOpen = useCommandStore((state) => state.setIncidentModalOpen)
  const setSelectedRiskZone = useCommandStore((state) => state.setSelectedRiskZone)

  const [mapType, setMapType] = useState<'satellite' | 'map'>('satellite')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLayerPanel, setShowLayerPanel] = useState(true)

  // Layer Toggles
  const [layers, setLayers] = useState({
    incidents: true,
    riskZones: true,
    policeUnits: true,
    stations: true,
    hospitals: true,
    shelters: true
  })

  // Fixed Mock Stations, Hospitals, Shelters for Kathmandu
  const stations = [
    { id: 'S-1', name: 'Kathmandu Metropolitan Police HQ', coordinates: [27.7050, 85.3150] as [number, number] },
    { id: 'S-2', name: 'Lalitpur Police Range', coordinates: [27.6700, 85.3220] as [number, number] },
    { id: 'S-3', name: 'Bhaktapur District Police', coordinates: [27.6720, 85.4200] as [number, number] }
  ]

  const hospitals = [
    { id: 'H-1', name: 'Tribhuvan University Teaching Hospital', coordinates: [27.7360, 85.3300] as [number, number] },
    { id: 'H-2', name: 'Patan Hospital', coordinates: [27.6680, 85.3250] as [number, number] }
  ]

  const shelters = [
    { id: 'SH-1', name: 'Budhanilkantha School Emergency Shelter', coordinates: [27.7620, 85.3650] as [number, number] },
    { id: 'SH-2', name: 'Balkhu Relief Camp', coordinates: [27.6840, 85.3000] as [number, number] }
  ]

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers({ ...layers, [layerKey]: !layers[layerKey] })
  }

  const getPolygonStyle = (risk: string) => {
    let color = '#ef4444'
    if (risk === 'HIGH') color = '#f97316'
    if (risk === 'MEDIUM') color = '#eab308'
    if (risk === 'LOW') color = '#22c55e'

    return {
      fillColor: color,
      fillOpacity: 0.35,
      color: color,
      weight: 2,
      dashArray: '4, 4'
    }
  }

  return (
    <div className="full-map-page">
      {/* Top Controls Overlay */}
      <div className="full-map-top-bar">
        <div className="map-title-tag">
          <h2>MAP VIEW</h2>
          <span className="operational-badge">Operational Center</span>
        </div>

        <div className="map-search-input">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search location, incident, risk zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="map-mode-toggle">
          <button
            className={`mode-btn ${mapType === 'map' ? 'active' : ''}`}
            onClick={() => setMapType('map')}
          >
            MAP
          </button>
          <button
            className={`mode-btn ${mapType === 'satellite' ? 'active' : ''}`}
            onClick={() => setMapType('satellite')}
          >
            SATELLITE
          </button>
        </div>

        <button
          className="layer-panel-toggle-btn"
          onClick={() => setShowLayerPanel(!showLayerPanel)}
        >
          <Layers size={16} /> Layers
        </button>
      </div>

      {/* Layer Controls Floating Panel */}
      {showLayerPanel && (
        <div className="map-layers-panel">
          <div className="layer-panel-title">MAP LAYER CONTROL</div>
          <label className="layer-checkbox-item">
            <input
              type="checkbox"
              checked={layers.incidents}
              onChange={() => toggleLayer('incidents')}
            />
            <span className="layer-color-indicator red-dot" /> Live Incidents ({incidents.length})
          </label>
          <label className="layer-checkbox-item">
            <input
              type="checkbox"
              checked={layers.riskZones}
              onChange={() => toggleLayer('riskZones')}
            />
            <span className="layer-color-indicator orange-poly" /> Risk Zone Polygons ({riskZones.length})
          </label>
          <label className="layer-checkbox-item">
            <input
              type="checkbox"
              checked={layers.policeUnits}
              onChange={() => toggleLayer('policeUnits')}
            />
            <span className="layer-color-indicator blue-dot" /> Police Units ({units.length})
          </label>
          <label className="layer-checkbox-item">
            <input
              type="checkbox"
              checked={layers.stations}
              onChange={() => toggleLayer('stations')}
            />
            <span className="layer-color-indicator darkblue-dot" /> Police Stations
          </label>
          <label className="layer-checkbox-item">
            <input
              type="checkbox"
              checked={layers.hospitals}
              onChange={() => toggleLayer('hospitals')}
            />
            <span className="layer-color-indicator pink-dot" /> Hospitals
          </label>
          <label className="layer-checkbox-item">
            <input
              type="checkbox"
              checked={layers.shelters}
              onChange={() => toggleLayer('shelters')}
            />
            <span className="layer-color-indicator purple-dot" /> Emergency Shelters
          </label>
        </div>
      )}

      {/* Leaflet Full-Screen Map Container */}
      <div className="leaflet-map-wrapper">
        <LeafletMap
          center={[27.7172, 85.3240]}
          zoom={12}
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <MapActionControls />

          {mapType === 'satellite' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> Satellite'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {/* Risk Zone Polygons Layer */}
          {layers.riskZones &&
            riskZones.map((zone) => (
              <Polygon
                key={zone.id}
                positions={zone.polygon}
                pathOptions={getPolygonStyle(zone.riskLevel)}
                eventHandlers={{
                  click: () => setSelectedRiskZone(zone)
                }}
              >
                <Popup>
                  <div className="popup-card-content">
                    <span className={`popup-risk-tag r-${zone.riskLevel.toLowerCase()}`}>
                      {zone.riskLevel} RISK ZONE
                    </span>
                    <h4>{zone.name}</h4>
                    <p><strong>Population:</strong> {zone.population.toLocaleString()}</p>
                    <p><strong>Reason:</strong> {zone.reason}</p>
                    <p><strong>Forecast:</strong> {zone.forecast}</p>
                    <span className="police-status">Status: {zone.policeStatus}</span>
                  </div>
                </Popup>
              </Polygon>
            ))}

          {/* Live Incident Markers Layer */}
          {layers.incidents &&
            incidents.map((inc) => (
              <Marker
                key={inc.id}
                position={inc.coordinates}
                icon={createCustomIcon('incident', inc.severity)}
                eventHandlers={{
                  click: () => {
                    setSelectedIncident(inc)
                    setIncidentModalOpen(true)
                  }
                }}
              >
                <Popup>
                  <div className="popup-card-content">
                    <span className={`popup-risk-tag r-${inc.severity.toLowerCase()}`}>
                      {inc.severity} INCIDENT
                    </span>
                    <h4>#{inc.id}</h4>
                    <p>{inc.title}</p>
                    <p>📍 {inc.location}</p>
                    <p>Priority Score: <strong>{inc.priority}/100</strong></p>
                    <button
                      className="popup-btn"
                      onClick={() => {
                        setSelectedIncident(inc)
                        setIncidentModalOpen(true)
                      }}
                    >
                      View Details & Dispatch
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Police Units Layer */}
          {layers.policeUnits &&
            units.map((unit) => (
              <Marker
                key={unit.id}
                position={unit.coordinates}
                icon={createCustomIcon('police')}
              >
                <Popup>
                  <div className="popup-card-content">
                    <h4>{unit.name}</h4>
                    <p>Type: {unit.type}</p>
                    <p>Officers: {unit.officers} | Vehicles: {unit.vehicles}</p>
                    <p>Status: <strong>{unit.status}</strong></p>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Police Stations */}
          {layers.stations &&
            stations.map((st) => (
              <Marker key={st.id} position={st.coordinates} icon={createCustomIcon('station')}>
                <Popup><strong>{st.name}</strong></Popup>
              </Marker>
            ))}

          {/* Hospitals */}
          {layers.hospitals &&
            hospitals.map((h) => (
              <Marker key={h.id} position={h.coordinates} icon={createCustomIcon('hospital')}>
                <Popup><strong>{h.name}</strong></Popup>
              </Marker>
            ))}

          {/* Shelters */}
          {layers.shelters &&
            shelters.map((sh) => (
              <Marker key={sh.id} position={sh.coordinates} icon={createCustomIcon('shelter')}>
                <Popup><strong>{sh.name}</strong></Popup>
              </Marker>
            ))}
        </LeafletMap>
      </div>
    </div>
  )
}
