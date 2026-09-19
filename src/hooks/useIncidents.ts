import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { seedIncidents } from '@/data/seed';
import type { Incident } from '@/types/incident';

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIncidents() {
      // If Supabase not configured, use seed data
      if (!isSupabaseConfigured) {
        console.log('Using seed data (Supabase not configured)');
        setIncidents(seedIncidents);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error: fetchError } = await supabase!
          .from('Incident')
          .select(`
            *,
            call:Call(
              id,
              callSid,
              phoneHash,
              status,
              startedAt,
              endedAt
            ),
            evidence:IncidentEvidence(*),
            assignments:Assignment(
              *,
              responder:Responder(*)
            )
          `)
          .order('createdAt', { ascending: false });

        if (fetchError) throw fetchError;

        // Transform Supabase data to match Incident type
        const transformedIncidents: Incident[] = (data || []).map((item: any) => ({
          id: item.id,
          phoneMasked: item.call?.phoneHash ? `+977****${item.call.phoneHash.slice(-4)}` : 'Unknown',
          status: item.status,
          createdAt: item.createdAt,
          simulated: item.simulated,
          priorityScore: item.priorityScore,
          priorityLevel: item.priorityLevel,
          priorityReasons: item.data?.priorityReasons || [],
          
          // Extract from JSON data field
          peopleCount: item.data?.peopleCount ?? null,
          trapped: item.data?.trapped ?? null,
          canEvacuate: item.data?.canEvacuate ?? null,
          seriousInjury: item.data?.seriousInjury ?? null,
          childrenCount: item.data?.childrenCount ?? null,
          elderlyCount: item.data?.elderlyCount ?? null,
          mobilityImpaired: item.data?.mobilityImpaired ?? null,
          waterRising: item.data?.waterRising ?? null,
          structuralDanger: item.data?.structuralDanger ?? null,
          injuredCount: item.data?.injuredCount ?? null,
          pregnantPerson: item.data?.pregnantPerson ?? null,
          foodNeeded: item.data?.foodNeeded ?? null,
          drinkingWaterNeeded: item.data?.drinkingWaterNeeded ?? null,
          medicineNeeded: item.data?.medicineNeeded ?? null,
          
          location: item.data?.location || {
            rawText: 'Unknown',
            latitude: null,
            longitude: null,
            district: null,
            municipality: null,
            ward: null,
            tole: null,
            landmark: null,
            accuracy: 'UNKNOWN'
          },
          
          summary: item.data?.summary || '',
          recommendedResponse: item.data?.recommendedResponse || [],
          assignedTeam: item.assignments?.[0]?.responder?.name || null,
          
          evidence: (item.evidence || []).map((e: any) => ({
            field: e.field,
            value: typeof e.value === 'string' ? e.value : JSON.stringify(e.value),
            quote: e.transcriptQuote,
            confidence: e.confidence,
            timestamp: e.createdAt
          })),
          
          transcript: [] // Will be loaded separately if needed
        }));

        setIncidents(transformedIncidents);
        setError(null);
      } catch (err) {
        console.error('Error fetching incidents:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
        
        // Fallback to seed data on error
        console.log('Falling back to seed data due to error');
        setIncidents(seedIncidents);
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();

    // Subscribe to real-time updates if Supabase is configured
    if (isSupabaseConfigured) {
      const subscription = supabase!
        .channel('incidents')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'Incident' }, 
          () => {
            console.log('Incident data changed, refetching...');
            fetchIncidents();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const addIncident = async (incident: Omit<Incident, 'id'>) => {
    if (!isSupabaseConfigured) {
      // Add to local state only
      const newIncident = { ...incident, id: Math.max(...incidents.map(i => i.id), 0) + 1 };
      setIncidents(prev => [newIncident, ...prev]);
      return newIncident;
    }

    try {
      const { data, error } = await supabase!
        .from('Incident')
        .insert({
          callId: 'temp-call-id', // Should be replaced with actual call ID
          data: incident,
          priorityScore: incident.priorityScore,
          priorityLevel: incident.priorityLevel,
          status: incident.status,
          simulated: incident.simulated
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error adding incident:', err);
      throw err;
    }
  };

  const updateIncident = async (id: number, updates: Partial<Incident>) => {
    if (!isSupabaseConfigured) {
      // Update local state only
      setIncidents(prev => 
        prev.map(inc => inc.id === id ? { ...inc, ...updates } : inc)
      );
      return;
    }

    try {
      const { error } = await supabase!
        .from('Incident')
        .update({
          data: updates,
          status: updates.status,
          priorityScore: updates.priorityScore,
          priorityLevel: updates.priorityLevel
        })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating incident:', err);
      throw err;
    }
  };

  return {
    incidents,
    loading,
    error,
    isUsingDemoData: !isSupabaseConfigured,
    addIncident,
    updateIncident,
    setIncidents // For local state management in demo mode
  };
}
