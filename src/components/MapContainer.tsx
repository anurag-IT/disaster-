import { useState, useEffect } from 'react'
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Search, Maximize2, Plus, Minus, Navigation } from 'lucide-react'
import { Incident } from '../data/mockData'
import { useCommandStore } from '../store/useCommandStore'
import '../styles/map-container.css'

interface MapProps {
  selectedIncident: Incident
  onSelectIncident: (incident: Incident) => void
}

function MapFlyTo({ coordinates }: { coordinates: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, 13, { duration: 1.2 })
    }
  }, [coordinates, map])
  return null
}

function MapActionControls({ onRecenter }: { onRecenter: () => void }) {
  const map = useMap()
  return (
    <div className="map-controls-right">
      <button className="map-control-btn" onClick={() => map.zoomIn()} title="Zoom In">
        <Plus size={18} />
      </button>
      <button className="map-control-btn" onClick={() => map.zoomOut()} title="Zoom Out">
        <Minus size={18} />
      </button>
      <button className="map-control-btn" onClick={onRecenter} title="Recenter Kathmandu">
        <Navigation size={18} />
      </button>
    </div>
  )
}

const createCustomIcon = (type: string, severity?: string, isSelected?: boolean) => {
  let color = '#ef4444'
  let label = '!'
  let extraClass = ''

  if (type === 'incident') {
    if (severity === 'CRITICAL') { color = '#ef4444'; extraClass = 'pulse-red'; }
    else if (severity === 'HIGH') { color = '#f97316'; }
    else if (severity === 'MEDIUM') { color = '#eab308'; }
    else { color = '#22c55e'; }
  } else if (type === 'police') {
    color = '#3b82f6'
    label = '🛡️'
  } else if (type === 'rescue') {
    color = '#10b981'
    label = '🚤'
  }

  const selectedBorder = isSelected ? 'box-shadow: 0 0 0 4px #ffffff, 0 0 16px rgba(255,255,255,0.8);' : ''

  const html = `
    <div class="custom-map-marker ${extraClass}" style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
      border: 2px solid #ffffff;
      ${selectedBorder}
      cursor: pointer;
      transition: transform 0.2s ease;
    ">
      ${label}
    </div>
  `

  return L.divIcon({
    html,
    className: 'leaflet-custom-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
}

export default function MapContainer({ selectedIncident, onSelectIncident }: MapProps) {
  const incidents = useCommandStore((state) => state.incidents)
  const units = useCommandStore((state) => state.units)

  const [mapType, setMapType] = useState<'satellite' | 'map'>('satellite')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const filteredIncidents = incidents.filter((inc) =>
    inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFullscreen = () => {
    const mapElement = document.querySelector('.map-container')
    if (!mapElement) return

    if (!document.fullscreenElement) {
      mapElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  return (
    <div className={`map-container ${isFullscreen ? 'fullscreen-active' : ''}`}>
      <div className="map-header">
        <div className="map-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search location, incident ID, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="map-badge-info">
          <span className="live-dot">●</span> {incidents.length} Incidents Mapped
        </div>

        <div className="map-controls-header">
          <button
            className={`map-type-btn ${mapType === 'map' ? 'active' : ''}`}
            onClick={() => setMapType('map')}
          >
            Map
          </button>
          <button
            className={`map-type-btn ${mapType === 'satellite' ? 'active' : ''}`}
            onClick={() => setMapType('satellite')}
          >
            Satellite
          </button>
          <button className="fullscreen-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <div className="map-body">
        <LeafletMap
          center={selectedIncident ? selectedIncident.coordinates : [27.7172, 85.3240]}
          zoom={12}
          zoomControl={false}
          style={{ width: '100%', height: '100%', minHeight: '380px' }}
        >
          <MapFlyTo coordinates={selectedIncident ? selectedIncident.coordinates : [27.7172, 85.3240]} />
          <MapActionControls onRecenter={() => incidents.length > 0 && onSelectIncident(incidents[0])} />

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

          {/* Incident Pins */}
          {filteredIncidents.map((inc) => {
            const isSelected = selectedIncident && selectedIncident.id === inc.id
            return (
              <Marker
                key={inc.id}
                position={inc.coordinates}
                icon={createCustomIcon('incident', inc.severity, isSelected)}
                eventHandlers={{
                  click: () => onSelectIncident(inc),
                }}
              >
                <Popup className="incident-popup">
                  <div className="popup-content">
                    <span className={`popup-badge badge-${inc.severity.toLowerCase()}`}>
                      {inc.severity}
                    </span>
                    <h4>{inc.title}</h4>
                    <p className="popup-loc">📍 {inc.location}</p>
                    <button
                      className="popup-select-btn"
                      onClick={() => onSelectIncident(inc)}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {/* Police & Rescue Units Pins */}
          {units.map((unit) => (
            <Marker
              key={unit.id}
              position={unit.coordinates}
              icon={createCustomIcon(unit.type.toLowerCase().includes('rescue') ? 'rescue' : 'police')}
            >
              <Popup>
                <div className="popup-content">
                  <h4>{unit.name}</h4>
                  <p>Status: <strong>{unit.status}</strong></p>
                </div>
              </Popup>
            </Marker>
          ))}
        </LeafletMap>

        {/* Map Legend Overlay */}
        <div className="map-legends">
          <div className="legend-item critical"><span className="dot critical-dot">◆</span> Critical</div>
          <div className="legend-item high"><span className="dot high-dot">◆</span> High</div>
          <div className="legend-item medium"><span className="dot medium-dot">◆</span> Medium</div>
          <div className="legend-item low"><span className="dot low-dot">◆</span> Low</div>
          <div className="legend-item police"><span className="dot police-dot">🛡️</span> Units</div>
        </div>

        <div className="map-provider-tag">
          Google Maps / Esri Live Tiles
        </div>
      </div>

      <div className="map-footer">
        <div className="map-info">
          <div className="info-item">
            <span className="label">Location:</span>
            <span className="value">Kathmandu Valley (27.7° N, 85.3° E)</span>
          </div>
          <div className="info-item">
            <span className="label">Active Focus:</span>
            <span className="value">{selectedIncident ? selectedIncident.location : 'Kathmandu'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
