# RAKSHA - Police Emergency Response Dashboard

**AI-Powered • Faster Decisions • Safer Communities**

A professional police emergency command center for flood intelligence and incident response, built as part of the RAKSHA emergency response system.

## Features

- **Live Incident Dashboard** - Real-time incident monitoring and management
- **Interactive Map** - Kathmandu Valley geographic visualization with incident markers
- **Emergency Alerts** - Critical flood risk alerts with admin-generated risk zones
- **Police Unit Management** - Deploy and track police response units
- **Risk Zone Mapping** - Display admin-created flood risk zones on the map
- **Emergency Calls** - Voice-analyzed emergency call integration
- **Real-time Statistics** - Critical, High, Medium, and Low priority incident tracking
- **Professional UI** - Dark emergency dashboard with police branding

## Project Structure

```
police-dashboard/
├── src/
│   ├── components/        # React components
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatisticsCards.tsx
│   │   ├── MapContainer.tsx
│   │   ├── IncidentDetailsPanel.tsx
│   │   ├── RecentIncidents.tsx
│   │   └── LiveAlerts.tsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx
│   │   ├── LiveIncidents.tsx
│   │   ├── EmergencyAlerts.tsx
│   │   ├── MapView.tsx
│   │   ├── RiskZones.tsx
│   │   ├── Calls.tsx
│   │   ├── PoliceUnits.tsx
│   │   ├── TeamsResources.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── styles/           # CSS stylesheets
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
cd police-dashboard
npm install
```

### Development

```bash
npm run dev
```

The dashboard will run on `http://localhost:5174`

### Build for Production

```bash
npm run build
```

## Architecture

### Design System

- **Theme**: Dark emergency dashboard (professional police operations center)
- **Colors**: Police blue primary, emergency status colors (red, orange, yellow, green)
- **Components**: Reusable React components with CSS modules

### Layout

- Fixed left sidebar with navigation
- Top header with emergency status and time
- Large interactive map as centerpiece
- Right incident details panel
- Bottom sections for recent incidents and live alerts

## Status

🚀 **Initial Release - Dashboard UI Complete**

### Completed

✅ Sidebar navigation with active states  
✅ Header with emergency status and time  
✅ Statistics cards for incident priority tracking  
✅ Map container placeholder (ready for Leaflet integration)  
✅ Incident details panel with police response section  
✅ Recent incidents table  
✅ Live alerts table with tab filtering  
✅ Responsive layout (desktop, tablet, mobile)  
✅ Dark emergency theme  
✅ Police RAKSHA branding  

### Coming Soon

⏳ Real Leaflet map integration  
⏳ Admin-generated risk zone display  
⏳ Police unit GPS tracking  
⏳ Real-time incident updates via API  
⏳ WebSocket integration for live alerts  
⏳ Police operator authentication  
⏳ Incident status workflow  
⏳ Full responsive mobile experience  

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Leaflet** - Map library (integration pending)
- **Lucide React** - Icons
- **CSS** - Styling with CSS variables
- **Zustand** - State management (prepared for integration)

## Police Workflow

1. **Alert Received** - Admin sends flood risk alert
2. **Map Display** - Risk zone polygon automatically appears on map
3. **Acknowledge** - Police operator acknowledges alert
4. **Assign Unit** - Select and assign available police unit
5. **Dispatch** - Send unit to location
6. **In Progress** - Track unit response and status
7. **Resolved** - Close incident

## Design Reference

This dashboard maintains the same visual design language and structure as the Flood ResQ AI dashboard, ensuring consistency across the product ecosystem.

## License

Private - RAKSHA Emergency Response System

## Support

For issues or questions, contact the development team.

---

**RAKSHA**: Police Emergency Response & Flood Intelligence System  
**Tagline**: Faster Decisions • Safer Communities
