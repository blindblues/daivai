import { supabase } from '../client';

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
