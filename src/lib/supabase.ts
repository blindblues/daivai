import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Ottieni il profilo dell'utente corrente
 */
export async function getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return { data, error };
}

/**
 * Verifica se l'utente è admin
 */
export async function isAdmin(userId: string) {
    const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    return data?.role === 'admin';
}

/**
 * Upload documento PDF per l'utente
 */
export async function uploadDocument(userId: string, file: File) {
    // Validazione
    if (file.type !== 'application/pdf') {
        return { data: null, error: new Error('Il file deve essere un PDF') };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
        return { data: null, error: new Error('Il file non può superare 5MB') };
    }

    // Path: user-documents/{userId}/document.pdf
    const filePath = `${userId}/document.pdf`;

    // Upload (sovrascrive se esiste già)
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(filePath, file, {
            upsert: true,
            contentType: 'application/pdf'
        });

    if (uploadError) {
        return { data: null, error: uploadError };
    }

    // Ottieni URL pubblico (signed per 1 anno)
    const { data: { publicUrl } } = supabase.storage
        .from('user-documents')
        .getPublicUrl(filePath);

    // Aggiorna profilo con URL documento
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ document_url: publicUrl })
        .eq('id', userId);

    if (updateError) {
        return { data: null, error: updateError };
    }

    return { data: { url: publicUrl, path: filePath }, error: null };
}

/**
 * Elimina documento PDF dell'utente
 */
export async function deleteDocument(userId: string) {
    const filePath = `${userId}/document.pdf`;

    // Rimuovi da storage
    const { error: storageError } = await supabase.storage
        .from('user-documents')
        .remove([filePath]);

    if (storageError) {
        return { error: storageError };
    }

    // Aggiorna profilo
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ document_url: null })
        .eq('id', userId);

    return { error: updateError };
}

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
