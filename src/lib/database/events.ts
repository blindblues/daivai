import { supabase } from '../client';

// ============================================
// TIPI
// ============================================

export interface Event {
    id: string;
    title: string;
    description: string | null;
    event_date: string;
    departure_time: string | null;
    return_time: string | null;
    location: string | null;
    cost: string | null;
    max_participants: number | null;
    image_url: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    participantsCount?: number;
}

export interface EventFormData {
    title: string;
    description?: string;
    event_date: string;
    departure_time?: string;
    return_time?: string;
    location?: string;
    cost?: string;
    max_participants?: number;
    image_url?: string;
}

// ============================================
// QUERY — LETTURA EVENTI
// ============================================

/**
 * Ottieni tutti gli eventi con conteggio partecipanti (per il carosello home)
 */
export async function getAllEvents() {
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

    const eventsWithCount = events?.map(event => ({
        ...event,
        participantsCount: event.participations?.[0]?.count || 0
    })) as Event[];

    return { data: eventsWithCount, error: null };
}

/**
 * Ottieni eventi futuri (event_date >= oggi) con conteggio partecipanti
 */
export async function getUpcomingEvents() {
    const now = new Date().toISOString();

    const { data: events, error } = await supabase
        .from('events')
        .select(`
            *,
            participations(count)
        `)
        .gte('event_date', now)
        .order('event_date', { ascending: true });

    if (error) {
        return { data: null, error };
    }

    const eventsWithCount = events?.map(event => ({
        ...event,
        participantsCount: event.participations?.[0]?.count || 0
    })) as Event[];

    return { data: eventsWithCount, error: null };
}

/**
 * Ottieni eventi passati (event_date < oggi) con conteggio partecipanti
 */
export async function getPastEvents() {
    const now = new Date().toISOString();

    const { data: events, error } = await supabase
        .from('events')
        .select(`
            *,
            participations(count)
        `)
        .lt('event_date', now)
        .order('event_date', { ascending: false });

    if (error) {
        return { data: null, error };
    }

    const eventsWithCount = events?.map(event => ({
        ...event,
        participantsCount: event.participations?.[0]?.count || 0
    })) as Event[];

    return { data: eventsWithCount, error: null };
}

/**
 * Ottieni un singolo evento per ID
 */
export async function getEventById(eventId: string) {
    const { data, error } = await supabase
        .from('events')
        .select(`
            *,
            participations(count)
        `)
        .eq('id', eventId)
        .single();

    if (error) {
        return { data: null, error };
    }

    const event = {
        ...data,
        participantsCount: data.participations?.[0]?.count || 0
    } as Event;

    return { data: event, error: null };
}

// ============================================
// CRUD ADMIN — SCRITTURA EVENTI
// ============================================

/**
 * Crea un nuovo evento (solo admin — protetto da RLS)
 */
export async function createEvent(eventData: EventFormData) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { data: null, error: new Error('Non autenticato') };
    }

    const { data, error } = await supabase
        .from('events')
        .insert({
            ...eventData,
            created_by: user.id
        })
        .select()
        .single();

    return { data, error };
}

/**
 * Modifica un evento esistente (solo admin — protetto da RLS)
 */
export async function updateEvent(eventId: string, eventData: Partial<EventFormData>) {
    const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', eventId)
        .select()
        .single();

    return { data, error };
}

/**
 * Elimina un evento (solo admin — protetto da RLS)
 */
export async function deleteEvent(eventId: string) {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

    return { error };
}

// ============================================
// STORAGE — IMMAGINI EVENTI
// ============================================

/**
 * Carica un'immagine per un evento nel bucket event-images
 * Ritorna l'URL pubblico dell'immagine
 */
export async function uploadEventImage(file: File, eventId: string) {
    // Validazione tipo file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return { data: null, error: new Error('Formato non supportato. Usa JPEG, PNG o WebP.') };
    }

    // Validazione dimensione (5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { data: null, error: new Error('Il file non può superare 5MB') };
    }

    const ext = file.name.split('.').pop();
    const filePath = `${eventId}/cover.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file, {
            upsert: true,
            contentType: file.type
        });

    if (uploadError) {
        return { data: null, error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

    // Aggiorna image_url nella tabella events
    const { error: updateError } = await supabase
        .from('events')
        .update({ image_url: publicUrl })
        .eq('id', eventId);

    if (updateError) {
        return { data: null, error: updateError };
    }

    return { data: { url: publicUrl, path: filePath }, error: null };
}

/**
 * Elimina l'immagine di un evento dal bucket
 */
export async function deleteEventImage(eventId: string) {
    // Prova a eliminare tutti i formati comuni
    const paths = [
        `${eventId}/cover.jpg`,
        `${eventId}/cover.jpeg`,
        `${eventId}/cover.png`,
        `${eventId}/cover.webp`
    ];

    const { error } = await supabase.storage
        .from('event-images')
        .remove(paths);

    return { error };
}

// ============================================
// PARTECIPAZIONI
// ============================================

/**
 * Iscrivi utente a un evento
 */
export async function joinEvent(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Non autenticato') };

    const { data, error } = await supabase
        .from('participations')
        .insert({
            event_id: eventId,
            user_id: user.id,
            status: 'confirmed'
        })
        .select()
        .single();

    return { data, error };
}

/**
 * Annulla iscrizione a un evento
 */
export async function leaveEvent(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Non autenticato') };

    const { error } = await supabase
        .from('participations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

    return { error };
}

/**
 * Verifica se l'utente è iscritto a un evento
 */
export async function isUserParticipating(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: false, error: null };

    const { data } = await supabase
        .from('participations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

    return { data: !!data, error: null };
}

/**
 * Ottieni tutti gli eventi a cui un utente è iscritto (storico partecipazioni)
 */
export async function getUserParticipations(userId: string) {
    const { data, error } = await supabase
        .from('participations')
        .select(`
            id,
            status,
            created_at,
            events (
                id,
                title,
                description,
                event_date,
                location,
                cost,
                image_url
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    return { data, error };
}

// ============================================
// ADMIN — GESTIONE UTENTI
// ============================================

/**
 * Ottieni lista completa di tutti gli utenti registrati (solo admin)
 */
export async function getAllUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, created_at')
        .order('created_at', { ascending: false });

    return { data, error };
}

/**
 * Promuovi un utente ad admin (solo admin)
 */
export async function promoteToAdmin(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId)
        .select()
        .single();

    return { data, error };
}

/**
 * Rimuovi i privilegi admin da un utente (solo admin)
 */
export async function demoteFromAdmin(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', userId)
        .select()
        .single();

    return { data, error };
}
