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
        console.log('📊 Using seed data (Supabase not configured)');
        setIncidents(seedIncidents);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔄 Fetching incidents from Supabase...');
        
        const { data, error: fetchError } = await supabase!
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('❌ Supabase fetch error:', fetchError);
          throw fetchError;
        }

        console.log('✅ Fetched from Supabase:', data?.length || 0, 'incidents');

        // Transform Supabase data to match Incident type
        const transformedIncidents: Incident[] = (data || []).map((item: any) => {
          const incidentData = item.data || {};
          
          return {
            id: item.id,
            phoneMasked: incidentData.phoneMasked || 'Unknown',
            status: item.status || 'NEW',
            createdAt: item.created_at,
            simulated: item.simulated || false,
            priorityScore: item.priority_score || 0,
            priorityLevel: item.priority_level || 'STANDARD',
            priorityReasons: incidentData.priorityReasons || [],
            
            // Incident details from JSONB data field
            peopleCount: incidentData.peopleCount ?? null,
            trapped: incidentData.trapped ?? null,
            canEvacuate: incidentData.canEvacuate ?? null,
            seriousInjury: incidentData.seriousInjury ?? null,
            childrenCount: incidentData.childrenCount ?? null,
            elderlyCount: incidentData.elderlyCount ?? null,
            mobilityImpaired: incidentData.mobilityImpaired ?? null,
            waterRising: incidentData.waterRising ?? null,
            structuralDanger: incidentData.structuralDanger ?? null,
            injuredCount: incidentData.injuredCount ?? null,
            pregnantPerson: incidentData.pregnantPerson ?? null,
            foodNeeded: incidentData.foodNeeded ?? null,
            drinkingWaterNeeded: incidentData.drinkingWaterNeeded ?? null,
            medicineNeeded: incidentData.medicineNeeded ?? null,
            
            location: incidentData.location || {
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
            
            summary: incidentData.summary || '',
            recommendedResponse: incidentData.recommendedResponse || [],
            assignedTeam: incidentData.assignedTeam || null,
            evidence: incidentData.evidence || [],
            transcript: incidentData.transcript || []
          };
        });

        setIncidents(transformedIncidents);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching incidents:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
        
        // Fallback to seed data on error
        console.log('📊 Falling back to seed data due to error');
        setIncidents(seedIncidents);
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();

    // Subscribe to real-time updates if Supabase is configured
    if (isSupabaseConfigured) {
      console.log('🔔 Subscribing to real-time incident updates...');
      
      const channel = supabase!
        .channel('incidents-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'incidents' }, 
          (payload) => {
            console.log('🔔 Real-time update:', payload);
            fetchIncidents();
          }
        )
        .subscribe();

      return () => {
        console.log('🔕 Unsubscribing from real-time updates');
        channel.unsubscribe();
      };
    }
  }, []);

  const updateIncident = async (id: number, updates: Partial<Incident>) => {
    if (!isSupabaseConfigured) {
      // Update local state only
      setIncidents(prev => 
        prev.map(inc => inc.id === id ? { ...inc, ...updates } : inc)
      );
      return;
    }

    try {
      // Get current incident data
      const currentIncident = incidents.find(inc => inc.id === id);
      if (!currentIncident) throw new Error('Incident not found');

      // Merge updates with current data
      const updatedData = {
        ...currentIncident.data,
        ...updates
      };

      const { error } = await supabase!
        .from('incidents')
        .update({
          data: updatedData,
          status: updates.status,
          priority_score: updates.priorityScore,
          priority_level: updates.priorityLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      console.log('✅ Incident updated:', id);
    } catch (err) {
      console.error('❌ Error updating incident:', err);
      throw err;
    }
  };

  return {
    incidents,
    loading,
    error,
    isUsingDemoData: !isSupabaseConfigured || incidents === seedIncidents,
    updateIncident,
    setIncidents // For local state management in demo mode
  };
}
