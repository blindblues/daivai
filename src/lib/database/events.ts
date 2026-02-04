import { supabase } from '../client';

/**
 * Ottieni tutti gli eventi con conteggio partecipanti
 */
export async function getEventsWithParticipants() {
    const { data: events, error } = await supabase
        .from('events')
        .select(`
      *,
      participations(count)
    `)
        .order('event_date', { ascending: true });

    if (error) {
        return { data: null, error };
    }

    // Trasforma il conteggio in un numero
    const eventsWithCount = events?.map(event => ({
        ...event,
        participantsCount: event.participations?.[0]?.count || 0
    }));

    return { data: eventsWithCount, error: null };
}

/**
 * Iscrivi utente a un evento
 */
export async function joinEvent(eventId: string, userId: string) {
    const { data, error } = await supabase
        .from('participations')
        .insert({
            event_id: eventId,
            user_id: userId,
            status: 'confirmed'
        })
        .select()
        .single();

    return { data, error };
}

/**
 * Annulla iscrizione a un evento
 */
export async function leaveEvent(eventId: string, userId: string) {
    const { error } = await supabase
        .from('participations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

    return { error };
}

/**
 * Verifica se l'utente è iscritto a un evento
 */
export async function isUserParticipating(eventId: string, userId: string) {
    const { data } = await supabase
        .from('participations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

    return !!data;
}
