-- ============================================
-- QUICK INSERT - Sample Data
-- ============================================
-- Run this AFTER creating tables
-- This will add sample incidents to test

-- Insert sample incidents (simplified)
WITH new_call AS (
  INSERT INTO calls (phone_hash, status, started_at) 
  VALUES ('+97798****123', 'COMPLETED', NOW())
  RETURNING id
)
INSERT INTO incidents (call_id, data, priority_score, priority_level, status, simulated) 
SELECT 
  id,
  '{"phoneMasked": "+97798****123", "peopleCount": 5, "trapped": true, "canEvacuate": false, "location": {"rawText": "Imadol, Lalitpur", "latitude": 27.6563, "longitude": 85.3420, "district": "Lalitpur", "accuracy": "APPROXIMATE"}, "summary": "Five people trapped in flood", "recommendedResponse": ["Water Rescue"], "transcript": [], "evidence": []}'::jsonb,
  85,
  'CRITICAL REVIEW',
  'ASSESSING',
  true
FROM new_call;

-- Add another incident
WITH new_call2 AS (
  INSERT INTO calls (phone_hash, status, started_at) 
  VALUES ('+97798****456', 'COMPLETED', NOW())
  RETURNING id
)
INSERT INTO incidents (call_id, data, priority_score, priority_level, status, simulated) 
SELECT 
  id,
  '{"phoneMasked": "+97798****456", "peopleCount": 3, "trapped": false, "canEvacuate": true, "location": {"rawText": "Bharatpur, Chitwan", "latitude": 27.6817, "longitude": 84.4325, "district": "Chitwan", "accuracy": "APPROXIMATE"}, "summary": "Family safe, need relief supplies", "recommendedResponse": ["Relief Team"], "transcript": [], "evidence": []}'::jsonb,
  30,
  'STANDARD',
  'NEW',
  true
FROM new_call2;

-- Verify
SELECT COUNT(*) as incident_count FROM incidents;
SELECT COUNT(*) as call_count FROM calls;
SELECT COUNT(*) as responder_count FROM responders;

-- Show inserted data
SELECT id, priority_level, status, data->>'summary' as summary 
FROM incidents 
ORDER BY created_at DESC;
