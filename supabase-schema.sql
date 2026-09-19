-- ============================================
-- RAKSHA AI - Supabase Database Schema
-- ============================================
-- Copy this SQL and run in Supabase SQL Editor
-- Dashboard: https://ezekbjgjukbhfjzbecxk.supabase.co

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE call_status AS ENUM ('INITIATED', 'RINGING', 'CONNECTED', 'COMPLETED', 'FAILED');
CREATE TYPE incident_status AS ENUM ('NEW', 'ASSESSING', 'TEAM_ASSIGNED', 'RESOLVED');
CREATE TYPE responder_status AS ENUM ('AVAILABLE', 'ASSIGNED', 'EN_ROUTE', 'ON_SCENE', 'UNAVAILABLE');

-- ============================================
-- TABLES
-- ============================================

-- Calls Table
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_sid TEXT UNIQUE,
  phone_hash TEXT NOT NULL,
  status call_status NOT NULL DEFAULT 'INITIATED',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transcripts Table
CREATE TABLE transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  speaker TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Incidents Table
CREATE TABLE incidents (
  id SERIAL PRIMARY KEY,
  call_id UUID UNIQUE REFERENCES calls(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  priority_score INTEGER NOT NULL DEFAULT 0,
  priority_level TEXT NOT NULL DEFAULT 'STANDARD',
  status incident_status NOT NULL DEFAULT 'NEW',
  simulated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Incident Evidence Table
CREATE TABLE incident_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  field TEXT NOT NULL,
  value JSONB NOT NULL,
  transcript_quote TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Responders Table
CREATE TABLE responders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status responder_status NOT NULL DEFAULT 'AVAILABLE',
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assignments Table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES responders(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ASSIGNED',
  assigned_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Incident Updates Table
CREATE TABLE incident_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_calls_call_sid ON calls(call_sid);
CREATE INDEX idx_transcripts_call_id ON transcripts(call_id);
CREATE INDEX idx_incidents_call_id ON incidents(call_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incident_evidence_incident_id ON incident_evidence(incident_id);
CREATE INDEX idx_assignments_incident_id ON assignments(incident_id);
CREATE INDEX idx_assignments_responder_id ON assignments(responder_id);

-- ============================================
-- SEED DATA - Initial Responders
-- ============================================

INSERT INTO responders (name, type, status, latitude, longitude) VALUES
  ('Water Rescue Alpha', 'WATER RESCUE', 'AVAILABLE', 27.68, 85.32),
  ('Water Rescue Bravo', 'WATER RESCUE', 'EN_ROUTE', 27.7, 85.35),
  ('Ambulance Team 1', 'AMBULANCE', 'AVAILABLE', NULL, NULL),
  ('Police Response 1', 'POLICE', 'AVAILABLE', NULL, NULL),
  ('Fire & Rescue 1', 'FIRE & RESCUE', 'AVAILABLE', NULL, NULL),
  ('Relief Team 1', 'RELIEF', 'AVAILABLE', NULL, NULL);

-- ============================================
-- SEED DATA - Sample Incidents
-- ============================================

-- Method 1: Simple insert with everything in one go
WITH new_call AS (
  INSERT INTO calls (phone_hash, status, started_at) 
  VALUES ('+97798****123', 'COMPLETED', NOW())
  RETURNING id
)
INSERT INTO incidents (call_id, data, priority_score, priority_level, status, simulated) 
SELECT 
  id,
  '{"phoneMasked": "+97798****123", "peopleCount": 5, "trapped": true, "canEvacuate": false, "seriousInjury": null, "childrenCount": 1, "elderlyCount": 1, "mobilityImpaired": true, "waterRising": true, "structuralDanger": null, "location": {"rawText": "Imadol, Lalitpur", "latitude": 27.6563, "longitude": 85.3420, "district": "Lalitpur", "accuracy": "APPROXIMATE"}, "summary": "Five people surrounded by flood water. A child and an elderly person with limited mobility are present; the family cannot evacuate.", "recommendedResponse": ["Water Rescue", "Medical Support"], "transcript": [{"id": "a", "speaker": "CALLER", "text": "Hamro ghar wari pari pani aaisakyo.", "time": "09:41"}], "evidence": [{"field": "people_count", "value": "5", "quote": "Hami 5 jana chhau.", "confidence": 0.98, "timestamp": "2024-01-01T09:41:00Z"}]}'::jsonb,
  85,
  'CRITICAL REVIEW',
  'ASSESSING',
  true
FROM new_call;

-- ============================================
-- ROW LEVEL SECURITY (Optional - Enable Later)
-- ============================================

-- Enable RLS (commented out for now)
-- ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE incident_evidence ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE responders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE incident_updates ENABLE ROW LEVEL SECURITY;

-- Example policy (allow all for now)
-- CREATE POLICY "Allow all access" ON incidents FOR ALL USING (true);

-- ============================================
-- REALTIME PUBLICATION (Enable for live updates)
-- ============================================

-- Enable realtime for incidents table
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE calls;
ALTER PUBLICATION supabase_realtime ADD TABLE responders;

-- ============================================
-- DONE! 
-- ============================================
-- Now test by querying: SELECT * FROM incidents;
