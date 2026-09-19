import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { normalizeNepalPhone } from "@/lib/phone";
import { responders as initialResponders, seedIncidents } from "@/data/seed";
import { useIncidents } from "@/hooks/useIncidents";
import type { Incident, PriorityLevel, Responder, TranscriptLine } from "@/types/incident";

// Fix Leaflet default icon with Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const lc: Record<PriorityLevel, string> = {
  STANDARD: "standard", ELEVATED: "elevated",
  URGENT: "urgent", "CRITICAL REVIEW": "critical",
};
const yn  = (v: boolean | null) => (v === null ? "Unknown" : v ? "Yes" : "No");
const num = (v: number | null)  => (v === null ? "—" : String(v));

/* ── Point-in-polygon (ray casting) ──────────────────────────────── */
function pointInPolygon(pt: L.LatLng, poly: L.LatLng[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].lng, yi = poly[i].lat;
    const xj = poly[j].lng, yj = poly[j].lat;
    const intersect = (yi > pt.lat) !== (yj > pt.lat)
      && pt.lng < ((xj - xi) * (pt.lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/* ── SVG icons ────────────────────────────────────────────────────── */
const Icon = {
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Incidents: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Map: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  Teams: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Reports: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  AI: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 9h6M9 12h6M9 15h4"/>
      <circle cx="18" cy="9" r="1" fill="currentColor"/>
    </svg>
  ),
  Rescue: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M3 18v-6a9 9 0 0118 0v6"/>
      <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
    </svg>
  ),
  Ambulance: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Police: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Relief: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Lasso: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C7 3 3 6.5 3 11c0 3.5 2.5 6.5 6 7.5"/>
      <path d="M9 19.5c1 .3 2 .5 3 .5 5 0 9-3.5 9-8s-4-8-9-8"/>
      <path d="M9 21l-2-2 2-2"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
    </svg>
  ),
  Broadcast: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <circle cx="12" cy="12" r="2"/>
      <path d="M16.24 7.76a6 6 0 010 8.49M7.76 16.24a6 6 0 010-8.49"/>
      <path d="M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14"/>
    </svg>
  ),
};

/* ── Logos ────────────────────────────────────────────────────────── */
function NepalSeal() {
  return <img src="/nepal_gov.jpg" alt="Nepal Government Seal" className="brand-seal"
    style={{ width: 48, height: 48, objectFit: "contain", mixBlendMode: "screen",
      filter: "drop-shadow(0 1px 3px rgba(0,0,0,.3))" }} />;
}
function PoliceLogo() {
  return <img src="/Nepal_Police_logo.png" alt="Nepal Police"
    style={{ width: 44, height: 44, objectFit: "contain",
      filter: "drop-shadow(0 1px 4px rgba(0,0,0,.5))" }} />;
}

/* ── Marker factory ───────────────────────────────────────────────── */
function createMarkerIcon(level: string, isSelected: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="map-incident-marker ${level}${isSelected ? " selected" : ""}"></div>`,
    iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -15],
  });
}

/* ── Map re-center ────────────────────────────────────────────────── */
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom(), { animate: true }); }, [center, map]);
  return null;
}

/* ══════════════════════════════════════════════════════════════════
   FREEHAND POLYGON DRAWER
   - Hold mouse button down → drag freely to trace any shape
   - Release mouse → path auto-closes into a filled polygon
   - Uses a native Leaflet Polyline for the live preview (no flicker)
══════════════════════════════════════════════════════════════════ */
function FreehandDrawer({
  active,
  onDrawn,
}: {
  active: boolean;
  onDrawn: (pts: L.LatLng[]) => void;
}) {
  const map = useMap();
  const drawing     = useRef(false);
  const points      = useRef<L.LatLng[]>([]);
  const previewLine = useRef<L.Polyline | null>(null);
  // minimum pixel distance between sampled points (keeps point count sane)
  const MIN_DIST_PX = 4;
  const lastPx      = useRef<L.Point | null>(null);

  /* Manage cursor & interactions when mode changes */
  useEffect(() => {
    const container = map.getContainer();
    if (active) {
      map.dragging.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      container.style.cursor = "crosshair";
    } else {
      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      container.style.cursor = "";
    }
    return () => {
      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      container.style.cursor = "";
    };
  }, [active, map]);

  /* Attach raw DOM listeners on the map container so we capture
     every pixel of mouse movement without Leaflet throttling */
  useEffect(() => {
    if (!active) return;
    const container = map.getContainer();

    function onMouseDown(e: MouseEvent) {
      drawing.current  = true;
      points.current   = [];
      lastPx.current   = null;
      const latlng     = map.mouseEventToLatLng(e);
      points.current.push(latlng);
      lastPx.current   = map.latLngToContainerPoint(latlng);

      // Create preview line
      previewLine.current = L.polyline([latlng], {
        color: "#a01c2c",
        weight: 2.5,
        dashArray: "6 3",
        opacity: 0.9,
      }).addTo(map);
    }

    function onMouseMove(e: MouseEvent) {
      if (!drawing.current || !previewLine.current) return;
      const latlng = map.mouseEventToLatLng(e);
      const px     = map.latLngToContainerPoint(latlng);

      // Only add point if moved enough pixels
      if (lastPx.current) {
        const dx = px.x - lastPx.current.x;
        const dy = px.y - lastPx.current.y;
        if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST_PX) return;
      }
      points.current.push(latlng);
      lastPx.current = px;
      previewLine.current.setLatLngs(points.current);
    }

    function onMouseUp() {
      if (!drawing.current) return;
      drawing.current = false;

      // Remove preview line
      if (previewLine.current) {
        previewLine.current.remove();
        previewLine.current = null;
      }

      // Need at least 3 unique points to form a polygon
      if (points.current.length >= 3) {
        onDrawn([...points.current]);
      }
      points.current = [];
    }

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup",   onMouseUp);
    // Also catch mouseup outside the map
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("mouseup", onMouseUp);
      if (previewLine.current) { previewLine.current.remove(); previewLine.current = null; }
    };
  }, [active, map, onDrawn]);

  return null;
}

/* ── Live calls stub ─────────────────────────────────────────────── */
const liveCalls = [
  { time: "16:40", location: "Budhanilkantha", priority: "critical", status: "pending"  },
  { time: "16:33", location: "Kirtipur",        priority: "urgent",   status: "assigned" },
  { time: "16:21", location: "Sindhupalchok",   priority: "urgent",   status: "on_way"  },
  { time: "16:12", location: "Tokha",            priority: "elevated", status: "assigned" },
  { time: "15:58", location: "Lalitpur",         priority: "elevated", status: "resolved" },
];

/* ══════════════════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════════════════ */
export function CommandDashboard() {
  // Supabase integration - auto-fetches incidents
  const { 
    incidents: dbIncidents,  // Rename to avoid collision
    loading: incidentsLoading, 
    error: incidentsError, 
    isUsingDemoData,
    setIncidents,
    updateIncident 
  } = useIncidents();
  
  const [selectedId,    setSelectedId]    = useState(1042);
  const [teams,         setTeams]         = useState(initialResponders);
  const [tab,           setTab]           = useState<"INTELLIGENCE" | "TRANSCRIPT">("INTELLIGENCE");
  const [mode,          setMode]          = useState<"LIVE" | "DEMO">("DEMO");
  const [phone,         setPhone]         = useState("9812345678");
  const [call,          setCall]          = useState<"IDLE" | "CALLING" | "CONNECTED" | "FAILED">("IDLE");
  const [error,         setError]         = useState("");
  const [step,          setStep]          = useState(0);
  const [mapType,       setMapType]       = useState<"map" | "satellite">("map");
  const [activeNav,     setActiveNav]     = useState("incidents");
  const [callsTab,      setCallsTab]      = useState("all");
  const [now,           setNow]           = useState(new Date());
  const [mapMode,       setMapMode]       = useState<"view" | "select">("view");
  // Freehand polygon points (null = no selection)
  const [areaPolygon,   setAreaPolygon]   = useState<L.LatLng[] | null>(null);
  const [showAreaCall,  setShowAreaCall]  = useState(false);
  const [areaCallMsg,   setAreaCallMsg]   = useState("");

  // All hooks MUST be called before any conditional returns
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // If no incidents from Supabase, use demo data
  const incidents = dbIncidents.length > 0 ? dbIncidents : seedIncidents;
  const selected = incidents.find(i => i.id === selectedId) ?? incidents[0];
  
  // Show warning banner if using fallback demo data
  const showDemoFallback = dbIncidents.length === 0 && !isUsingDemoData;

  const metrics = useMemo(() => ({
    critical:   incidents.filter(i => i.priorityLevel === "CRITICAL REVIEW").length,
    urgent:     incidents.filter(i => i.priorityLevel === "URGENT").length,
    elevated:   incidents.filter(i => i.priorityLevel === "ELEVATED").length,
    standard:   incidents.filter(i => i.priorityLevel === "STANDARD").length,
    totalCalls: 1248,
  }), [incidents]);

  /* Incidents whose coordinates fall inside the drawn polygon */
  const incidentsInArea = useMemo(() => {
    if (!areaPolygon || areaPolygon.length < 3) return [];
    return incidents.filter(i => {
      if (!i.location.latitude || !i.location.longitude) return false;
      return pointInPolygon(
        L.latLng(i.location.latitude, i.location.longitude),
        areaPolygon
      );
    });
  }, [incidents, areaPolygon]);

  function startCall() {
    const phone_num = normalizeNepalPhone(phone);
    if (!phone_num) {
      setError("Invalid Nepal mobile number");
      return;
    }
    setCall("CALLING"); setStep(1); setSelectedId(1042); setTab("TRANSCRIPT");
    setTimeout(() => { setCall("CONNECTED"); setStep(2); }, 900);
  }

  useEffect(() => {
    if (mode !== "DEMO" || call !== "CONNECTED" || step !== 2) return;
    const t = [
      setTimeout(() => setStep(3), 1100),
      setTimeout(() => setStep(4), 2600),
      setTimeout(() => setStep(5), 4100),
      setTimeout(() => setStep(6), 5600),
    ];
    return () => t.forEach(clearTimeout);
  }, [mode, call, step]);

  const transcript = selected && selected.transcript ? (
    selected.id === 1042 && step > 0
      ? selected.transcript.slice(0, Math.max(0, step - 1))
      : selected.transcript
  ) : [];

  function assign(team: Responder) {
    setTeams(ts => ts.map(t => t.id === team.id ? { ...t, status: "ASSIGNED" } : t));
    setIncidents(xs => xs.map(i => i.id === selected.id
      ? { ...i, assignedTeam: team.name, status: "TEAM_ASSIGNED" } : i));
  }
  
  // NOW check loading state AFTER all hooks
  if (incidentsLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#0a0e1a',
        color: '#fff',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '2rem' }}>⏳</div>
        <div>Loading Raksha Dashboard...</div>
      </div>
    );
  }

  async function startCall() {
    setError("");
    const normalized = normalizeNepalPhone(phone);
    if (!normalized) { setError("Enter a valid Nepal mobile number (98XXXXXXXX)."); return; }
    if (call === "CALLING" || call === "CONNECTED") return;
    if (mode === "LIVE") {
      setCall("CALLING");
      try {
        const r = await fetch("/api/calls/start", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ phoneNumber: normalized }),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Call could not be started");
      } catch (e) { setCall("FAILED"); setError(e instanceof Error ? e.message : "Call failed"); }
      return;
    }
    setCall("CALLING"); setStep(1); setSelectedId(1042); setTab("TRANSCRIPT");
    setTimeout(() => { setCall("CONNECTED"); setStep(2); }, 900);
  }

  useEffect(() => {
    if (mode !== "DEMO" || call !== "CONNECTED" || step !== 2) return;
    const t = [
      setTimeout(() => setStep(3), 1100),
      setTimeout(() => setStep(4), 2600),
      setTimeout(() => setStep(5), 4100),
      setTimeout(() => setStep(6), 5600),
    ];
    return () => t.forEach(clearTimeout);
  }, [mode, call, step]);

  const transcript = selected.id === 1042 && step > 0
    ? (selected.transcript || []).slice(0, Math.max(0, step - 1))
    : (selected.transcript || []);

  function assign(team: Responder) {
    setTeams(ts => ts.map(t => t.id === team.id ? { ...t, status: "ASSIGNED" } : t));
    setIncidents(xs => xs.map(i => i.id === selected.id
      ? { ...i, assignedTeam: team.name, status: "TEAM ASSIGNED" } : i));
  }

  const handleDrawn = useCallback((pts: L.LatLng[]) => {
    setAreaPolygon(pts);
    setMapMode("view"); // auto-switch back to view so user can pan
  }, []);

  const clearArea = () => {
    setAreaPolygon(null);
    setShowAreaCall(false);
    setAreaCallMsg("");
  };

  const enterSelectMode = () => {
    setMapMode("select");
    setAreaPolygon(null);
    setShowAreaCall(false);
  };

  const selectedLatLng: [number, number] =
    selected.location.latitude && selected.location.longitude
      ? [selected.location.latitude, selected.location.longitude]
      : [27.7, 85.3];

  const tileUrl = mapType === "satellite"
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const tileAttrib = mapType === "satellite"
    ? "Tiles &copy; Esri"
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

  const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <main className="app-shell">

      {/* Ticker */}
      <div className="ticker-bar">
        <div className="ticker-label">ALERT</div>
        <div className="ticker-track">
          <span>
            Bagmati River basin — elevated water levels &nbsp;|&nbsp;
            SAR active: Sindhupalchok &nbsp;|&nbsp;
            Helpline: 1145 &nbsp;|&nbsp;
            Bagmati River basin — elevated water levels &nbsp;|&nbsp;
            SAR active: Sindhupalchok &nbsp;|&nbsp; Helpline: 1145
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="topbar">
        <div className="brand">
          <NepalSeal />
          <div className="brand-text">
            <span className="brand-sup">Government of Nepal</span>
            <strong>Flood Emergency Response</strong>
          </div>
        </div>
        <div className="topbar-sep" />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PoliceLogo />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>नेपाल प्रहरी</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", lineHeight: 1.3 }}>Nepal Police</div>
          </div>
        </div>
        <div className="topbar-sep" />
        <div className="header-system">
          <h1>Disaster Command Centre</h1>
          {(isUsingDemoData || showDemoFallback) && (
            <div style={{ 
              fontSize: 10, 
              color: "rgba(255,203,0,0.9)", 
              marginTop: 2,
              fontWeight: 600,
              letterSpacing: "0.5px"
            }}>
              {showDemoFallback 
                ? "⚠ No data in Supabase - Using demo incidents" 
                : "⚠ DEMO MODE - Using simulated data"}
            </div>
          )}
          {incidentsLoading && (
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              Loading incidents...
            </div>
          )}
        </div>
        <div className="topbar-right">
          <div className="clock-block">
            <b>{timeStr}</b>
            <small>{dateStr}</small>
          </div>
          <div className="online-badge">
            <span className="dot" />
            Online
          </div>
          <div className="mode-toggle">
            <button className={mode === "LIVE" ? "active" : ""} onClick={() => setMode("LIVE")}>LIVE</button>
            <button className={mode === "DEMO" ? "active" : ""} onClick={() => setMode("DEMO")}>DEMO</button>
          </div>
          <div className="operator-pill">
            <div className="op-avatar" style={{ padding: 2, background: "transparent", border: "1px solid rgba(255,255,255,.2)" }}>
              <img src="/Nepal_Police_logo.png" alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
            </div>
            <div>
              <b>Constable Sharma</b>
              <small>Operator</small>
            </div>
          </div>
        </div>
      </header>

      {mode === "DEMO" && (
        <div className="simulation-banner">
          <b>DEMO</b>
          <span>Simulated data — not live</span>
        </div>
      )}

      {/* Metrics */}
      <section className="metrics">
        <MetricCard label="Critical" value={metrics.critical} variant="red"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
        <MetricCard label="High" value={metrics.urgent} variant="orange"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} />
        <MetricCard label="Medium" value={metrics.elevated} variant="yellow"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <MetricCard label="Low" value={metrics.standard} variant="green"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polyline points="20 6 9 17 4 12"/></svg>} />
        <MetricCard label="Total Calls (24h)" value={metrics.totalCalls.toLocaleString()}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81 19.79 19.79 0 01.02 1.13 2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>} />
      </section>

      <section className="workspace">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <nav className="nav-menu">
            {[
              { id: "dashboard", Icon: Icon.Dashboard, label: "Dashboard" },
              { id: "incidents", Icon: Icon.Incidents, label: "Incidents", badge: incidents.filter(i => i.status !== "RESOLVED").length },
              { id: "map",       Icon: Icon.Map,       label: "Map" },
              { id: "calls",     Icon: Icon.Phone,     label: "Calls" },
              { id: "teams",     Icon: Icon.Teams,     label: "Teams" },
              { id: "reports",   Icon: Icon.Reports,   label: "Reports" },
              { id: "settings",  Icon: Icon.Settings,  label: "Settings" },
            ].map(item => (
              <button key={item.id} className={`nav-item ${activeNav === item.id ? "active" : ""}`}
                onClick={() => setActiveNav(item.id)}>
                <span className="nav-icon"><item.Icon /></span>
                {item.label}
                {"badge" in item && item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </button>
            ))}
          </nav>

          <div className="queue-header">
            <h3>Incidents</h3>
            <span className="queue-count">{incidents.length}</span>
          </div>

          <div className="queue-list">
            {incidents.map(i => (
              <button key={i.id}
                className={`incident-card ${selectedId === i.id ? "selected" : ""} ${lc[i.priorityLevel]}`}
                onClick={() => setSelectedId(i.id)}>
                <div className="incident-top">
                  <span className={`badge ${lc[i.priorityLevel]}`}>{i.priorityLevel}</span>
                  <span className="incident-id">#{i.id}</span>
                </div>
                <h3>{i.location.rawText ?? "Location unknown"}</h3>
                <div className="incident-meta">
                  <span>{i.id === 1042 ? "2 min ago" : "8 min ago"}</span>
                  <span className="incident-score"
                    style={{ color: i.priorityScore >= 70 ? "var(--red)" : i.priorityScore >= 50 ? "var(--orange)" : "var(--text-dim)" }}>
                    {i.priorityScore}/100
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="ai-assistant">
            <div className="ai-assistant-header">
              <div className="ai-avatar-wrap"><Icon.AI /></div>
              <div>
                <b>AI Assistant</b>
                <div className="ai-status">
                  <span className="ai-status-dot" />
                  Active
                </div>
              </div>
            </div>
            <div className="wave-bar">
              {Array.from({ length: 20 }, (_, i) => <span key={i} style={{ height: `${5 + (i * 11) % 20}px` }} />)}
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN */}
        <section className="center-column">
          <div className="map-panel">

            {/* Toolbar */}
            <div className="map-toolbar">
              <div className="map-toolbar-title">
                <Icon.Map />
                <h2>Live Incident Map</h2>
                <span className="map-live-dot" />
              </div>
              <span className="map-count">
                {incidents.filter(i => i.location.latitude).length} incidents mapped
              </span>

              {/* View / Select */}
              <div className="map-mode-btns">
                <button
                  className={`map-mode-btn${mapMode === "view" ? " active" : ""}`}
                  onClick={() => setMapMode("view")}
                  title="Pan and zoom the map"
                >
                  <Icon.Eye /> View
                </button>
                <button
                  className={`map-mode-btn${mapMode === "select" ? " active-select" : ""}`}
                  onClick={enterSelectMode}
                  title="Hold and drag to draw a freehand selection"
                >
                  <Icon.Lasso /> Select
                </button>
              </div>

              <div className="map-search">
                <Icon.Search />
                <input placeholder="Search location, incident ID, or area…" />
              </div>
              <div className="map-type-btns">
                <button className={mapType === "map" ? "active" : ""} onClick={() => setMapType("map")}>Map</button>
                <button className={mapType === "satellite" ? "active" : ""} onClick={() => setMapType("satellite")}>Satellite</button>
              </div>
            </div>

            {/* Drawing hint */}
            {mapMode === "select" && !areaPolygon && (
              <div className="map-select-hint">
                <Icon.Lasso />
                <span>Hold &amp; drag to draw — release to confirm</span>
              </div>
            )}

            <div className="map-container">
              <MapContainer center={[27.7, 85.0]} zoom={8} style={{ height: "100%", width: "100%" }}>
                <TileLayer url={tileUrl} attribution={tileAttrib} />
                <MapController center={selectedLatLng} />

                {/* Freehand drawer — only active in select mode */}
                <FreehandDrawer active={mapMode === "select"} onDrawn={handleDrawn} />

                {/* Completed polygon overlay */}
                {areaPolygon && areaPolygon.length >= 3 && (
                  <Polygon
                    positions={areaPolygon}
                    pathOptions={{
                      color: "#a01c2c",
                      fillColor: "#a01c2c",
                      fillOpacity: 0.13,
                      weight: 2.5,
                      dashArray: "6 4",
                    }}
                  />
                )}

                {/* Incident markers */}
                {incidents
                  .filter(i => i.location.latitude && i.location.longitude)
                  .map(i => {
                    const inArea = areaPolygon
                      ? pointInPolygon(L.latLng(i.location.latitude!, i.location.longitude!), areaPolygon)
                      : false;
                    return (
                      <Marker
                        key={i.id}
                        position={[i.location.latitude!, i.location.longitude!]}
                        icon={createMarkerIcon(lc[i.priorityLevel], i.id === selectedId)}
                        eventHandlers={{ click: () => setSelectedId(i.id) }}
                        opacity={areaPolygon && !inArea ? 0.3 : 1}
                      >
                        <Popup>
                          <div className="map-popup-inner">
                            <div className="pop-id">INCIDENT #{i.id}</div>
                            <div className="pop-loc">{i.location.rawText}</div>
                            <div className="pop-meta">
                              {num(i.peopleCount)} people &bull; Trapped: {yn(i.trapped)}<br />
                              <span className={`badge ${lc[i.priorityLevel]}`} style={{ marginTop: 5, display: "inline-block" }}>
                                {i.priorityLevel}
                              </span>
                            </div>
                            <button className="pop-select" onClick={() => setSelectedId(i.id)}>View Details</button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
              </MapContainer>

              {/* Area action panel — appears after drawing */}
              {areaPolygon && (
                <div className="area-selection-panel">
                  <div className="area-sel-info">
                    <span className="area-sel-dot" />
                    <div>
                      <b>Area Selected</b>
                      <small>
                        {incidentsInArea.length} incident{incidentsInArea.length !== 1 ? "s" : ""} inside zone
                        &nbsp;&bull;&nbsp;
                        {areaPolygon.length} boundary points
                      </small>
                    </div>
                  </div>
                  <div className="area-sel-actions">
                    <button className="area-sel-btn area-call-btn" onClick={() => setShowAreaCall(true)}>
                      <Icon.Broadcast /> Call This Area
                    </button>
                    <button className="area-sel-btn area-redraw-btn" onClick={enterSelectMode}>
                      <Icon.Lasso /> Redraw
                    </button>
                    <button className="area-sel-btn area-delete-btn" onClick={clearArea}>
                      <Icon.Trash /> Delete
                    </button>
                  </div>
                </div>
              )}

              <div className="map-legend">
                <span><i style={{ background: "#1e7e45" }} /> Standard</span>
                <span><i style={{ background: "#b8860b" }} /> Elevated</span>
                <span><i style={{ background: "#c0621a" }} /> Urgent</span>
                <span><i style={{ background: "#a01c2c" }} /> Critical</span>
              </div>
            </div>
          </div>

          {/* Live calls */}
          <div className="live-calls-panel">
            <div className="calls-header">
              <h3><Icon.Phone /> Live Calls</h3>
              <a>View All</a>
            </div>
            <div className="calls-tabs">
              {["all", "critical", "urgent", "elevated", "standard"].map(t => (
                <button key={t} className={callsTab === t ? "active" : ""} onClick={() => setCallsTab(t)}>
                  {t === "all" ? `All (${liveCalls.length})` : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <table className="calls-table">
              <thead><tr><th>Time</th><th>Location</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {liveCalls
                  .filter(c => callsTab === "all" || c.priority === callsTab)
                  .map((c, idx) => (
                    <tr key={idx}>
                      <td style={{ fontVariantNumeric: "tabular-nums", color: "var(--text-dim)" }}>{c.time}</td>
                      <td>{c.location}</td>
                      <td><span className={`badge ${c.priority}`}>{c.priority.toUpperCase()}</span></td>
                      <td>
                        <span className={`status-tag ${c.status.replace(" ", "_")}`}>
                          {c.status === "on_way" ? "On way" : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside className="intelligence">
          <div className="detail-head">
            <div className="detail-head-top">
              <div>
                <small>#{selected.id}</small>
                <h2>{selected.location.rawText ?? "Unknown Location"}</h2>
                <div className="reported-time">
                  {selected.location.district ?? "—"} &bull;{" "}
                  {selected.location.latitude?.toFixed(3) ?? "—"}°N {selected.location.longitude?.toFixed(3) ?? "—"}°E
                </div>
              </div>
              <span className={`badge ${lc[selected.priorityLevel]}`}>{selected.priorityLevel}</span>
            </div>
            <div className="ai-summary-box">{selected.summary}</div>
          </div>

          <div className="tabs">
            <button className={tab === "INTELLIGENCE" ? "active" : ""} onClick={() => setTab("INTELLIGENCE")}>Details</button>
            <button className={tab === "TRANSCRIPT" ? "active" : ""} onClick={() => setTab("TRANSCRIPT")}>Transcript</button>
          </div>

          {tab === "TRANSCRIPT" ? (
            <TranscriptView lines={transcript} />
          ) : (
            <div className="detail-scroll">

              <div className="info-grid" style={{ marginBottom: 12 }}>
                <InfoCell label="People"       value={num(selected.peopleCount)} />
                <InfoCell label="Trapped"      value={yn(selected.trapped)} warn={selected.trapped === true} />
                <InfoCell label="Children"     value={num(selected.childrenCount)} />
                <InfoCell label="Elderly"      value={num(selected.elderlyCount)} />
                <InfoCell label="Injuries"     value={selected.seriousInjury ? "Serious" : selected.seriousInjury === false ? "None" : "—"} warn={selected.seriousInjury === true} />
                <InfoCell label="Water Rising" value={yn(selected.waterRising)} warn={selected.waterRising === true} />
                <InfoCell label="Food"         value={selected.foodNeeded ? "Low" : selected.foodNeeded === false ? "OK" : "—"} warn={selected.foodNeeded === true} />
                <InfoCell label="Water"        value={selected.drinkingWaterNeeded ? "Critical" : selected.drinkingWaterNeeded === false ? "OK" : "—"} warn={selected.drinkingWaterNeeded === true} />
              </div>

              <div className="priority-box">
                <div className="score-ring">
                  <b>{selected.priorityScore}</b>
                  <span>/ 100</span>
                </div>
                <div className="priority-box-info">
                  <h3>{selected.priorityLevel}</h3>
                  <ul className="reasons" style={{ margin: "4px 0 0", padding: 0 }}>
                    {selected.priorityReasons.slice(0, 2).map(r => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              </div>

              <h4 className="section-label">Response</h4>
              <div className="response-btns">
                {[
                  { Ic: Icon.Rescue,    label: "Rescue"    },
                  { Ic: Icon.Ambulance, label: "Ambulance" },
                  { Ic: Icon.Police,    label: "Police"    },
                  { Ic: Icon.Relief,    label: "Relief"    },
                ].map(rb => (
                  <div key={rb.label} className="response-btn">
                    <rb.Ic />
                    <span className="rb-label">{rb.label}</span>
                  </div>
                ))}
              </div>

              <button className="dispatch-btn">Approve &amp; Dispatch</button>

              <h4 className="section-label">Assign Team</h4>
              {selected.assignedTeam ? (
                <div className="assigned-banner">
                  {selected.assignedTeam}
                  <small>Assigned</small>
                </div>
              ) : (
                <div className="team-list">
                  {teams.filter(t => t.status === "AVAILABLE").slice(0, 3).map(t => (
                    <div key={t.id} className="team-item">
                      <div className="team-item-info">
                        <span>{t.name}</span>
                        <small>{t.type}</small>
                      </div>
                      <button className="team-assign-btn" onClick={() => assign(t)}>ASSIGN</button>
                    </div>
                  ))}
                </div>
              )}

              <h4 className="section-label">Resources</h4>
              <div className="quick-resources">
                {[
                  { label: "Rescue", count: 6 }, { label: "Ambulance", count: 3 },
                  { label: "Police", count: 8 }, { label: "Aid", count: 4 },
                ].map(r => (
                  <div key={r.label} className="qr-item">
                    <b>{r.count}</b>
                    <small>{r.label}</small>
                  </div>
                ))}
              </div>

            </div>
          )}

          <div className="actions-bar">
            <button>Note</button>
            <button className="call-back-btn" onClick={startCall}>
              {call === "FAILED" ? "Retry" : "Call Back"}
            </button>
            <button className="resolve-btn"
              onClick={() => setIncidents(xs => xs.map(i =>
                i.id === selected.id ? { ...i, status: "RESOLVED" } : i))}>
              Resolve
            </button>
          </div>
        </aside>
      </section>

      {/* Area Broadcast Modal */}
      {showAreaCall && areaPolygon && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAreaCall(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-header-icon"><Icon.Broadcast /></div>
              <div>
                <h2>Broadcast Call to Selected Area</h2>
                <small>
                  Custom polygon zone &bull;&nbsp;
                  {incidentsInArea.length} incident{incidentsInArea.length !== 1 ? "s" : ""} inside
                </small>
              </div>
              <button className="modal-close" onClick={() => setShowAreaCall(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {incidentsInArea.length > 0 ? (
              <div className="modal-incidents">
                <div className="modal-section-label">Incidents in this zone</div>
                {incidentsInArea.map(i => (
                  <div key={i.id} className="modal-incident-row">
                    <span className={`badge ${lc[i.priorityLevel]}`}>{i.priorityLevel}</span>
                    <span className="modal-incident-loc">{i.location.rawText}</span>
                    <span className="modal-incident-score">{i.priorityScore}/100</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="modal-no-incidents">
                No mapped incidents inside this zone. You can still broadcast a call.
              </div>
            )}

            <div className="modal-section-label" style={{ marginTop: 14 }}>Emergency broadcast message</div>
            <textarea className="modal-textarea" rows={3}
              placeholder="Enter your emergency message (optional — AI will generate default)…"
              value={areaCallMsg} onChange={e => setAreaCallMsg(e.target.value)} />

            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={() => setShowAreaCall(false)}>Cancel</button>
              <button className="modal-call-btn" onClick={() => {
                alert(`Broadcast call initiated\nZone: custom polygon (${areaPolygon.length} pts)\nIncidents: ${incidentsInArea.length}`);
                setShowAreaCall(false);
              }}>
                <Icon.Broadcast /> Initiate Broadcast Call
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */
function MetricCard({ label, value, sub, variant, icon }: {
  label: string; value: string | number; sub?: string; variant?: string; icon: React.ReactNode;
}) {
  return (
    <div className={`metric${variant ? " " + variant : ""}`}>
      <div className="metric-icon-wrap">{icon}</div>
      <div className="metric-body">
        <small>{label}</small>
        <b>{value}</b>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}

function InfoCell({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="info-grid-item">
      <small>{label}</small>
      <b className={warn ? "warn" : value === "Yes" || value === "OK" ? "ok" : ""}>{value}</b>
    </div>
  );
}

function TranscriptView({ lines }: { lines: TranscriptLine[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);
  return (
    <div className="transcript">
      {lines.length === 0
        ? <div className="transcript-empty">Waiting for transcript…</div>
        : lines.map(l => (
          <div key={l.id} className={`transcript-line ${l.speaker.toLowerCase()}`}>
            <div className="transcript-line-header">
              <b>{l.speaker}</b>
              <time>{l.time}</time>
            </div>
            <div className="transcript-bubble">{l.text}</div>
          </div>
        ))}
      <div ref={endRef} />
    </div>
  );
}
